'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { SignupSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function SignUp() {
    const form = useForm({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const hanldeSubmit = (data: z.infer<typeof SignupSchema>) => {
        startTransition(async () => {
            await authClient.signUp.email({
                email: data.email,
                name: data.name,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.add({
                            type: 'success',
                            description: 'Account created successfully',
                            timeout: 2000,
                        })
                        router.push('/')
                    },
                    onError: (error) => {
                        toast.add({
                            type: 'error',
                            description: `error occured while signing up ${error.error.message}`,
                            timeout: 2000,
                        })
                    }
                }
            })
        })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Please sign up here</CardTitle>
                <CardDescription> Create an account to get started</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(hanldeSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel> Name</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="john doe" {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
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
                                <Button type="submit"> Sign up</Button>
                            )}
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}