import { title } from "process";
import z from "zod";

export const blogSchema = z.object({
    title: z.string(),
    content: z.string(),
    image: z.instanceof(File)
})