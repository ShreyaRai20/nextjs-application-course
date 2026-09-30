'use client'

import { getBlogsAction } from "@/app/actions";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";

export default function Blog() {
    const posts = useQuery(api.posts.getPosts)

    return (
        <div>
            <div>Blog</div>
            {posts?.map(({ _id, title, content, _creationTime }) => (
                <div key={_id}>{title}</div>
            ))}
        </div>
    )
}