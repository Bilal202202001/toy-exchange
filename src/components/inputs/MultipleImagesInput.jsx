"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { fieldLabelClass, fileDropBaseClass } from "./shared";
import { useFieldId } from "./useFieldId";

/**
 * Multiple image files with previews and a configurable max count. Width follows parent.
 *
 * @param {object} props
 * @param {string} [props.name]
 * @param {string} [props.id]
 * @param {function(File[]): void} props.onFilesChange — full list after each change
 * @param {number} [props.maxFiles] — max number of images (default 8)
 * @param {number} [props.maxSizeBytes] — per-file limit; oversized files are skipped
 * @param {boolean} [props.disabled]
 * @param {string} [props.accept] — default "image/*"
 * @param {string} [props.className]
 * @param {string} [props.dropClassName]
 * @param {string} [props.ariaLabel]
 * @param {string} [props.ariaDescribedBy]
 * @param {string} [props.label] — optional visible label (use with `id` or auto id)
 * @param {string} [props.labelClassName]
 * @param {string} [props.wrapperClassName]
 * @param {'default'|'compact'} [props.variant] — `compact` = inline thumbnails + small Add chip (e.g. add-toy form)
 */
export default function MultipleImagesInput({
  name,
  id: idProp,
  label,
  labelClassName,
  wrapperClassName,
  onFilesChange,
  maxFiles = 8,
  maxSizeBytes,
  disabled,
  accept = "image/*",
  className = "",
  dropClassName = "",
  ariaLabel = "Upload images",
  ariaDescribedBy,
  variant = "default",
}) {
  const id = useFieldId(idProp);
  const inputRef = useRef(null);
  const itemsRef = useRef([]);
  const [items, setItems] = useState([]);

  itemsRef.current = items;

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((it) => {
        if (it.url?.startsWith("blob:")) URL.revokeObjectURL(it.url);
      });
    };
  }, []);

  const addFiles = useCallback(
    (fileList) => {
      const incoming = Array.from(fileList ?? []);
      if (incoming.length === 0) return;

      const prev = itemsRef.current;
      const next = [...prev];
      for (const file of incoming) {
        if (next.length >= maxFiles) break;
        if (maxSizeBytes != null && file.size > maxSizeBytes) continue;
        const url = URL.createObjectURL(file);
        next.push({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
          file,
          url,
        });
      }
      setItems(next);
      onFilesChange?.(next.map((x) => x.file));
      if (inputRef.current) inputRef.current.value = "";
    },
    [maxFiles, maxSizeBytes, onFilesChange]
  );

  const removeAt = useCallback((index) => {
    const prev = itemsRef.current;
    const row = prev[index];
    if (row?.url?.startsWith("blob:")) URL.revokeObjectURL(row.url);
    const next = prev.filter((_, i) => i !== index);
    setItems(next);
    onFilesChange?.(next.map((x) => x.file));
  }, [onFilesChange]);

  const atLimit = items.length >= maxFiles;

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      id={id}
      name={name}
      accept={accept}
      multiple
      disabled={disabled || atLimit}
      className="sr-only"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      onChange={(e) => addFiles(e.target.files)}
    />
  );

  const thumbClassCompact =
    "relative h-16 w-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 sm:h-[4.5rem] sm:w-24";

  const labelEl =
    label != null && label !== "" ? (
      <label htmlFor={id} className={labelClassName ?? fieldLabelClass}>
        {label}
      </label>
    ) : null;

  if (variant === "compact") {
    return (
      <div className={`w-full min-w-0 ${wrapperClassName ?? ""} ${className}`.trim()}>
        {labelEl}
        {fileInput}
        <div className="mt-1.5 flex flex-wrap gap-2">
          {items.map((it, index) => (
            <div key={it.id} className={thumbClassCompact}>
              <Image
                src={it.url}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="96px"
              />
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeAt(index)}
                className="absolute right-0.5 top-0.5 flex h-6 w-6 items-center justify-center rounded bg-slate-900/70 text-white hover:bg-slate-900"
                aria-label={`Remove photo ${index + 1}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {!atLimit && (
            <label
              htmlFor={id}
              className={`flex h-16 w-[4.5rem] shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:border-[#00C4D9]/60 hover:bg-[#e0f7fa]/40 sm:h-[4.5rem] sm:w-24 ${dropClassName} ${
                disabled ? "pointer-events-none opacity-60" : ""
              }`.trim()}
            >
              <Upload className="h-4 w-4" aria-hidden />
              <span className="text-[10px] font-medium leading-none">Add</span>
            </label>
          )}
        </div>
        {atLimit && items.length > 0 && (
          <p className="mt-2 text-center text-xs text-slate-500">Maximum {maxFiles} images.</p>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full min-w-0 space-y-3 ${wrapperClassName ?? ""} ${className}`.trim()}>
      {labelEl}
      {fileInput}

      {!atLimit && (
        <label
          htmlFor={id}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 ${fileDropBaseClass} ${dropClassName} ${
            disabled ? "pointer-events-none opacity-60" : ""
          }`.trim()}
        >
          <Upload className="h-8 w-8 text-[#00C4D9]" aria-hidden />
          <span className="text-center text-sm font-medium text-slate-600">
            Add images (up to {maxFiles})
          </span>
          <span className="text-xs text-slate-400">{accept}</span>
        </label>
      )}

      {items.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {items.map((it, index) => (
            <li
              key={it.id}
              className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <Image
                src={it.url}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="120px"
              />
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeAt(index)}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-md bg-slate-900/70 text-white hover:bg-slate-900 disabled:opacity-50"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {atLimit && items.length > 0 && (
        <p className="text-center text-xs text-slate-500">Maximum {maxFiles} images reached.</p>
      )}
    </div>
  );
}
