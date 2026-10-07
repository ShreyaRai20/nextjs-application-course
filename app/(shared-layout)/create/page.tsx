"use client"
import { createBlogAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { blogSchema } from "@/schema/blog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function CreateBlog() {
    const form = useForm({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            content: ""
        }
    })

    const [isePending, startTransition] = useTransition()

    const handleSubmit = (values: z.infer<typeof blogSchema>) => {
        startTransition(async () => {
            await createBlogAction(values)
        })
    }
    return (
        <div className="min-h-full flex justify-center items-center">
            <div className="w-full max-w-md mx-auto">
                <Card className="mt-4 rounded-xl">
                    <CardHeader>
                        <CardTitle>Blog</CardTitle>
                        <CardDescription>Create your blog here</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <FieldGroup>
                                <Controller
                                    name="title"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel>Title</FieldLabel>
                                            <Input
                                                type="text"
                                                placeholder="title"
                                                aria-invalid={fieldState.invalid}
                                                {...field}
                                            />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="content"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel>Content</FieldLabel>
                                            <Textarea
                                                placeholder="Content..."
                                                aria-invalid={fieldState.invalid}
                                                {...field}
                                            />
                                        </Field>
                                    )}
                                />
                                <Button type="submit"> {isePending ? (<Loader2 />) : "Create blog"}</Button>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}