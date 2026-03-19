"use client";

import { useTranslations } from "next-intl";
import ChipSelect from "@/components/brief/ui/ChipSelect";
import SingleSelect from "@/components/brief/ui/SingleSelect";
import TextInput from "@/components/brief/ui/TextInput";
import TextArea from "@/components/brief/ui/TextArea";
import type { ProjectType } from "@/data/briefTypes";
import type {
  BriefFeatures,
  FeaturesSiteVitrine,
  FeaturesAppWeb,
  FeaturesAppMobile,
  FeaturesLandingPage,
  FeaturesRefonte,
  FeaturesDevSurMesure,
  FeaturesMaintenance,
} from "@/data/briefTypes";
import { LIMITS } from "@/data/briefTypes";
import {
  siteVitrinePages,
  siteVitrineFeatures,
  contentAutonomyOptions,
  appWebUserTypes,
  appWebFeatures,
  userVolumeOptions,
  mobilePlatformOptions,
  mobilePhoneFeatures,
  offlineModeOptions,
  storePublishingOptions,
  landingPageObjectives,
  landingPageFeatures,
  refonteProblems,
  devIntegrations,
  maintenanceInterventions,
  maintenanceFrequency,
} from "@/data/briefQuestions";

interface FeaturesStepProps {
  projectType: ProjectType;
  data: BriefFeatures | null;
  onChange: (data: BriefFeatures) => void;
  errors: Record<string, string>;
}

// ── Helper to build labels from i18n ──

function buildLabels(
  t: ReturnType<typeof useTranslations>,
  basePath: string,
  keys: readonly string[]
): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const key of keys) {
    labels[key] = t(`${basePath}.${key}`);
  }
  labels["autre"] = t("ui.other");
  return labels;
}

// ── Site Vitrine ──

