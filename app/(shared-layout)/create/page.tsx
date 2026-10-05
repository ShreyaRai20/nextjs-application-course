'use client'

import { createBlogAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PostSchema } from "@/schemas/blog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function Create() {
    const [isPending, startTransition] = useTransition()
    const form = useForm({
        resolver: zodResolver(PostSchema),
        defaultValues: {
            title: '',
            content: '',
            image: undefined
        }
    })

    const hanldeSubmit = (values: z.infer<typeof PostSchema>) => {
        console.log(values)
        startTransition(async () => {
            await createBlogAction(values)
        })
    }
    return (
        <div className="min-h-screen flex justify-center py-7">
            <div className="w-full max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle> Create Blog </CardTitle>
                        <CardDescription> Create your blog article here </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(hanldeSubmit)}>
                            <FieldGroup>
                                <Controller
                                    name="title"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel> Title </FieldLabel>
                                            <Input aria-invalid={fieldState.invalid} placeholder="Title" type="text" {...field} />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="content"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel> Content </FieldLabel>
                                            <Textarea aria-invalid={fieldState.invalid} placeholder="Please write your content here" {...field} />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="image"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel> Image </FieldLabel>
                                            <Input aria-invalid={fieldState.invalid} placeholder="Title" type="file" accept="image/*" onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                field.onChange(file)
                                            }} />
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
                                        <Button type="submit"> Create Post</Button>
                                    )}
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}