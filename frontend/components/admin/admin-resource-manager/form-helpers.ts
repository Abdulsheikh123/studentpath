/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FieldConfig } from "./types";

export function getInitialState(fields: FieldConfig[]) {
  return fields.reduce<Record<string, any>>((accumulator, field) => {
    accumulator[field.name] = field.type === "dynamic-pairs" ? [] : "";
    return accumulator;
  }, {});
}

export function normalizeCourseEntry(entry: any) {
  if (typeof entry === "string") {
    return entry.trim();
  }

  return String(entry?.label || entry?.value || "").trim();
}

export function sanitizeDynamicField(fieldName: string, value: any) {
  if (!Array.isArray(value)) return [];

  if (fieldName === "courses") {
    return value.map(normalizeCourseEntry).filter(Boolean);
  }

  if (fieldName === "faqs") {
    return value
      .map((item) => ({
        question: String(item?.question || "").trim(),
        answer: String(item?.answer || "").trim(),
      }))
      .filter((item) => item.question || item.answer);
  }

  return value
    .map((item) => ({
      label: String(item?.label || "").trim(),
      value: String(item?.value || "").trim(),
    }))
    .filter((item) => item.label || item.value);
}
