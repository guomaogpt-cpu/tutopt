import { Container } from "@/components/ui/container";
import { VerticalCards } from "@/components/verticals/VerticalCards";

export function HomeVerticalsSection() {
  return (
    <section
      data-home-section="verticals"
      className="overflow-x-clip bg-[#F5F7FA] pb-1 pt-5 sm:pt-6"
      aria-labelledby="home-verticals-heading"
    >
      <Container size="lg">
        <VerticalCards showTitle trackingSource="homepage" />
      </Container>
    </section>
  );
}
