import BlogCard from "@/components/web/blog-card";
import Loading from "@/components/web/loading";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import { Suspense } from "react";

export default function Blog() {
    return (
        <div>
            <div>Blogs</div>
            <Suspense fallback={<Loading />}>
                <BlogList />
            </Suspense>
        </div>
    )
}

async function BlogList() {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const posts = await fetchAuthQuery(api.posts.getPosts)
    return (
        <div className="flex gap-5 flex-wrap">
            {posts?.map(({ _id, title, content, _creationTime }) => (
                <BlogCard key={_id} title={title} content={content} _creationTime={_creationTime} />
            ))}
        </div>
    )
}