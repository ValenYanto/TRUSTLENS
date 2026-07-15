"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  Control,
  FieldPath,
  UseFormReturn,
} from "react-hook-form";
import {
  Controller,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ExternalLink,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  UserRound,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ScrollReveal } from "@/src/components/motion/scroll-reveal";
import { Container } from "@/src/components/shared/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  focusAreaOptions,
  interestTypeOptions,
  investmentRangeOptions,
  investorInquirySchema,
  investorTypeOptions,
  type InvestorInquiryInput,
} from "@/src/lib/validations/investor-inquiry";
import { siteConfig } from "@/src/lib/site";

type InvestorFormMethods =
  UseFormReturn<InvestorInquiryInput>;

const formSteps = [
  {
    title: "Identitas",
    description: "Informasi pribadi dan institusi",
    icon: UserRound,
  },
  {
    title: "Ketertarikan",
    description: "Preferensi investasi atau kerja sama",
    icon: CircleDollarSign,
  },
  {
    title: "Diskusi",
    description: "Waktu dan pesan tambahan",
    icon: CalendarDays,
  },
  {
    title: "Review",
    description: "Periksa kembali data",
    icon: Check,
  },
] as const;

const stepFields: Record<
  number,
  FieldPath<InvestorInquiryInput>[]
> = {
  0: [
    "fullName",
    "companyName",
    "jobTitle",
    "email",
    "whatsapp",
    "country",
  ],
  1: [
    "investorType",
    "interestType",
    "investmentRange",
    "focusArea",
  ],
  2: [
    "preferredMeetingDate",
    "message",
    "consentAccepted",
  ],
  3: [],
};

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

function getOptionLabel(
  options: readonly {
    value: string;
    label: string;
  }[],
  value?: string,
) {
  return (
    options.find((option) => option.value === value)
      ?.label ?? "-"
  );
}

function formatMeetingDate(value?: string) {
  if (!value) {
    return "Belum ditentukan";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Belum ditentukan";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
}

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 wrap-break-word text-sm font-semibold text-foreground">
        {value || "-"}
      </p>
    </div>
  );
}

function IdentityStep({
  form,
}: {
  form: InvestorFormMethods;
}) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="fullName">
            Nama lengkap
          </Label>

          <Input
            autoComplete="name"
            id="fullName"
            placeholder="Nama lengkap Anda"
            {...register("fullName")}
          />

          <FieldError
            message={errors.fullName?.message}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="companyName">
            Perusahaan atau fund
          </Label>

          <Input
            autoComplete="organization"
            id="companyName"
            placeholder="Nama perusahaan atau fund"
            {...register("companyName")}
          />

          <FieldError
            message={errors.companyName?.message}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="jobTitle">
            Jabatan
          </Label>

          <Input
            autoComplete="organization-title"
            id="jobTitle"
            placeholder="Contoh: Investment Director"
            {...register("jobTitle")}
          />

          <FieldError
            message={errors.jobTitle?.message}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="country">
            Negara
          </Label>

          <Input
            autoComplete="country-name"
            id="country"
            placeholder="Contoh: Indonesia"
            {...register("country")}
          />

          <FieldError
            message={errors.country?.message}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="email">
            Email bisnis
          </Label>

          <Input
            autoComplete="email"
            id="email"
            placeholder="nama@perusahaan.com"
            type="email"
            {...register("email")}
          />

          <FieldError
            message={errors.email?.message}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="whatsapp">
            Nomor WhatsApp
          </Label>

          <Input
            autoComplete="tel"
            id="whatsapp"
            inputMode="tel"
            placeholder="+62 812 3456 7890"
            type="tel"
            {...register("whatsapp")}
          />

          <FieldError
            message={errors.whatsapp?.message}
          />
        </div>
      </div>
    </div>
  );
}

