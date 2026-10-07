import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { title } from "process";

export default defineSchema({
    posts: defineTable({
        title: v.string(),
        content: v.string(),
        authorId: v.string()
    })
})