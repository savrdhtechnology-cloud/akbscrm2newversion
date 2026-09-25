"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  FileArchive,
  FileText,
  Folder,
  Globe,
  Handshake,
  History,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  Settings as SettingsIcon,
  ShieldCheck,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";
import { logoutAction } from "@/app/actions/logout";
import { can } from "@/lib/rbac";
import type { AppRole, NavItem } from "@/lib/types";

type SidebarProps = {
  role: AppRole;
  userName: string;
  items: NavItem[];
  onNavigate?: () => void;
};

type NavSpec = {
  label: string;
  href: string;
  icon: LucideIcon;
  aliases?: string[];
};

type SidebarGroup = {
  title: string;
  items: NavSpec[];
};

const adminGroups: SidebarGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "REGISTRATION MODULES",
    items: [
      { label: "Leads", href: "/admin/leads", icon: UsersRound },
      { label: "Follow-ups", href: "/admin/follow-ups", icon: PhoneCall },
      { label: "Customers", href: "/admin/customers", icon: UserRound },
      { label: "Partners", href: "/admin/partners", icon: Handshake },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { label: "Site Visits", href: "/admin/site-visits", icon: CalendarCheck },
      {
        label: "DPR & Proposals",
        href: "/admin/dpr",
        aliases: ["/admin/proposals"],
        icon: FileText,
      },
      {
        label: "Loan & Financing",
        href: "/admin/financing",
        icon: IndianRupee,
      },
      { label: "Tasks", href: "/admin/tasks", icon: ClipboardCheck },
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    title: "SETTINGS & SUPPORT",
    items: [
      {
        label: "Support & Help",
        href: "/admin/calling-guide",
        icon: CircleHelp,
      },
      {
        label: "Access Control",
        href: "/admin/team",
        icon: ShieldCheck,
      },
      { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
    ],
  },
];

const iconByLabel: Record<string, LucideIcon> = {
  "Command Center": Building2,
  Inquiries: MessageSquare,
  Projects: Folder,
  Proposals: FileText,
  Documents: FileArchive,
  Commission: IndianRupee,
  Team: Users,
  Communication: MessageCircle,
  Email: Mail,
  WhatsApp: MessageCircle,
  "Website Content": Globe,
  "Calling Guide": CircleHelp,
  "Audit Logs": History,
  Approvals: ShieldCheck,
  Profile: UserRound,
  Application: FileText,
  Project: Folder,
  DPR: FileText,
  Proposal: FileText,
  Loan: IndianRupee,
  Payouts: IndianRupee,
};

function normalizeLabel(label: string) {
  return label.toLowerCase().replace(/\s+/g, " ").trim();
}

function iconFor(item: NavItem): LucideIcon {
  return (
    iconByLabel[item.label] ||
    (normalizeLabel(item.label).includes("report") ? BarChart3 : Folder)
  );
}

function isActivePath(pathname: string, href: string, aliases: string[] = []) {
  const candidates = [href, ...aliases];
  return candidates.some(
    (candidate) =>
      pathname === candidate || pathname.startsWith(candidate + "/"),
  );
}

function SidebarBrand() {
  return (
    <div className="px-3 pt-3">
      <div className="rounded-[22px] border border-emerald-900/10 bg-white/95 p-3 shadow-[0_12px_30px_rgba(0,0,0,.12)]">
        <div className="flex items-center gap-3">
          <div
            aria-label="AKBS Poultry Farming logo"
            className="h-14 w-14 shrink-0 rounded-2xl border border-emerald-100 bg-white bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://www.akbspoultry.com/images/akbs_email_logo.png')",
            }}
          />
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[.24em] text-emerald-600">
              Admin CRM
            </div>
            <div className="mt-0.5 truncate text-[17px] font-bold leading-tight text-[#063d2d]">
              AKBS Poultry Farming
            </div>
            <div className="mt-1 text-[10px] font-medium text-slate-500">
              Healthy Birds | Better Tomorrow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarNavItem({
  spec,
  pathname,
  availableItems,
  onNavigate,
}: {
  spec: NavSpec;
  pathname: string;
  availableItems: NavItem[];
  onNavigate?: () => void;
}) {
  const available = availableItems.find((item) => item.href === spec.href);
  if (!available) return null;

  const active = isActivePath(pathname, spec.href, spec.aliases);
  const Icon = spec.icon;

  return (
    <Link
      href={available.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex min-h-11 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[14px] font-semibold transition-all duration-150",
        active
          ? "bg-white text-[#083c2d] shadow-[0_8px_22px_rgba(0,0,0,.18)]"
          : "text-emerald-50/78 hover:bg-white/[0.075] hover:text-white",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-7 w-7 shrink-0 place-items-center rounded-xl transition-colors",
          active
            ? "bg-emerald-50 text-emerald-700"
            : "text-emerald-300 group-hover:text-emerald-200",
        ].join(" ")}
      >
        <Icon size={18} strokeWidth={1.9} />
      </span>

      <span className="min-w-0 flex-1 truncate">{spec.label}</span>

      {active && (
        <ChevronRight
          size={17}
          strokeWidth={2}
          className="shrink-0 text-emerald-700"
        />
      )}
    </Link>
  );
}

