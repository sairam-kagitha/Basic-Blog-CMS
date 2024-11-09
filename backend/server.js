import express from "express"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import "dotenv/config"
import multer from "multer"
import cors from "cors"
import path from "path"
import fs from "fs"

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 8081
app.use(express.json())
app.use(cors())
app.use("/images", express.static("./uploads"))

const multerStorage = multer.diskStorage({
    destination: "./uploads",
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
        )
    },
})

const upload = multer({ storage: multerStorage })

// auth
async function isAuthenticated(req) {
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer")
    ) {
        return { ok: false, error: "Missing or invalid token" }
    }

    const beararToken = req.headers.authorization.split(" ")[1]
    const payload = jwt.decode(beararToken, process.env.JWT_SECRET)
    if (!payload) {
        return { ok: false, error: "Missing or invalid token" }
    }

    const user = await prisma.user.findUnique({
        where: {
            id: payload.id,
        },
    })

    if (!user || user.role !== "admin") {
        return { ok: false, error: "Access denied" }
    }

    return { ok: true, user: user }
}

// read all posts
app.get("/posts", async (req, res) => {
    try {
        const isAuth = await isAuthenticated(req)
        if (!isAuth.ok) return res.status(401).json({ error: isAuth.error })

        const posts = await prisma.post.findMany()

        res.json(posts)
    } catch (error) {
        req.status(500).send("Something went wrong")
    }
})

// create a post
app.post("/posts", async (req, res) => {
    try {
        const isAuth = await isAuthenticated(req)
        if (!isAuth.ok) return res.status(401).json({ error: isAuth.error })

        if (
            !req.body ||
            !req.body.title ||
            !req.body.content ||
            !req.body.meta_title ||
            !req.body.meta_description ||
            !req.body.tags
        ) {
            return res.status(400).json({
                error: "Missing title or content or meta title or meta description or tags ",
            })
        }

        const post = await prisma.post.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                metaDescription: req.body.meta_description,
                metaTitle: req.body.meta_title,
                status: req.body.status || "draft",
                publishedAt:
                    req.body.status === "published" ? new Date() : null,
                userId: isAuth.user.id,
                tags: req.body.tags.split(", ") || [],
                imageUrl: req.body.imageUrl || null,
                videoUrl: req.body.videoUrl || null,
            },
        })

        res.json(post)
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
})

// login
app.post("/login", async (req, res) => {
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({ error: "Missing email or password" })
    }

    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email,
        },
    })

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" })
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" })
    }

    const { password, ...rest } = user

    res.json({ user: rest })
})

// get a single post
app.get("/posts/:id", async (req, res) => {
    try {
        const isAuth = await isAuthenticated(req)
        if (!isAuth.ok) return res.status(401).json({ error: isAuth.error })

        const post = await prisma.post.findUnique({
            where: {
                id: req.params.id,
            },
        })

        res.json(post)
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
})

// update a post
app.post("/posts/:id", async (req, res) => {
    try {
        const isAuth = await isAuthenticated(req)
        if (!isAuth.ok) return res.status(401).json({ error: isAuth.error })

        const existedPost = await prisma.post.findUnique({
            where: {
                id: req.params.id,
            },
        })
        if (!existedPost) {
            return res.status(404).json({ error: "Post not found" })
        }

        const post = await prisma.post.update({
            where: {
                id: req.params.id,
            },
            data: {
                title: req.body.title || existedPost.title,
                content: req.body.content || existedPost.content,
                metaDescription:
                    req.body.meta_description || existedPost.metaDescription,
                metaTitle: req.body.meta_title || existedPost.metaTitle,
                status: req.body.status || existedPost.status,
                publishedAt:
                    req.body.status === "published" ? new Date() : null,
                tags: req.body.tags?.split(",") || existedPost.tags,
                imageUrl: req.body.imageUrl || existedPost.imageUrl,
                videoUrl: req.body.videoUrl || existedPost.videoUrl,
            },
        })

        res.json(post)
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
})

// delete a post
app.delete("/posts/:id", async (req, res) => {
    try {
        const isAuth = await isAuthenticated(req)
        if (!isAuth.ok) return res.status(401).json({ error: isAuth.error })

        const post = await prisma.post.delete({
            where: {
                id: req.params.id,
            },
        })

        const filename = post.imageUrl.split("/").pop()
        if (filename) {
            if (fs.existsSync(`./uploads/${filename}`)) {
                fs.unlinkSync(`./uploads/${filename}`)
            }
        }

        res.json(post)
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
})

// upload a image
app.post("/upload", upload.single("postImage"), async (req, res) => {
    const isAuth = await isAuthenticated(req)
    if (!isAuth.ok) {
        fs.unlinkSync(`./uploads/${req.file.filename}`)
        return res.status(401).json({ error: isAuth.error })
    }
    res.json(req.file)
})

// delete a image
app.delete("/images/:filename", async (req, res) => {
    const isAuth = await isAuthenticated(req)
    if (!isAuth.ok) return res.status(401).json({ error: isAuth.error })

    const filename = req.params.filename

    if (!filename) {
        return res.status(400).json({ error: "Missing filename" })
    }

    if (!fs.existsSync(`./uploads/${filename}`)) {
        return res.status(404).json({ error: "Image not found" })
    }

    fs.unlinkSync(`./uploads/${filename}`)
    res.json({ message: "Image deleted" })
})

// server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
