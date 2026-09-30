import BlogCard from "@/components/web/blog-card";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";

export default async function Blog() {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const posts = await fetchAuthQuery(api.posts.getPosts)

    return (
        <div>
            <div>Blogs</div>
            <div className="flex gap-5 flex-wrap">
                {posts?.map(({ _id, title, content, _creationTime }) => (
                    <BlogCard key={_id} title={title} content={content} _creationTime={_creationTime} />
                ))}
            </div>
        </div>
    )
}