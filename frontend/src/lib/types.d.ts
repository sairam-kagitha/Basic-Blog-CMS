export type User = {
    id: string
    name: string
    email: string
    role: "user" | "admin"
    createdAt: Date
    updatedAt: Date
}

export type Post = {
    id: string
    createdAt: Date
    updatedAt: Date
    title: string
    content: string
    videoUrl: string | null
    imageUrl: string | null
    metaTitle: string
    metaDescription: string
    tags: string[]
    status: "draft" | "published"
    publishedAt: Date | null
    userId: string | null
}

export type ImageResponse = {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    destination: string
    filename: string
    path: string
    size: number
}
