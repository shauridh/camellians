import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Button primitive.
 *
 * Every variant is built from design tokens only — no raw hex, no arbitrary
 * spacing. Minimum height is 44px to satisfy the project's touch-target
 * contract (WCAG 2.5.8 asks for 24px; we hold ourselves to 44px).
 */
const buttonVariants = cva(
  // Shared: layout, type, motion, and a 44px floor.
  "inline-flex min-h-11 items-center justify-center gap-tight whitespace-nowrap rounded-md font-body font-medium transition-[transform,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-evergreen text-ivory hover:bg-evergreen-deep",
        secondary:
          "bg-mist text-evergreen-deep hover:bg-sage/25",
        outline:
          "border border-stone bg-paper text-ink hover:bg-mist",
        ghost: "text-evergreen hover:bg-mist",
        destructive: "bg-alert text-paper hover:bg-alert/90",
      },
      size: {
        sm: "px-snug py-tight text-sm",
        md: "px-card py-tight text-base",
        lg: "px-card-lg py-snug text-base",
        // Square icon button — still 44x44 for touch.
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
