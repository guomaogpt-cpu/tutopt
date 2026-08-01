export type AccountRequestsTab =
  | "all"
  | "sent"
  | "received"
  | "cargoRequests"
  | "cargoResponses";

const TAB_VALUES: AccountRequestsTab[] = [
  "all",
  "sent",
  "received",
  "cargoRequests",
  "cargoResponses",
];

export function parseAccountRequestsTab(
  value: string | string[] | undefined,
): AccountRequestsTab {
  const raw = typeof value === "string" ? value.trim() : "";
  return TAB_VALUES.includes(raw as AccountRequestsTab)
    ? (raw as AccountRequestsTab)
    : "all";
}

export function buildAccountRequestsHref(tab: AccountRequestsTab): string {
  if (tab === "all") {
    return "/account/requests";
  }
  return `/account/requests?tab=${tab}`;
}
