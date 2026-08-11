"use client";

import { useEffect, useState } from "react";
import { CargoRequestForm } from "@/components/cargo/CargoRequestForm";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useTranslation } from "@/lib/i18n/useTranslation";

type CargoRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthenticated?: boolean;
};

export function CargoRequestModal({
  open,
  onOpenChange,
  isAuthenticated = false,
}: CargoRequestModalProps) {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(0);
  const [formDirty, setFormDirty] = useState(false);

  useEffect(() => {
    if (open) {
      setFormKey((current) => current + 1);
      setFormDirty(false);
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side="bottom"
        swipeDismissGuard={() => !formDirty}
        className="max-h-[92vh] gap-0 overflow-hidden p-0 dark:border-slate-800 dark:bg-slate-950 sm:left-1/2 sm:right-auto sm:max-w-2xl sm:-translate-x-1/2 sm:rounded-t-2xl"
      >
        <DrawerHeader className="border-b border-slate-100 px-4 pb-3 pt-4 dark:border-slate-800 sm:px-6">
          <DrawerTitle>{t("cargo.requestModalTitle")}</DrawerTitle>
          <DrawerDescription>{t("cargo.requestModalDescription")}</DrawerDescription>
        </DrawerHeader>
        <div
          data-drawer-scroll
          className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom)+var(--keyboard-inset,0px))] pt-4 sm:px-6"
        >
          <CargoRequestForm
            key={formKey}
            variant="modal"
            isAuthenticated={isAuthenticated}
            onSuccessClose={() => onOpenChange(false)}
            onDirtyChange={setFormDirty}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
