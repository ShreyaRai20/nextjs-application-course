'use server'

import { api } from "@/convex/_generated/api"
import { fetchAuthMutation, fetchAuthQuery, getToken } from "@/lib/auth-server";
import { PostSchema } from "@/schemas/blog"
import { redirect } from "next/navigation";
import z from "zod"

export async function createBlogAction( values: z.infer<typeof PostSchema>) {

    const parsedValues = PostSchema.safeParse(values)

    if (!parsedValues.success) throw new Error("something went wrong")

    const token = await getToken()
    if (!token) throw new Error("NO TOKEN: Next.js can't get a Convex token from your session")

    await fetchAuthMutation(
        api.posts.createPost,
        {
            title: parsedValues.data?.title,
            content: parsedValues.data?.content
        }
    )

    return redirect('/')
}

export async function getBlogsAction() {

    return await fetchAuthQuery( api.posts.getPosts)
}