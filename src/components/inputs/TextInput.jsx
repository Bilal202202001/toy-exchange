"use client";

import { forwardRef } from "react";
import { fieldGapClass, fieldLabelClass, inputBaseClass } from "./shared";
import { useFieldId } from "./useFieldId";

/**
 * Single-line input. Default `type="text"`. Optional `prefix` (e.g. @) for leading adornment.
 */
const TextInput = forwardRef(function TextInput(
  {
    name,
    id: idProp,
    label,
    labelClassName,
    wrapperClassName,
    type = "text",
    prefix,
    value,
    defaultValue,
    onChange,
    onBlur,
    placeholder,
    disabled,
    readOnly,
    required,
    maxLength,
    minLength,
    pattern,
    autoComplete,
    autoFocus,
    inputMode,
    className = "",
    ariaLabel,
    ariaDescribedBy,
    ...rest
  },
  ref
) {
  const id = useFieldId(idProp);

  const inputProps = {
    ref,
    type,
    name,
    id,
    value,
    defaultValue,
    onChange,
    onBlur,
    placeholder,
    disabled,
    readOnly,
    required,
    maxLength,
    minLength,
    pattern,
    autoComplete,
    autoFocus,
    inputMode,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    ...rest,
  };

  const inputClassNoGap = `${inputBaseClass} ${prefix ? "pl-8" : ""} ${className}`.trim();

  if (prefix) {
    const block = (
      <div className={`relative w-full min-w-0 ${label ? fieldGapClass : ""}`.trim()}>
        <span
          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-slate-400"
          aria-hidden
        >
          {prefix}
        </span>
        <input {...inputProps} className={inputClassNoGap} />
      </div>
    );

    if (!label) return block;

    return (
      <div className={`w-full min-w-0 ${wrapperClassName ?? ""}`.trim()}>
        <label htmlFor={id} className={labelClassName ?? fieldLabelClass}>
          {label}
        </label>
        {block}
      </div>
    );
  }

  const inputClass = `${inputBaseClass} ${label ? fieldGapClass : ""} ${className}`.trim();
  const control = <input {...inputProps} className={inputClass} />;

  if (!label) return control;

  return (
    <div className={`w-full min-w-0 ${wrapperClassName ?? ""}`.trim()}>
      <label htmlFor={id} className={labelClassName ?? fieldLabelClass}>
        {label}
      </label>
      {control}
    </div>
  );
});

TextInput.displayName = "TextInput";

export default TextInput;
