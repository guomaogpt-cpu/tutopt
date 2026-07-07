import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section, SectionHeader, SectionTitle } from "@/components/ui/section";

export type ListingCharacteristicItem = {
  label: string;
  value: string;
};

type ListingCharacteristicsProps = {
  items: ListingCharacteristicItem[];
};

export function ListingCharacteristics({ items }: ListingCharacteristicsProps) {
  const visibleItems = items.filter((item) => item.value.trim().length > 0);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <Section spacing="none" aria-labelledby="listing-characteristics-title">
      <SectionHeader className="mb-4">
        <SectionTitle id="listing-characteristics-title" className="text-xl">
          Характеристики
        </SectionTitle>
      </SectionHeader>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>Характеристики</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {visibleItems.map((item) => (
              <div key={item.label} className="rounded-xl border bg-muted/20 px-4 py-3">
                <dt className="text-sm text-muted-foreground">{item.label}</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </Section>
  );
}
