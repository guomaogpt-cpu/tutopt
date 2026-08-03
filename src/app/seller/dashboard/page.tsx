import { redirect } from "next/navigation";

/** Legacy seller dashboard → unified account. */
export default function SellerDashboardRedirectPage() {
  redirect("/account");
}
