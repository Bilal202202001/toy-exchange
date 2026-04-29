"use client";

import { forwardRef } from "react";
import { fieldGapClass, fieldLabelClass, inputBaseClass } from "./shared";
import { useFieldId } from "./useFieldId";

const TextareaInput = forwardRef(function TextareaInput(
  {
    name,
    id: idProp,
    label,
    labelClassName,
    wrapperClassName,
    value,
    defaultValue,
    onChange,
    onBlur,
    placeholder,
    disabled,
    readOnly,
    required,
    rows = 3,
    maxLength,
    minLength,
    autoComplete,
    className = "",
    ariaLabel,
    ariaDescribedBy,
    ...rest
  },
  ref
) {
  const id = useFieldId(idProp);
  const inputClass = `${inputBaseClass} ${label ? fieldGapClass : ""} ${className}`.trim();

  const control = (
    <textarea
      ref={ref}
      name={name}
      id={id}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      rows={rows}
      maxLength={maxLength}
      minLength={minLength}
      autoComplete={autoComplete}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={inputClass}
      {...rest}
    />
  );

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

TextareaInput.displayName = "TextareaInput";

export default TextareaInput;
