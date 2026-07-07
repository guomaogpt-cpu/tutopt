import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <Section spacing="none" className={cn("animate-fade-in-up", className)}>
      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent className="space-y-5 p-4 sm:p-6">{children}</CardContent>
      </Card>
    </Section>
  );
}
