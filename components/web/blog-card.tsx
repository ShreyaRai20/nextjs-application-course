import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ImageOff } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type BlogCardProps = {
    _id?: string;
    title: string;
    content: string;
    _creationTime: number;
    imageUrl: string | null;
};

function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function BlogCard({
    _id,
    title,
    content,
    _creationTime,
    imageUrl,
}: BlogCardProps) {
    const card = (
        <Card className="group h-full gap-0 overflow-hidden rounded-2xl p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Image area: fixed aspect ratio so every card lines up */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ImageOff className="h-8 w-8 opacity-50" />
                    </div>
                )}
            </div>

            <CardContent className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight">
                    {title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {content}
                </p>
            </CardContent>

            <CardFooter className="border-t px-5 py-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <time dateTime={new Date(_creationTime).toISOString()}>
                        {formatDate(_creationTime)}
                    </time>
                </div>
            </CardFooter>
        </Card>
    );

    // Make the whole card clickable if you have a detail page
    return _id ? (
        <Link href={`/blog/${_id}`} className="block h-full">
            {card}
        </Link>
    ) : (
        card
    );
}