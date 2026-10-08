import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { title } from "process";

export default defineSchema({
    posts: defineTable({
        title: v.string(),
        content: v.string(),
        authorId: v.string(),
        imageStorageId: v.optional(v.id("_storage"))
    }),
    comments: defineTable({
        body: v.string(),
        postId: v.id("posts"),
        commenterId: v.string(),
        commenterName: v.string(),
    })
})