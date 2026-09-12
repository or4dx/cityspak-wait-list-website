"use client";

import { useState, type FormEvent } from "react";

const EXPERIENCE_FOCUS_OPTIONS = [
  "Date nights",
  "Group outings",
  "Solo discovery",
  "All of the above",
];

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-lg border border-cs-border bg-cs-surface px-3.5 py-2.5 text-sm text-cs-text outline-none transition-colors focus:border-cs-accent";
const labelClass = "mb-1.5 block text-xs font-medium text-cs-text-muted";

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const payload = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      city: (form.elements.namedItem("city") as HTMLInputElement).value.trim(),
      experienceFocus: (form.elements.namedItem("experienceFocus") as HTMLSelectElement).value,
    };

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-cs-accent/30 bg-cs-accent/[0.08] p-6 text-center">
        <p className="text-base font-medium text-cs-text">You&apos;re on the list.</p>
        <p className="mt-1 text-sm text-cs-text-muted">We&apos;ll be in touch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First name
          </label>
          <input id="firstName" name="firstName" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="city" className={labelClass}>
            City
          </label>
          <input id="city" name="city" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="experienceFocus" className={labelClass}>
            Experience focus
          </label>
          <select
            id="experienceFocus"
            name="experienceFocus"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Select one
            </option>
            {EXPERIENCE_FOCUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "error" && errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-lg bg-cs-accent px-6 py-3 text-sm font-semibold text-cs-bg transition-all hover:bg-cs-accent-hover hover:shadow-lg hover:shadow-cs-accent/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Joining…" : "Join the waitlist"}
      </button>
    </form>
  );
}
