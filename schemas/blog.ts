import z from "zod"

export const BlogSchema = z.object({
    title: z.string().min(6).max(30),
    content: z.string().min(8)
})