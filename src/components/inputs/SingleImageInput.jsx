"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Upload, X } from "lucide-react";
import { fieldGapClass, fieldLabelClass, fileDropBaseClass } from "./shared";
import { useFieldId } from "./useFieldId";

/**
 * Single image file picker with optional preview. Optional `label` renders the field label.
 * Use `variant="avatar"` for circular profile-style uploads; optional `remotePreviewUrl` for
 * an existing image (e.g. saved profile) when no new file is selected.
 */
export default function SingleImageInput({
  name,
  id: idProp,
  label,
  labelClassName,
  wrapperClassName,
  onFileChange,
  disabled,
  required,
  accept = "image/*",
  maxSizeBytes,
  className = "",
  dropClassName = "",
  ariaLabel = "Upload image",
  ariaDescribedBy,
  variant = "default",
  remotePreviewUrl,
  avatarFallback,
  hint,
}) {
  const id = useFieldId(idProp);
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);

  const displayUrl = previewUrl ?? remotePreviewUrl ?? null;
  const hasPreview = Boolean(displayUrl);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFiles = useCallback(
    (list) => {
      const nextFile = list?.[0] ?? null;
      if (!nextFile) {
        setPreviewUrl((prev) => {
          if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
          return null;
        });
        setFile(null);
        onFileChange?.(null);
        return;
      }
      if (maxSizeBytes != null && nextFile.size > maxSizeBytes) {
        setPreviewUrl((prev) => {
          if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
          return null;
        });
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      setPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return URL.createObjectURL(nextFile);
      });
      setFile(nextFile);
      onFileChange?.(nextFile);
    },
    [maxSizeBytes, onFileChange]
  );

  const clear = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    onFileChange?.(null);
  }, [onFileChange]);

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const labelEl =
    label != null && label !== "" ? (
      <label htmlFor={id} className={labelClassName ?? fieldLabelClass}>
        {label}
      </label>
    ) : null;

  const imgUnoptimized =
    typeof displayUrl === "string" &&
    (displayUrl.startsWith("blob:") || displayUrl.startsWith("data:"));

  const defaultPreview = (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <div className="relative aspect-video w-full max-h-48">
        <Image
          src={displayUrl}
          alt=""
          fill
          unoptimized={imgUnoptimized}
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={clear}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/70 text-white hover:bg-slate-900 disabled:opacity-50"
        aria-label="Remove image"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  const defaultEmpty = (
    <label
      htmlFor={id}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 ${fileDropBaseClass} ${dropClassName} ${
        disabled ? "pointer-events-none opacity-60" : ""
      }`.trim()}
    >
      <Upload className="h-8 w-8 text-[#00C4D9]" aria-hidden />
      <span className="text-center text-sm font-medium text-slate-600">
        Click or tap to choose an image
      </span>
      <span className="text-xs text-slate-400">One file · {accept}</span>
    </label>
  );

  const avatarPreview = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-[#e0f7fa] bg-slate-100 shadow-md">
        <Image
          src={displayUrl}
          alt=""
          fill
          unoptimized={imgUnoptimized}
          className="object-cover"
          sizes="96px"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={clear}
          className="absolute right-0.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white hover:bg-slate-900 disabled:opacity-50"
          aria-label="Remove photo"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={openPicker}
        className="text-sm font-semibold text-[#00C4D9] transition-colors hover:text-[#00ACC1] disabled:opacity-50"
      >
        Change photo
      </button>
    </div>
  );

  const fallbackText =
    typeof avatarFallback === "string" && avatarFallback.trim()
      ? avatarFallback.trim().slice(0, 2).toUpperCase()
      : null;

  const avatarEmpty = (
    <label
      htmlFor={id}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 transition-colors hover:border-[#00C4D9]/60 hover:bg-[#e0f7fa]/30 ${
        disabled ? "pointer-events-none opacity-60" : ""
      } ${dropClassName}`.trim()}
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-[#80deea] to-[#00C4D9] shadow-md">
        {fallbackText ? (
          <span className="text-2xl font-bold text-white">{fallbackText}</span>
        ) : (
          <Camera className="h-9 w-9 text-white" aria-hidden />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-800">Tap to upload</p>
        <p className="mt-1 text-xs text-slate-500">
          {hint ?? `JPG or PNG${maxSizeBytes ? ` · max ${Math.round(maxSizeBytes / (1024 * 1024))} MB` : ""}`}
        </p>
      </div>
    </label>
  );

  let control;
  if (variant === "avatar") {
    control = hasPreview ? avatarPreview : avatarEmpty;
  } else {
    control = hasPreview ? defaultPreview : defaultEmpty;
  }

  return (
    <div className={`w-full min-w-0 ${wrapperClassName ?? ""} ${className}`.trim()}>
      {labelEl}
      <input
        ref={inputRef}
        type="file"
        id={id}
        name={name}
        accept={accept}
        disabled={disabled}
        required={required}
        className="sr-only"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {label ? <div className={fieldGapClass}>{control}</div> : control}
    </div>
  );
}
