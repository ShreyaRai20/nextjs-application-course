"use server"
import { fetchAuthMutation, getToken } from "@/lib/auth-server";
import { blogSchema } from "@/schema/blog";
import z from "zod";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { generateImageUploadUrl } from "@/convex/posts";
import { revalidatePath } from "next/cache";

export async function createBlogAction (values: z.infer<typeof blogSchema>) {

    // STEP 1: PARSE VALUES
    const parsedValues = blogSchema.safeParse(values)
    if (!parsedValues.success) throw new Error("Something went wrong")
        
    // STEP 2: GET USER JWT TOKEN AND CHECK IF USER IS AUTHORIED
    const token = getToken()
    // STEP 2: IF USER NOT AUTHORIED THROW "NOT AUTHORIZED" ERROR
    if (!token) throw new Error("Not authorized")

    try {
        // STEP 3: IF AUTHORIZED, GET IMAGE URL
        const imageUrl = await fetchAuthMutation(
            api.posts.generateImageUploadUrl,
            {}
        )

        const result = await fetch(
            imageUrl, 
            {
                method: "POST",
                headers: {"Content-Tyoe": parsedValues.data.image.type},
                body: parsedValues.data.image
            }
        )

        const { storageId } = await result.json()

        // STEP 4: IF AUTHORIZED PROCEED WITH MUTATION
        await fetchAuthMutation(
            api.posts.createBlog,
            {
                title: parsedValues.data?.title,
                content: parsedValues.data?.content,
                imageStorageId: storageId
            }
        )

    } catch (error) {

    throw new Error("Error while creating blog");

}
    // ON DEMAND REVALIDATION
    revalidatePath("/blog")
    return redirect("/blog")
}