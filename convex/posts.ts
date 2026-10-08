import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const createBlog = mutation({
    args: {title: v.string(), content: v.string(), imageStorageId: v.optional(v.id("_storage"))},
    handler: async (ctx, {title, content, imageStorageId}) => {
        const user = await authComponent.safeGetAuthUser(ctx)

        if (!user) throw new Error("Not Authorized")

        const newPost = await ctx.db.insert("posts", {
            title: title,
            content: content,
            authorId: user._id,
            imageStorageId: imageStorageId
        })

        return newPost
    }
})

export const getBlogs = query({
    args: {},
    handler: async (ctx) => {
        const posts = await ctx.db
            .query("posts")
            .order("desc")
            .collect()

        return Promise.all(
            posts.map( async (post) => {
                const resolvedImage = post.imageStorageId !== undefined
                    ? { url: await ctx.storage.getUrl(post.imageStorageId) }
                    : null

                return {
                    ...post,
                    imageUrl: resolvedImage?.url || null
                }
            })
        )
    }
})

export const getBlogById = query({
    args: {postId: v.id("posts")},
    handler: async (ctx, {postId}) => {
        const post = await ctx.db.get(postId)

        const resolvedImage = post?.imageStorageId !== undefined
                    ? { url: await ctx.storage.getUrl(post.imageStorageId) }
                    : null

        return {
            ...post,
            imageUrl: resolvedImage?.url || null
        }
    }
})

export const generateImageUploadUrl = mutation({
    args: {},
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if(!user) throw new Error("Not authorized")

        return await ctx.storage.generateUploadUrl()
    }
})