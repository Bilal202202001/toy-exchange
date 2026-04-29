"use client";

import { useId } from "react";

/** Stable id for label `htmlFor` when `id` prop is omitted. */
export function useFieldId(idProp) {
  const reactId = useId();
  return idProp ?? `field-${reactId.replace(/:/g, "")}`;
}
