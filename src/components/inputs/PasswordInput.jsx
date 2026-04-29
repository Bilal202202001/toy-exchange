"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { fieldGapClass, fieldLabelClass, inputBaseClass } from "./shared";
import { useFieldId } from "./useFieldId";

const PasswordInput = forwardRef(function PasswordInput(
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
    minLength,
    maxLength,
    autoComplete = "current-password",
    showToggle = true,
    className = "",
    innerWrapperClassName = "",
    ariaLabel,
    ariaDescribedBy,
    ...rest
  },
  ref
) {
  const id = useFieldId(idProp);
  const [visible, setVisible] = useState(false);
  const inputClass = `${inputBaseClass} ${showToggle ? "pr-11" : ""} ${label ? fieldGapClass : ""} ${className}`.trim();

  const inner = (
    <div className={`relative w-full min-w-0 ${innerWrapperClassName}`.trim()}>
      <input
        ref={ref}
        type={visible ? "text" : "password"}
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
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={inputClass}
        {...rest}
      />
      {showToggle && (
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:pointer-events-none"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );

  if (!label) return inner;

  return (
    <div className={`w-full min-w-0 ${wrapperClassName ?? ""}`.trim()}>
      <label htmlFor={id} className={labelClassName ?? fieldLabelClass}>
        {label}
      </label>
      {inner}
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
