"use client";

import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTranslations } from "next-intl";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Contact() {
  const t = useTranslations("contact");
  const { trackEvent } = useAnalytics();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  const projectTypes = [
    { value: "", label: t("form.projectTypes.placeholder") },
    { value: "site-vitrine", label: t("form.projectTypes.showcase") },
    { value: "application-web", label: t("form.projectTypes.webapp") },
    { value: "landing-page", label: t("form.projectTypes.landing") },
    { value: "refonte", label: t("form.projectTypes.redesign") },
    { value: "autre", label: t("form.projectTypes.other") },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur serveur");
      }

      setStatus("success");
      trackEvent("contact_submit");
      setFormData({ name: "", email: "", projectType: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[var(--background)]"
    >
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left side - Info */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">
              {t("label")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              {t("title")}
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-8 leading-relaxed">
              {t("subtitle")}
            </p>

            {/* Direct contact */}
            <div
              className={`space-y-4 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <a
                href="mailto:jb@jbrdevelopment.fr"
                className="flex items-center gap-4 p-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground-secondary)]">{t("email")}</p>
                  <p className="font-medium">jb@jbrdevelopment.fr</p>
                </div>
              </a>
            </div>

            {/* Social links */}
            <div
              className={`flex items-center gap-4 mt-8 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <a
                href="https://github.com/Jeeiib"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
                aria-label="GitHub"
                onClick={() => trackEvent("social_click", { platform: "github_contact" })}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/jean-baptiste-renart-46b618153/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
                aria-label="LinkedIn"
                onClick={() => trackEvent("social_click", { platform: "linkedin_contact" })}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right side - Form */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl p-6 md:p-8"
            >
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("form.name")} <span className="text-[var(--accent)]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder={t("form.namePlaceholder")}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("form.email")} <span className="text-[var(--accent)]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder={t("form.emailPlaceholder")}
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label
                    htmlFor="projectType"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("form.projectType")} <span className="text-[var(--accent)]">*</span>
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a0a0a0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.75rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                    }}
                  >
                    {projectTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("form.message")} <span className="text-[var(--accent)]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                    placeholder={t("form.messagePlaceholder")}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full px-8 py-4 bg-[var(--accent)] btn-primary-text font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t("form.submitting")}
                    </span>
                  ) : (
                    t("form.submit")
                  )}
                </button>

                {/* Status messages */}
                {status === "success" && (
                  <p className="text-green-400 text-center">
                    {t("form.success")}
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-400 text-center">
                    {t("form.error")}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
