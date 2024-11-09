"use server"
import { ImageResponse, Post } from "@/lib/types"
import { PostSchemaType } from "@/lib/validators"
import { cookies } from "next/headers"

const getJwt = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("jwtToken")?.value
    return token
}

export const getPosts = async () => {
    const token = await getJwt()
    const response = await fetch(`${process.env.BACKEND_URL}/posts`, {
        cache: "no-store",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
    })
    if (!response.ok) return null
    return (await response.json()) as Post[]
}

export const createPost = async (
    post: PostSchemaType,
    imageUrl: string | null,
    videoUrl: string | null
) => {
    const token = await getJwt()
    const response = await fetch(`${process.env.BACKEND_URL}/posts`, {
        cache: "no-store",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            title: post.title,
            content: post.content,
            meta_description: post.metaDescription,
            meta_title: post.metaTitle,
            status: post.status,
            tags: post.tags,
            imageUrl,
            videoUrl,
        }),
    })

    const data = await response.json()

    if (!response.ok) return { ok: false, error: data.error }

    return {
        ok: true,
        post: data as Post,
    }
}

export const deletePost = async (id: string) => {
    const token = await getJwt()
    const response = await fetch(`${process.env.BACKEND_URL}/posts/${id}`, {
        cache: "no-store",
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
    })

    const data = await response.json()

    if (!response.ok) return { ok: false, error: data.error }

    return {
        ok: true,
        post: data as Post,
    }
}

export const getSinglePost = async (
    id: string
): Promise<{ ok: true; post: Post } | { ok: false; error: string }> => {
    const token = await getJwt()
    const response = await fetch(`${process.env.BACKEND_URL}/posts/${id}`, {
        cache: "no-store",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
    })

    const data = await response.json()

    if (!response.ok) return { ok: false, error: data.error }

    return { ok: true, post: data as Post }
}

export const updatePost = async (
    id: string,
    post: PostSchemaType,
    imageUrl: string | null,
    videoUrl: string | null
) => {
    const token = await getJwt()
    const response = await fetch(`${process.env.BACKEND_URL}/posts/${id}`, {
        cache: "no-store",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            title: post.title,
            content: post.content,
            meta_description: post.metaDescription,
            meta_title: post.metaTitle,
            status: post.status,
            tags: post.tags,
            imageUrl,
            videoUrl,
        }),
    })

    const data = await response.json()

    if (!response.ok) return { ok: false, error: data.error }

    return {
        ok: true,
        post: data as Post,
    }
}

export const uploadImage = async (
    formData: FormData
): Promise<
    | { ok: true; url: string; type: "image" | "video" }
    | { ok: false; error: string }
> => {
    const token = await getJwt()
    const response = await fetch(`${process.env.BACKEND_URL}/upload`, {
        cache: "no-store",
        method: "POST",
        headers: {
            authorization: `Bearer ${token}`,
        },
        body: formData,
        redirect: "follow",
    })

    const data = await response.json()

    if (!response.ok) return { ok: false, error: data.error }

    return {
        ok: true,
        url: `${process.env.BACKEND_URL}/images/${data.filename}`,
        type: data.mimetype.startsWith("image") ? "image" : "video",
    }
}

export const deleteImage = async (filename: string) => {
    const token = await getJwt()
    const response = await fetch(
        `${process.env.BACKEND_URL}/images/${filename}`,
        {
            cache: "no-store",
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        }
    )

    const data = await response.json()
    if (!response.ok) return { ok: false, error: data.error }

    return { ok: true }
}
