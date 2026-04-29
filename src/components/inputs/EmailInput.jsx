"use client";

import { forwardRef } from "react";
import { fieldGapClass, fieldLabelClass, inputBaseClass } from "./shared";
import { useFieldId } from "./useFieldId";

const EmailInput = forwardRef(function EmailInput(
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
    maxLength,
    minLength,
    autoComplete = "email",
    multiple,
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
    <input
      ref={ref}
      type="email"
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
      maxLength={maxLength}
      minLength={minLength}
      autoComplete={autoComplete}
      multiple={multiple}
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

EmailInput.displayName = "EmailInput";

export default EmailInput;
