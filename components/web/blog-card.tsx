import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type BlogCardProps = {
    title: string;
    content: string;
    _creationTime: number;
};


export default function BlogCard({ title, content, _creationTime }: BlogCardProps) {
    return (
        <Card size="sm" className="mx-auto w-full max-w-xs">
            <CardHeader>
                <CardTitle> {title} </CardTitle>
                <CardDescription>
                    {_creationTime}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
        </Card>
    )
}