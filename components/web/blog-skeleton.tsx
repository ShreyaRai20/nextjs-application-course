import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function BlogCardSkeleton() {
    return (
        <Card className="h-full gap-0 overflow-hidden rounded-2xl p-0">
            {/* Image placeholder (same aspect ratio as the real card) */}
            <Skeleton className="aspect-[16/10] w-full rounded-none" />

            <CardContent className="flex flex-1 flex-col gap-3 p-5">
                {/* Title */}
                <Skeleton className="h-5 w-3/4" />
                {/* Content lines */}
                <div className="space-y-2">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-2/3" />
                </div>
            </CardContent>

            <CardFooter className="border-t px-5 py-3">
                {/* Date */}
                <Skeleton className="h-3.5 w-28" />
            </CardFooter>
        </Card>
    );
}

export default function BlogListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <BlogCardSkeleton key={i} />
            ))}
        </div>
    );
}