import * as React from "react";
import { cn } from "@/lib/utils";

export type PageTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2";
};

const PageTitle = React.forwardRef<HTMLHeadingElement, PageTitleProps>(
  ({ className, as: Comp = "h1", ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn("text-3xl font-bold tracking-tight text-foreground sm:text-4xl", className)}
      {...props}
    />
  ),
);
PageTitle.displayName = "PageTitle";

const PageSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-base text-muted-foreground sm:text-lg", className)} {...props} />
));
PageSubtitle.displayName = "PageSubtitle";

export { PageSubtitle, PageTitle };
