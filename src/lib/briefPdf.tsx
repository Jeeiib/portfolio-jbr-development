import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { BriefData, BriefFile } from "@/data/briefTypes";
import { showDesignStep, contentVariant } from "@/data/briefQuestions";

// ── Styles ──

const colors = {
  accent: "#34d399",
  accentDark: "#059669",
  bg: "#ffffff",
  text: "#1a1a1a",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
  sectionBg: "#f9fafb",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `2px solid ${colors.accent}`,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  headerBrand: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.accentDark,
    textAlign: "right",
  },
  headerBrandSub: {
    fontSize: 8,
    color: colors.textSecondary,
    textAlign: "right",
    marginTop: 2,
  },
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.sectionBg,
    borderRadius: 4,
    border: `1px solid ${colors.border}`,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.accentDark,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "35%",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: colors.textSecondary,
  },
  value: {
    width: "65%",
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: colors.textSecondary,
  },
  badge: {
    backgroundColor: colors.accent,
    color: "#ffffff",
    padding: "3px 8px",
    borderRadius: 10,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
});

// ── Translation interface ──

interface PdfTranslations {
  title: string;
  generatedOn: string;
  sections: {
    projectType: string;
    company: string;
    goals: string;
    features: string;
    design: string;
    content: string;
    budget: string;
    contact: string;
    freeComment: string;
  };
  labels: Record<string, string>;
  values: Record<string, string>;
}

// ── Helpers ──

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function formatList(items: string[] | undefined, labels: Record<string, string>): string {
  if (!items || items.length === 0) return "";
  return items.map((key) => labels[key] || key).join(", ");
}

function formatFiles(files: BriefFile[]): string {
  if (!files || files.length === 0) return "";
  return files.map((f) => f.name).join(", ");
}

// ── PDF Document ──

