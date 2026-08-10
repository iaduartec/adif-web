"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useModalFocus } from "../ui/use-modal-focus";
import { NAV_ITEMS } from "./nav-items";

export function MobileNavigation({ currentPath }: { currentPath: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  function closeNavigation() {
    setIsOpen(false);
  }

  const handleKeyDown = useModalFocus({
    dialogRef,
    initialFocusRef: closeRef,
    isOpen,
    onDismiss: closeNavigation,
    returnFocusRef: triggerRef,
  });

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
                    <Link className="shell-navigation-link" href={href} aria-current={currentPath === href ? "page" : undefined} onClick={closeNavigation}>
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
