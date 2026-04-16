"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Loader2, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";

import AdminPanelShell from "@/components/admin/AdminPanelShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminRequest, buildAdminUrl, getListData } from "@/lib/admin-api";
import { getAdminModuleConfig } from "@/lib/admin-modules";
import { optionSources } from "@/lib/admin-option-sources";
import type { AdminOption, OptionSourceKey } from "@/lib/admin-types";

function toInputDate(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function buildEmptyForm(moduleKey: string) {
  const config = getAdminModuleConfig(moduleKey);
  const nextForm: Record<string, string | boolean> = {};

  config?.fields?.forEach((field) => {
    nextForm[field.name] = field.type === "boolean" ? false : "";
  });

  return nextForm;
}

export default function AdminModulePage({ moduleKey }: { moduleKey: string }) {
  const searchParams = useSearchParams();
  const config = useMemo(() => getAdminModuleConfig(moduleKey), [moduleKey]);
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<Record<string, AdminOption[]>>({});
  const [form, setForm] = useState<Record<string, string | boolean>>(() =>
    buildEmptyForm(moduleKey),
  );
  const [editingItem, setEditingItem] = useState<Record<string, any> | null>(
    null,
  );
  const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(
    null,
  );
  const [formOpen, setFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!config?.filters) return;

    const nextFilters: Record<string, string> = {};

    config.filters.forEach((filter) => {
      const paramValue = searchParams.get(filter.name);
      if (paramValue) {
        nextFilters[filter.name] = paramValue;
      }
    });

    setFilters((current) => {
      const currentKeys = Object.keys(current);
      const nextKeys = Object.keys(nextFilters);
      if (
        currentKeys.length === nextKeys.length &&
        nextKeys.every((key) => current[key] === nextFilters[key])
      ) {
        return current;
      }
      return nextFilters;
    });
  }, [config?.filters, searchParams]);

  useEffect(() => {
    if (!config) return;

    let active = true;

    const loadItems = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await adminRequest<{
          success: boolean;
          data?: Record<string, any>[];
          items?: Record<string, any>[];
        }>(config.listPath || config.endpoint);

        if (!active) return;
        setItems(getListData(response));
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load data",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const loadOptions = async () => {
      const keys = new Set<OptionSourceKey>();

      config.fields?.forEach((field) => {
        if (field.optionSource) keys.add(field.optionSource);
      });

      config.filters?.forEach((filter) => {
        if (filter.optionSource) keys.add(filter.optionSource);
      });

      if (keys.size === 0) return;

      const entries = await Promise.all(
        Array.from(keys).map(async (key) => {
          const source = optionSources[key];
          const response = await adminRequest<{
            success: boolean;
            data?: Record<string, any>[];
            items?: Record<string, any>[];
          }>(source.listPath || source.endpoint);

          return [key, getListData(response).map(source.mapOption)] as const;
        }),
      );

      if (!active) return;
      setOptions(Object.fromEntries(entries));
    };

    void loadItems();
    void loadOptions();

    return () => {
      active = false;
    };
  }, [config]);

  const filteredItems = useMemo(() => {
    if (!config) return [];

    const query = searchValue.trim().toLowerCase();

    return items.filter((item) => {
      const searchMatch = !query
        ? true
        : (config.searchText?.(item) || "").includes(query);

      const filterMatch = (config.filters || []).every((filter) => {
        const activeValue = filters[filter.name];
        if (!activeValue) return true;
        return filter.getValue(item) === activeValue;
      });

      return searchMatch && filterMatch;
    });
  }, [config, filters, items, searchValue]);

  const pageSize = config?.pageSize || 10;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  if (!config) {
    return (
      <AdminPanelShell
        title="Page not found"
        description="This admin page is not configured yet."
      >
        <Card className="rounded-[2rem] border border-white/10 bg-slate-950/70 py-0">
          <CardContent className="px-6 py-8 text-slate-300">
            The requested admin screen does not exist.
          </CardContent>
        </Card>
      </AdminPanelShell>
    );
  }

  const openCreate = () => {
    setEditingItem(null);
    setForm(buildEmptyForm(moduleKey));
    setFormOpen(true);
  };

  const openEdit = (item: Record<string, any>) => {
    const nextForm = buildEmptyForm(moduleKey);

    config.fields?.forEach((field) => {
      const value =
        field.type === "date"
          ? toInputDate(item[field.name])
          : item[field.name] ?? "";

      nextForm[field.name] =
        field.type === "boolean" ? Boolean(value) : String(value);
    });

    if (config.deserialize) {
      Object.assign(nextForm, config.deserialize(item));
    }

    setEditingItem(item);
    setForm(nextForm);
    setFormOpen(true);
  };

  const handleDelete = async (item: Record<string, any>) => {
    const confirmed = window.confirm("Delete this record?");
    if (!confirmed) return;

    try {
      await adminRequest(config.deletePath?.(item) || `${config.endpoint}/${item.id}`, {
        method: "DELETE",
      });

      setItems((current) => current.filter((entry) => entry.id !== item.id));
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Delete failed",
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotification(null);

    try {
      const payload = config.serialize
        ? config.serialize(form, editingItem ? "edit" : "create", editingItem)
        : form;

      const response = await adminRequest<{
        success: boolean;
        data?: Record<string, any>;
        item?: Record<string, any>;
        emailDelivery?: {
          sent?: boolean;
          reason?: string;
        };
      }>(
        editingItem
          ? config.updatePath?.(editingItem) || `${config.endpoint}/${editingItem.id}`
          : config.endpoint,
        {
          method: editingItem ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
      );

      const nextItem = (response.data ||
        response.item ||
        editingItem) as Record<string, any>;

      if (editingItem) {
        setItems((current) =>
          current.map((entry) => (entry.id === editingItem.id ? nextItem : entry)),
        );
      } else {
        setItems((current) => [nextItem, ...current]);
      }

      setEditingItem(null);
      setForm(buildEmptyForm(moduleKey));
      setFormOpen(false);

      if (response.emailDelivery) {
        if (response.emailDelivery.sent) {
          setNotification({
            type: "success",
            message: "Status updated and email sent to user successfully.",
          });
        } else {
          const reason = response.emailDelivery.reason || "unknown_reason";
          setNotification({
            type: "error",
            message: `Status updated but email was not sent (${reason}).`,
          });
        }
      } else {
        setNotification({
          type: "success",
          message: editingItem
            ? "Record updated successfully."
            : "Record created successfully.",
        });
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Save failed",
      );
    } finally {
      setSaving(false);
    }
  };

  const formFields = config.fields || [];

  return (
    <AdminPanelShell
      title={config.title}
      description={config.description}
      actions={
        config.allowCreate !== false && formFields.length > 0 ? (
          <Button size="lg" className="rounded-2xl" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        ) : undefined
      }
    >
      {notification ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            notification.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
              : "border-rose-500/30 bg-rose-500/10 text-rose-100"
          }`}
        >
          {notification.message}
        </div>
      ) : null}

      {formOpen && formFields.length > 0 ? (
        <Card className="rounded-[2rem] border border-white/10 bg-slate-950/70 py-0">
          <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
            <CardTitle className="text-white">
              {editingItem ? "Edit Record" : "Create Record"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              {formFields.map((field) => (
                <div
                  key={field.name}
                  className={field.type === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"}
                >
                  <label className="text-sm font-medium text-slate-200">
                    {field.label}
                  </label>
                  {field.type === "image" ? (
                    <ModuleImageUploader
                      value={String(form[field.name] || "")}
                      onChange={(url) =>
                        setForm((current) => ({
                          ...current,
                          [field.name]: url,
                        }))
                      }
                      placeholder={field.placeholder || "Upload image"}
                    />
                  ) : field.type === "textarea" ? (
                    <Textarea
                      value={String(form[field.name] || "")}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                      placeholder={field.placeholder}
                      className="min-h-28 rounded-2xl border-white/10 bg-white/[0.04] text-slate-100"
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={String(form[field.name] || "")}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                      className="flex h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 outline-none [color-scheme:dark]"
                    >
                      <option
                        value=""
                        style={{ backgroundColor: "#08111f", color: "#e2e8f0" }}
                      >
                        Select {field.label}
                      </option>
                      {(field.options || options[field.optionSource || ""] || []).map(
                        (option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            style={{ backgroundColor: "#08111f", color: "#e2e8f0" }}
                          >
                            {option.label}
                          </option>
                        ),
                      )}
                    </select>
                  ) : field.type === "boolean" ? (
                    <label className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100">
                      <input
                        type="checkbox"
                        checked={Boolean(form[field.name])}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            [field.name]: event.target.checked,
                          }))
                        }
                      />
                      Enable
                    </label>
                  ) : (
                    <Input
                      type={
                        field.type === "number"
                          ? "number"
                          : field.type === "date"
                            ? "date"
                            : field.type === "url"
                              ? "url"
                              : "text"
                      }
                      value={String(form[field.name] || "")}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                      placeholder={field.placeholder}
                      className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100"
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-3 md:col-span-2">
                <Button type="submit" size="lg" className="rounded-2xl" disabled={saving}>
                  {saving ? "Saving..." : editingItem ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                  onClick={() => {
                    setEditingItem(null);
                    setFormOpen(false);
                    setForm(buildEmptyForm(moduleKey));
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-[2rem] border border-white/10 bg-slate-950/70 py-0">
        <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
          <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-white">Records</CardTitle>
            <div className="flex min-w-0 flex-col gap-3 lg:flex-1 lg:flex-row lg:flex-wrap lg:justify-end">
              <div className="relative min-w-0 w-full lg:w-72">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={searchValue}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                    setPage(1);
                  }}
                  placeholder={`Search ${config.title.toLowerCase()}...`}
                  className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-slate-100"
                />
              </div>

              {(config.filters || []).map((filter) => (
                <select
                  key={filter.name}
                  value={filters[filter.name] || ""}
                  onChange={(event) => {
                    setFilters((current) => ({
                      ...current,
                      [filter.name]: event.target.value,
                    }));
                    setPage(1);
                  }}
                  className="h-12 min-w-0 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 outline-none lg:w-56 [color-scheme:dark]"
                >
                  <option
                    value=""
                    style={{ backgroundColor: "#08111f", color: "#e2e8f0" }}
                  >
                    All {filter.label}
                  </option>
                  {(filter.options || options[filter.optionSource || ""] || []).map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        style={{ backgroundColor: "#08111f", color: "#e2e8f0" }}
                      >
                        {option.label}
                      </option>
                    ),
                  )}
                </select>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-slate-400">
              Loading records...
            </div>
          ) : null}

          {!loading && filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-slate-400">
              {config.emptyState || "No records found."}
            </div>
          ) : null}

          {!loading && filteredItems.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {config.columns.map((column) => (
                        <th key={column.key} className="px-3 py-3 font-medium">
                          {column.label}
                        </th>
                      ))}
                      <th className="px-3 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pagedItems.map((item) => (
                      <tr key={item.id} className="align-top">
                        {config.columns.map((column) => (
                          <td key={column.key} className="px-3 py-4 text-slate-200">
                            {column.render(item)}
                          </td>
                        ))}
                        <td className="px-3 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                            {config.allowEdit !== false && formFields.length > 0 ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                                onClick={() => openEdit(item)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                            ) : null}
                            {config.allowDelete !== false ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-red-500/30 bg-red-500/10 text-red-100 hover:bg-red-500/20"
                                onClick={() => handleDelete(item)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </Button>
                            ) : null}
                            {(config.rowLinks || []).map((link) => (
                              <Button
                                key={link.label}
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                                render={<Link href={link.href(item)} />}
                              >
                                {link.label}
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing {(page - 1) * pageSize + 1}-
                  {Math.min(page * pageSize, filteredItems.length)} of{" "}
                  {filteredItems.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      {selectedItem ? (
        <Card className="rounded-[2rem] border border-white/10 bg-slate-950/70 py-0">
          <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-white">Record Details</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-6 text-slate-300">
              {JSON.stringify(selectedItem, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : null}
    </AdminPanelShell>
  );
}

function ModuleImageUploader({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder: string;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }

      setError("");
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(buildAdminUrl("/api/admin/upload"), {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (response.status === 401) {
          setError("Please login to admin again and retry upload.");
          return;
        }

        if (!response.ok || !data?.success || !data?.imageUrl) {
          setError(data?.message || "Image upload failed");
          return;
        }

        onChange(String(data.imageUrl));
      } catch {
        setError("Network error during image upload");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  return (
    <div className="space-y-2">
      {value ? (
        <div className="group relative h-44 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
          <img src={value} alt="Uploaded preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 transition group-hover:opacity-100">
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="rounded-xl"
              onClick={() => onChange("")}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <label
          className={`relative flex h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 text-center transition ${
            dragActive
              ? "border-cyan-300 bg-cyan-300/10"
              : "border-white/15 bg-white/[0.03] hover:border-cyan-300/70"
          } ${uploading ? "pointer-events-none opacity-70" : ""}`}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const file = e.dataTransfer.files?.[0];
            if (file) {
              void handleFile(file);
            }
          }}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleFile(file);
              }
            }}
          />
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
              <p className="mt-2 text-sm text-slate-200">Uploading image...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-cyan-300" />
              <p className="mt-2 text-sm font-medium text-slate-200">{placeholder}</p>
              <p className="text-xs text-slate-400">Drag & drop or click to choose file</p>
            </>
          )}
        </label>
      )}
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
