import type { Metadata } from "next";
import { CargoRequestDetailView } from "@/components/cargo/CargoRequestDetailView";
import { CargoRequestNotFound } from "@/components/cargo/CargoRequestNotFound";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getCargoRequestDetailForViewer } from "@/features/cargo/lib/cargo-requests-data";
import { Container } from "@/components/ui/container";
import { isUuid } from "@/shared/lib/is-uuid";
import { prisma } from "@/shared/lib/prisma";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

type CargoRequestDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: CargoRequestDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  if (!isUuid(id)) {
    return buildPrivatePageMetadata(
      "Заявка не найдена",
      "Карго-заявка не найдена на ВсеТут.",
    );
  }

  const request = await prisma.cargoRequest.findUnique({
    where: { id },
    select: { item_name: true, from_location: true, to_location: true },
  });

  if (!request) {
    return buildPrivatePageMetadata(
      "Заявка не найдена",
      "Карго-заявка не найдена на ВсеТут.",
    );
  }

  return buildPrivatePageMetadata(
    `${request.item_name}: ${request.from_location} → ${request.to_location}`,
    "Карго-заявка на перевозку на ВсеТут.",
  );
}

export const dynamic = "force-dynamic";

export default async function CargoRequestDetailPage({
  params,
}: CargoRequestDetailPageProps) {
  const { id } = await params;

  if (!isUuid(id)) {
    return (
      <main className="min-w-0 bg-gradient-to-b from-orange-50/40 to-slate-50 py-8 dark:from-slate-950 dark:to-slate-950">
        <Container size="md" className="max-w-2xl">
          <CargoRequestNotFound />
        </Container>
      </main>
    );
  }

  const user = await getCurrentUser();

  const sellerProfile = user
    ? await prisma.sellerProfile.findUnique({
        where: { user_id: user.id },
        select: { id: true },
      })
    : null;

  const detail = await getCargoRequestDetailForViewer({
    requestId: id,
    userId: user?.id ?? null,
    userRole: user?.role ?? null,
    sellerProfileId: sellerProfile?.id ?? null,
  });

  if (!detail) {
    return (
      <main className="min-w-0 bg-gradient-to-b from-orange-50/40 to-slate-50 py-8 dark:from-slate-950 dark:to-slate-950">
        <Container size="md" className="max-w-2xl">
          <CargoRequestNotFound />
        </Container>
      </main>
    );
  }

  return (
    <main className="min-w-0 bg-gradient-to-b from-orange-50/40 to-slate-50 py-6 dark:from-slate-950 dark:to-slate-950 sm:py-8">
      <Container size="md" className="max-w-2xl min-w-0">
        <CargoRequestDetailView detail={detail} isAuthenticated={Boolean(user)} />
      </Container>
    </main>
  );
}
