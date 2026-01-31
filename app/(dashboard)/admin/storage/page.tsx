"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Trash2, Upload, Image as ImageIcon, Copy, Check } from "lucide-react";
// import Image from "next/image"; // Using standard img for simpler local file handling without width/height quirks for now

import { Dialog } from "@/app/components/ui/Dialog";

export default function StoragePage() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const { data: files, isLoading } = useQuery<{ name: string; url: string }[]>({
    queryKey: ["files"],
    queryFn: async () => {
      const res = await fetch("/api/storage");
      if (!res.ok) throw new Error("Failed to load files");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      setUploading(false);
    },
    onError: () => setUploading(false),
  });

  const deleteMutation = useMutation({
    mutationFn: async (filename: string) => {
      const res = await fetch(
        `/api/storage?filename=${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      setFileToDelete(null);
    },
    onError: (error) => {
      alert("Failed to delete image: " + error.message);
      // Optional: keep dialog open on error or close it?
      // Usually keep it open so user can retry or see error, but here we using alert.
      // Let's close it to be clean or keep it. I'll keep it open if error, but user will see alert.
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploading(true);
      uploadMutation.mutate(e.target.files[0]);
    }
  };

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy URL to clipboard");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <ImageIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
              Media Library
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
              Manage product images and assets.
            </p>
          </div>
        </div>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload">
            <Button
              variant="outline"
              className="gap-2 font-black cursor-pointer"
              type="button"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </label>
        </div>
      </div>

      {isLoading ? (
        <div>Loading gallery...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {files?.map((file) => (
            <div
              key={file.name}
              className="group relative glass rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all flex flex-col"
            >
              <div className="aspect-square relative overflow-hidden bg-muted/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-3 flex items-center justify-between gap-3 border-t border-border/50 bg-card/30 backdrop-blur-sm relative z-20">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-lg hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Copying:", file.url);
                      copyToClipboard(file.url);
                    }}
                    title="Copy URL"
                  >
                    {copied === file.url ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-lg cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileToDelete(file.name);
                    }}
                    title="Delete Image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {files?.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No images found. Upload one to get started.</p>
            </div>
          )}
        </div>
      )}
      <Dialog
        isOpen={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        title="Delete Image"
        description="Are you sure you want to permanently delete this image? This action cannot be undone."
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setFileToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (fileToDelete) {
                  deleteMutation.mutate(fileToDelete);
                }
              }}
              isLoading={deleteMutation.isPending}
            >
              Delete Permanently
            </Button>
          </>
        }
      >
        {fileToDelete && (
          <div className="bg-muted/50 p-3 rounded-xl border border-border/50 flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 bg-background rounded-lg overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={files?.find((f) => f.name === fileToDelete)?.url}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-mono truncate">{fileToDelete}</span>
          </div>
        )}
      </Dialog>
    </div>
  );
}
