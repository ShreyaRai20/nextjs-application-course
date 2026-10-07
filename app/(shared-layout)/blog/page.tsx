import BlogCard from "@/components/web/blog-card";
import Loading from "@/components/web/loading";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import { Suspense } from "react";

export default function Blog() {
    return (
        <>
            Blog
            <Suspense fallback={<Loading />}>
                <BlogList />
            </Suspense>
        </>
    )
}


export async function BlogList() {
    const posts = await fetchAuthQuery(api.posts.getBlogs)
    return (
        <div className="flex flex-wrap gap-1">
            {posts.map(({ _id, title, content, _creationTime }) => (
                <BlogCard key={_id} title={title} content={content} _creationTime={_creationTime} />
            ))}
        </div>
    )
}

