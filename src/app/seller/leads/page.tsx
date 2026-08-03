import { redirect } from "next/navigation";

/** Legacy seller leads → /account/requests. */
export default function SellerLeadsRedirectPage() {
  redirect("/account/requests?tab=received");
}
