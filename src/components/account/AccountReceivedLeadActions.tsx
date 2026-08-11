"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LeadStatus } from "@prisma/client";
import { CheckCircle2, Clock3, Phone, XCircle } from "lucide-react";
import { updateSellerLeadStatus } from "@/features/leads/lib/leads-client";
import { isLeadStatusTerminal } from "@/features/leads/lib/lead-status";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";

type AccountReceivedLeadActionsProps = {
  leadId: string;
  status: LeadStatus;
  buyerPhone: string | null;
};

export function AccountReceivedLeadActions({
  leadId,
  status,
  buyerPhone,
}: AccountReceivedLeadActionsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isTerminal = isLeadStatusTerminal(status);

  async function updateStatus(
    nextStatus: Extract<LeadStatus, "VIEWED" | "CLOSED" | "REJECTED">,
  ) {
    setError(null);
    setIsPending(true);
    try {
      await updateSellerLeadStatus(leadId, nextStatus);
      router.refresh();
    } catch {
      setError(t("accountRequests.leadActionFailed"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {buyerPhone ? (
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-xl dark:border-slate-700 sm:w-auto"
          >
            <a href={`tel:${buyerPhone}`}>
              <Phone className="size-4" aria-hidden="true" />
              {t("accountRequests.callBuyer")}
            </a>
          </Button>
        ) : null}

        {!isTerminal && status === LeadStatus.NEW ? (
          <Button
            type="button"
            variant="secondary"
            className="h-11 w-full rounded-xl sm:w-auto"
            disabled={isPending}
            onClick={() => void updateStatus(LeadStatus.VIEWED)}
          >
            <Clock3 className="size-4" aria-hidden="true" />
            {t("accountRequests.markInProgress")}
          </Button>
        ) : null}

        {!isTerminal ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl dark:border-slate-700 sm:w-auto"
              disabled={isPending}
              onClick={() => void updateStatus(LeadStatus.CLOSED)}
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {t("accountRequests.completeLead")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-11 w-full rounded-xl text-slate-600 dark:text-slate-400 sm:w-auto"
              disabled={isPending}
              onClick={() => void updateStatus(LeadStatus.REJECTED)}
            >
              <XCircle className="size-4" aria-hidden="true" />
              {t("accountRequests.rejectLead")}
            </Button>
          </>
        ) : null}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
