import { Resend } from "resend";
import { NextResponse } from "next/server";

// Instanciation lazy pour éviter le crash au build si la clé n'est pas définie
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

const projectTypeLabels: Record<string, string> = {
  "site-vitrine": "Site vitrine",
  "application-web": "Application web",
  "landing-page": "Landing page",
  "refonte": "Refonte de site",
  "autre": "Autre",
};

const VALID_PROJECT_TYPES = Object.keys(projectTypeLabels);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

// Rate limiting in-memory (par IP, 3 requêtes par minute)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Échappement HTML pour les templates email
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Template email pour JB (notification nouveau lead)
function getNotificationEmailHtml(data: {
  name: string;
  email: string;
  projectType: string;
  message: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #232323; border-radius: 16px; overflow: hidden; border: 1px solid #333333;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #34d399 0%, #10b981 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 700;">
                Nouveau Lead
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <!-- Client Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #2a2a2a; border-radius: 12px; border: 1px solid #333333; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 16px 0; color: #34d399; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      Informations client
                    </h2>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                          <span style="color: #a0a0a0; font-size: 14px;">Nom</span><br>
                          <span style="color: #f5f5f5; font-size: 16px; font-weight: 600;">${escapeHtml(data.name)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                          <span style="color: #a0a0a0; font-size: 14px;">Email</span><br>
                          <a href="mailto:${escapeHtml(data.email)}" style="color: #34d399; font-size: 16px; font-weight: 600; text-decoration: none;">${escapeHtml(data.email)}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #a0a0a0; font-size: 14px;">Type de projet</span><br>
                          <span style="display: inline-block; margin-top: 4px; padding: 6px 12px; background-color: #34d399; color: #1a1a1a; font-size: 14px; font-weight: 600; border-radius: 20px;">
                            ${projectTypeLabels[data.projectType]}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #2a2a2a; border-radius: 12px; border: 1px solid #333333;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 16px 0; color: #34d399; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      Message
                    </h2>
                    <p style="margin: 0; color: #f5f5f5; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(data.email)}?subject=Re: Demande de projet - JBR Development"
                       style="display: inline-block; padding: 16px 32px; background-color: #34d399; color: #1a1a1a; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                      Répondre à ${escapeHtml(data.name)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center; border-top: 1px solid #333333;">
              <p style="margin: 0; color: #a0a0a0; font-size: 14px;">
                JBR Development • Portfolio Contact Form
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Template email pour le client (confirmation)
function getConfirmationEmailHtml(data: { name: string; projectType: string }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #232323; border-radius: 16px; overflow: hidden; border: 1px solid #333333;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 32px; text-align: center; border-bottom: 1px solid #333333;">
              <h1 style="margin: 0 0 8px 0; color: #f5f5f5; font-size: 28px; font-weight: 700;">
                JBR<span style="color: #34d399;">.</span>
              </h1>
              <p style="margin: 0; color: #a0a0a0; font-size: 14px;">Development</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 24px 0; color: #f5f5f5; font-size: 24px; font-weight: 600;">
                Bonjour ${escapeHtml(data.name)} 👋
              </h2>

              <p style="margin: 0 0 16px 0; color: #f5f5f5; font-size: 16px; line-height: 1.6;">
                Merci pour votre message ! J'ai bien reçu votre demande concernant un projet de type
                <strong style="color: #34d399;">${projectTypeLabels[data.projectType]}</strong>.
              </p>

              <p style="margin: 0 0 24px 0; color: #f5f5f5; font-size: 16px; line-height: 1.6;">
                Je prends le temps d'étudier votre demande et vous répondrai personnellement sous <strong>24 heures</strong>.
              </p>

              <!-- What's Next Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #2a2a2a; border-radius: 12px; border: 1px solid #333333; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px 0; color: #34d399; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      Prochaines étapes
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #f5f5f5; font-size: 15px;">
                          <span style="color: #34d399; font-weight: 600;">1.</span> Analyse de votre demande
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #f5f5f5; font-size: 15px;">
                          <span style="color: #34d399; font-weight: 600;">2.</span> Prise de contact pour discuter de votre projet
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #f5f5f5; font-size: 15px;">
                          <span style="color: #34d399; font-weight: 600;">3.</span> Proposition personnalisée
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #a0a0a0; font-size: 15px; line-height: 1.6;">
                En attendant, n'hésitez pas à consulter mes
                <a href="https://jbrdevelopment.fr/#projets" style="color: #34d399; text-decoration: none;">réalisations</a>
                pour découvrir mon travail.
              </p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding: 0 32px 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #333333; padding-top: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px 0; color: #f5f5f5; font-size: 16px; font-weight: 600;">
                      Jean-Baptiste Renart
                    </p>
                    <p style="margin: 0; color: #a0a0a0; font-size: 14px;">
                      Développeur Web Full Stack
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center; background-color: #1a1a1a; border-top: 1px solid #333333;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <a href="https://github.com/Jeeiib" style="display: inline-block; margin: 0 8px; color: #a0a0a0; text-decoration: none;">GitHub</a>
                    <span style="color: #333333;">•</span>
                    <a href="https://www.linkedin.com/in/jean-baptiste-renart-46b618153/" style="display: inline-block; margin: 0 8px; color: #a0a0a0; text-decoration: none;">LinkedIn</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin: 0; color: #666666; font-size: 12px;">
                      © ${new Date().getFullYear()} JBR Development. Tous droits réservés.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function POST(request: Request) {
  try {
    // Rate limiting par IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez dans une minute." },
        { status: 429 }
      );
    }

    // Vérification Origin (CSRF)
    const origin = request.headers.get("origin");
    const allowedOrigins = [
      "https://jbrdevelopment.fr",
      "https://www.jbrdevelopment.fr",
    ];
    if (process.env.NODE_ENV === "development") {
      allowedOrigins.push("http://localhost:3000");
    }
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json({ error: "Origine non autorisée" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, projectType, message } = body;

    // Vérification des types
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof projectType !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { error: "Format de données invalide" },
        { status: 400 }
      );
    }

    // Trim et vérification de présence
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !projectType || !trimmedMessage) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Limites de longueur
    if (
      trimmedName.length > MAX_NAME_LENGTH ||
      trimmedEmail.length > MAX_EMAIL_LENGTH ||
      trimmedMessage.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { error: "Un ou plusieurs champs dépassent la longueur maximale" },
        { status: 400 }
      );
    }

    // Validation email
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Adresse email invalide" },
        { status: 400 }
      );
    }

    // Rejet des retours à la ligne (prévention injection header email)
    if (
      [trimmedName, trimmedEmail, projectType].some((f) => /[\r\n]/.test(f))
    ) {
      return NextResponse.json(
        { error: "Caractères invalides détectés" },
        { status: 400 }
      );
    }

    // Validation projectType contre la whitelist
    if (!VALID_PROJECT_TYPES.includes(projectType)) {
      return NextResponse.json(
        { error: "Type de projet invalide" },
        { status: 400 }
      );
    }

    const contactEmail = process.env.CONTACT_EMAIL || "jb@jbrdevelopment.fr";
    const resend = getResendClient();

    // Email 1: Notification pour JB
    const notificationResult = await resend.emails.send({
      from: "JBR Development <contact@jbrdevelopment.fr>",
      to: contactEmail,
      subject: `Nouveau lead: ${escapeHtml(trimmedName)} - ${projectTypeLabels[projectType]}`,
      html: getNotificationEmailHtml({
        name: trimmedName,
        email: trimmedEmail,
        projectType,
        message: trimmedMessage,
      }),
      replyTo: trimmedEmail,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Notification email sent:", notificationResult);
    }

    // Email 2: Confirmation pour le client
    const confirmationResult = await resend.emails.send({
      from: "JBR Development <contact@jbrdevelopment.fr>",
      to: trimmedEmail,
      subject: "Bien reçu ! Je vous réponds rapidement",
      html: getConfirmationEmailHtml({ name: trimmedName, projectType }),
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Confirmation email sent:", confirmationResult);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Error sending email:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
