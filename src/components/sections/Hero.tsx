"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import SmoothScrollLink from "@/components/ui/SmoothScrollLink";
import { useAnalytics } from "@/hooks/useAnalytics";

// Composant Terminal animé - Reste en français (décoratif)
function AnimatedTerminal() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "compiling" | "done">("typing");
  const [outputLines, setOutputLines] = useState<string[]>([]);

  const codeLines = [
    "const developer = {",
    '  name: "Jean-Baptiste",',
    '  role: "Full Stack Developer",',
    "  stack: {",
    '    frontend: ["React", "Next.js", "Vue.js"],',
    '    backend: ["Node.js", "Java", "Spring Boot"],',
    '    database: ["PostgreSQL", "Supabase"],',
    '    mobile: ["React Native"]',
    "  },",
    '  passion: "Building digital solutions"',
    "};",
    "",
    "developer.startProject();",
  ];

  const outputSequence = [
    { text: "> Compiling...", delay: 400 },
    { text: "> ✓ Build successful", delay: 600 },
    { text: "> 🚀 Ready to build something amazing", delay: 500 },
  ];

  // Phase 1: Typing animation
  useEffect(() => {
    if (phase !== "typing") return;

    if (currentLineIndex >= codeLines.length) {
      setTimeout(() => setPhase("compiling"), 300);
      return;
    }

    const currentLine = codeLines[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          if (newLines.length <= currentLineIndex) {
            newLines.push("");
          }
          newLines[currentLineIndex] = currentLine.slice(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, 15 + Math.random() * 10);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, phase, codeLines]);

  // Phase 2: Output sequence
  useEffect(() => {
    if (phase !== "compiling") return;

    let totalDelay = 0;
    const timers: NodeJS.Timeout[] = [];

    outputSequence.forEach((item, index) => {
      totalDelay += item.delay;
      const timer = setTimeout(() => {
        setOutputLines((prev) => [...prev, item.text]);
        if (index === outputSequence.length - 1) {
          setTimeout(() => setPhase("done"), 300);
        }
      }, totalDelay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Syntax highlighting character by character
  const renderLine = (line: string) => {
    if (!line) return <span>&nbsp;</span>;

    // Tokenize et colorize le texte caractère par caractère
    const result: React.ReactElement[] = [];
    let i = 0;

    while (i < line.length) {
      // Espaces (indentation)
      if (line[i] === " ") {
        let spaces = "";
        while (i < line.length && line[i] === " ") {
          spaces += " ";
          i++;
        }
        result.push(<span key={`space-${i}`} className="text-[var(--foreground)]">{spaces}</span>);
        continue;
      }

      // Mots-clés (const, let, var)
      const keywords = ["const", "let", "var"];
      let foundKeyword = false;
      for (const kw of keywords) {
        if (line.slice(i).startsWith(kw) && (i + kw.length >= line.length || !line[i + kw.length].match(/\w/))) {
          result.push(<span key={`kw-${i}`} className="text-[var(--syntax-keyword)]">{kw}</span>);
          i += kw.length;
          foundKeyword = true;
          break;
        }
      }
      if (foundKeyword) continue;

      // developer (nom de variable)
      if (line.slice(i).startsWith("developer")) {
        result.push(<span key={`dev-${i}`} className="text-[var(--syntax-variable)]">developer</span>);
        i += 9;
        continue;
      }

      // startProject (méthode)
      if (line.slice(i).startsWith("startProject")) {
        result.push(<span key={`method-${i}`} className="text-[var(--syntax-method)]">startProject</span>);
        i += 12;
        continue;
      }

      // Propriétés (avant les :)
      const props = ["name", "role", "stack", "passion", "frontend", "backend", "database", "mobile"];
      let foundProp = false;
      for (const prop of props) {
        if (line.slice(i).startsWith(prop) && line.slice(i + prop.length).match(/^:/)) {
          result.push(<span key={`prop-${i}`} className="text-[var(--syntax-property)]">{prop}</span>);
          i += prop.length;
          foundProp = true;
          break;
        }
      }
      if (foundProp) continue;

      // Strings entre guillemets
      if (line[i] === '"') {
        let str = '"';
        i++;
        while (i < line.length && line[i] !== '"') {
          str += line[i];
          i++;
        }
        if (i < line.length) {
          str += '"';
          i++;
        }
        result.push(<span key={`str-${i}`} className="text-[var(--syntax-string)]">{str}</span>);
        continue;
      }

      // Crochets et accolades
      if (line[i] === "[" || line[i] === "]") {
        result.push(<span key={`bracket-${i}`} className="text-[var(--syntax-bracket)]">{line[i]}</span>);
        i++;
        continue;
      }

      if (line[i] === "{" || line[i] === "}") {
        result.push(<span key={`brace-${i}`} className="text-[var(--foreground)]">{line[i]}</span>);
        i++;
        continue;
      }

      // Reste (ponctuation, etc.)
      result.push(<span key={`char-${i}`} className="text-[var(--foreground)]">{line[i]}</span>);
      i++;
    }

    return <>{result}</>;
  };

  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0">
      {/* Terminal window */}
      <div className="bg-[var(--terminal-bg)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--terminal-header)] border-b border-[var(--border)]">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <span className="ml-4 text-xs text-[var(--foreground-secondary)] font-mono">developer.ts</span>
        </div>

        {/* Command bar */}
        <div className="px-4 py-2 bg-[var(--terminal-header)]/50 border-b border-[var(--border)] font-mono text-xs">
          <span className="text-[var(--accent)]">$</span>
          <span className="text-[var(--foreground-secondary)]"> npx ts-node developer.ts</span>
        </div>

        {/* Terminal content */}
        <div className="p-4 font-mono text-sm leading-relaxed min-h-[300px]">
          {/* Code lines with line numbers */}
          <div className="flex">
            {/* Line numbers */}
            <div className="pr-4 text-right select-none border-r border-[var(--border)]/30 mr-4">
              {displayedLines.map((_, index) => (
                <div key={index} className="text-[var(--foreground-secondary)]/40 text-xs leading-relaxed">
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Code content */}
            <div className="flex-1 overflow-hidden">
              {displayedLines.map((line, index) => (
                <div key={index} className="whitespace-pre leading-relaxed">
                  {renderLine(line)}
                  {index === currentLineIndex && phase === "typing" && (
                    <span className="inline-block w-2 h-4 bg-[var(--accent)] ml-0.5 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Output section */}
          {outputLines.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--border)]/30">
              {outputLines.map((line, index) => (
                <div
                  key={index}
                  className={`leading-relaxed ${
                    line.includes("✓") ? "text-green-400" :
                    line.includes("🚀") ? "text-[var(--accent)]" :
                    "text-[var(--foreground-secondary)]"
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Final cursor */}
          {phase === "done" && (
            <div className="mt-2 flex items-center">
              <span className="text-[var(--accent)]">$</span>
              <span className="inline-block w-2 h-4 bg-[var(--accent)] ml-2 animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--accent)]/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-700" />
    </div>
  );
}

export default function Hero() {
  const t = useTranslations("hero");
  const { trackCTAClick, trackSocialClick } = useAnalytics();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-[var(--background-secondary)]" />

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Accent glows */}
      <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-[var(--accent)] rounded-full blur-[180px] opacity-[0.08]" />
      <div className="absolute bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px] opacity-[0.05]" />

      {/* Content */}
      <div className="relative z-10 section-container py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text content */}
          <div className="text-center lg:text-left">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--background-card)] border border-[var(--border)] mb-6">
              <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
              <span className="text-sm text-[var(--foreground-secondary)]">
                {t("available")}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4">
              Jean-Baptiste Renart
            </h1>

            {/* Role */}
            <p className="text-lg sm:text-xl lg:text-2xl text-[var(--foreground-secondary)] mb-6">
              {t("role")}{" "}
              <span className="text-[var(--accent)]">•</span>{" "}
              <span className="text-[var(--accent)] font-medium">JBR Development</span>
            </p>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl lg:text-3xl font-medium mb-8 leading-relaxed">
              {t("tagline")}{" "}
              <span className="gradient-text">{t("taglineHighlight")}</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-8">
              <SmoothScrollLink
                href="#contact"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-[var(--accent)] btn-primary-text rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent)]/25 hover:scale-105"
                onClick={() => trackCTAClick("hero_primary")}
              >
                <span className="relative z-10">{t("ctaPrimary")}</span>
                <div className="absolute inset-0 bg-[var(--accent-hover)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </SmoothScrollLink>

              <SmoothScrollLink
                href="#projets"
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold border border-[var(--border)] rounded-lg transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                onClick={() => trackCTAClick("hero_secondary")}
              >
                {t("ctaSecondary")}
                <svg
                  className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </SmoothScrollLink>
            </div>

            {/* Social links */}
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <a
                href="https://github.com/Jeeiib"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[var(--background-card)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
                aria-label="GitHub"
                onClick={() => trackSocialClick("github_hero")}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/jean-baptiste-renart-46b618153/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[var(--background-card)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
                aria-label="LinkedIn"
                onClick={() => trackSocialClick("linkedin_hero")}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right - Terminal animation */}
          <div>
            <AnimatedTerminal />
          </div>
        </div>
      </div>

      {/* Scroll indicator - hidden on mobile to avoid conflict with social links */}
      <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0-initial animate-fade-in delay-700">
        <SmoothScrollLink href="#projets" className="flex flex-col items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors">
          <span className="text-xs uppercase tracking-widest">{t("scroll")}</span>
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </SmoothScrollLink>
      </div>
    </section>
  );
}
