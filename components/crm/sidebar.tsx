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
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
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
      { label: "Loan & Financing", href: "/admin/financing", icon: IndianRupee },
      { label: "Tasks", href: "/admin/tasks", icon: ClipboardCheck },
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    title: "SETTINGS & SUPPORT",
    items: [
      { label: "Support & Help", href: "/admin/calling-guide", icon: CircleHelp },
      { label: "Access Control", href: "/admin/team", icon: ShieldCheck },
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
  return [href, ...aliases].some(
    (candidate) => pathname === candidate || pathname.startsWith(candidate + "/"),
  );
}

function SidebarBrand() {
  return (
    <div className="px-3 pt-3">
      <div className="rounded-[20px] border border-emerald-900/10 bg-white p-3 shadow-[0_10px_26px_rgba(0,0,0,.12)]">
        <div className="flex items-center gap-3">
          <img
            src="/assets/akbs-sidebar-logo.png"
            alt="AKBS Poultry Farming"
            className="h-[58px] w-[58px] shrink-0 rounded-[17px] border border-emerald-100 object-cover shadow-sm"
          />
          <div className="min-w-0">
            <div className="text-[9.5px] font-semibold uppercase tracking-[.22em] text-emerald-600">
              Admin CRM
            </div>
            <div className="mt-1 truncate text-[15px] font-semibold leading-[1.15] text-[#073d2e]">
              AKBS Poultry Farming
            </div>
            <div className="mt-1 text-[10px] font-normal leading-4 text-slate-500">
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
        "group relative flex min-h-[42px] items-center gap-3 rounded-[14px] px-3 py-2 text-[14px] font-medium tracking-[-0.01em] transition-all duration-150",
        active
          ? "bg-white text-[#0a3f30] shadow-[0_7px_18px_rgba(0,0,0,.17)]"
          : "text-emerald-50/75 hover:bg-white/[0.07] hover:text-white",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-7 w-7 shrink-0 place-items-center transition-colors",
          active
            ? "text-emerald-700"
            : "text-emerald-300/90 group-hover:text-emerald-200",
        ].join(" ")}
      >
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1 truncate">{spec.label}</span>
      {active && <ChevronRight size={16} strokeWidth={1.9} className="shrink-0 text-emerald-700" />}
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
      <div className="mb-2 px-3 text-[9.5px] font-semibold uppercase tracking-[.22em] text-emerald-300/55">
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
    <div className="group relative mt-6 min-h-[205px] overflow-hidden rounded-[20px] border border-emerald-300/20 bg-[#064733] shadow-[0_10px_28px_rgba(0,0,0,.2)] transition-transform duration-200 hover:-translate-y-0.5">
      <img
        src="/assets/akbs-sidebar-promo.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-95"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,35,26,.08)_0%,rgba(2,36,27,.25)_42%,rgba(1,31,24,.9)_100%)]" />

      <div className="relative flex min-h-[205px] flex-col justify-between p-4">
        <div>
          <div className="text-[18px] font-semibold italic leading-[1.05] tracking-[-0.02em] text-white">
            Healthy Farmers
          </div>
          <div className="mt-1 text-[18px] font-semibold italic leading-[1.05] tracking-[-0.02em] text-emerald-300">
            Healthy India
          </div>
        </div>

        <div className="w-[82%] rounded-[14px] border border-emerald-300/35 bg-[#022c21]/78 px-3 py-2.5 text-center text-[10px] font-medium leading-[1.55] text-emerald-50/90 backdrop-blur-sm">
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

function SidebarProfile({ role, userName }: { role: AppRole; userName: string }) {
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
      <div className="flex items-center gap-3 rounded-[18px] border border-emerald-300/20 bg-white/[0.07] p-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-400 text-[14px] font-bold text-[#063829]">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-semibold text-white">{displayName}</div>
          <div className="mt-0.5 truncate text-[10px] font-normal text-emerald-100/55">
            {isAdmin ? "CRM Management Console" : role.replaceAll("_", " ")}
          </div>
        </div>
        <ChevronRight size={16} className="text-emerald-200/70" />
      </div>

      <form action={logoutAction} className="mt-2">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left text-[13.5px] font-medium text-emerald-50/72 transition-colors hover:bg-red-500/10 hover:text-red-100"
        >
          <span className="grid h-7 w-7 place-items-center text-emerald-300">
            <LogOut size={17} strokeWidth={1.8} />
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
    <aside className="flex h-full w-full flex-col overflow-hidden bg-[linear-gradient(180deg,#043d2d_0%,#032f24_46%,#02271e_100%)] font-sans text-white">
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
                className="mt-5 rounded-[16px] border border-white/8 bg-white/[0.025]"
                open={extraActive || undefined}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-[16px] px-3 py-3 text-[9.5px] font-semibold uppercase tracking-[.2em] text-emerald-300/55 transition-colors hover:bg-white/[0.04]">
                  More CRM
                  <ChevronDown size={14} />
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
                          "flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-medium tracking-[-0.01em] transition-colors",
                          active
                            ? "bg-white text-[#083c2d]"
                            : "text-emerald-50/70 hover:bg-white/[0.07] hover:text-white",
                        ].join(" ")}
                      >
                        <Icon size={16} strokeWidth={1.8} />
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
            <div className="mb-2 px-3 text-[9.5px] font-semibold uppercase tracking-[.22em] text-emerald-300/55">
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
                      "flex min-h-[42px] items-center gap-3 rounded-[14px] px-3 py-2 text-[14px] font-medium tracking-[-0.01em] transition-all",
                      active
                        ? "bg-white text-[#083c2d] shadow-[0_7px_18px_rgba(0,0,0,.17)]"
                        : "text-emerald-50/75 hover:bg-white/[0.07] hover:text-white",
                    ].join(" ")}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span className="truncate">{item.label}</span>
                    {active && <ChevronRight size={16} className="ml-auto" />}
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
