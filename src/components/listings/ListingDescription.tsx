"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section, SectionHeader, SectionTitle } from "@/components/ui/section";

const COLLAPSED_LENGTH = 480;

type ListingDescriptionProps = {
  text: string;
};

export function ListingDescription({ text }: ListingDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > COLLAPSED_LENGTH;
  const displayText = !isLong || expanded ? text : `${text.slice(0, COLLAPSED_LENGTH).trimEnd()}…`;

  if (!text.trim()) {
    return null;
  }

  return (
    <Section spacing="none" aria-labelledby="listing-description-title">
      <SectionHeader className="mb-4">
        <SectionTitle id="listing-description-title" className="text-xl">
          Описание
        </SectionTitle>
      </SectionHeader>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>Описание</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <p className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
            {displayText}
          </p>
          {isLong ? (
            <Button
              type="button"
              variant="link"
              className="mt-4 h-auto p-0"
              onClick={() => setExpanded((current) => !current)}
            >
              {expanded ? "Свернуть" : "Показать полностью"}
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </Section>
  );
}
