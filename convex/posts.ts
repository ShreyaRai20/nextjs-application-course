import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";

export const createPost = mutation({
  args: { title: v.string(), content: v.string()},
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx)

    if (!user) throw new ConvexError('not Authorized')

    const newPost =  await ctx.db.insert("posts", { title: args.title, content: args.content, authorId: user._id});

    return newPost
  },
});


export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx)

    if (!user) throw new ConvexError('not Authorized')

    const newPost =  await ctx.db
      .query('posts')
      .order('desc')
      .collect()

    return newPost
  },
});
