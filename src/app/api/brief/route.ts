import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { del } from "@vercel/blob";
import { generateBriefPdf } from "@/lib/briefPdf";
import type { PdfTranslations } from "@/lib/briefPdf";
import type { BriefData } from "@/data/briefTypes";
import { LIMITS, PROJECT_TYPES, ALLOWED_FILE_TYPES } from "@/data/briefTypes";

// ── Resend client (lazy, same pattern as /api/contact) ──

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

// ── CSRF ──

const ALLOWED_ORIGINS = [
  "https://jbrdevelopment.fr",
  "https://www.jbrdevelopment.fr",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

// ── Rate limiting: 3/hour/IP ──

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 60 * 1000;

// ── HTML escaping ──

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Validation ──

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateBriefData(body: Record<string, unknown>): {
  valid: boolean;
  error?: string;
  data?: BriefData;
} {
  const { projectType, company, goals, features, design, content, budget, contact, freeComment, locale } = body;

  // projectType
  if (!projectType || !PROJECT_TYPES.includes(projectType as typeof PROJECT_TYPES[number])) {
    return { valid: false, error: "Invalid project type" };
  }

  // company
  if (!company || typeof company !== "object") return { valid: false, error: "Missing company" };
  const c = company as Record<string, unknown>;
  if (typeof c.name !== "string" || !c.name.trim() || c.name.length > LIMITS.name) {
    return { valid: false, error: "Invalid company name" };
  }
  if (typeof c.description !== "string" || !c.description.trim() || c.description.length > LIMITS.description) {
    return { valid: false, error: "Invalid company description" };
  }
  if (typeof c.target !== "string" || !c.target.trim() || c.target.length > LIMITS.target) {
    return { valid: false, error: "Invalid company target" };
  }

  // goals
  if (!goals || typeof goals !== "object") return { valid: false, error: "Missing goals" };
  const g = goals as Record<string, unknown>;
  if (!Array.isArray(g.objectives) || g.objectives.length === 0) {
    return { valid: false, error: "Missing objectives" };
  }
  if (typeof g.problem !== "string" || !g.problem.trim()) {
    return { valid: false, error: "Missing problem description" };
  }

  // contact
  if (!contact || typeof contact !== "object") return { valid: false, error: "Missing contact" };
  const ct = contact as Record<string, unknown>;
  if (typeof ct.fullName !== "string" || !ct.fullName.trim() || ct.fullName.length > LIMITS.fullName) {
    return { valid: false, error: "Invalid contact name" };
  }
  if (typeof ct.email !== "string" || !ct.email.trim() || !EMAIL_REGEX.test(ct.email) || ct.email.length > LIMITS.email) {
    return { valid: false, error: "Invalid email" };
  }
  // Reject newlines in contact fields (email header injection prevention)
  if ([ct.fullName as string, ct.email as string].some((f) => /[\r\n]/.test(f))) {
    return { valid: false, error: "Invalid characters detected" };
  }

  // budget
  if (!budget || typeof budget !== "object") return { valid: false, error: "Missing budget" };
  const b = budget as Record<string, unknown>;
  if (typeof b.range !== "string" || !b.range) return { valid: false, error: "Missing budget range" };
  if (typeof b.deadline !== "string" || !b.deadline) return { valid: false, error: "Missing deadline" };

  // locale
  if (typeof locale !== "string" || !["fr", "en"].includes(locale)) {
    return { valid: false, error: "Invalid locale" };
  }

  // freeComment length
  if (typeof freeComment === "string" && freeComment.length > LIMITS.freeComment) {
    return { valid: false, error: "Free comment too long" };
  }

  return {
    valid: true,
    data: body as unknown as BriefData,
  };
}

// ── Load translations for PDF ──

async function buildPdfTranslations(locale: string): Promise<PdfTranslations> {
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const b = messages.brief;

  return {
    title: locale === "fr" ? "Brief Projet" : "Project Brief",
    generatedOn: locale === "fr" ? "Généré le" : "Generated on",
    sections: {
      projectType: b.steps.projectType.title,
      company: b.steps.company.title,
      goals: b.steps.goals.title,
      features: b.steps.features.title,
      design: b.steps.design.title,
      content: b.steps.content.title,
      budget: b.steps.budget.title,
      contact: b.steps.summary.contact.title,
      freeComment: b.steps.summary.freeComment.label,
    },
    labels: {
      companyName: b.steps.company.questions.name.label,
      description: b.steps.company.questions.description.label,
      target: b.steps.company.questions.target.label,
      websiteUrl: b.steps.company.questions.websiteUrl.label,
      inspirations: b.steps.company.questions.inspirations?.label || "Inspirations",
      objectives: b.steps.goals.questions.objectives.label,
      problem: b.steps.goals.questions.problem.label,
      successCriteria: b.steps.goals.questions.successCriteria.label,
      other: b.ui.other,
      pages: b.steps.features["site-vitrine"]?.pages?.label || "Pages",
      features: b.steps.features.title,
      contentAutonomy: b.steps.features["site-vitrine"]?.contentAutonomy?.label || "Content autonomy",
      dailyUsage: b.steps.features["application-web"]?.dailyUsage?.label || "Daily usage",
      userTypes: b.steps.features["application-web"]?.userTypes?.label || "User types",
      currentTools: b.steps.features["application-web"]?.currentTools?.label || "Current tools",
      userVolume: b.steps.features["application-web"]?.userVolume?.label || "User volume",
      platforms: b.steps.features["application-mobile"]?.platforms?.label || "Platforms",
      phoneFeatures: b.steps.features["application-mobile"]?.phoneFeatures?.label || "Phone features",
      offlineMode: b.steps.features["application-mobile"]?.offlineMode?.label || "Offline mode",
      storePublishing: b.steps.features["application-mobile"]?.storePublishing?.label || "Store publishing",
      objective: b.steps.features["landing-page"]?.objective?.label || "Objective",
      currentUrl: b.steps.features.refonte?.currentUrl?.label || "Current URL",
      problems: b.steps.features.refonte?.problems?.label || "Problems",
      toKeep: b.steps.features.refonte?.toKeep?.label || "To keep",
      newFeatures: b.steps.features.refonte?.newFeatures?.label || "New features",
      technicalDescription: b.steps.features["developpement-sur-mesure"]?.description?.label || "Description",
      integrations: b.steps.features["developpement-sur-mesure"]?.integrations?.label || "Integrations",
      appUrl: b.steps.features.maintenance?.appUrl?.label || "App URL",
      interventionTypes: b.steps.features.maintenance?.interventionTypes?.label || "Intervention types",
      frequency: b.steps.features.maintenance?.frequency?.label || "Frequency",
      existingIdentity: b.steps.design.questions.existingIdentity.label,
      ambiance: b.steps.design.questions.ambiance.label,
      colorPreferences: b.steps.design.questions.colorPreferences.label,
      designInspirations: b.steps.design.questions.designInspirations.label,
      files: locale === "fr" ? "Fichiers joints" : "Attached files",
      textsReady: b.steps.content.full?.textsReady?.label || "Texts ready",
      visualsAvailable: b.steps.content.full?.visualsAvailable?.label || "Visuals",
      keepExistingContent: b.steps.content.full?.keepContent?.label || "Keep existing content",
      budgetRange: b.steps.budget.questions.range.label,
      deadline: b.steps.budget.questions.deadline.label,
      communication: b.steps.budget.questions.communication.label,
      fullName: b.steps.summary.contact.fullName.label,
      email: b.steps.summary.contact.email.label,
      phone: b.steps.summary.contact.phone.label,
    },
    values: {
      // Project types
      ...Object.fromEntries(
        Object.entries(b.steps.projectType.options).map(([key, val]) => [
          `projectType.${key}`,
          (val as { title: string }).title,
        ])
      ),
      // Objectives
      ...Object.fromEntries(
        Object.entries(b.steps.goals.options || {}).map(([key, val]) => [key, val as string])
      ),
      // Budget ranges
      ...Object.fromEntries(
        Object.entries(b.steps.budget.questions.range.options || {}).map(([key, val]) => [key, val as string])
      ),
      // Deadlines
      ...Object.fromEntries(
        Object.entries(b.steps.budget.questions.deadline.options || {}).map(([key, val]) => [key, val as string])
      ),
      // Communication
      ...Object.fromEntries(
        Object.entries(b.steps.budget.questions.communication.options || {}).map(([key, val]) => [key, val as string])
      ),
      // Design identity
      ...Object.fromEntries(
        Object.entries(b.steps.design.questions.existingIdentity.options || {}).map(([key, val]) => [key, val as string])
      ),
      // Ambiance
      ...Object.fromEntries(
        Object.entries(b.steps.design.questions.ambiance.options || {}).map(([key, val]) => [key, val as string])
      ),
      // Content options
      ...Object.fromEntries(
        Object.entries(b.steps.content.full?.textsReady?.options || {}).map(([key, val]) => [key, val as string])
      ),
      ...Object.fromEntries(
        Object.entries(b.steps.content.full?.visualsAvailable?.options || {}).map(([key, val]) => [key, val as string])
      ),
      ...Object.fromEntries(
        Object.entries(b.steps.content.full?.keepContent?.options || {}).map(([key, val]) => [key, val as string])
      ),
    },
  };
}

// ── Notification email template ──

function getBriefNotificationHtml(data: BriefData): string {
  const name = escapeHtml(data.contact.fullName);
  const email = escapeHtml(data.contact.email);
  const projectType = escapeHtml(data.projectType || "");
  const company = escapeHtml(data.company?.name || "");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#232323;border-radius:16px;overflow:hidden;border:1px solid #333333;">
        <tr><td style="background:linear-gradient(135deg,#34d399 0%,#10b981 100%);padding:32px;text-align:center;">
          <h1 style="margin:0;color:#1a1a1a;font-size:24px;font-weight:700;">Nouveau Brief Projet</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#2a2a2a;border-radius:12px;border:1px solid #333333;margin-bottom:24px;">
            <tr><td style="padding:24px;">
              <h2 style="margin:0 0 16px 0;color:#34d399;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Client</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:8px 0;border-bottom:1px solid #333333;">
                  <span style="color:#a0a0a0;font-size:14px;">Nom</span><br>
                  <span style="color:#f5f5f5;font-size:16px;font-weight:600;">${name}</span>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #333333;">
                  <span style="color:#a0a0a0;font-size:14px;">Email</span><br>
                  <a href="mailto:${email}" style="color:#34d399;font-size:16px;font-weight:600;text-decoration:none;">${email}</a>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #333333;">
                  <span style="color:#a0a0a0;font-size:14px;">Entreprise</span><br>
                  <span style="color:#f5f5f5;font-size:16px;font-weight:600;">${company}</span>
                </td></tr>
                <tr><td style="padding:8px 0;">
                  <span style="color:#a0a0a0;font-size:14px;">Type de projet</span><br>
                  <span style="display:inline-block;margin-top:4px;padding:6px 12px;background-color:#34d399;color:#1a1a1a;font-size:14px;font-weight:600;border-radius:20px;">${projectType}</span>
                </td></tr>
              </table>
            </td></tr>
          </table>
          <p style="margin:0;color:#a0a0a0;font-size:14px;text-align:center;">
            Le brief complet est en pièce jointe (PDF).
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
            <tr><td align="center">
              <a href="mailto:${email}?subject=Re: Brief Projet - JBR Development"
                 style="display:inline-block;padding:16px 32px;background-color:#34d399;color:#1a1a1a;font-size:16px;font-weight:600;text-decoration:none;border-radius:8px;">
                Répondre à ${name}
              </a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px;text-align:center;border-top:1px solid #333333;">
          <p style="margin:0;color:#a0a0a0;font-size:14px;">JBR Development • Brief Questionnaire</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function getBriefConfirmationHtml(data: BriefData): string {
  const name = escapeHtml(data.contact.fullName);
  const isFr = data.locale === "fr";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#232323;border-radius:16px;overflow:hidden;border:1px solid #333333;">
        <tr><td style="padding:40px 32px;text-align:center;border-bottom:1px solid #333333;">
          <h1 style="margin:0 0 8px 0;color:#f5f5f5;font-size:28px;font-weight:700;">JBR<span style="color:#34d399;">.</span></h1>
          <p style="margin:0;color:#a0a0a0;font-size:14px;">Development</p>
        </td></tr>
        <tr><td style="padding:40px 32px;">
          <h2 style="margin:0 0 24px 0;color:#f5f5f5;font-size:24px;font-weight:600;">
            ${isFr ? `Bonjour ${name}` : `Hello ${name}`} 👋
          </h2>
          <p style="margin:0 0 16px 0;color:#f5f5f5;font-size:16px;line-height:1.6;">
            ${isFr
              ? "Merci d'avoir pris le temps de remplir votre brief projet ! J'ai bien reçu toutes les informations et vous trouverez une copie du brief en pièce jointe."
              : "Thank you for taking the time to fill out your project brief! I've received all the information and you'll find a copy of the brief attached."}
          </p>
          <p style="margin:0 0 24px 0;color:#f5f5f5;font-size:16px;line-height:1.6;">
            ${isFr
              ? "Je prends le temps d'étudier votre projet et vous recontacte sous <strong>24 à 48 heures</strong>."
              : "I'll take the time to study your project and get back to you within <strong>24 to 48 hours</strong>."}
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#2a2a2a;border-radius:12px;border:1px solid #333333;margin-bottom:24px;">
            <tr><td style="padding:24px;">
              <h3 style="margin:0 0 16px 0;color:#34d399;font-size:14px;text-transform:uppercase;letter-spacing:1px;">
                ${isFr ? "Prochaines étapes" : "Next steps"}
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:8px 0;color:#f5f5f5;font-size:15px;"><span style="color:#34d399;font-weight:600;">1.</span> ${isFr ? "Analyse de votre brief" : "Brief analysis"}</td></tr>
                <tr><td style="padding:8px 0;color:#f5f5f5;font-size:15px;"><span style="color:#34d399;font-weight:600;">2.</span> ${isFr ? "Prise de contact pour en discuter" : "Contact to discuss"}</td></tr>
                <tr><td style="padding:8px 0;color:#f5f5f5;font-size:15px;"><span style="color:#34d399;font-weight:600;">3.</span> ${isFr ? "Proposition personnalisée" : "Personalized proposal"}</td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 32px 40px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #333333;padding-top:24px;">
            <tr><td>
              <p style="margin:0 0 4px 0;color:#f5f5f5;font-size:16px;font-weight:600;">Jean-Baptiste Renart</p>
              <p style="margin:0;color:#a0a0a0;font-size:14px;">${isFr ? "Développeur Web Full Stack" : "Full Stack Web Developer"}</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px;text-align:center;background-color:#1a1a1a;border-top:1px solid #333333;">
          <p style="margin:0;color:#666666;font-size:12px;">© ${new Date().getFullYear()} JBR Development.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Collect file attachments from Blob URLs ──

interface FileAttachment {
  filename: string;
  content: Buffer;
}

async function downloadBlobFiles(data: BriefData): Promise<{ attachments: FileAttachment[]; blobUrls: string[] }> {
  const blobUrls: string[] = [];
  const files: { url: string; name: string }[] = [];

  if (data.design?.files) {
    for (const f of data.design.files) {
      files.push({ url: f.url, name: f.name });
      blobUrls.push(f.url);
    }
  }
  if (data.content?.files) {
    for (const f of data.content.files) {
      files.push({ url: f.url, name: f.name });
      blobUrls.push(f.url);
    }
  }

  const attachments: FileAttachment[] = [];
  for (const file of files) {
    try {
      const res = await fetch(file.url);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        attachments.push({
          filename: file.name,
          content: Buffer.from(arrayBuffer),
        });
      }
    } catch {
      // Skip files that fail to download
    }
  }

  return { attachments, blobUrls };
}

// ── POST handler ──

export async function POST(request: NextRequest) {
  // 1. CSRF check
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const rateEntry = rateLimitMap.get(ip);
  if (rateEntry) {
    if (now > rateEntry.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    } else if (rateEntry.count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    } else {
      rateEntry.count++;
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
  }

  try {
    // 3. Parse JSON body
    const body = await request.json();

    // 4. Honeypot — if filled, return fake success
    if (body.website_url) {
      return NextResponse.json({ success: true });
    }

    // 5. Validate
    const validation = validateBriefData(body);
    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: validation.error || "Invalid data" },
        { status: 400 }
      );
    }

    const data = validation.data;
    const resend = getResendClient();
    const contactEmail = process.env.CONTACT_EMAIL || "jb@jbrdevelopment.fr";

    // 6. Download file attachments from Blob
    const { attachments, blobUrls } = await downloadBlobFiles(data);

    // 7. Generate PDF
    const translations = await buildPdfTranslations(data.locale);
    const pdfBuffer = await generateBriefPdf(data, translations);

    // 8. Send notification email to freelance
    const allAttachments = [
      { filename: `brief-${data.company?.name || "projet"}.pdf`, content: pdfBuffer },
      ...attachments,
    ];

    await resend.emails.send({
      from: "JBR Development <contact@jbrdevelopment.fr>",
      to: contactEmail,
      subject: `Brief Projet: ${data.contact.fullName} - ${data.company?.name || ""}`,
      html: getBriefNotificationHtml(data),
      replyTo: data.contact.email,
      attachments: allAttachments,
    });

    // 9. Cleanup Blob files
    if (blobUrls.length > 0) {
      try {
        await Promise.all(blobUrls.map((url) => del(url)));
      } catch {
        // Non-critical: log but don't fail
        console.error("Failed to cleanup some Blob files");
      }
    }

    // 10. Send confirmation email to client
    try {
      await resend.emails.send({
        from: "JBR Development <contact@jbrdevelopment.fr>",
        to: data.contact.email,
        subject: data.locale === "fr"
          ? "Bien reçu ! Votre brief projet"
          : "Received! Your project brief",
        html: getBriefConfirmationHtml(data),
        attachments: [
          { filename: `brief-${data.company?.name || "projet"}.pdf`, content: pdfBuffer },
        ],
      });
    } catch {
      // Non-critical: notification was sent, confirmation is best-effort
      console.error("Failed to send confirmation email to client");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Brief submission error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "An error occurred while processing your brief" },
      { status: 500 }
    );
  }
}
