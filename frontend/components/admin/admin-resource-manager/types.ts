/* eslint-disable @typescript-eslint/no-explicit-any */

export type FieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "number" | "dynamic-pairs" | "textarea" | "image" | "select";
  options?: { label: string; value: string }[];
  fetchResource?: string;
  autoSlugFrom?: string;
  hideInCard?: boolean;
};

export type AdminResourceManagerProps = {
  resource: "users" | "cities" | "exams" | "institutions" | "categories";
  title: string;
  description: string;
  fields: FieldConfig[];
  allowCreate?: boolean;
  layout?: "grid" | "flex-col";
};

export type ResourceItem = Record<string, any> & {
  _id: string;
};
