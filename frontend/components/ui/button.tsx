"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-300 text-[oklch(12.9%_0.042_264.695)] hover:bg-cyan-400 dark:bg-cyan-300 dark:text-[oklch(12.9%_0.042_264.695)] dark:hover:bg-cyan-200",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 gap-1.5 px-3",
        xs: "h-6 gap-1 rounded-[10px] px-2 text-xs",
        sm: "h-7 gap-1 rounded-[12px] px-2.5 text-[0.8rem]",
        lg: "h-9 gap-1.5 px-4",
        icon: "size-8",
        "icon-xs": "size-6 rounded-[10px]",
        "icon-sm": "size-7 rounded-[12px]",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    render?: React.ReactElement;
    nativeButton?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  nativeButton = true,
  type,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }));

  if (render && React.isValidElement(render)) {
    const element = render as React.ReactElement<Record<string, unknown>>;

    return React.cloneElement(element, {
      ...props,
      className: cn(classes, element.props.className as string | undefined),
      children,
    });
  }

  return (
    <button
      type={type ?? (nativeButton ? "button" : undefined)}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button, buttonVariants };
