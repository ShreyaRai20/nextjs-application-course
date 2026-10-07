"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { signUpSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

    const handleSubmit = async (values: z.infer<typeof signUpSchema>) => {
        console.log("submitting")
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
                },
                onError: (error) => {
                    toast.add({
                        type: "error",
                        description: `error while creating account ${error.error.message}`
                    })
                }
            }
        })
        router.push("/")
    }

    return (
        <>
            <Card>
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
                        </FieldGroup>
                        <Button type="submit"> Sign up </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}