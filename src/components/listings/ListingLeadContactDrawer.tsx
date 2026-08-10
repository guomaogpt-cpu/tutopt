"use client";

import type { ListingVertical } from "@prisma/client";
import { ListingLeadFormContent } from "@/components/listings/ListingLeadFormContent";
import { useListingLeadContact } from "@/components/listings/ListingLeadContactProvider";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useTranslation } from "@/lib/i18n/useTranslation";

type ListingLeadContactDrawerProps = {
  listingId: string;
  listingTitle: string;
  sellerName: string;
  moq: number;
  unitLabel: string;
  vertical: ListingVertical;
  isAuthenticated: boolean;
  isOwner: boolean;
  restrictionMessage?: string | null;
  defaultName?: string | null;
  defaultPhone?: string | null;
  defaultEmail?: string | null;
};

export function ListingLeadContactDrawer(props: ListingLeadContactDrawerProps) {
  const { t } = useTranslation();
  const { isOpen, closeLeadDrawer } = useListingLeadContact();

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeLeadDrawer()}>
      <DrawerContent
        side="bottom"
        className="max-h-[min(85dvh,calc(100dvh-env(safe-area-inset-bottom)-var(--keyboard-inset,0px)))] overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom)+var(--keyboard-inset,0px))] pt-2"
      >
        <DrawerHeader className="px-0 pb-2 text-left">
          <DrawerTitle>{t("lead.title")}</DrawerTitle>
          <DrawerDescription>{t("lead.description")}</DrawerDescription>
        </DrawerHeader>
        <ListingLeadFormContent
          {...props}
          compact
          onClose={closeLeadDrawer}
        />
      </DrawerContent>
    </Drawer>
  );
}
