'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { SignInSchema } from "@/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

export default function SignIn() {
    const [isPending, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const router = useRouter()

    const hanldeSubmit = (data: z.infer<typeof SignInSchema>) => {
        startTransition(async () => {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.add({
                            type: 'success',
                            description: 'Signed in successfully',
                            timeout: 2000,
                        })
                        router.push('/')
                    },
                    onError: (error) => {
                        toast.add({
                            type: 'error',
                            description: `error occured while signing in ${error.error.message}`,
                            timeout: 2000,
                        })
                    },
                }
            })
        })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Please sign in here</CardTitle>
                <CardDescription> Sign in to get started</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(hanldeSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel> Email</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="john@doe.com" type="email" {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel> Password</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="*******" type="password" {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        {isPending ?
                            (
                                <>
                                    <Loader2 size={4} className="animate-spin" />
                                    <span>Loading...</span>
                                </>
                            ) :
                            (
                                <Button type="submit"> Sign in</Button>
                            )}
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}