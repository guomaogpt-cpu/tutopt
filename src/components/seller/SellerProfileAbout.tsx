import { Building2, MapPin, User } from "lucide-react";
import type { SellerProfileData } from "@/features/sellers/lib/seller-profile-data";
import { cn } from "@/lib/utils";

type SellerProfileAboutProps = {
  profile: SellerProfileData;
};

export function SellerProfileAbout({ profile }: SellerProfileAboutProps) {
  const locationLabel = [profile.city?.name, profile.region?.name].filter(Boolean).join(", ");
  const showContactPerson =
    profile.user.name.trim().length > 0 && profile.user.name !== profile.company_name;

  return (
    <section aria-labelledby="seller-about-title" className="mt-6">
      <h2 id="seller-about-title" className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl">
        О компании
      </h2>

      <div
        className={cn(
          "rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-6",
        )}
      >
        {profile.description ? (
          <p className="whitespace-pre-wrap text-base leading-relaxed text-[#334155]">
            {profile.description}
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-[#64748B]">
            Продавец пока не добавил описание компании.
          </p>
        )}

        <dl className="mt-5 space-y-3 border-t border-[rgba(148,163,184,0.14)] pt-5 text-sm">
          {showContactPerson ? (
            <div className="flex items-start gap-2.5">
              <User className="mt-0.5 size-4 shrink-0 text-[#64748B]" aria-hidden="true" />
              <div>
                <dt className="text-[#64748B]">Контактное лицо</dt>
                <dd className="mt-0.5 font-medium text-[#0F172A]">{profile.user.name}</dd>
              </div>
            </div>
          ) : null}

          {locationLabel ? (
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#64748B]" aria-hidden="true" />
              <div>
                <dt className="text-[#64748B]">Город</dt>
                <dd className="mt-0.5 font-medium text-[#0F172A]">{locationLabel}</dd>
              </div>
            </div>
          ) : null}

          {profile.company_name ? (
            <div className="flex items-start gap-2.5">
              <Building2 className="mt-0.5 size-4 shrink-0 text-[#64748B]" aria-hidden="true" />
              <div>
                <dt className="text-[#64748B]">Компания</dt>
                <dd className="mt-0.5 font-medium text-[#0F172A]">{profile.company_name}</dd>
              </div>
            </div>
          ) : null}
        </dl>
      </div>
    </section>
  );
}
