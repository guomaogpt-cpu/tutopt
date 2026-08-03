import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { AccountCargoRequestCard } from "@/components/account/AccountCargoRequestCard";
import { AccountCargoResponseCard } from "@/components/account/AccountCargoResponseCard";
import { AccountMyCargoResponsesLink } from "@/components/account/AccountMyCargoResponsesLink";
import { AccountReceivedLeadCard } from "@/components/account/AccountReceivedLeadCard";
import { AccountRequestsEmptyState } from "@/components/account/AccountRequestsEmptyState";
import { AccountRequestsPageHeader } from "@/components/account/AccountRequestsPageHeader";
import { AccountRequestsSectionTitle } from "@/components/account/AccountRequestsSectionTitle";
import { AccountRequestsTabs } from "@/components/account/AccountRequestsTabs";
import { AccountSentLeadCard } from "@/components/account/AccountSentLeadCard";
import { getSellerOwnCargoResponses } from "@/features/account/lib/seller-own-cargo-responses";
import { parseAccountRequestsTab } from "@/features/account/lib/account-requests-tabs";
import { getCurrentUser } from "@/features/auth/lib/session";
import { needsSellerOnboarding } from "@/features/auth/lib/seller-onboarding";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
import { getBuyerCargoRequests } from "@/features/cargo/lib/cargo-requests-data";
import { getBuyerLeads, getSellerLeads } from "@/features/leads/lib/leads-data";
import { prisma } from "@/shared/lib/prisma";
import { Container } from "@/components/ui/container";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Мои заявки",
  "Заявки и карго-запросы в личном кабинете ВсеТут.",
);

export const dynamic = "force-dynamic";

type AccountRequestsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountRequestsPage({ searchParams }: AccountRequestsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/account/requests"));
  }

  if (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) {
    redirect("/admin");
  }

  if (
    user.role === UserRole.SELLER &&
    needsSellerOnboarding({ role: user.role, phone: user.phone })
  ) {
    redirect(buildSellerOnboardingUrl("/account/requests"));
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.BUYER) {
    redirect("/");
  }

  const rawParams = await searchParams;
  const activeTab = parseAccountRequestsTab(rawParams.tab);

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
    select: { id: true },
  });

  const [sentLeads, receivedLeads, cargoRequests, ownCargoResponses] = await Promise.all([
    getBuyerLeads(user.id),
    sellerProfile ? getSellerLeads(sellerProfile.id) : Promise.resolve([]),
    getBuyerCargoRequests(user.id),
    sellerProfile ? getSellerOwnCargoResponses(sellerProfile.id) : Promise.resolve([]),
  ]);

  const incomingCargoResponses = cargoRequests.flatMap((request) =>
    request.responses.map((response) => ({
      id: response.id,
      created_at: response.created_at,
      price: response.price,
      currency: response.currency,
      estimated_time: response.estimated_time,
      comment: response.comment,
      status: response.status,
      companyName: response.sellerProfile.company_name,
      cargoRequestId: request.id,
      itemName: request.item_name,
      fromLocation: request.from_location,
      toLocation: request.to_location,
      contactName: response.contact_name,
      contactPhone: response.contact_phone,
    })),
  );

  const cargoResponsesCount = incomingCargoResponses.length + ownCargoResponses.length;
  const totalCount =
    sentLeads.length +
    receivedLeads.length +
    cargoRequests.length +
    cargoResponsesCount;

  const showSent = activeTab === "all" || activeTab === "sent";
  const showReceived = activeTab === "all" || activeTab === "received";
  const showCargoRequests = activeTab === "all" || activeTab === "cargoRequests";
  const showCargoResponses = activeTab === "all" || activeTab === "cargoResponses";

  const tabHasItems =
    (activeTab === "all" && totalCount > 0) ||
    (activeTab === "sent" && sentLeads.length > 0) ||
    (activeTab === "received" && receivedLeads.length > 0) ||
    (activeTab === "cargoRequests" && cargoRequests.length > 0) ||
    (activeTab === "cargoResponses" && cargoResponsesCount > 0);

  return (
    <main className="min-w-0 bg-[#F5F7FA] pt-4 dark:bg-slate-950 sm:py-8">
      <Container size="lg" className="max-w-[1100px] min-w-0">
        <AccountRequestsPageHeader />

        <div className="mt-5 space-y-4 sm:mt-6">
          <AccountRequestsTabs
            activeTab={activeTab}
            counts={{
              all: totalCount,
              sent: sentLeads.length,
              received: receivedLeads.length,
              cargoRequests: cargoRequests.length,
              cargoResponses: cargoResponsesCount,
            }}
          />

          {!tabHasItems ? (
            <AccountRequestsEmptyState variant={totalCount === 0 ? "global" : "section"} />
          ) : (
            <div className="space-y-8">
              {showSent && sentLeads.length > 0 ? (
                <section className="space-y-3">
                  {activeTab === "all" ? (
                    <AccountRequestsSectionTitle titleKey="accountRequests.sentTitle" />
                  ) : null}
                  {sentLeads.map((lead) => (
                    <AccountSentLeadCard key={lead.id} lead={lead} />
                  ))}
                </section>
              ) : null}

              {showReceived && receivedLeads.length > 0 ? (
                <section className="space-y-3">
                  {activeTab === "all" ? (
                    <AccountRequestsSectionTitle titleKey="accountRequests.receivedTitle" />
                  ) : null}
                  {receivedLeads.map((lead) => (
                    <AccountReceivedLeadCard key={lead.id} lead={lead} />
                  ))}
                </section>
              ) : null}

              {showCargoRequests && cargoRequests.length > 0 ? (
                <section className="space-y-3">
                  {activeTab === "all" ? (
                    <AccountRequestsSectionTitle titleKey="accountRequests.cargoRequestsTitle" />
                  ) : null}
                  {cargoRequests.map((request) => (
                    <AccountCargoRequestCard key={request.id} request={request} />
                  ))}
                </section>
              ) : null}

              {showCargoResponses && cargoResponsesCount > 0 ? (
                <section className="space-y-3">
                  {activeTab === "all" || activeTab === "cargoResponses" ? (
                    <AccountRequestsSectionTitle titleKey="accountRequests.cargoResponsesTitle" />
                  ) : null}

                  {incomingCargoResponses.map((response) => (
                    <AccountCargoResponseCard
                      key={`in-${response.id}`}
                      mode="incoming"
                      response={response}
                    />
                  ))}

                  {ownCargoResponses.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <AccountRequestsSectionTitle titleKey="accountRequests.myCargoResponsesTitle" />
                        <AccountMyCargoResponsesLink />
                      </div>
                      {ownCargoResponses.map((response) => (
                        <AccountCargoResponseCard
                          key={`own-${response.id}`}
                          mode="own"
                          response={{
                            id: response.id,
                            created_at: response.created_at,
                            price: response.price,
                            currency: response.currency,
                            estimated_time: response.estimated_time,
                            comment: response.comment,
                            status: response.status,
                            companyName: "",
                            cargoRequestId: response.cargoRequest.id,
                            itemName: response.cargoRequest.item_name,
                            fromLocation: response.cargoRequest.from_location,
                            toLocation: response.cargoRequest.to_location,
                          }}
                        />
                      ))}
                    </div>
                  ) : null}
                </section>
              ) : null}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
