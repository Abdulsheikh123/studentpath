"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";

import AdminPanelShell from "@/components/admin/AdminPanelShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminRequest, getListData } from "@/lib/admin-api";
import { optionSources } from "@/lib/admin-option-sources";

const faqTabs = [
  { label: "College FAQ", value: "college", optionSource: "colleges" as const },
  { label: "School FAQ", value: "school", optionSource: "schools" as const },
  { label: "Exam FAQ", value: "exam", optionSource: "exams" as const },
  { label: "Course FAQ", value: "course", optionSource: "courses" as const },
];

export default function AdminFaqManager() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("college");
  const [faqs, setFaqs] = useState<Record<string, any>[]>([]);
  const [options, setOptions] = useState<Record<string, { label: string; value: string }[]>>({});
  const [searchValue, setSearchValue] = useState("");
  const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(null);
  const [editingItem, setEditingItem] = useState<Record<string, any> | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    itemId: "",
  });

  useEffect(() => {
    const requestedTab = searchParams.get("tab");
    const requestedItemId = searchParams.get("itemId");

    if (requestedTab && faqTabs.some((entry) => entry.value === requestedTab)) {
      setTab(requestedTab);
    }

    if (requestedItemId) {
      setForm((current) => ({ ...current, itemId: requestedItemId }));
    }
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    const loadFaqs = async () => {
      setLoading(true);
      setError("");

      try {
        const [faqResponse, ...optionResponses] = await Promise.all([
          adminRequest<{
            success: boolean;
            data?: Record<string, any>[];
            items?: Record<string, any>[];
          }>("/api/faqs"),
          ...faqTabs.map((entry) =>
            adminRequest<{
              success: boolean;
              data?: Record<string, any>[];
              items?: Record<string, any>[];
            }>(
              optionSources[entry.optionSource].listPath ||
                optionSources[entry.optionSource].endpoint,
            ),
          ),
        ]);

        if (!active) return;

        setFaqs(getListData(faqResponse));
        setOptions(
          Object.fromEntries(
            faqTabs.map((entry, index) => [
              entry.value,
              getListData(optionResponses[index]).map(
                optionSources[entry.optionSource].mapOption,
              ),
            ]),
          ),
        );
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load FAQs",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadFaqs();

    return () => {
      active = false;
    };
  }, []);

  const filteredFaqs = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return faqs.filter((faq) => {
      const tabMatch = faq.itemType === tab;
      const searchMatch = !query
        ? true
        : `${faq.question} ${faq.answer} ${faq.itemId}`.toLowerCase().includes(query);
      return tabMatch && searchMatch;
    });
  }, [faqs, searchValue, tab]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredFaqs.length / pageSize));
  const pagedFaqs = filteredFaqs.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchValue, tab]);

  const resetForm = () => {
    setEditingItem(null);
    setFormOpen(false);
    setForm({ question: "", answer: "", itemId: "" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await adminRequest<{
        success: boolean;
        data?: Record<string, any>;
      }>(editingItem ? `/api/faqs/${editingItem.id}` : "/api/faqs", {
        method: editingItem ? "PUT" : "POST",
        body: JSON.stringify({
          question: form.question,
          answer: form.answer,
          itemType: tab,
          itemId: Number(form.itemId),
        }),
      });

      const nextFaq = (response.data || editingItem) as Record<string, any>;

      if (editingItem) {
        setFaqs((current) =>
          current.map((entry) => (entry.id === editingItem.id ? nextFaq : entry)),
        );
      } else {
        setFaqs((current) => [nextFaq, ...current]);
      }

      resetForm();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Failed to save FAQ",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Record<string, any>) => {
    const confirmed = window.confirm("Delete this FAQ?");
    if (!confirmed) return;

    try {
      await adminRequest(`/api/faqs/${item.id}`, { method: "DELETE" });
      setFaqs((current) => current.filter((entry) => entry.id !== item.id));
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Delete failed",
      );
    }
  };

  return (
    <AdminPanelShell
      title="FAQ Manager"
      description="Manage college, school, exam, and course FAQs from a single screen with tabbed filtering."
      actions={
        <Button
          size="lg"
          className="rounded-2xl"
          onClick={() => {
            setEditingItem(null);
            setForm({ question: "", answer: "", itemId: "" });
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        {faqTabs.map((entry) => (
          <Button
            key={entry.value}
            variant={tab === entry.value ? "default" : "outline"}
            className={`rounded-2xl ${
              tab === entry.value
                ? ""
                : "border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
            }`}
            onClick={() => setTab(entry.value)}
          >
            {entry.label}
          </Button>
        ))}
      </div>

      {formOpen ? (
        <Card className="rounded-[2rem] border border-white/10 bg-slate-950/70 py-0">
          <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
            <CardTitle className="text-white">
              {editingItem ? "Edit FAQ" : "Create FAQ"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Question</label>
                <Input
                  value={form.question}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, question: event.target.value }))
                  }
                  className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Answer</label>
                <Textarea
                  value={form.answer}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, answer: event.target.value }))
                  }
                  className="min-h-28 rounded-2xl border-white/10 bg-white/[0.04] text-slate-100"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Item Type</label>
                  <Input
                    value={tab}
                    disabled
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Item</label>
                  <select
                    value={form.itemId}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, itemId: event.target.value }))
                    }
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 outline-none [color-scheme:dark]"
                  >
                    <option
                      value=""
                      style={{ backgroundColor: "#08111f", color: "#e2e8f0" }}
                    >
                      Select item
                    </option>
                    {(options[tab] || []).map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        style={{ backgroundColor: "#08111f", color: "#e2e8f0" }}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" size="lg" className="rounded-2xl" disabled={saving}>
                  {saving ? "Saving..." : editingItem ? "Update FAQ" : "Create FAQ"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                  onClick={resetForm}
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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-white">FAQ Records</CardTitle>
            <div className="relative lg:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search question or answer..."
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-slate-100"
              />
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
              Loading FAQs...
            </div>
          ) : null}

          {!loading && filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-slate-400">
              No FAQs found for this tab.
            </div>
          ) : null}

          {!loading && filteredFaqs.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      <th className="px-3 py-3 font-medium">Question</th>
                      <th className="px-3 py-3 font-medium">Answer</th>
                      <th className="px-3 py-3 font-medium">Item Type</th>
                      <th className="px-3 py-3 font-medium">Item ID</th>
                      <th className="px-3 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pagedFaqs.map((faq) => (
                      <tr key={faq.id} className="align-top">
                        <td className="px-3 py-4">{faq.question}</td>
                        <td className="px-3 py-4">{faq.answer}</td>
                        <td className="px-3 py-4">{faq.itemType}</td>
                        <td className="px-3 py-4">{faq.itemId}</td>
                        <td className="px-3 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                              onClick={() => setSelectedItem(faq)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                              onClick={() => {
                                setEditingItem(faq);
                                setTab(faq.itemType);
                                setForm({
                                  question: faq.question || "",
                                  answer: faq.answer || "",
                                  itemId: String(faq.itemId || ""),
                                });
                                setFormOpen(true);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-red-500/30 bg-red-500/10 text-red-100 hover:bg-red-500/20"
                              onClick={() => handleDelete(faq)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
                <p>
                  Showing {(page - 1) * pageSize + 1}-
                  {Math.min(page * pageSize, filteredFaqs.length)} of{" "}
                  {filteredFaqs.length}
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
              <CardTitle className="text-white">FAQ Details</CardTitle>
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
