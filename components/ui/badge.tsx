import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent glass text-primary-foreground shadow hover:shadow-lg hover:-translate-y-0.5",
        secondary:
          "border-transparent glass-light text-secondary-foreground hover:shadow-lg hover:-translate-y-0.5",
        destructive:
          "border-transparent bg-destructive/80 text-destructive-foreground shadow backdrop-blur-sm hover:bg-destructive/90 hover:shadow-lg hover:-translate-y-0.5",
        outline:
          "text-foreground glass-light border-white/20 hover:shadow-md hover:-translate-y-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
