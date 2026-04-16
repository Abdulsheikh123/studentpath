"use client";

import { useCallback, useState } from "react";
import type { DragEvent } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";

import { buildAdminUrl } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  placeholder: string;
};

export function ImageUploader({
  value,
  onChange,
  placeholder,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Only images are allowed");
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

        const data = await response.json();
        if (data.success) {
          onChange(data.imageUrl);
        } else {
          setError(data.message || "Upload failed");
        }
      } catch {
        setError("Network error during upload");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const onDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="group relative h-48 w-full overflow-hidden rounded-[2rem] border border-border/70 bg-muted/20">
          <img
            src={value}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="rounded-full"
              onClick={() => onChange("")}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Image
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed py-10 transition-all",
            dragActive
              ? "border-cyan-500 bg-cyan-500/5"
              : "border-border/70 hover:border-cyan-500/50 hover:bg-muted/10",
            error ? "border-red-500 bg-red-500/5" : "",
            uploading ? "pointer-events-none opacity-60" : "",
          )}
        >
          <input
            type="file"
            className="absolute inset-0 cursor-pointer opacity-0"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                void handleFile(e.target.files[0]);
              }
            }}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-600" />
              <p className="text-sm font-medium text-muted-foreground">
                Uploading image...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center px-4 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-600/10 text-cyan-600">
                <Upload className="h-7 w-7" />
              </div>
              <p className="text-sm font-bold text-foreground">{placeholder}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG or WebP (max. 5MB)
              </p>
            </div>
          )}
        </div>
      )}
      {error ? (
        <p className="text-xs font-medium text-red-500">{error}</p>
      ) : null}
    </div>
  );
}
