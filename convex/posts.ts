import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";

export const createPost = mutation({
  args: { title: v.string(), content: v.string(), imageStorageId: v.id('_storage')},
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx)

    if (!user) throw new ConvexError('not Authorized')

    const newPost =  await ctx.db.insert(
        "posts", 
        { 
          title: args.title, 
          content: args.content,
          authorId: user._id,
          imageStorageId: args.imageStorageId,
        }
      );

    return newPost
  },
});


export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx)

    if (!user) throw new ConvexError('not Authorized')

    const posts =  await ctx.db
      .query('posts')
      .order('desc')
      .collect()

    return Promise.all(
      posts.map(async (post) => {
        const resolvedImage = post.imageStorageId !== undefined
          ? await ctx.storage.getUrl(post.imageStorageId)
          : null
        
        return {
          ...post,
          imageUrl: resolvedImage,
        }
      }),
    );
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {

    // STEP 1: GET USER TO CHECK IF THEY ARE AUTHORIZED
    const user = await authComponent.safeGetAuthUser(ctx)

    // STEP 2: IF NOT AUTHORIZED THROW 'not Authorized' ERROR
    if (!user) throw new ConvexError('not Authorized')

    // STEP 3: IF AUTHORIZED RETURN GENERATED URL

    return await ctx.storage.generateUploadUrl() 
  }
})
