"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import { adminRequest } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { DynamicSelect } from "./DynamicSelect";
import { ImageUploader } from "./ImageUploader";
import { getInitialState, sanitizeDynamicField } from "./form-helpers";
import type {
  AdminResourceManagerProps,
  FieldConfig,
  ResourceItem,
} from "./types";

export default function AdminResourceManager({
  resource,
  title,
  description,
  fields,
  allowCreate = true,
  layout = "grid",
}: AdminResourceManagerProps) {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [form, setForm] = useState<Record<string, any>>(() =>
    getInitialState(fields),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resourceData, setResourceData] = useState<Record<string, any[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const handleResourceLoaded = useCallback((resourceKey: string, loadedItems: any[]) => {
    setResourceData((current) => {
      if (current[resourceKey] === loadedItems) return current;
      return {
        ...current,
        [resourceKey]: loadedItems,
      };
    });
  }, []);

  const buttonLabel = useMemo(() => {
    if (editingId) return "Update Record";
    return allowCreate ? "Add Record" : "Save Changes";
  }, [allowCreate, editingId]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await adminRequest<{
        success: boolean;
        items: ResourceItem[];
      }>(`/api/admin/manage/${resource}`);
      setItems(data.items);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load records",
      );
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const resetForm = () => {
    setEditingId(null);
    setForm(getInitialState(fields));
  };

  const onChange =
    (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const val = event.target.value;
      setForm((current: Record<string, any>) => {
        const next = { ...current, [name]: val };

        // Auto-fill state when the city is selected from existing cities
        if (name === "city" && Array.isArray(resourceData.cities)) {
          const selectedCity = resourceData.cities.find(
            (city) => city.name === val || city.slug === val,
          );

          if (selectedCity) {
            next.state = selectedCity.state || next.state;
          }
        }

        // Handle auto-slug fields
        fields.forEach((field) => {
          if (field.autoSlugFrom === name) {
            const currentSlug = String(current[field.name] || "");
            const expectedSlug = String(current[name] || "")
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]+/g, "")
              .replace(/--+/g, "-")
              .replace(/^-+/, "")
              .replace(/-+$/, "");

            // Auto-update if slug is empty or was previously auto-generated from the old name
            if (!currentSlug || currentSlug === expectedSlug) {
              next[field.name] = val
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "")
                .replace(/--+/g, "-")
                .replace(/^-+/, "")
                .replace(/-+$/, "");
            }
          }
        });

        return next;
      });
    };

  useEffect(() => {
    if (!Array.isArray(resourceData.cities) || !form.city) return;

    const selectedCity = resourceData.cities.find(
      (city) => city.name === form.city || city.slug === form.city,
    );

    if (selectedCity && form.state !== selectedCity.state) {
      setForm((current) => ({
        ...current,
        state: selectedCity.state || current.state,
      }));
    }
  }, [resourceData.cities, form.city, form.state]);

  const onEdit = (item: ResourceItem) => {
    const nextState = getInitialState(fields);

    fields.forEach((field) => {
      const value = item[field.name];
      if (field.type === "dynamic-pairs") {
        nextState[field.name] = sanitizeDynamicField(field.name, value);
      } else {
        nextState[field.name] = Array.isArray(value)
          ? value.join(", ")
          : String(value ?? "");
      }
    });

    setEditingId(item._id);
    setForm(nextState);
  };

  const renderDynamicField = (field: FieldConfig) => {
    const currentItems: any[] = form[field.name] || [];

    if (field.name === "courses") {
      return (
        <div className="space-y-3">
          {currentItems.map((pair: any, index: number) => (
            <div
              key={`course-${index}`}
              className="flex items-center gap-3 rounded-3xl border border-border/60 bg-background/70 p-4"
            >
              <Input
                placeholder={`Course ${index + 1} - MCA, BCA, MBA`}
                value={pair || ""}
                onChange={(e) => {
                  const next = [...form[field.name]];
                  next[index] = e.target.value;
                  setForm({ ...form, [field.name]: next });
                }}
                className="h-11 flex-1 rounded-2xl border-border/50 bg-background"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-border/60 text-muted-foreground hover:text-red-500"
                onClick={() => {
                  const next = form[field.name].filter(
                    (_: any, i: number) => i !== index,
                  );
                  setForm({ ...form, [field.name]: next });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      );
    }

    if (field.name === "__legacy_courses__") {
      return (
        <div className="space-y-3">
          {currentItems.map((pair: any, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <Input
                placeholder={`Course ${index + 1} — MAC, BCA, MBA`}
                value={pair.label || ""}
                onChange={(e) => {
                  const next = [...form[field.name]];
                  next[index].label = e.target.value;
                  setForm({ ...form, [field.name]: next });
                }}
                className="h-11 flex-1 rounded-2xl border-border/50 bg-background"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-border/60 text-muted-foreground hover:text-red-500"
                onClick={() => {
                  const next = form[field.name].filter(
                    (_: any, i: number) => i !== index,
                  );
                  setForm({ ...form, [field.name]: next });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      );
    }

    return currentItems.map((pair: any, index: number) => (
      <div
        key={index}
        className="group relative grid gap-4 rounded-3xl border border-border/60 bg-background/50 p-4 sm:p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              {field.name === "faqs" ? "Question" : "Key"}
            </label>
            <Input
              placeholder={
                field.name === "faqs" ? "Enter question" : "Enter label"
              }
              value={pair.question || pair.label || ""}
              onChange={(e) => {
                const next = [...form[field.name]];
                if (field.name === "faqs") {
                  next[index].question = e.target.value;
                } else {
                  next[index].label = e.target.value;
                }
                setForm({ ...form, [field.name]: next });
              }}
              className="h-11 rounded-2xl border-border/50 bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              {field.name === "faqs" ? "Answer" : "Value"}
            </label>
            <Input
              placeholder={
                field.name === "faqs" ? "Enter answer" : "Enter details"
              }
              value={pair.answer || pair.value || ""}
              onChange={(e) => {
                const next = [...form[field.name]];
                if (field.name === "faqs") {
                  next[index].answer = e.target.value;
                } else {
                  next[index].value = e.target.value;
                }
                setForm({ ...form, [field.name]: next });
              }}
              className="h-11 rounded-2xl border-border/50 bg-background"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-8 w-8 rounded-full border border-border/60 bg-background text-muted-foreground opacity-0 shadow-sm transition-all hover:text-red-500 group-hover:opacity-100"
          onClick={() => {
            const next = form[field.name].filter(
              (_: any, i: number) => i !== index,
            );
            setForm({ ...form, [field.name]: next });
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    ));
  };

  const onDelete = async (id: string) => {
    setError("");

    try {
      await adminRequest(`/api/admin/manage/${resource}/${id}`, {
        method: "DELETE",
      });
      setItems((current: ResourceItem[]) =>
        current.filter((item: ResourceItem) => item._id !== id),
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Delete failed",
      );
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const path = editingId
        ? `/api/admin/manage/${resource}/${editingId}`
        : `/api/admin/manage/${resource}`;

      if (!allowCreate && !editingId) {
        throw new Error("Only existing records can be updated here");
      }

      const payload = fields.reduce<Record<string, any>>((accumulator, field) => {
        if (field.type === "dynamic-pairs") {
          accumulator[field.name] = sanitizeDynamicField(
            field.name,
            form[field.name],
          );
          return accumulator;
        }

        accumulator[field.name] = form[field.name];
        return accumulator;
      }, {});

      const response = await adminRequest<{
        success: boolean;
        item: ResourceItem;
      }>(path, {
        method,
        body: JSON.stringify(payload),
      });

      if (editingId) {
        setItems((current: ResourceItem[]) =>
          current.map((item: ResourceItem) =>
            item._id === editingId ? response.item : item,
          ),
        );
      } else {
        setItems((current: ResourceItem[]) => [response.item, ...current]);
      }

      resetForm();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Save failed",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const imageFieldName = fields.find(
    (field) =>
      field.name === "image" ||
      field.name === "imageUrl" ||
      field.name === "profileImage",
  )?.name;

  const summaryFields = fields
    .filter((field) => field.name !== imageFieldName)
    .slice(0, 2);

  const dynamicFields = fields.filter(
    (field) => field.type === "dynamic-pairs",
  );

  const remainingFields = fields.filter(
    (field) =>
      !summaryFields.some((summary) => summary.name === field.name) &&
      field.name !== imageFieldName &&
      field.type !== "dynamic-pairs",
  );

  const filteredItems = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) =>
      fields.some((field) => {
        const value = item[field.name];

        if (Array.isArray(value)) {
          return value.some((entry) => {
            if (typeof entry === "string") {
              return entry.toLowerCase().includes(query);
            }

            if (entry && typeof entry === "object") {
              return Object.values(entry).some((nestedValue) =>
                String(nestedValue ?? "").toLowerCase().includes(query),
              );
            }

            return false;
          });
        }

        return String(value ?? "").toLowerCase().includes(query);
      }),
    );
  }, [deferredSearchQuery, fields, items]);

  const renderInstitutionCards = () => (
    <div className="grid gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-3">
      {filteredItems.map((item) => (
        <div
          key={item._id}
          className="overflow-hidden rounded-3xl border border-border/70 bg-background/95 shadow-sm"
        >
          <div className="h-44 w-full overflow-hidden bg-slate-950">
            {imageFieldName && item[imageFieldName] ? (
              <img
                src={String(item[imageFieldName])}
                alt={String(item.name ?? "Institution")}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="space-y-4 p-4">
            <div className="space-y-1">
              <p className="line-clamp-2 text-base font-semibold text-foreground">
                {String(item.name || "-")}
              </p>
              <p className="text-sm text-muted-foreground">
                {String(item.city || "-")}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-2xl"
                onClick={() => onEdit(item)}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-2xl border-red-500/30 text-red-600 hover:bg-red-500/10 dark:text-red-300"
                onClick={() => onDelete(item._id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={
        layout === "flex-col"
          ? "flex flex-col gap-6"
          : "grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] min-w-0"
      }
    >
      <Card className="rounded-[2rem] border border-border/70 bg-background/95 py-0 shadow-sm min-w-0">
        <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
          <form onSubmit={onSubmit} className="grid gap-4">
            {fields
              .filter((field) => field.type !== "dynamic-pairs")
              .map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {field.label}
                  </label>
                  {field.type === "image" ? (
                    <ImageUploader
                      value={form[field.name] ?? ""}
                      onChange={(url) =>
                        setForm({ ...form, [field.name]: url })
                      }
                      placeholder={field.placeholder}
                    />
                  ) : field.type === "select" ? (
                    <DynamicSelect
                      value={form[field.name] ?? ""}
                      onChange={(val) =>
                        onChange(field.name)({
                          target: { value: val },
                        } as ChangeEvent<HTMLInputElement>)
                      }
                      placeholder={field.placeholder}
                      options={field.options}
                      fetchResource={field.fetchResource}
                      onResourceLoaded={handleResourceLoaded}
                    />
                  ) : field.type === "textarea" ? (
                    <Textarea
                      value={form[field.name] ?? ""}
                      onChange={(e: any) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                      placeholder={field.placeholder}
                      className="min-h-30 rounded-2xl border-border/70 bg-background"
                    />
                  ) : (
                    <Input
                      type={field.type || "text"}
                      value={form[field.name] ?? ""}
                      onChange={onChange(field.name)}
                      placeholder={field.placeholder}
                      className="h-11 rounded-2xl border-border/70 bg-background"
                    />
                  )}
                </div>
              ))}

            {dynamicFields.map((field) => (
              <div
                key={field.name}
                className="mt-4 space-y-6 rounded-[2rem] border border-border/70 bg-muted/10 p-6 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold tracking-wider text-cyan-600 uppercase dark:text-cyan-300">
                    {field.label}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-xl border-cyan-300/50 bg-cyan-300/10 text-cyan-600 dark:text-cyan-300"
                    onClick={() => {
                      const current = [...(form[field.name] || [])];
                      setForm({
                        ...form,
                        [field.name]: [
                          ...current,
                          field.name === "courses"
                            ? ""
                            : { label: "", value: "" },
                        ],
                      });
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add More
                  </Button>
                </div>

                <div className="space-y-4">{renderDynamicField(field)}</div>

                {(form[field.name] || []).length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 py-10 text-center">
                    <Plus className="h-8 w-8 text-muted-foreground/30" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      No {field.label} added yet. Click the button above to
                      start.
                    </p>
                  </div>
                )}
              </div>
            ))}

            {error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-200">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                className="h-11 flex-1 rounded-2xl"
                disabled={submitting}
              >
                <Plus className="h-4 w-4" />
                {submitting ? "Saving..." : buttonLabel}
              </Button>

              {editingId ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-2xl"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border border-border/70 bg-background/95 py-0 shadow-sm">
        <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
          <CardTitle className="text-2xl">All Records</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Manage existing {resource} entries from the admin panel.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 px-6 pb-6 sm:px-8 sm:pb-8">
          {loading ? (
            <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-4 text-sm text-muted-foreground">
              Loading records...
            </div>
          ) : null}

          {!loading && items.length === 0 ? (
            <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-4 text-sm text-muted-foreground">
              No records found yet.
            </div>
          ) : null}

          {!loading && items.length > 0 ? (
            <div>
              <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold">
                  Showing <strong>{filteredItems.length}</strong> of{" "}
                  <strong>{items.length}</strong> {resource}
                </p>
                <div className="relative w-full sm:max-w-sm">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={`Search ${resource}...`}
                    className="h-10 rounded-2xl border-border/70 bg-background pl-9"
                  />
                </div>
              </div>

              {resource === "institutions" ? (
                renderInstitutionCards()
              ) : (
                <div className="overflow-y-auto pr-2 pt-4">
                  <div className="">
                    {filteredItems.map((item) => (
                      <div
                        key={item._id}
                        className="rounded-3xl border border-border/70 bg-muted/20 p-4 min-w-0"
                      >
                        {resource === "users" ? (
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border/50 bg-slate-950">
                              <img
                                src={String(item.profileImage || "")}
                                alt={String(item.name || "User")}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex min-w-0 flex-1 items-center gap-4">
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-foreground">
                                  {item.name || "No Name"}
                                </p>
                              </div>
                              <div className="hidden min-w-0 flex-1 flex-col sm:flex">
                                <p className="truncate text-xs text-muted-foreground">
                                  {item.email}
                                </p>
                              </div>
                              <div className="hidden text-right sm:block w-24">
                                <p className="truncate text-[10px] font-mono text-muted-foreground/40 uppercase">
                                  {String(item.googleId || "-")}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-full p-0 hover:bg-cyan-500/10 hover:text-cyan-600"
                                onClick={() => onEdit(item)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-full p-0 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                                onClick={() => onDelete(item._id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid gap-3">
                            {imageFieldName && item[imageFieldName] ? (
                              <div className="flex flex-col gap-3 rounded-3xl border border-border/70 bg-background/95 p-3 sm:flex-row sm:items-center">
                                <div className="h-20 w-full overflow-hidden border border-border/50 bg-slate-950 sm:h-20 sm:w-20 rounded-3xl">
                                  <img
                                    src={String(item[imageFieldName])}
                                    alt={String(item.name ?? resource)}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex flex-1 flex-wrap gap-2 text-sm font-semibold text-foreground">
                                  {summaryFields
                                    .filter((field) => !field.hideInCard)
                                    .map((field) => (
                                      <span
                                        key={field.name}
                                        className="flex-1 min-w-0 wrap-break-word"
                                      >
                                        {field.label}:{" "}
                                        {String(item[field.name] ?? "-")}
                                      </span>
                                    ))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-3 text-sm font-semibold text-foreground">
                                {summaryFields
                                  .filter((field) => !field.hideInCard)
                                  .map((field) => (
                                    <span
                                      key={field.name}
                                      className="flex-1 min-w-0 wrap-break-word"
                                    >
                                      {field.label}:{" "}
                                      {String(item[field.name] ?? "-")}
                                    </span>
                                  ))}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2 text-sm text-foreground">
                              {remainingFields
                                .filter((field) => !field.hideInCard)
                                .map((field) => (
                                  <span
                                    key={field.name}
                                    className="flex-1 min-w-0 wrap-break-word rounded-2xl bg-background/80 px-3 py-2"
                                  >
                                    {field.label}:{" "}
                                    {Array.isArray(item[field.name])
                                      ? (item[field.name] as string[]).join(", ")
                                      : String(item[field.name] ?? "-")}
                                  </span>
                                ))}
                            </div>

                            {dynamicFields.map((field) =>
                              item[field.name] && item[field.name].length > 0 ? (
                                <div
                                  key={field.name}
                                  className="mt-2 space-y-3 rounded-2xl border border-border/70 bg-background/80 p-4"
                                >
                                  <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    {field.label}
                                  </p>
                                  <div className="space-y-3">
                                    {item[field.name].map(
                                      (pair: any, index: number) => (
                                        <div
                                          key={index}
                                          className="space-y-1 border-l-2 border-cyan-500/30 pl-3"
                                        >
                                          <p className="text-sm font-bold text-foreground">
                                            <span className="text-cyan-600 dark:text-cyan-300">
                                              {pair.question || pair.label ? (
                                                <>
                                                  {pair.question || pair.label}:
                                                </>
                                              ) : (
                                                "Entry:"
                                              )}
                                            </span>{" "}
                                          </p>
                                          <p className="text-sm leading-6 text-foreground">
                                            <span className="font-bold text-cyan-600 dark:text-cyan-300">
                                              -
                                            </span>{" "}
                                            {pair.answer || pair.value}
                                          </p>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              ) : null,
                            )}

                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-2xl"
                                onClick={() => onEdit(item)}
                              >
                                <Pencil className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-2xl border-red-500/30 text-red-600 hover:bg-red-500/10 dark:text-red-300"
                                onClick={() => onDelete(item._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredItems.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-border/70 bg-muted/20 px-4 py-4 text-sm text-muted-foreground">
                  No matching records found.
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
