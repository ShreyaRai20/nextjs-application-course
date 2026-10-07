"use server"
import { fetchAuthMutation, getToken } from "@/lib/auth-server";
import { blogSchema } from "@/schema/blog";
import z from "zod";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";

export async function createBlogAction (values: z.infer<typeof blogSchema>) {
    // STEP 1: PARSE VALUES

    const parsedValues = blogSchema.safeParse(values)
    if (!parsedValues.success) throw new Error("Something went wrong")

    const token = getToken()
    if (!token) throw new Error("Not authorized")

    try {

        await fetchAuthMutation(
            api.posts.createBlog,
            {
                title: parsedValues.data?.title,
                content: parsedValues.data?.content
            }
        )

    } catch (error) {

    throw new Error("Error while creating blog");

}

    return redirect('/')
}