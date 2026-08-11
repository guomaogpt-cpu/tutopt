"use client";

import { useEffect, useState } from "react";
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
  const [formDirty, setFormDirty] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormDirty(false);
    }
  }, [isOpen]);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeLeadDrawer()}>
      <DrawerContent
        side="bottom"
        swipeDismissGuard={() => !formDirty}
        className="max-h-[min(85dvh,calc(100dvh-env(safe-area-inset-bottom)-var(--keyboard-inset,0px)))] gap-0 overflow-hidden px-4 pb-[calc(1rem+env(safe-area-inset-bottom)+var(--keyboard-inset,0px))] pt-2"
      >
        <DrawerHeader className="px-0 pb-2 text-left">
          <DrawerTitle>{t("lead.title")}</DrawerTitle>
          <DrawerDescription>{t("lead.description")}</DrawerDescription>
        </DrawerHeader>
        <div
          data-drawer-scroll
          className="min-h-0 flex-1 overflow-y-auto pb-2"
        >
          <ListingLeadFormContent
            {...props}
            compact
            onClose={closeLeadDrawer}
            onDirtyChange={setFormDirty}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
