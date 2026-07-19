"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wholesaleApplicationSchema, type WholesaleApplication } from "@/lib/schemas";
import { Field, FormSuccess, SubmitButton, inputClass } from "./fields";

export function WholesaleApplyForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WholesaleApplication>({
    resolver: zodResolver(wholesaleApplicationSchema),
  });

  if (done) {
    return (
      <FormSuccess
        title="Your application is in review."
        body="Verification protects every partner already in the programme. Expect a reply within two business days — pricing is released the moment you clear."
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const res = await fetch("/api/wholesale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) setDone(true);
      })}
      className="grid gap-6 text-left sm:grid-cols-2"
      noValidate
    >
      <Field label="Business name" error={errors.businessName?.message}>
        <input className={inputClass} {...register("businessName")} />
      </Field>
      <Field label="Business type" error={errors.businessType?.message}>
        <select className={inputClass} defaultValue="" {...register("businessType")}>
          <option value="" disabled>
            Select…
          </option>
          <option value="salon">Salon</option>
          <option value="stylist">Independent stylist</option>
          <option value="reseller">Online reseller / white label</option>
          <option value="distributor">Distributor</option>
        </select>
      </Field>
      <Field label="Contact name" error={errors.contactName?.message}>
        <input className={inputClass} {...register("contactName")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input type="email" className={inputClass} {...register("email")} />
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        <input type="tel" className={inputClass} {...register("phone")} />
      </Field>
      <Field label="Country" error={errors.country?.message}>
        <input className={inputClass} {...register("country")} />
      </Field>
      <Field label="Estimated annual volume" error={errors.estimatedVolume?.message}>
        <select className={inputClass} defaultValue="" {...register("estimatedVolume")}>
          <option value="" disabled>
            Select tier…
          </option>
          <option value="50-149">50–149 units — Bronze</option>
          <option value="150-499">150–499 units — Silver</option>
          <option value="500+">500+ units — Gold</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Anything we should know (optional)" error={errors.message?.message}>
          <textarea rows={4} className={inputClass} {...register("message")} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <SubmitButton pending={isSubmitting}>Submit application</SubmitButton>
      </div>
    </form>
  );
}
