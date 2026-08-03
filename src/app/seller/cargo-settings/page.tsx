import { redirect } from "next/navigation";

/** Legacy alias — primary path is /account/cargo-settings. */
export default function SellerCargoSettingsRedirectPage() {
  redirect("/account/cargo-settings");
}
