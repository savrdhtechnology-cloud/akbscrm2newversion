"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import { CrmSidebar } from "@/components/crm/sidebar";
import type { AppRole, NavItem } from "@/lib/types";

export function AppShell({
  role,
  userName,
  items,
  children,
}: {
  role: AppRole;
  userName: string;
  items: NavItem[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7f4]">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-[278px] border-r border-emerald-950/20 lg:block">
        <CrmSidebar role={role} userName={userName} items={items} />
      </div>

      <div
        className={[
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className={[
            "absolute inset-0 bg-slate-950/55 backdrop-blur-[2px] transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        <div
          className={[
            "absolute inset-y-0 left-0 w-[292px] max-w-[86vw] overflow-hidden rounded-r-[26px] shadow-2xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <CrmSidebar
            role={role}
            userName={userName}
            items={items}
            onNavigate={() => setOpen(false)}
          />
        </div>

        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className={[
            "absolute left-[304px] top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-700 shadow-xl transition-all duration-200",
            open
              ? "translate-x-0 opacity-100"
              : "-translate-x-4 opacity-0",
          ].join(" ")}
        >
          <X size={18} />
        </button>
      </div>

      <div className="min-w-0 lg:ml-[278px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#dfe7e1] bg-white/92 px-4 backdrop-blur lg:px-6">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-[#0a4a36] shadow-sm transition-colors hover:bg-emerald-50 lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div className="min-w-0 flex-1 lg:hidden">
            <div className="truncate text-[15px] font-extrabold tracking-tight text-[#073d2d]">
              AKBS
            </div>
            <div className="text-[10px] font-medium text-slate-500">
              Poultry Farming CRM
            </div>
          </div>

          <div className="hidden max-w-xl flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-500 lg:flex">
            <Search size={17} />
            <span className="text-sm">
              Search customers, leads, applications...
            </span>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Bell size={18} />
          </button>

          <div className="hidden text-right sm:block">
            <div className="max-w-44 truncate text-sm font-semibold text-slate-800">
              {userName}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[.12em] text-slate-400">
              {role.replaceAll("_", " ")}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
