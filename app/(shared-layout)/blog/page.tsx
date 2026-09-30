import BlogCard from "@/components/web/blog-card";
import Loading from "@/components/web/loading";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import { Suspense } from "react";

export default async function Blog() {


    const posts = await fetchAuthQuery(api.posts.getPosts)

    return (
        <div>
            <div>Blogs</div>
            <Suspense fallback={<Loading />}>
                <div className="flex gap-5 flex-wrap">
                    {posts?.map(({ _id, title, content, _creationTime }) => (
                        <BlogCard key={_id} title={title} content={content} _creationTime={_creationTime} />
                    ))}
                </div>
            </Suspense>
        </div>
    )
}