import { redirect } from "next/navigation";

/** Legacy buyer dashboard → unified account. */
export default function BuyerDashboardRedirectPage() {
  redirect("/account");
}
