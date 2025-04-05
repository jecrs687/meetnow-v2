import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@utils";

const loaderVariants = cva(
    "animate-spin rounded-full border-current border-t-transparent",
    {
        variants: {
            size: {
                sm: "h-4 w-4 border-2",
                default: "h-6 w-6 border-2",
                lg: "h-8 w-8 border-3",
                xl: "h-12 w-12 border-4",
            },
            variant: {
                default: "text-primary",
                secondary: "text-secondary",
                muted: "text-muted-foreground",
                white: "text-white",
            },
        },
        defaultVariants: {
            size: "default",
            variant: "default",
        },
    }
);

export interface LoaderProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
    text?: string;
    textClassName?: string;
}

export function Loader({
    className,
    size,
    variant,
    text,
    textClassName,
    ...props
}: LoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2" {...props}>
            <div
                className={cn(loaderVariants({ size, variant }), className)}
                role="status"
                aria-label="Loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
            {text && (
                <p className={cn("text-sm text-muted-foreground", textClassName)}>
                    {text}
                </p>
            )}
        </div>
    );
}

export { loaderVariants };
