"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ListingLeadContactContextValue = {
  isOpen: boolean;
  openLeadDrawer: () => void;
  closeLeadDrawer: () => void;
};

const ListingLeadContactContext = createContext<ListingLeadContactContextValue | null>(null);

export function ListingLeadContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openLeadDrawer = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeLeadDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      openLeadDrawer,
      closeLeadDrawer,
    }),
    [isOpen, openLeadDrawer, closeLeadDrawer],
  );

  return (
    <ListingLeadContactContext.Provider value={value}>
      {children}
    </ListingLeadContactContext.Provider>
  );
}

export function useListingLeadContact(): ListingLeadContactContextValue {
  const context = useContext(ListingLeadContactContext);
  if (!context) {
    throw new Error("useListingLeadContact must be used within ListingLeadContactProvider");
  }
  return context;
}

export function useListingLeadContactOptional(): ListingLeadContactContextValue | null {
  return useContext(ListingLeadContactContext);
}
