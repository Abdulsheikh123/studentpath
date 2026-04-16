"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { adminRequest } from "@/lib/admin-api";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DynamicSelectProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  options?: { label: string; value: string }[];
  fetchResource?: string;
  onResourceLoaded?: (resource: string, items: any[]) => void;
};

export function DynamicSelect({
  value,
  onChange,
  placeholder,
  options: staticOptions,
  fetchResource,
  onResourceLoaded,
}: DynamicSelectProps) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    staticOptions ?? [],
  );
  const [loading, setLoading] = useState(!!fetchResource);

  useEffect(() => {
    if (!fetchResource) return;

    const loadOptions = async () => {
      try {
        const data = await adminRequest<{
          success: boolean;
          items: any[];
        }>(`/api/admin/manage/${fetchResource}`);

        const mappedOptions = data.items.map((item) => ({
          label: item.name || item.title || item.label || item._id,
          value: item.name || item._id,
        }));

        setOptions(mappedOptions);
        if (typeof onResourceLoaded === "function") {
          onResourceLoaded(fetchResource, data.items);
        }
      } catch (err) {
        console.error("Failed to load select options", err);
      } finally {
        setLoading(false);
      }
    };

    void loadOptions();
  }, [fetchResource, onResourceLoaded]);

  return (
    <Select>
      <SelectTrigger
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        className="h-11 rounded-2xl border-border/70 bg-background px-4"
        triggerSize="default"
      >
        <SelectValue placeholder={loading ? "Loading..." : placeholder} />
      </SelectTrigger>
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </Select>
  );
}
