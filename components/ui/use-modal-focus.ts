"use client";

import { useCallback, useEffect, type KeyboardEvent, type RefObject } from "react";

function focusableWithin(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function useModalFocus({
  dialogRef,
  initialFocusRef,
  isOpen,
  onDismiss,
  returnFocusRef,
}: {
  dialogRef: RefObject<HTMLElement | null>;
  initialFocusRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onDismiss: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const initialOverflow = document.body.style.overflow;
    const elementToRestore = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    initialFocusRef.current?.focus();

    return () => {
      document.body.style.overflow = initialOverflow;
      elementToRestore?.focus();
    };
  }, [initialFocusRef, isOpen, returnFocusRef]);

  return useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onDismiss();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    const elements = focusableWithin(dialogRef.current);
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, [dialogRef, onDismiss]);
}
