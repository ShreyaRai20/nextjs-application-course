"use client"

import { useTransition } from "react"
import { useParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Newsreader } from "next/font/google"
import z from "zod"
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { commentSchema } from "@/schema/comment"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { toast } from "../ui/toast"

const serif = Newsreader({
    subsets: ["latin"],
    display: "swap",
    style: ["normal", "italic"],
})

const AVATAR_COLORS = [
    "bg-[#E4E9FF] text-[#2F4BFF] dark:bg-[#1D2540] dark:text-[#8EA0FF]",
    "bg-[#DDF3EA] text-[#12805C] dark:bg-[#12302A] dark:text-[#5FD3A6]",
    "bg-[#FDE9DC] text-[#B4501A] dark:bg-[#3A2418] dark:text-[#F2A375]",
    "bg-[#F3E4F7] text-[#8A33A8] dark:bg-[#33203B] dark:text-[#D59BE8]",
]

function hash(str: string) {
    let h = 0
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
    return Math.abs(h)
}

function displayName(id: string) {
    return `Reader ${id.slice(-4)}`
}

function formatDate(ms: number) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(ms))
}

const MAX_LENGTH = 1000

export default function CommentSection(props: {
    preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>
}) {
    const [isPending, startTransition] = useTransition()
    const params = useParams<{ blogId: Id<"posts"> }>()
    const createComment = useMutation(api.comments.createComment)
    const comments = usePreloadedQuery(props.preloadedComments)

    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            postId: params.blogId,
            body: "",
        },
    })

    const bodyValue = form.watch("body") ?? ""

    const handleSubmit = (data: z.infer<typeof commentSchema>) => {
        startTransition(async () => {
            try {
                await createComment({ postId: data.postId, body: data.body })
                form.reset({ postId: params.blogId, body: "" })
                toast.add({ type: "success", description: "Comment added successfully" })
            } catch (error) {
                console.error(error)
                toast.add({ type: "error", description: "Failed to add comment" })
            }
        })
    }

    return (
        <section
            aria-labelledby="comments-heading"
            className="mt-16 border-t border-[#E3E6EB] pt-10 dark:border-[#242A34]"
        >
            <h2
                id="comments-heading"
                className={`${serif.className} text-2xl font-semibold tracking-tight`}
            >
                Comments
                <span className="ml-2 text-lg font-normal text-[#5B6472] dark:text-[#9AA3B2]">
                    {comments.length}
                </span>
            </h2>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6" noValidate>
                <Controller
                    name="body"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div>
                            <label htmlFor="comment-body" className="sr-only">
                                Write a comment
                            </label>
                            <Textarea
                                id="comment-body"
                                placeholder="Share your thoughts on this post"
                                rows={4}
                                maxLength={MAX_LENGTH}
                                aria-invalid={fieldState.invalid}
                                aria-describedby={fieldState.error ? "comment-error" : undefined}
                                onKeyDown={(e) => {
                                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                                        e.preventDefault()
                                        form.handleSubmit(handleSubmit)()
                                    }
                                }}
                                className="min-h-28 resize-y rounded-lg border-[#D5DAE2] bg-white px-4 py-3 text-base leading-relaxed placeholder:text-[#8A93A2] focus-visible:border-[#2F4BFF] focus-visible:ring-2 focus-visible:ring-[#2F4BFF]/25 dark:border-[#2A313D] dark:bg-[#141922] dark:placeholder:text-[#6B7483] dark:focus-visible:border-[#8EA0FF] dark:focus-visible:ring-[#8EA0FF]/25"
                                {...field}
                            />
                            {fieldState.error && (
                                <p id="comment-error" role="alert" className="mt-2 text-sm text-[#C23B3B] dark:text-[#F28B8B]">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                <div className="mt-3 flex items-center justify-between gap-4">
                    <p className="text-xs text-[#5B6472] dark:text-[#9AA3B2]">
                        {bodyValue.length}/{MAX_LENGTH}
                        <span className="hidden sm:inline"> · Ctrl or ⌘ + Enter to post</span>
                    </p>

                    <Button
                        type="submit"
                        disabled={isPending || bodyValue.trim().length === 0}
                        className="rounded-lg bg-[#2F4BFF] px-5 text-white hover:bg-[#2339D6] disabled:opacity-50 dark:bg-[#8EA0FF] dark:text-[#0E1116] dark:hover:bg-[#A8B5FF]"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Posting</span>
                            </>
                        ) : (
                            "Post comment"
                        )}
                    </Button>
                </div>
            </form>

            <div className="mt-10">
                {comments.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#D5DAE2] px-6 py-10 text-center dark:border-[#2A313D]">
                        <p className={`${serif.className} text-lg`}>No comments yet</p>
                        <p className="mt-1 text-sm text-[#5B6472] dark:text-[#9AA3B2]">
                            Start the conversation with the first comment.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-[#E3E6EB] dark:divide-[#242A34]">
                        {comments.map((comment) => {
                            const name = displayName(comment.commenterId)
                            const color = AVATAR_COLORS[hash(comment.commenterId) % AVATAR_COLORS.length]
                            return (
                                <li key={comment._id} className="flex gap-4 py-6 first:pt-0">
                                    <div
                                        aria-hidden="true"
                                        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${color}`}
                                    >
                                        {comment.commenterId.slice(-2).toUpperCase()}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                                            <p className="text-sm font-semibold">{name}</p>
                                            <time
                                                suppressHydrationWarning
                                                dateTime={new Date(comment._creationTime).toISOString()}
                                                className="text-xs text-[#5B6472] dark:text-[#9AA3B2]"
                                            >
                                                {formatDate(comment._creationTime)}
                                            </time>
                                        </div>
                                        <p className="mt-1.5 whitespace-pre-wrap break-words text-[0.9375rem] leading-relaxed text-[#242A34] dark:text-[#CDD3DD]">
                                            {comment.body}
                                        </p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </section>
    )
}