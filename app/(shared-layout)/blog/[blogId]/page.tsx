import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Newsreader } from "next/font/google"
import { fetchQuery, preloadQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import CommentSection from "@/components/web/comment-section"

const serif = Newsreader({
    subsets: ["latin"],
    display: "swap",
    style: ["normal", "italic"],
})

function readingTime(text: string) {
    if (!text.trim()) return 0
    const words = text.trim().split(/\s+/).length
    return Math.max(1, Math.round(words / 220))
}

function formatDate(ms: number) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(ms))
}

export default async function BlogId({
    params,
}: {
    params: Promise<{ blogId: Id<"posts"> }>
}) {
    const { blogId } = await params

    // Run both requests in parallel. Don't `await` inside the array,
    // or they run one after the other.
    // preloadQuery keeps the comments reactive on the client.
    const [post, preloadedComments] = await Promise.all([
        fetchQuery(api.posts.getBlogById, { postId: blogId }),
        preloadQuery(api.comments.getCommentsByPostId, { postId: blogId }),
    ])

    if (!post) notFound()

    const title = post.title ?? "Untitled"
    const content = post.content ?? ""
    const imageUrl = post.imageUrl ?? null
    const createdAt = post._creationTime ?? null
    const minutes = readingTime(content)
    const paragraphs = content.split(/\n{2,}/).filter(Boolean)

    return (
        <main className="min-h-screen bg-[#FBFBFD] text-[#14181F] dark:bg-[#0E1116] dark:text-[#E8EBF0]">
            <article className="mx-auto w-full max-w-[44rem] px-5 pb-24 pt-10 sm:px-6 sm:pt-16">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 rounded text-sm text-[#5B6472] transition-colors hover:text-[#2F4BFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F4BFF] dark:text-[#9AA3B2] dark:hover:text-[#8EA0FF]"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    All posts
                </Link>

                <header className="mt-10 border-l-2 border-[#2F4BFF] pl-5 dark:border-[#8EA0FF]">
                    <h1
                        className={`${serif.className} text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl`}
                    >
                        {title}
                    </h1>

                    {(createdAt !== null || minutes > 0) && (
                        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#5B6472] dark:text-[#9AA3B2]">
                            {createdAt !== null && (
                                <time dateTime={new Date(createdAt).toISOString()}>
                                    {formatDate(createdAt)}
                                </time>
                            )}
                            {minutes > 0 && <span>{minutes} min read</span>}
                        </p>
                    )}
                </header>

                {imageUrl && (
                    <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-lg bg-[#E3E6EB] dark:bg-[#1A1F28]">
                        <Image
                            src={imageUrl}
                            alt=""
                            fill
                            priority
                            sizes="(min-width: 704px) 704px, 100vw"
                            className="object-cover"
                        />
                    </div>
                )}

                <div
                    className={`${serif.className} mt-12 space-y-6 text-[1.1875rem] leading-[1.75] text-[#242A34] dark:text-[#CDD3DD]`}
                >
                    {paragraphs.length > 0 ? (
                        paragraphs.map((p, i) => (
                            <p
                                key={i}
                                className={
                                    i === 0
                                        ? "first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-[#2F4BFF] dark:first-letter:text-[#8EA0FF]"
                                        : undefined
                                }
                            >
                                {p}
                            </p>
                        ))
                    ) : (
                        <p className="italic text-[#5B6472] dark:text-[#9AA3B2]">
                            This post doesn&apos;t have any content yet.
                        </p>
                    )}
                </div>

                <CommentSection preloadedComments={preloadedComments} />

                <footer className="mt-16 text-sm">
                    <Link
                        href="/blog"
                        className="rounded font-medium text-[#14181F] underline decoration-[#2F4BFF] decoration-2 underline-offset-4 hover:text-[#2F4BFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F4BFF] dark:text-[#E8EBF0] dark:decoration-[#8EA0FF] dark:hover:text-[#8EA0FF]"
                    >
                        Back to all posts
                    </Link>
                </footer>
            </article>
        </main>
    )
}