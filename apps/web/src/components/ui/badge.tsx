import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", {
  variants: {
    variant: {
      default: "border-white/10 bg-white/[0.04] text-zinc-300",
      success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      accent: "border-violet-500/30 bg-violet-500/10 text-violet-200",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