function BriefPdfDocument({
  data,
  t,
}: {
  data: BriefData;
  t: PdfTranslations;
}) {
  const projectType = data.projectType!;
  const hasDesign = showDesignStep[projectType];
  const variant = contentVariant[projectType];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{t.title}</Text>
            <Text style={styles.headerSubtitle}>
              {data.company?.name || ""}
            </Text>
          </View>
          <View>
            <Text style={styles.headerBrand}>JBR Development</Text>
            <Text style={styles.headerBrandSub}>jbrdevelopment.fr</Text>
          </View>
        </View>

        {/* Project Type */}
        <Section title={t.sections.projectType}>
          <View style={styles.row}>
            <Text style={styles.badge}>
              {t.values[`projectType.${projectType}`] || projectType}
            </Text>
          </View>
        </Section>

        {/* Company */}
        {data.company && (
          <Section title={t.sections.company}>
            <Row label={t.labels.companyName} value={data.company.name} />
            <Row label={t.labels.description} value={data.company.description} />
            <Row label={t.labels.target} value={data.company.target} />
            {data.company.hasWebsite && (
              <Row label={t.labels.websiteUrl} value={data.company.websiteUrl} />
            )}
            <Row label={t.labels.inspirations} value={data.company.inspirations} />
          </Section>
        )}

        {/* Goals */}
        {data.goals && (
          <Section title={t.sections.goals}>
            <Row
              label={t.labels.objectives}
              value={formatList(data.goals.objectives, t.values)}
            />
            {data.goals.objectiveOther && (
              <Row label={t.labels.other} value={data.goals.objectiveOther} />
            )}
            <Row label={t.labels.problem} value={data.goals.problem} />
            <Row label={t.labels.successCriteria} value={data.goals.successCriteria} />
          </Section>
        )}

        {/* Features */}
        {data.features && (
          <Section title={t.sections.features}>
            {/* Generic approach: iterate over known fields */}
            {"pages" in data.features && (
              <Row
                label={t.labels.pages}
                value={formatList((data.features as { pages: string[] }).pages, t.values)}
              />
            )}
            {"features" in data.features && (
              <Row
                label={t.labels.features}
                value={formatList((data.features as { features: string[] }).features, t.values)}
              />
            )}
            {"contentAutonomy" in data.features && (
              <Row
                label={t.labels.contentAutonomy}
                value={t.values[(data.features as { contentAutonomy: string }).contentAutonomy] || (data.features as { contentAutonomy: string }).contentAutonomy}
              />
            )}
            {"dailyUsage" in data.features && (
              <Row label={t.labels.dailyUsage} value={(data.features as { dailyUsage: string }).dailyUsage} />
            )}
            {"userTypes" in data.features && (
              <Row
                label={t.labels.userTypes}
                value={formatList((data.features as { userTypes: string[] }).userTypes, t.values)}
              />
            )}
            {"currentTools" in data.features && (
              <Row label={t.labels.currentTools} value={(data.features as { currentTools: string }).currentTools} />
            )}
            {"userVolume" in data.features && (
              <Row
                label={t.labels.userVolume}
                value={t.values[(data.features as { userVolume: string }).userVolume] || (data.features as { userVolume: string }).userVolume}
              />
            )}
            {"platforms" in data.features && (
              <Row
                label={t.labels.platforms}
                value={t.values[(data.features as { platforms: string }).platforms] || (data.features as { platforms: string }).platforms}
              />
            )}
            {"phoneFeatures" in data.features && (
              <Row
                label={t.labels.phoneFeatures}
                value={formatList((data.features as { phoneFeatures: string[] }).phoneFeatures, t.values)}
              />
            )}
            {"offlineMode" in data.features && (
              <Row
                label={t.labels.offlineMode}
                value={t.values[(data.features as { offlineMode: string }).offlineMode] || (data.features as { offlineMode: string }).offlineMode}
              />
            )}
            {"storePublishing" in data.features && (
              <Row
                label={t.labels.storePublishing}
                value={t.values[(data.features as { storePublishing: string }).storePublishing] || (data.features as { storePublishing: string }).storePublishing}
              />
            )}
            {"objective" in data.features && (
              <Row
                label={t.labels.objective}
                value={t.values[(data.features as { objective: string }).objective] || (data.features as { objective: string }).objective}
              />
            )}
            {"currentUrl" in data.features && (
              <Row label={t.labels.currentUrl} value={(data.features as { currentUrl: string }).currentUrl} />
            )}
            {"problems" in data.features && (
              <Row
                label={t.labels.problems}
                value={formatList((data.features as { problems: string[] }).problems, t.values)}
              />
            )}
            {"toKeep" in data.features && (
              <Row label={t.labels.toKeep} value={(data.features as { toKeep?: string }).toKeep} />
            )}
            {"newFeatures" in data.features && (
              <Row label={t.labels.newFeatures} value={(data.features as { newFeatures?: string }).newFeatures} />
            )}
            {"description" in data.features && (
              <Row label={t.labels.technicalDescription} value={(data.features as { description: string }).description} />
            )}
            {"integrations" in data.features && (
              <Row
                label={t.labels.integrations}
                value={formatList((data.features as { integrations: string[] }).integrations, t.values)}
              />
            )}
            {"appUrl" in data.features && (
              <Row label={t.labels.appUrl} value={(data.features as { appUrl: string }).appUrl} />
            )}
            {"interventionTypes" in data.features && (
              <Row
                label={t.labels.interventionTypes}
                value={formatList((data.features as { interventionTypes: string[] }).interventionTypes, t.values)}
              />
            )}
            {"frequency" in data.features && (
              <Row
                label={t.labels.frequency}
                value={t.values[(data.features as { frequency: string }).frequency] || (data.features as { frequency: string }).frequency}
              />
            )}
            {"other" in data.features && (data.features as { other?: string }).other && (
              <Row label={t.labels.other} value={(data.features as { other?: string }).other} />
            )}
          </Section>
        )}

        {/* Design */}
        {hasDesign && data.design && (
          <Section title={t.sections.design}>
            <Row
              label={t.labels.existingIdentity}
              value={t.values[data.design.existingIdentity] || data.design.existingIdentity}
            />
            <Row
              label={t.labels.ambiance}
              value={formatList(data.design.ambiance, t.values)}
            />
            <Row label={t.labels.colorPreferences} value={data.design.colorPreferences} />
            <Row label={t.labels.designInspirations} value={data.design.designInspirations} />
            {data.design.files.length > 0 && (
              <Row label={t.labels.files} value={formatFiles(data.design.files)} />
            )}
          </Section>
        )}

        {/* Content */}
        {variant !== "none" && data.content && (
          <Section title={t.sections.content}>
            {variant === "full" && (
              <>
                <Row
                  label={t.labels.textsReady}
                  value={t.values[data.content.textsReady || ""] || data.content.textsReady}
                />
                <Row
                  label={t.labels.visualsAvailable}
                  value={t.values[data.content.visualsAvailable || ""] || data.content.visualsAvailable}
                />
                <Row
                  label={t.labels.keepExistingContent}
                  value={t.values[data.content.keepExistingContent || ""] || data.content.keepExistingContent}
                />
              </>
            )}
            {data.content.files.length > 0 && (
              <Row label={t.labels.files} value={formatFiles(data.content.files)} />
            )}
          </Section>
        )}

        {/* Budget */}
        {data.budget && (
          <Section title={t.sections.budget}>
            <Row
              label={t.labels.budgetRange}
              value={t.values[data.budget.range] || data.budget.range}
            />
            <Row
              label={t.labels.deadline}
              value={t.values[data.budget.deadline] || data.budget.deadline}
            />
            <Row
              label={t.labels.communication}
              value={formatList(data.budget.communicationPreference, t.values)}
            />
          </Section>
        )}

        {/* Free comment */}
        {data.freeComment && (
          <Section title={t.sections.freeComment}>
            <Text style={styles.value}>{data.freeComment}</Text>
          </Section>
        )}

        {/* Contact */}
        {data.contact && (
          <Section title={t.sections.contact}>
            <Row label={t.labels.fullName} value={data.contact.fullName} />
            <Row label={t.labels.email} value={data.contact.email} />
            <Row label={t.labels.phone} value={data.contact.phone} />
          </Section>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {t.generatedOn} {new Date().toLocaleDateString(data.locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text style={styles.footerText}>jbrdevelopment.fr</Text>
        </View>
      </Page>
    </Document>
  );
}

// ── Public API ──

export type { PdfTranslations };

export async function generateBriefPdf(
  data: BriefData,
  translations: PdfTranslations
): Promise<Buffer> {
  const { renderToBuffer } = await import("@react-pdf/renderer");
  return renderToBuffer(
    <BriefPdfDocument data={data} t={translations} />
  ) as unknown as Buffer;
}
