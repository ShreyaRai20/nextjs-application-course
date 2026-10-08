import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { fetchQuery } from "convex/nextjs"


export default async function BlogId({ params }: { params: Promise<{ blogId: Id<'posts'> }> }) {
    const { blogId } = await params

    const post = await fetchQuery(
        api.posts.getBlogById,
        {
            postId: blogId
        }
    )
    console.log("post: ", post)
    return (
        <>
            blog: {blogId}
        </>
    )
}