function SiteVitrineFields({
  data,
  onChange,
  errors,
  t,
}: {
  data: FeaturesSiteVitrine;
  onChange: (data: FeaturesSiteVitrine) => void;
  errors: Record<string, string>;
  t: ReturnType<typeof useTranslations>;
}) {
  const pagesLabels = buildLabels(t, "steps.features.site-vitrine.pages.options", siteVitrinePages);
  const featuresLabels = buildLabels(t, "steps.features.site-vitrine.features.options", siteVitrineFeatures);
  const autonomyLabels: Record<string, string> = {};
  for (const key of contentAutonomyOptions) {
    autonomyLabels[key] = t(`steps.features.site-vitrine.contentAutonomy.options.${key}`);
  }

  return (
    <>
      {/* Pages */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.site-vitrine.pages.label")}
        </label>
        {t.has("steps.features.site-vitrine.pages.hint") && (
          <p className="text-xs text-[var(--foreground-secondary)]/70">
            {t("steps.features.site-vitrine.pages.hint")}
          </p>
        )}
        <ChipSelect
          id="features-sv-pages"
          options={[...siteVitrinePages]}
          selected={data.pages}
          onChange={(pages) => onChange({ ...data, pages })}
          labels={pagesLabels}
          hasOther
        />
        {errors.pages && (
          <p role="alert" className="text-sm text-red-400/90">{errors.pages}</p>
        )}
      </div>

      {/* Features */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.site-vitrine.features.label")}
        </label>
        {t.has("steps.features.site-vitrine.features.hint") && (
          <p className="text-xs text-[var(--foreground-secondary)]/70">
            {t("steps.features.site-vitrine.features.hint")}
          </p>
        )}
        <ChipSelect
          id="features-sv-features"
          options={[...siteVitrineFeatures]}
          selected={data.features}
          onChange={(features) => onChange({ ...data, features })}
          labels={featuresLabels}
          hasOther
        />
        {errors.features && (
          <p role="alert" className="text-sm text-red-400/90">{errors.features}</p>
        )}
      </div>

      {/* Content autonomy */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.site-vitrine.contentAutonomy.label")}
        </label>
        {t.has("steps.features.site-vitrine.contentAutonomy.hint") && (
          <p className="text-xs text-[var(--foreground-secondary)]/70">
            {t("steps.features.site-vitrine.contentAutonomy.hint")}
          </p>
        )}
        <SingleSelect
          id="features-sv-autonomy"
          options={[...contentAutonomyOptions]}
          selected={data.contentAutonomy || null}
          onChange={(v) => onChange({ ...data, contentAutonomy: v })}
          labels={autonomyLabels}
        />
        {errors.contentAutonomy && (
          <p role="alert" className="text-sm text-red-400/90">{errors.contentAutonomy}</p>
        )}
      </div>

      {/* Other */}
      <TextArea
        id="features-sv-other"
        label={t("steps.features.site-vitrine.other.label")}
        value={data.other ?? ""}
        onChange={(v) => onChange({ ...data, other: v })}
        placeholder={t("steps.features.site-vitrine.other.placeholder")}
        maxLength={LIMITS.other}
      />
    </>
  );
}

// ── Application Web ──

function AppWebFields({
  data,
  onChange,
  errors,
  t,
}: {
  data: FeaturesAppWeb;
  onChange: (data: FeaturesAppWeb) => void;
  errors: Record<string, string>;
  t: ReturnType<typeof useTranslations>;
}) {
  const userTypesLabels = buildLabels(t, "steps.features.application-web.userTypes.options", appWebUserTypes);
  const featuresLabels = buildLabels(t, "steps.features.application-web.features.options", appWebFeatures);
  const volumeLabels: Record<string, string> = {};
  for (const key of userVolumeOptions) {
    volumeLabels[key] = t(`steps.features.application-web.userVolume.options.${key}`);
  }

  return (
    <>
      {/* Daily usage */}
      <TextArea
        id="features-aw-daily-usage"
        label={t("steps.features.application-web.dailyUsage.label")}
        value={data.dailyUsage}
        onChange={(v) => onChange({ ...data, dailyUsage: v })}
        placeholder={t("steps.features.application-web.dailyUsage.placeholder")}
        maxLength={LIMITS.dailyUsage}
        required
        error={errors.dailyUsage}
        rows={5}
      />

      {/* User types */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.application-web.userTypes.label")}
        </label>
        {t.has("steps.features.application-web.userTypes.hint") && (
          <p className="text-xs text-[var(--foreground-secondary)]/70">
            {t("steps.features.application-web.userTypes.hint")}
          </p>
        )}
        <ChipSelect
          id="features-aw-user-types"
          options={[...appWebUserTypes]}
          selected={data.userTypes}
          onChange={(userTypes) => onChange({ ...data, userTypes })}
          labels={userTypesLabels}
        />
        {errors.userTypes && (
          <p role="alert" className="text-sm text-red-400/90">{errors.userTypes}</p>
        )}
      </div>

      {/* Features */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.application-web.features.label")}
        </label>
        {t.has("steps.features.application-web.features.hint") && (
          <p className="text-xs text-[var(--foreground-secondary)]/70">
            {t("steps.features.application-web.features.hint")}
          </p>
        )}
        <ChipSelect
          id="features-aw-features"
          options={[...appWebFeatures]}
          selected={data.features}
          onChange={(features) => onChange({ ...data, features })}
          labels={featuresLabels}
          hasOther
        />
        {errors.features && (
          <p role="alert" className="text-sm text-red-400/90">{errors.features}</p>
        )}
      </div>

      {/* Current tools */}
      <TextArea
        id="features-aw-current-tools"
        label={t("steps.features.application-web.currentTools.label")}
        value={data.currentTools}
        onChange={(v) => onChange({ ...data, currentTools: v })}
        placeholder={t("steps.features.application-web.currentTools.placeholder")}
        maxLength={LIMITS.currentTools}
        required
        error={errors.currentTools}
      />

      {/* User volume */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.application-web.userVolume.label")}
        </label>
        <SingleSelect
          id="features-aw-volume"
          options={[...userVolumeOptions]}
          selected={data.userVolume || null}
          onChange={(v) => onChange({ ...data, userVolume: v })}
          labels={volumeLabels}
        />
        {errors.userVolume && (
          <p role="alert" className="text-sm text-red-400/90">{errors.userVolume}</p>
        )}
      </div>

      {/* Other */}
      <TextArea
        id="features-aw-other"
        label={t("steps.features.application-web.other.label")}
        value={data.other ?? ""}
        onChange={(v) => onChange({ ...data, other: v })}
        placeholder={t("steps.features.application-web.other.placeholder")}
        maxLength={LIMITS.other}
      />
    </>
  );
}

// ── Application Mobile ──

function AppMobileFields({
  data,
  onChange,
  errors,
  t,
}: {
  data: FeaturesAppMobile;
  onChange: (data: FeaturesAppMobile) => void;
  errors: Record<string, string>;
  t: ReturnType<typeof useTranslations>;
}) {
  const platformLabels: Record<string, string> = {};
  for (const key of mobilePlatformOptions) {
    platformLabels[key] = t(`steps.features.application-mobile.platforms.options.${key}`);
  }
  const phoneFeatLabels = buildLabels(t, "steps.features.application-mobile.phoneFeatures.options", mobilePhoneFeatures);
  const offlineLabels: Record<string, string> = {};
  for (const key of offlineModeOptions) {
    offlineLabels[key] = t(`steps.features.application-mobile.offlineMode.options.${key}`);
  }
  const storeLabels: Record<string, string> = {};
  for (const key of storePublishingOptions) {
    storeLabels[key] = t(`steps.features.application-mobile.storePublishing.options.${key}`);
  }
  const volumeLabels: Record<string, string> = {};
  for (const key of userVolumeOptions) {
    volumeLabels[key] = t(`steps.features.application-mobile.userVolume.options.${key}`);
  }

  return (
    <>
      {/* Platforms */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.application-mobile.platforms.label")}
        </label>
        <SingleSelect
          id="features-am-platforms"
          options={[...mobilePlatformOptions]}
          selected={data.platforms || null}
          onChange={(v) => onChange({ ...data, platforms: v })}
          labels={platformLabels}
        />
        {errors.platforms && (
          <p role="alert" className="text-sm text-red-400/90">{errors.platforms}</p>
        )}
      </div>

      {/* Usage */}
      <TextArea
        id="features-am-usage"
        label={t("steps.features.application-mobile.usage.label")}
        value={data.usage}
        onChange={(v) => onChange({ ...data, usage: v })}
        placeholder={t("steps.features.application-mobile.usage.placeholder")}
        maxLength={LIMITS.dailyUsage}
        required
        error={errors.usage}
        rows={5}
      />

      {/* Phone features */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.application-mobile.phoneFeatures.label")}
        </label>
        {t.has("steps.features.application-mobile.phoneFeatures.hint") && (
          <p className="text-xs text-[var(--foreground-secondary)]/70">
            {t("steps.features.application-mobile.phoneFeatures.hint")}
          </p>
        )}
        <ChipSelect
          id="features-am-phone"
          options={[...mobilePhoneFeatures]}
          selected={data.phoneFeatures}
          onChange={(phoneFeatures) => onChange({ ...data, phoneFeatures })}
          labels={phoneFeatLabels}
        />
        {errors.phoneFeatures && (
          <p role="alert" className="text-sm text-red-400/90">{errors.phoneFeatures}</p>
        )}
      </div>

      {/* Offline mode */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.application-mobile.offlineMode.label")}
        </label>
        <SingleSelect
          id="features-am-offline"
          options={[...offlineModeOptions]}
          selected={data.offlineMode || null}
          onChange={(v) => onChange({ ...data, offlineMode: v })}
          labels={offlineLabels}
        />
        {errors.offlineMode && (
          <p role="alert" className="text-sm text-red-400/90">{errors.offlineMode}</p>
        )}
      </div>

      {/* Store publishing */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.application-mobile.storePublishing.label")}
        </label>
        <SingleSelect
          id="features-am-store"
          options={[...storePublishingOptions]}
          selected={data.storePublishing || null}
          onChange={(v) => onChange({ ...data, storePublishing: v })}
          labels={storeLabels}
        />
        {errors.storePublishing && (
          <p role="alert" className="text-sm text-red-400/90">{errors.storePublishing}</p>
        )}
      </div>

      {/* User volume */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.application-mobile.userVolume.label")}
        </label>
        <SingleSelect
          id="features-am-volume"
          options={[...userVolumeOptions]}
          selected={data.userVolume || null}
          onChange={(v) => onChange({ ...data, userVolume: v })}
          labels={volumeLabels}
        />
        {errors.userVolume && (
          <p role="alert" className="text-sm text-red-400/90">{errors.userVolume}</p>
        )}
      </div>

      {/* Other */}
      <TextArea
        id="features-am-other"
        label={t("steps.features.application-mobile.other.label")}
        value={data.other ?? ""}
        onChange={(v) => onChange({ ...data, other: v })}
        placeholder={t("steps.features.application-mobile.other.placeholder")}
        maxLength={LIMITS.other}
      />
    </>
  );
}

// ── Landing Page ──

function LandingPageFields({
  data,
  onChange,
  errors,
  t,
}: {
  data: FeaturesLandingPage;
  onChange: (data: FeaturesLandingPage) => void;
  errors: Record<string, string>;
  t: ReturnType<typeof useTranslations>;
}) {
  const objectiveLabels: Record<string, string> = {};
  for (const key of landingPageObjectives) {
    objectiveLabels[key] = t(`steps.features.landing-page.objective.options.${key}`);
  }
  objectiveLabels["autre"] = t("ui.other");

  const featuresLabels = buildLabels(t, "steps.features.landing-page.features.options", landingPageFeatures);

  return (
    <>
      {/* Objective */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.landing-page.objective.label")}
        </label>
        <SingleSelect
          id="features-lp-objective"
          options={[...landingPageObjectives]}
          selected={data.objective || null}
          onChange={(v) => onChange({ ...data, objective: v })}
          labels={objectiveLabels}
        />
        {errors.objective && (
          <p role="alert" className="text-sm text-red-400/90">{errors.objective}</p>
        )}
      </div>

      {/* Features */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.landing-page.features.label")}
        </label>
        {t.has("steps.features.landing-page.features.hint") && (
          <p className="text-xs text-[var(--foreground-secondary)]/70">
            {t("steps.features.landing-page.features.hint")}
          </p>
        )}
        <ChipSelect
          id="features-lp-features"
          options={[...landingPageFeatures]}
          selected={data.features}
          onChange={(features) => onChange({ ...data, features })}
          labels={featuresLabels}
          hasOther
        />
        {errors.features && (
          <p role="alert" className="text-sm text-red-400/90">{errors.features}</p>
        )}
      </div>

      {/* Other */}
      <TextArea
        id="features-lp-other"
        label={t("steps.features.landing-page.other.label")}
        value={data.other ?? ""}
        onChange={(v) => onChange({ ...data, other: v })}
        placeholder={t("steps.features.landing-page.other.placeholder")}
        maxLength={LIMITS.other}
      />
    </>
  );
}

// ── Refonte ──

function RefonteFields({
  data,
  onChange,
  errors,
  t,
}: {
  data: FeaturesRefonte;
  onChange: (data: FeaturesRefonte) => void;
  errors: Record<string, string>;
  t: ReturnType<typeof useTranslations>;
}) {
  const problemsLabels = buildLabels(t, "steps.features.refonte.problems.options", refonteProblems);

  return (
    <>
      {/* Current URL */}
      <TextInput
        id="features-ref-url"
        label={t("steps.features.refonte.currentUrl.label")}
        value={data.currentUrl}
        onChange={(v) => onChange({ ...data, currentUrl: v })}
        placeholder={t("steps.features.refonte.currentUrl.placeholder")}
        maxLength={200}
        required
        error={errors.currentUrl}
      />

      {/* Problems */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.refonte.problems.label")}
        </label>
        {t.has("steps.features.refonte.problems.hint") && (
          <p className="text-xs text-[var(--foreground-secondary)]/70">
            {t("steps.features.refonte.problems.hint")}
          </p>
        )}
        <ChipSelect
          id="features-ref-problems"
          options={[...refonteProblems]}
          selected={data.problems}
          onChange={(problems) => onChange({ ...data, problems })}
          labels={problemsLabels}
          hasOther
        />
        {errors.problems && (
          <p role="alert" className="text-sm text-red-400/90">{errors.problems}</p>
        )}
      </div>

      {/* To keep */}
      <TextArea
        id="features-ref-keep"
        label={t("steps.features.refonte.toKeep.label")}
        value={data.toKeep ?? ""}
        onChange={(v) => onChange({ ...data, toKeep: v })}
        placeholder={t("steps.features.refonte.toKeep.placeholder")}
        maxLength={LIMITS.other}
      />

      {/* New features */}
      <TextArea
        id="features-ref-new"
        label={t("steps.features.refonte.newFeatures.label")}
        value={data.newFeatures ?? ""}
        onChange={(v) => onChange({ ...data, newFeatures: v })}
        placeholder={t("steps.features.refonte.newFeatures.placeholder")}
        maxLength={LIMITS.other}
      />
    </>
  );
}

// ── Developpement sur mesure ──

function DevSurMesureFields({
  data,
  onChange,
  errors,
  t,
}: {
  data: FeaturesDevSurMesure;
  onChange: (data: FeaturesDevSurMesure) => void;
  errors: Record<string, string>;
  t: ReturnType<typeof useTranslations>;
}) {
  const integrationsLabels = buildLabels(t, "steps.features.developpement-sur-mesure.integrations.options", devIntegrations);

  return (
    <>
      {/* Description */}
      <TextArea
        id="features-dsm-description"
        label={t("steps.features.developpement-sur-mesure.description.label")}
        value={data.description}
        onChange={(v) => onChange({ ...data, description: v })}
        placeholder={t("steps.features.developpement-sur-mesure.description.placeholder")}
        maxLength={LIMITS.technicalDescription}
        required
        error={errors.description}
        rows={6}
      />

      {/* Integrations */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.developpement-sur-mesure.integrations.label")}
        </label>
        {t.has("steps.features.developpement-sur-mesure.integrations.hint") && (
          <p className="text-xs text-[var(--foreground-secondary)]/70">
            {t("steps.features.developpement-sur-mesure.integrations.hint")}
          </p>
        )}
        <ChipSelect
          id="features-dsm-integrations"
          options={[...devIntegrations]}
          selected={data.integrations}
          onChange={(integrations) => onChange({ ...data, integrations })}
          labels={integrationsLabels}
          hasOther
        />
        {errors.integrations && (
          <p role="alert" className="text-sm text-red-400/90">{errors.integrations}</p>
        )}
      </div>

      {/* Other */}
      <TextArea
        id="features-dsm-other"
        label={t("steps.features.developpement-sur-mesure.other.label")}
        value={data.other ?? ""}
        onChange={(v) => onChange({ ...data, other: v })}
        placeholder={t("steps.features.developpement-sur-mesure.other.placeholder")}
        maxLength={LIMITS.other}
      />
    </>
  );
}

// ── Maintenance ──

function MaintenanceFields({
  data,
  onChange,
  errors,
  t,
}: {
  data: FeaturesMaintenance;
  onChange: (data: FeaturesMaintenance) => void;
  errors: Record<string, string>;
  t: ReturnType<typeof useTranslations>;
}) {
  const interventionLabels = buildLabels(t, "steps.features.maintenance.interventionTypes.options", maintenanceInterventions);
  const frequencyLabels: Record<string, string> = {};
  for (const key of maintenanceFrequency) {
    frequencyLabels[key] = t(`steps.features.maintenance.frequency.options.${key}`);
  }

  return (
    <>
      {/* App URL */}
      <TextInput
        id="features-maint-url"
        label={t("steps.features.maintenance.appUrl.label")}
        value={data.appUrl}
        onChange={(v) => onChange({ ...data, appUrl: v })}
        placeholder={t("steps.features.maintenance.appUrl.placeholder")}
        maxLength={200}
        required
        error={errors.appUrl}
      />

      {/* Intervention types */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.maintenance.interventionTypes.label")}
        </label>
        {t.has("steps.features.maintenance.interventionTypes.hint") && (
          <p className="text-xs text-[var(--foreground-secondary)]/70">
            {t("steps.features.maintenance.interventionTypes.hint")}
          </p>
        )}
        <ChipSelect
          id="features-maint-interventions"
          options={[...maintenanceInterventions]}
          selected={data.interventionTypes}
          onChange={(interventionTypes) => onChange({ ...data, interventionTypes })}
          labels={interventionLabels}
          hasOther
        />
        {errors.interventionTypes && (
          <p role="alert" className="text-sm text-red-400/90">{errors.interventionTypes}</p>
        )}
      </div>

      {/* Frequency */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          {t("steps.features.maintenance.frequency.label")}
        </label>
        <SingleSelect
          id="features-maint-frequency"
          options={[...maintenanceFrequency]}
          selected={data.frequency || null}
          onChange={(v) => onChange({ ...data, frequency: v })}
          labels={frequencyLabels}
        />
        {errors.frequency && (
          <p role="alert" className="text-sm text-red-400/90">{errors.frequency}</p>
        )}
      </div>

      {/* Other */}
      <TextArea
        id="features-maint-other"
        label={t("steps.features.maintenance.other.label")}
        value={data.other ?? ""}
        onChange={(v) => onChange({ ...data, other: v })}
        placeholder={t("steps.features.maintenance.other.placeholder")}
        maxLength={LIMITS.other}
      />
    </>
  );
}

// ── Default data factories ──

function defaultSiteVitrine(): FeaturesSiteVitrine {
  return { pages: [], features: [], contentAutonomy: "", other: "" };
}
function defaultAppWeb(): FeaturesAppWeb {
  return { dailyUsage: "", userTypes: [], features: [], currentTools: "", userVolume: "", other: "" };
}
function defaultAppMobile(): FeaturesAppMobile {
  return { platforms: "", usage: "", phoneFeatures: [], offlineMode: "", storePublishing: "", userVolume: "", other: "" };
}
function defaultLandingPage(): FeaturesLandingPage {
  return { objective: "", features: [], other: "" };
}
function defaultRefonte(): FeaturesRefonte {
  return { currentUrl: "", problems: [], toKeep: "", newFeatures: "" };
}
function defaultDevSurMesure(): FeaturesDevSurMesure {
  return { description: "", integrations: [], other: "" };
}
function defaultMaintenance(): FeaturesMaintenance {
  return { appUrl: "", interventionTypes: [], frequency: "", other: "" };
}

// ── Main Component ──

export default function FeaturesStep({ projectType, data, onChange, errors }: FeaturesStepProps) {
  const t = useTranslations("brief");

  const renderFields = () => {
    switch (projectType) {
      case "site-vitrine": {
        const d = (data as FeaturesSiteVitrine) ?? defaultSiteVitrine();
        return (
          <SiteVitrineFields
            data={d}
            onChange={(v) => onChange(v)}
            errors={errors}
            t={t}
          />
        );
      }
      case "application-web": {
        const d = (data as FeaturesAppWeb) ?? defaultAppWeb();
        return (
          <AppWebFields
            data={d}
            onChange={(v) => onChange(v)}
            errors={errors}
            t={t}
          />
        );
      }
      case "application-mobile": {
        const d = (data as FeaturesAppMobile) ?? defaultAppMobile();
        return (
          <AppMobileFields
            data={d}
            onChange={(v) => onChange(v)}
            errors={errors}
            t={t}
          />
        );
      }
      case "landing-page": {
        const d = (data as FeaturesLandingPage) ?? defaultLandingPage();
        return (
          <LandingPageFields
            data={d}
            onChange={(v) => onChange(v)}
            errors={errors}
            t={t}
          />
        );
      }
      case "refonte": {
        const d = (data as FeaturesRefonte) ?? defaultRefonte();
        return (
          <RefonteFields
            data={d}
            onChange={(v) => onChange(v)}
            errors={errors}
            t={t}
          />
        );
      }
      case "developpement-sur-mesure": {
        const d = (data as FeaturesDevSurMesure) ?? defaultDevSurMesure();
        return (
          <DevSurMesureFields
            data={d}
            onChange={(v) => onChange(v)}
            errors={errors}
            t={t}
          />
        );
      }
      case "maintenance": {
        const d = (data as FeaturesMaintenance) ?? defaultMaintenance();
        return (
          <MaintenanceFields
            data={d}
            onChange={(v) => onChange(v)}
            errors={errors}
            t={t}
          />
        );
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          {t("steps.features.title")}
        </h2>
        <p className="text-[var(--foreground-secondary)]">
          {t("steps.features.subtitle")}
        </p>
      </div>

      <div className="space-y-8">
        {renderFields()}
      </div>
    </div>
  );
}
