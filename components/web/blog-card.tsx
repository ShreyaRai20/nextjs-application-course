import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image";

type BlogCardProps = {
    title: string;
    content: string;
    _creationTime: number;
    imageUrl: string | null
};


export default function BlogCard({ title, content, _creationTime, imageUrl }: BlogCardProps) {
    return (
        <Card size="sm" className="mx-auto w-full max-w-xs rounded-xl">
            <CardHeader>
                <CardTitle> {title} </CardTitle>
                <CardDescription>
                    {_creationTime}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Image
                    src={imageUrl || ''}
                    alt=""
                    width={500}
                    height={500}
                />
                {content}
            </CardContent>
        </Card>
    )
}