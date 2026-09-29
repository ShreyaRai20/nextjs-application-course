'use client'
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Blog() {
    const tasks = useQuery(api.tasks.get);
    return (
        <div>
            <div>Blog</div>
            {tasks?.map(({ _id, text }) => (
                <div key={_id}>{text}</div>
            ))}
        </div>
    )
}