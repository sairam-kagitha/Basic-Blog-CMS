import { z } from "zod"

export const LoginSchema = z.object({
    email: z
        .string()
        .min(3, { message: "Email must be at least 3 characters" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(30, { message: "Password must be at most 30 characters" }),
})
export type LoginSchemaType = z.infer<typeof LoginSchema>

export const PostSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters" }),
    content: z.string().min(3, { message: "Please enter some content" }),
    metaTitle: z
        .string()
        .min(3, { message: "Meta Title must be at least 3 characters" }),
    metaDescription: z
        .string()
        .min(3, { message: "Meta Description must be at least 3 characters" }),
    tags: z.string().min(1, { message: "Tags must be at least 1 character" }),
    status: z.union([z.literal("draft"), z.literal("published")]),
})
export type PostSchemaType = z.infer<typeof PostSchema>
