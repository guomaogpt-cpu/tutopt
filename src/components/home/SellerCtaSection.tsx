import Link from "next/link";
import { Container } from "@/components/layout/Container";

const focusRingClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

type SellerCtaSectionProps = {
  createListingHref: string;
};

export function SellerCtaSection({ createListingHref }: SellerCtaSectionProps) {
  return (
    <section className="bg-white py-12 sm:py-16">
      <Container>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Продаёте оптом?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Разместите предложение и получайте заявки от магазинов, HoReCa и закупщиков.
          </p>
          <Link
            href={createListingHref}
            className={`mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 ${focusRingClassName}`}
          >
            Подать объявление
          </Link>
        </div>
      </Container>
    </section>
  );
}
