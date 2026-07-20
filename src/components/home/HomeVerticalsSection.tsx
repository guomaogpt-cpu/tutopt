import { Container } from "@/components/ui/container";
import { VerticalCards } from "@/components/verticals/VerticalCards";

export function HomeVerticalsSection() {
  return (
    <section
      data-home-section="verticals"
      className="overflow-x-clip bg-[#F5F7FA] pb-2 pt-7 sm:pt-8"
      aria-labelledby="home-verticals-heading"
    >
      <Container size="lg">
        <VerticalCards showTitle trackingSource="homepage" />
      </Container>
    </section>
  );
}
