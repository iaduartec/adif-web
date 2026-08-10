import { DashboardContent } from "../../components/shell/content-width";
import { DashboardNavigation } from "../../components/shell/dashboard-navigation";
import { UserMenu } from "../../components/shell/user-menu";
import { createServerClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const metadata = user.user_metadata;
  const profile = {
    avatarUrl: typeof metadata.avatar_url === "string" ? metadata.avatar_url : undefined,
    email: user.email,
    name: typeof metadata.full_name === "string" ? metadata.full_name : typeof metadata.name === "string" ? metadata.name : undefined,
  };

  return (
    <div className="dashboard-shell">
      <a className="skip-link" href="#dashboard-content">Saltar al contenido</a>
      <DashboardNavigation placement="sidebar" />
      <div className="dashboard-surface">
        <header className="dashboard-header">
          <DashboardNavigation placement="mobile" />
          <p className="dashboard-context">Preparación ADIF Telecomunicaciones</p>
          <UserMenu profile={profile} />
        </header>
        <main className="dashboard-main" id="dashboard-content"><DashboardContent>{children}</DashboardContent></main>
      </div>
    </div>
  );
}
