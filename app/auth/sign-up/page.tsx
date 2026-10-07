"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { signUpSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function SignUp() {
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })
    const router = useRouter()
    const [isPending, startTransiiton] = useTransition()

    const handleSubmit = async (values: z.infer<typeof signUpSchema>) => {
        startTransiiton(async () => {
            await authClient.signUp.email({
                name: values.name,
                email: values.email,
                password: values.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.add({
                            type: "success",
                            description: "Account created successfully"
                        })
                        router.push("/")
                    },
                    onError: (error) => {
                        toast.add({
                            type: "error",
                            description: `error while creating account ${error.error.message}`
                        })
                    }
                }
            })
        })
    }

    return (
        <>
            <Card className="rounded-xl">
                <CardHeader>
                    <CardTitle>Sign up</CardTitle>
                    <CardDescription>Create your account here</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Name</FieldLabel>
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Email</FieldLabel>
                                        <Input
                                            type="text"
                                            placeholder="john@doe.com"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Password</FieldLabel>
                                        <Input
                                            type="password"
                                            placeholder="*********"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}

                            />
                            {isPending ? (<Loader2 />) : (<Button type="submit"> Sign up </Button>)}
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}