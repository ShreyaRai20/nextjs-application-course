import z from "zod"

export const SignupSchema = z.object({
    name: z.string().min(6).max(30),
    email: z.email(),
    password: z.string().min(8).max(30)
})