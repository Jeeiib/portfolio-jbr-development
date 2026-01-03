import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const projectTypeLabels: Record<string, string> = {
  "site-vitrine": "Site vitrine",
  "application-web": "Application web",
  "landing-page": "Landing page",
  "refonte": "Refonte de site",
  "autre": "Autre",
};

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
                          <span style="color: #f5f5f5; font-size: 16px; font-weight: 600;">${data.name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                          <span style="color: #a0a0a0; font-size: 14px;">Email</span><br>
                          <a href="mailto:${data.email}" style="color: #34d399; font-size: 16px; font-weight: 600; text-decoration: none;">${data.email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #a0a0a0; font-size: 14px;">Type de projet</span><br>
                          <span style="display: inline-block; margin-top: 4px; padding: 6px 12px; background-color: #34d399; color: #1a1a1a; font-size: 14px; font-weight: 600; border-radius: 20px;">
                            ${projectTypeLabels[data.projectType] || data.projectType}
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
                    <p style="margin: 0; color: #f5f5f5; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${data.email}?subject=Re: Demande de projet - JBR Development"
                       style="display: inline-block; padding: 16px 32px; background-color: #34d399; color: #1a1a1a; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                      Répondre à ${data.name}
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
                Bonjour ${data.name} 👋
              </h2>

              <p style="margin: 0 0 16px 0; color: #f5f5f5; font-size: 16px; line-height: 1.6;">
                Merci pour votre message ! J'ai bien reçu votre demande concernant un projet de type
                <strong style="color: #34d399;">${projectTypeLabels[data.projectType] || data.projectType}</strong>.
              </p>

              <p style="margin: 0 0 24px 0; color: #f5f5f5; font-size: 16px; line-height: 1.6;">
                Je prends le temps d'étudier votre demande et vous répondrai personnellement sous <strong>24 à 48 heures</strong>.
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
    const body = await request.json();
    const { name, email, projectType, message } = body;

    // Validation
    if (!name || !email || !projectType || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const contactEmail = process.env.CONTACT_EMAIL || "jb@jbrdevelopment.fr";

    // Email 1: Notification pour JB
    const notificationResult = await resend.emails.send({
      from: "JBR Development <contact@jbrdevelopment.fr>",
      to: contactEmail,
      subject: `Nouveau lead: ${name} - ${projectTypeLabels[projectType] || projectType}`,
      html: getNotificationEmailHtml({ name, email, projectType, message }),
      replyTo: email,
    });

    console.log("Notification email sent:", notificationResult);

    // Email 2: Confirmation pour le client
    const confirmationResult = await resend.emails.send({
      from: "JBR Development <contact@jbrdevelopment.fr>",
      to: email,
      subject: "Bien reçu ! Je vous réponds rapidement",
      html: getConfirmationEmailHtml({ name, projectType }),
    });

    console.log("Confirmation email sent:", confirmationResult);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
