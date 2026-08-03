import { redirect } from "next/navigation";

/** Legacy buyer cargo requests → account requests. */
export default function BuyerCargoRequestsRedirectPage() {
  redirect("/account/requests?tab=cargoRequests");
}
