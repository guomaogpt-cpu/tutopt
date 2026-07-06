import * as React from "react";
import { cn } from "@/lib/utils";

export type SectionProps = React.HTMLAttributes<HTMLElement> & {
  spacing?: "none" | "sm" | "md" | "lg";
};

const spacingClasses: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  sm: "py-6",
  md: "py-10",
  lg: "py-16",
};

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "md", ...props }, ref) => (
    <section ref={ref} className={cn(spacingClasses[spacing], className)} {...props} />
  ),
);
Section.displayName = "Section";

const SectionHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between", className)}
      {...props}
    />
  ),
);
SectionHeader.displayName = "SectionHeader";

const SectionTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-2xl font-bold tracking-tight text-foreground", className)} {...props} />
  ),
);
SectionTitle.displayName = "SectionTitle";

const SectionDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("max-w-2xl text-sm text-muted-foreground", className)} {...props} />
));
SectionDescription.displayName = "SectionDescription";

export { Section, SectionDescription, SectionHeader, SectionTitle };
