'use server'

import { api } from "@/convex/_generated/api"
import { fetchAuthMutation, fetchAuthQuery, getToken } from "@/lib/auth-server";
import {fetchMutation} from "convex/nextjs"
import { PostSchema } from "@/schemas/blog"
import { redirect } from "next/navigation";
import z from "zod"
import { error } from "console";

export async function createBlogAction( values: z.infer<typeof PostSchema>) {

    const parsedValues = PostSchema.safeParse(values)

    if (!parsedValues.success) throw new Error("something went wrong")

    const token = await getToken()
    if (!token) throw new Error("NO TOKEN: Next.js can't get a Convex token from your session")

    try {
        const imageUrl = await fetchMutation(
            api.posts.generateImageUploadUrl,
            {},
            { token }
        )

        const uploadResult = await fetch(
            imageUrl, 
            {
                method: "POST",
                headers: { "Content-Type": parsedValues.data.image.type },
                body: parsedValues.data.image
            }
        );

        if (!uploadResult.ok) {
            return {
                error: "Failed to upload image",
            }
        }

        const { storageId } = await uploadResult.json()

        await fetchAuthMutation(
            api.posts.createPost,
            {
                title: parsedValues.data?.title,
                content: parsedValues.data?.content,
                imageStorageId: storageId,
            }
        )

    } catch (error) {
        
    }

    return redirect('/')
}

export async function getBlogsAction() {

    return await fetchAuthQuery( api.posts.getPosts)
}