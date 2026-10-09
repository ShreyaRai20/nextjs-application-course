import BlogCard from "@/components/web/blog-card";
import BlogListSkeleton from "@/components/web/blog-skeleton";
import Loading from "@/components/web/loading";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import { Suspense } from "react";
import { fetchQuery } from "convex/nextjs";
import { connection } from "next/server";

// export const dynamic = "force-static"
// // 'auto' | 'force-dynamic' | 'error' | 'force-static'

// export const revalidate = 60
// // false | 0 | number

export default function Blog() {
    return (
        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
            <header className="mb-10 space-y-2">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Our Blog
                </h1>
                <p className="text-lg text-muted-foreground">
                    Insights, thoughts, and trends from our team.
                </p>
            </header>

            <Suspense fallback={<BlogListSkeleton />}>
                <BlogList />
            </Suspense>
        </section>
    );
}

export async function BlogList() {
    await connection()
    const posts = await fetchQuery(api.posts.getBlogs);
    // const posts = await fetchAuthQuery(api.posts.getBlogs);

    if (!posts || posts.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed py-20 text-center">
                <p className="text-lg font-medium">No posts yet</p>
                <p className="text-sm text-muted-foreground">
                    Create your first blog post to see it here.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map(({ _id, title, content, _creationTime, imageUrl }) => (
                <BlogCard
                    key={_id}
                    _id={_id}
                    title={title}
                    content={content}
                    _creationTime={_creationTime}
                    imageUrl={imageUrl}
                />
            ))}
        </div>
    );
}