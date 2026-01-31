"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const content = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      <div
        ref={contentRef}
        className="w-full max-w-lg rounded-3xl bg-card border border-border/50 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 flex flex-col gap-4"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {children && <div className="py-2">{children}</div>}

        {footer && (
          <div className="flex items-center justify-end gap-3 mt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Use createPortal to render at the end of the document body
  // to avoid z-index issues, but simple rendering might suffice if body is main app
  // For safety in Next.js app dir, we can try portal if document is available, or just render.
  // Creating a portal safely:
  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