function SidebarSection({
  group,
  pathname,
  availableItems,
  onNavigate,
}: {
  group: SidebarGroup;
  pathname: string;
  availableItems: NavItem[];
  onNavigate?: () => void;
}) {
  const hasVisibleItem = group.items.some((spec) =>
    availableItems.some((item) => item.href === spec.href),
  );

  if (!hasVisibleItem) return null;

  return (
    <section className="mt-5">
      <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.22em] text-emerald-300/55">
        {group.title}
      </div>
      <div className="space-y-1">
        {group.items.map((spec) => (
          <SidebarNavItem
            key={spec.href}
            spec={spec}
            pathname={pathname}
            availableItems={availableItems}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}

function SidebarPromo() {
  return (
    <div
      className="group relative mt-6 overflow-hidden rounded-[22px] border border-emerald-300/20 bg-[#064733] shadow-[0_12px_34px_rgba(0,0,0,.2)] transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        backgroundImage:
          "linear-gradient(180deg,rgba(3,50,36,.15),rgba(2,39,29,.96)),url('https://www.akbspoultry.com/images/akbs_email_header_chicken.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="min-h-[185px] p-4">
        <div className="max-w-[170px]">
          <div className="font-serif text-[23px] font-semibold italic leading-[1.05] text-white">
            Healthy Farmers
          </div>
          <div className="mt-1 font-serif text-[23px] font-semibold italic leading-[1.05] text-emerald-300">
            Healthy India
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-emerald-300/30 bg-[#032c21]/75 px-3 py-3 text-center text-[11px] font-medium leading-5 text-emerald-50/90 backdrop-blur-sm">
          “Every Follow-up
          <br />
          Brings a Farmer Closer
          <br />
          to a Better Tomorrow”
        </div>
      </div>
    </div>
  );
}

function SidebarProfile({
  role,
  userName,
}: {
  role: AppRole;
  userName: string;
}) {
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const displayName = isAdmin ? "Super Admin" : userName;
  const initials = isAdmin
    ? "SA"
    : userName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "AK";

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <div className="flex items-center gap-3 rounded-[20px] border border-emerald-300/20 bg-white/[0.07] p-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-400 font-extrabold text-[#063829] shadow-inner">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-white">{displayName}</div>
          <div className="mt-0.5 truncate text-[11px] text-emerald-100/55">
            {isAdmin ? "CRM Management Console" : role.replaceAll("_", " ")}
          </div>
        </div>
        <ChevronRight size={17} className="text-emerald-200/70" />
      </div>

      <form action={logoutAction} className="mt-2">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold text-emerald-50/70 transition-colors hover:bg-red-500/10 hover:text-red-100"
        >
          <span className="grid h-7 w-7 place-items-center text-emerald-300">
            <LogOut size={18} strokeWidth={1.9} />
          </span>
          Logout
        </button>
      </form>
    </div>
  );
}

export function CrmSidebar({
  role,
  userName,
  items,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const availableItems = items.filter((item) => can(role, item.permission));
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const primaryHrefs = new Set(
    adminGroups.flatMap((group) => group.items.map((item) => item.href)),
  );
  primaryHrefs.add("/admin/proposals");

  const extraAdminItems = isAdmin
    ? availableItems.filter((item) => !primaryHrefs.has(item.href))
    : [];

  const extraActive = extraAdminItems.some((item) =>
    isActivePath(pathname, item.href),
  );

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden bg-[linear-gradient(180deg,#043d2d_0%,#032f24_46%,#02271e_100%)] text-white">
      <SidebarBrand />

      <div className="akbs-sidebar-scroll flex-1 overflow-y-auto px-3 pb-4 pt-1">
        {isAdmin ? (
          <>
            {adminGroups.map((group) => (
              <SidebarSection
                key={group.title}
                group={group}
                pathname={pathname}
                availableItems={availableItems}
                onNavigate={onNavigate}
              />
            ))}

            {extraAdminItems.length > 0 && (
              <details
                className="mt-5 rounded-2xl border border-white/8 bg-white/[0.025]"
                open={extraActive || undefined}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl px-3 py-3 text-[10px] font-bold uppercase tracking-[.2em] text-emerald-300/55 transition-colors hover:bg-white/[0.04]">
                  More CRM
                  <ChevronDown size={15} />
                </summary>
                <div className="space-y-1 px-2 pb-2">
                  {extraAdminItems.map((item) => {
                    const Icon = iconFor(item);
                    const active = isActivePath(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={[
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                          active
                            ? "bg-white text-[#083c2d]"
                            : "text-emerald-50/70 hover:bg-white/[0.07] hover:text-white",
                        ].join(" ")}
                      >
                        <Icon size={17} strokeWidth={1.8} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </details>
            )}
          </>
        ) : (
          <section className="mt-5">
            <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.22em] text-emerald-300/55">
              Portal Navigation
            </div>
            <div className="space-y-1">
              {availableItems.map((item) => {
                const Icon = iconFor(item);
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={[
                      "flex min-h-11 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[14px] font-semibold transition-all",
                      active
                        ? "bg-white text-[#083c2d] shadow-[0_8px_22px_rgba(0,0,0,.18)]"
                        : "text-emerald-50/78 hover:bg-white/[0.075] hover:text-white",
                    ].join(" ")}
                  >
                    <Icon size={18} strokeWidth={1.9} />
                    <span className="truncate">{item.label}</span>
                    {active && <ChevronRight size={17} className="ml-auto" />}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {isAdmin && <SidebarPromo />}
        <SidebarProfile role={role} userName={userName} />
      </div>
    </aside>
  );
}
