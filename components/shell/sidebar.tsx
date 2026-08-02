import Link from "next/link";
import { NAV_ITEMS } from "./nav-items";

export function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="dashboard-rail" aria-label="Navegación de estudio">
      <Link className="dashboard-wordmark" href="/"><span>ADIF</span><span>Telecomunicaciones</span></Link>
      <nav aria-label="Navegación principal">
        <ul className="shell-navigation-list">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link className="shell-navigation-link" href={href} aria-current={currentPath === href ? "page" : undefined}>
                <Icon className="shell-navigation-icon" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
