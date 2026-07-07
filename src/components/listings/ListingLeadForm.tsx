"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  LeadRequestError,
  createLeadRequest,
} from "@/features/leads/lib/leads-client";
import { buildLoginUrl, getCurrentPathFromWindow } from "@/features/auth/lib/login-redirect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Section, SectionHeader, SectionTitle } from "@/components/ui/section";
import { Textarea } from "@/components/ui/textarea";

const QUICK_TEMPLATES = [
  "Есть в наличии?",
  "Какая цена при опте?",
  "Можно получить КП?",
  "Какие условия доставки?",
] as const;

type ListingLeadFormProps = {
  listingId: string;
  sellerName: string;
  moq: number;
  unitLabel: string;
  isAuthenticated: boolean;
  isOwner: boolean;
  defaultPhone?: string | null;
  defaultEmail?: string | null;
};

export function ListingLeadForm({
  listingId,
  sellerName,
  moq,
  unitLabel,
  isAuthenticated,
  isOwner,
  defaultPhone = "",
  defaultEmail = "",
}: ListingLeadFormProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(String(moq));
  const [message, setMessage] = useState("Здравствуйте! Интересует товар...");
  const [contactPhone, setContactPhone] = useState(defaultPhone ?? "");
  const [contactEmail, setContactEmail] = useState(defaultEmail ?? "");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleLoginRedirect() {
    router.push(buildLoginUrl(getCurrentPathFromWindow()));
  }

  function applyTemplate(template: string) {
    setMessage((current) => {
      const trimmed = current.trim();
      if (!trimmed || trimmed === "Здравствуйте! Интересует товар...") {
        return template;
      }
      return `${trimmed}\n${template}`;
    });
  }

  function resetFormForAnotherLead() {
    setQuantity(String(moq));
    setMessage("Здравствуйте! Интересует товар...");
    setContactPhone(defaultPhone ?? "");
    setContactEmail(defaultEmail ?? "");
    setFormError(null);
    setFieldErrors({});
    setIsSuccess(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    if (!isAuthenticated) {
      router.push(buildLoginUrl(getCurrentPathFromWindow()));
      return;
    }

    if (isOwner) {
      setFormError("Нельзя отправить заявку на своё объявление");
      return;
    }

    setIsPending(true);

    try {
      await createLeadRequest(listingId, {
        quantity: Number(quantity),
        message,
        contact_phone: contactPhone || null,
        contact_email: contactEmail || null,
      });
      setIsSuccess(true);
      router.refresh();
    } catch (error) {
      if (error instanceof LeadRequestError) {
        setFormError(error.formErrors.form[0] ?? null);
        setFieldErrors(error.formErrors.fields);
      } else {
        setFormError("Не удалось отправить заявку. Попробуйте ещё раз.");
      }
    } finally {
      setIsPending(false);
    }
  }

  if (isSuccess) {
    return (
      <Section
        spacing="none"
        id="listing-seller-message"
        className="scroll-mt-28"
        aria-labelledby="listing-lead-success-title"
      >
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle id="listing-lead-success-title" className="text-green-900">
              Заявка отправлена
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-green-800">
              Поставщик {sellerName} получит вашу заявку и сможет связаться с вами по указанным
              контактам. Можно отправить ещё одну заявку по этому объявлению.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-5 border-green-300 bg-white text-green-900 hover:bg-green-100"
              onClick={resetFormForAnotherLead}
            >
              Отправить ещё заявку
            </Button>
          </CardContent>
        </Card>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section
        spacing="none"
        id="listing-seller-message"
        className="scroll-mt-28"
        aria-labelledby="listing-lead-login-title"
      >
        <Card>
          <CardHeader>
            <CardTitle id="listing-lead-login-title">Отправить заявку</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Войдите, чтобы отправить заявку поставщику {sellerName}.
            </p>
            <Button className="mt-5" onClick={handleLoginRedirect}>
              Войти
            </Button>
          </CardContent>
        </Card>
      </Section>
    );
  }

  if (isOwner) {
    return (
      <Section
        spacing="none"
        id="listing-seller-message"
        className="scroll-mt-28"
        aria-labelledby="listing-lead-owner-title"
      >
        <Card>
          <CardHeader>
            <CardTitle id="listing-lead-owner-title">Отправить заявку</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Это ваше объявление — заявки от покупателей появятся в разделе «Заявки».
            </p>
            <Button variant="outline" className="mt-5" asChild>
              <Link href="/seller/leads">Перейти к заявкам</Link>
            </Button>
          </CardContent>
        </Card>
      </Section>
    );
  }

  return (
    <Section
      spacing="none"
      id="listing-seller-message"
      className="scroll-mt-28"
      aria-labelledby="listing-lead-form-title"
    >
      <SectionHeader className="mb-4">
        <SectionTitle id="listing-lead-form-title" className="text-xl">
          Отправить заявку
        </SectionTitle>
      </SectionHeader>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <p className="text-sm text-muted-foreground">
            Опишите интерес к товару — поставщик {sellerName} получит заявку и свяжется с вами.
          </p>

          <form onSubmit={(event) => void handleSubmit(event)} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="lead-quantity" className="text-sm font-medium text-foreground">
                  Количество
                </label>
                <Input
                  id="lead-quantity"
                  type="number"
                  min={1}
                  step={1}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Мин. партия: {moq} {unitLabel.toLowerCase()}
                </p>
                {fieldErrors.quantity ? (
                  <p className="text-xs text-destructive">{fieldErrors.quantity}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="lead-phone" className="text-sm font-medium text-foreground">
                  Телефон
                </label>
                <Input
                  id="lead-phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(event) => setContactPhone(event.target.value)}
                  placeholder="+996700000000"
                />
                {fieldErrors.contact_phone ? (
                  <p className="text-xs text-destructive">{fieldErrors.contact_phone}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="lead-email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="lead-email"
                type="email"
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                placeholder="buyer@company.kg"
              />
              {fieldErrors.contact_email ? (
                <p className="text-xs text-destructive">{fieldErrors.contact_email}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="lead-message" className="text-sm font-medium text-foreground">
                Сообщение
              </label>
              <Textarea
                id="lead-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                placeholder="Здравствуйте! Интересует товар..."
              />
              {fieldErrors.message ? (
                <p className="text-xs text-destructive">{fieldErrors.message}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_TEMPLATES.map((template) => (
                <Badge
                  key={template}
                  variant="secondary"
                  className="cursor-pointer px-3 py-1.5 text-xs font-medium hover:bg-accent"
                  onClick={() => applyTemplate(template)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      applyTemplate(template);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {template}
                </Badge>
              ))}
            </div>

            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

            <Button type="submit" disabled={isPending}>
              {isPending ? "Отправка..." : "Отправить заявку"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Section>
  );
}
