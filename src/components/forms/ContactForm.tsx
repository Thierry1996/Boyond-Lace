"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactMessage } from "@/lib/schemas";
import { Field, FormSuccess, SubmitButton, inputClass } from "./fields";

export function ContactForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessage>({ resolver: zodResolver(contactSchema) });

  if (done) {
    return (
      <FormSuccess
        title="We have it."
        body="A human replies within one business day. If it concerns an order, the order number you gave us is already attached."
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) setDone(true);
      })}
      className="grid gap-6 sm:grid-cols-2"
      noValidate
    >
      <Field label="Name" error={errors.name?.message}>
        <input className={inputClass} {...register("name")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input type="email" className={inputClass} {...register("email")} />
      </Field>
      <Field label="Topic" error={errors.topic?.message}>
        <select className={inputClass} defaultValue="" {...register("topic")}>
          <option value="" disabled>
            Select…
          </option>
          <option value="order">An order</option>
          <option value="returns">Returns & exchanges</option>
          <option value="fit">Fit, sizing & shade</option>
          <option value="wholesale">Wholesale</option>
          <option value="press">Press & partnerships</option>
          <option value="other">Something else</option>
        </select>
      </Field>
      <Field label="Order number (if relevant)" error={errors.orderNumber?.message}>
        <input className={inputClass} placeholder="BL-XXXXXX" {...register("orderNumber")} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Message" error={errors.message?.message}>
          <textarea rows={5} className={inputClass} {...register("message")} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <SubmitButton pending={isSubmitting}>Send message</SubmitButton>
      </div>
    </form>
  );
}
