"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { type BriefFile, LIMITS, ALLOWED_FILE_TYPES } from "@/data/briefTypes";

interface FileUploadProps {
  files: BriefFile[];
  onUpload: (file: BriefFile) => void;
  onRemove: (url: string) => void;
  maxFiles: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string): string {
  if (type === "application/pdf") return "PDF";
  if (type.startsWith("image/")) return "IMG";
  return "FILE";
}

export default function FileUpload({
  files,
  onUpload,
  onRemove,
  maxFiles,
}: FileUploadProps) {
  const t = useTranslations("brief.ui.upload");
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const canUpload = files.length < maxFiles;

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number])) {
      return t("errorUnsupportedType", { type: file.type || "unknown" });
    }
    if (file.size > LIMITS.fileMaxSize) {
      return t("errorTooLarge", { size: formatFileSize(file.size), maxSize: formatFileSize(LIMITS.fileMaxSize) });
    }
    return null;
  };

  const uploadFile = useCallback(
    async (file: File) => {
      if (!canUpload) return;

      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      setUploadError(null);
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/brief/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();

        onUpload({
          url: data.url,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      } catch {
        setUploadError(t("errorUploadFailed"));
      } finally {
        setIsUploading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canUpload, onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        uploadFile(droppedFile);
      }
    },
    [uploadFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        uploadFile(selectedFile);
      }
      // Reset input so the same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [uploadFile]
  );

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {canUpload && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          aria-label={t("dropzoneLabel")}
          className={`
            relative flex flex-col items-center justify-center
            w-full py-8 px-4 rounded-xl cursor-pointer
            border-2 border-dashed transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40
            ${isUploading
              ? "border-[var(--accent)]/50 bg-[var(--accent)]/5 cursor-wait"
              : isDragActive
                ? "border-[var(--accent)] bg-[var(--accent)]/10 scale-[1.01]"
                : "border-[var(--border)] bg-[var(--background-secondary)]/50 hover:border-[var(--accent)]/50 hover:bg-[var(--background-secondary)]"
            }
          `}
        >
          {isUploading ? (
            <>
              <svg
                className="w-8 h-8 text-[var(--accent)] animate-spin mb-2"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm text-[var(--foreground-secondary)]">
                {t("uploading")}
              </span>
            </>
          ) : (
            <>
              {/* Upload icon */}
              <svg
                className={`w-8 h-8 mb-2 transition-colors duration-200 ${
                  isDragActive
                    ? "text-[var(--accent)]"
                    : "text-[var(--foreground-secondary)]/50"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 4.502 4.502 0 013.516 5.855A3.75 3.75 0 0118 19.5H6.75z"
                />
              </svg>
              <p className="text-sm text-[var(--foreground-secondary)]">
                <span className="text-[var(--accent)] font-medium">{t("clickToBrowse")}</span>
                {" "}{t("orDragDrop")}
              </p>
              <p className="text-xs text-[var(--foreground-secondary)]/50 mt-1">
                {t("formats", { maxSize: formatFileSize(LIMITS.fileMaxSize) })}
              </p>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            onChange={handleFileSelect}
            accept={ALLOWED_FILE_TYPES.join(",")}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <p role="alert" className="text-sm text-red-400/90 animate-fade-in">
          {uploadError}
        </p>
      )}

      {/* File count */}
      <p className="text-xs text-[var(--foreground-secondary)]/60">
        {t("fileCount", { count: files.length, max: maxFiles })}
      </p>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.url}
              className="
                flex items-center gap-3 px-4 py-3 rounded-lg
                bg-[var(--background-secondary)] border border-[var(--border)]
                transition-all duration-200 hover:border-[var(--foreground-secondary)]/20
                animate-fade-in
              "
            >
              {/* Type badge */}
              <span
                className="
                  flex-shrink-0 px-2 py-1 rounded text-[0.65rem] font-bold uppercase tracking-wider
                  bg-[var(--accent)]/10 text-[var(--accent)]
                "
              >
                {getFileIcon(file.type)}
              </span>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--foreground)] truncate">{file.name}</p>
                <p className="text-xs text-[var(--foreground-secondary)]/60">
                  {formatFileSize(file.size)}
                </p>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(file.url)}
                aria-label={t("removeFile", { name: file.name })}
                className="
                  flex-shrink-0 p-1.5 rounded-lg
                  text-[var(--foreground-secondary)]/60
                  hover:text-red-400 hover:bg-red-400/10
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-red-400/30
                "
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
