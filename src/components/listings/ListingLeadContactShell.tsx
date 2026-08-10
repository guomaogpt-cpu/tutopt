"use client";

import type { ReactNode } from "react";
import type { ListingVertical } from "@prisma/client";
import { ListingLeadContactDrawer } from "@/components/listings/ListingLeadContactDrawer";
import { ListingLeadContactProvider } from "@/components/listings/ListingLeadContactProvider";

type ListingLeadContactShellProps = {
  children: ReactNode;
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

export function ListingLeadContactShell({
  children,
  ...drawerProps
}: ListingLeadContactShellProps) {
  return (
    <ListingLeadContactProvider>
      {children}
      {!drawerProps.isOwner ? <ListingLeadContactDrawer {...drawerProps} /> : null}
    </ListingLeadContactProvider>
  );
}
