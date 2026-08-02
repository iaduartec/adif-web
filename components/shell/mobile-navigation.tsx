"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { NAV_ITEMS } from "./nav-items";

function focusableWithin(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
}

export function MobileNavigation({ currentPath }: { currentPath: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const initialOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.body.style.overflow = initialOverflow; };
  }, [isOpen]);

  function closeNavigation(restoreFocus = true) {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeNavigation();
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
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="mobile-navigation">
      <button ref={triggerRef} className="mobile-navigation-trigger" type="button" aria-expanded={isOpen} aria-haspopup="dialog" aria-label="Abrir navegación" onClick={() => setIsOpen(true)}>
        <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      {isOpen ? (
        <div ref={dialogRef} className="mobile-navigation-dialog" role="dialog" aria-modal="true" aria-labelledby="mobile-navigation-title" onKeyDown={handleKeyDown}>
          <div className="mobile-navigation-sheet">
            <div className="mobile-navigation-heading">
              <p id="mobile-navigation-title">Navegación principal</p>
              <button ref={closeRef} className="mobile-navigation-close" type="button" aria-label="Cerrar navegación" onClick={() => closeNavigation()}>
                <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <nav aria-label="Navegación principal">
              <ul className="shell-navigation-list">
                {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
                  <li key={href}>
                    <Link className="shell-navigation-link" href={href} aria-current={currentPath === href ? "page" : undefined} onClick={() => closeNavigation(false)}>
                      <Icon className="shell-navigation-icon" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
