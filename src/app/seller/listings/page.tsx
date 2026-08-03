import { redirect } from "next/navigation";

/** Legacy seller listings → /account/listings. */
export default function SellerListingsRedirectPage() {
  redirect("/account/listings");
}