function InterestStep({
  form,
}: {
  form: InvestorFormMethods;
}) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="investorType">
            Jenis investor
          </Label>

          <Controller
            control={control}
            name="investorType"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger id="investorType">
                  <SelectValue placeholder="Pilih jenis investor" />
                </SelectTrigger>

                <SelectContent>
                  {investorTypeOptions.map(
                    (option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError
            message={errors.investorType?.message}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="interestType">
            Jenis ketertarikan
          </Label>

          <Controller
            control={control}
            name="interestType"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger id="interestType">
                  <SelectValue placeholder="Pilih bentuk kerja sama" />
                </SelectTrigger>

                <SelectContent>
                  {interestTypeOptions.map(
                    (option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError
            message={errors.interestType?.message}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="investmentRange">
            Kisaran investasi
          </Label>

          <Controller
            control={control}
            name="investmentRange"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger id="investmentRange">
                  <SelectValue placeholder="Pilih kisaran investasi" />
                </SelectTrigger>

                <SelectContent>
                  {investmentRangeOptions.map(
                    (option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError
            message={
              errors.investmentRange?.message
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="focusArea">
            Fokus ketertarikan
          </Label>

          <Controller
            control={control}
            name="focusArea"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger id="focusArea">
                  <SelectValue placeholder="Pilih fokus utama" />
                </SelectTrigger>

                <SelectContent>
                  {focusAreaOptions.map(
                    (option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError
            message={errors.focusArea?.message}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <p className="text-sm font-semibold text-foreground">
          Belum menentukan nominal investasi?
        </p>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Pilih opsi “Belum ditentukan”. Tim TrustLens
          dapat mendiskusikan kebutuhan pendanaan dan
          bentuk kerja sama yang paling relevan.
        </p>
      </div>
    </div>
  );
}

function DiscussionStep({
  form,
}: {
  form: InvestorFormMethods;
}) {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  const minimumMeetingDate = new Date()
    .toISOString()
    .slice(0, 10);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="preferredMeetingDate">
          Preferensi tanggal diskusi
        </Label>

        <Input
          id="preferredMeetingDate"
          min={minimumMeetingDate}
          type="date"
          {...register("preferredMeetingDate")}
        />

        <p className="text-xs leading-5 text-muted-foreground">
          Tanggal bersifat preferensi dan akan
          dikonfirmasi kembali oleh tim TrustLens.
        </p>

        <FieldError
          message={
            errors.preferredMeetingDate?.message
          }
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">
          Pesan atau pertanyaan
        </Label>

        <Textarea
          className="min-h-36 resize-y"
          id="message"
          placeholder="Jelaskan hal yang ingin didiskusikan, bentuk kerja sama yang diharapkan, atau pertanyaan mengenai TrustLens."
          {...register("message")}
        />

        <FieldError
          message={errors.message?.message}
        />
      </div>

      <Controller
        control={control}
        name="consentAccepted"
        render={({ field }) => (
          <div className="rounded-2xl border border-border bg-background/60 p-5">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={field.value}
                id="consentAccepted"
                onBlur={field.onBlur}
                onCheckedChange={(checked) => {
                  field.onChange(checked === true);
                }}
              />

              <div className="grid gap-2">
                <Label
                  className="cursor-pointer leading-6"
                  htmlFor="consentAccepted"
                >
                  Saya menyetujui pemrosesan data
                  untuk keperluan komunikasi investasi
                  dan kerja sama dengan TrustLens.
                </Label>

                <p className="text-xs leading-5 text-muted-foreground">
                  Data hanya digunakan untuk
                  menindaklanjuti inquiry dan tidak
                  akan dipublikasikan.
                </p>
              </div>
            </div>

            <div className="mt-2">
              <FieldError
                message={
                  errors.consentAccepted?.message
                }
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}

function ReviewStep({
  control,
}: {
  control: Control<InvestorInquiryInput>;
}) {
  const values = useWatch({
    control,
  });

  const preferredDate = formatMeetingDate(
    values.preferredMeetingDate,
  );

  return (
    <div className="grid gap-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <UserRound className="size-5 text-primary" />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold">
              Identitas
            </h3>

            <p className="text-sm text-muted-foreground">
              Informasi investor dan institusi
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ReviewItem
            label="Nama lengkap"
            value={values.fullName}
          />

          <ReviewItem
            label="Perusahaan atau fund"
            value={values.companyName}
          />

          <ReviewItem
            label="Jabatan"
            value={values.jobTitle}
          />

          <ReviewItem
            label="Negara"
            value={values.country}
          />

          <ReviewItem
            label="Email"
            value={values.email}
          />

          <ReviewItem
            label="WhatsApp"
            value={values.whatsapp}
          />
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <CircleDollarSign className="size-5 text-primary" />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold">
              Ketertarikan
            </h3>

            <p className="text-sm text-muted-foreground">
              Preferensi investasi dan kerja sama
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ReviewItem
            label="Jenis investor"
            value={getOptionLabel(
              investorTypeOptions,
              values.investorType,
            )}
          />

          <ReviewItem
            label="Jenis ketertarikan"
            value={getOptionLabel(
              interestTypeOptions,
              values.interestType,
            )}
          />

          <ReviewItem
            label="Kisaran investasi"
            value={getOptionLabel(
              investmentRangeOptions,
              values.investmentRange,
            )}
          />

          <ReviewItem
            label="Fokus ketertarikan"
            value={getOptionLabel(
              focusAreaOptions,
              values.focusArea,
            )}
          />
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <CalendarDays className="size-5 text-primary" />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold">
              Rencana diskusi
            </h3>

            <p className="text-sm text-muted-foreground">
              Preferensi waktu dan pesan
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <ReviewItem
            label="Preferensi tanggal"
            value={preferredDate}
          />

          <ReviewItem
            label="Pesan"
            value={values.message}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />

          <div>
            <p className="text-sm font-semibold">
              Persetujuan telah diberikan
            </p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Data akan digunakan untuk komunikasi
              investasi dan kerja sama dengan
              TrustLens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvestorSuccess({
  data,
  onReset,
}: {
  data: InvestorInquiryInput;
  onReset: () => void;
}) {
  return (
    <div className="px-5 py-14 text-center sm:px-10 sm:py-20">
      <div className="mx-auto flex size-18 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
        <CheckCircle2 className="size-9 text-primary" />
      </div>

      <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-primary">
        Form berhasil divalidasi
      </p>

      <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
        Terima kasih, {data.fullName}.
      </h2>

      <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">
        Informasi Anda telah lolos validasi frontend.
        Penyimpanan database dan pengiriman otomatis
        akan diaktifkan pada tahap integrasi
        berikutnya.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild>
          <Link
            href={siteConfig.whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="size-4" />
            Lanjutkan melalui WhatsApp
          </Link>
        </Button>

        <Button asChild variant="outline">
          <Link
            href={siteConfig.productDemoUrl}
            rel="noreferrer"
            target="_blank"
          >
            Lihat Demo Produk
            <ExternalLink className="size-4" />
          </Link>
        </Button>

        <Button
          onClick={onReset}
          type="button"
          variant="ghost"
        >
          Isi ulang form
        </Button>
      </div>
    </div>
  );
}

export function InvestorForm() {
  const [currentStep, setCurrentStep] =
    useState(0);

  const [submittedData, setSubmittedData] =
    useState<InvestorInquiryInput | null>(
      null,
    );

  const form = useForm<InvestorInquiryInput>({
    resolver: zodResolver(
      investorInquirySchema,
    ),

    defaultValues: {
      fullName: "",
      companyName: "",
      jobTitle: "",
      email: "",
      whatsapp: "",
      country: "Indonesia",
      preferredMeetingDate: "",
      message: "",
      consentAccepted: false,
    },

    mode: "onTouched",
    shouldUnregister: false,
  });

  const {
    formState: { isSubmitting },
  } = form;

  const progress =
    ((currentStep + 1) / formSteps.length) *
    100;

  async function handleNext() {
    const fields = stepFields[currentStep];

    const valid = await form.trigger(fields, {
      shouldFocus: true,
    });

    if (!valid) {
      toast.error(
        "Periksa kembali data pada tahap ini.",
        {
          duration: 2000,
        },
      );

      return;
    }

    setCurrentStep((step) =>
      Math.min(
        step + 1,
        formSteps.length - 1,
      ),
    );
  }

  function handlePrevious() {
    setCurrentStep((step) =>
      Math.max(step - 1, 0),
    );
  }

  async function handleSubmit(
    data: InvestorInquiryInput,
  ) {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 800);
    });

    setSubmittedData(data);

    toast.success(
      "Form investor berhasil divalidasi.",
      {
        duration: 2000,
      },
    );
  }

  function handleInvalidSubmit() {
    toast.error(
      "Masih terdapat data yang perlu diperbaiki.",
      {
        duration: 2000,
      },
    );
  }

  function handleReset() {
    form.reset();

    setCurrentStep(0);
    setSubmittedData(null);
  }

  return (
    <section
      className="scroll-mt-28 pb-24 sm:pb-30"
      id="investor-form"
    >
      <Container>
        <ScrollReveal>
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Investor inquiry
              </p>

              <h2 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">
                Mulai percakapan bersama TrustLens.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">
                Isi informasi berikut untuk membantu
                tim kami memahami profil dan bentuk
                kerja sama yang Anda pertimbangkan.
              </p>
            </div>

            <Card className="overflow-hidden border-border bg-card shadow-2xl shadow-primary/5">
              {submittedData ? (
                <InvestorSuccess
                  data={submittedData}
                  onReset={handleReset}
                />
              ) : (
                <div className="grid lg:grid-cols-[19rem_1fr]">
                  <aside className="border-b border-border bg-muted/35 p-6 lg:border-r lg:border-b-0 lg:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                        <Building2 className="size-5 text-primary" />
                      </div>

                      <div>
                        <p className="font-display font-bold">
                          TrustLens
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Investor Interest Form
                        </p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>
                          Tahap {currentStep + 1}{" "}
                          dari {formSteps.length}
                        </span>

                        <span className="text-primary">
                          {Math.round(progress)}%
                        </span>
                      </div>

                      <Progress
                        className="mt-3 h-2"
                        value={progress}
                      />
                    </div>

                    <div className="mt-8 grid gap-3">
                      {formSteps.map(
                        (step, index) => {
                          const Icon = step.icon;

                          const completed =
                            index < currentStep;

                          const active =
                            index === currentStep;

                          return (
                            <button
                              className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors disabled:cursor-default"
                              disabled={
                                index > currentStep
                              }
                              key={step.title}
                              onClick={() => {
                                if (
                                  index <
                                  currentStep
                                ) {
                                  setCurrentStep(
                                    index,
                                  );
                                }
                              }}
                              type="button"
                            >
                              <span
                                className={[
                                  "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                                  active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : completed
                                      ? "border-primary/30 bg-primary/10 text-primary"
                                      : "border-border bg-background text-muted-foreground",
                                ].join(" ")}
                              >
                                {completed ? (
                                  <Check className="size-4" />
                                ) : (
                                  <Icon className="size-4" />
                                )}
                              </span>

                              <span>
                                <span
                                  className={[
                                    "block text-sm font-semibold",
                                    active
                                      ? "text-foreground"
                                      : "text-muted-foreground",
                                  ].join(" ")}
                                >
                                  {step.title}
                                </span>

                                <span className="mt-0.5 hidden text-xs leading-5 text-muted-foreground lg:block">
                                  {
                                    step.description
                                  }
                                </span>
                              </span>
                            </button>
                          );
                        },
                      )}
                    </div>

                    <Separator className="my-8" />

                    <div className="rounded-2xl border border-border bg-background/60 p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="size-4 text-primary" />

                        <p className="text-sm font-semibold">
                          Butuh bantuan?
                        </p>
                      </div>

                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        Hubungi tim melalui WhatsApp
                        untuk diskusi lebih cepat.
                      </p>

                      <Button
                        asChild
                        className="mt-4 w-full"
                        size="sm"
                        variant="outline"
                      >
                        <Link
                          href={
                            siteConfig.whatsappUrl
                          }
                          rel="noreferrer"
                          target="_blank"
                        >
                          <MessageCircle className="size-4" />
                          WhatsApp
                        </Link>
                      </Button>
                    </div>
                  </aside>

                  <CardContent className="p-6 sm:p-8 lg:p-10">
                    <form
                      noValidate
                      onSubmit={form.handleSubmit(
                        handleSubmit,
                        handleInvalidSubmit,
                      )}
                    >
                      <div className="mb-8">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                          Tahap {currentStep + 1}
                        </p>

                        <h3 className="mt-2 font-display text-2xl font-extrabold">
                          {
                            formSteps[currentStep]
                              .title
                          }
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                          {
                            formSteps[currentStep]
                              .description
                          }
                        </p>
                      </div>

                      {currentStep === 0 ? (
                        <IdentityStep
                          form={form}
                        />
                      ) : null}

                      {currentStep === 1 ? (
                        <InterestStep
                          form={form}
                        />
                      ) : null}

                      {currentStep === 2 ? (
                        <DiscussionStep
                          form={form}
                        />
                      ) : null}

                      {currentStep === 3 ? (
                        <ReviewStep
                          control={form.control}
                        />
                      ) : null}

                      <Separator className="my-8" />

                      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                          disabled={
                            currentStep === 0 ||
                            isSubmitting
                          }
                          onClick={handlePrevious}
                          type="button"
                          variant="outline"
                        >
                          <ArrowLeft className="size-4" />
                          Kembali
                        </Button>

                        {currentStep <
                        formSteps.length - 1 ? (
                          <Button
                            onClick={handleNext}
                            type="button"
                          >
                            Lanjutkan
                            <ArrowRight className="size-4" />
                          </Button>
                        ) : (
                          <Button
                            disabled={isSubmitting}
                            type="submit"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                Memvalidasi...
                              </>
                            ) : (
                              <>
                                <Send className="size-4" />
                                Validasi Form
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </div>
              )}
            </Card>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}