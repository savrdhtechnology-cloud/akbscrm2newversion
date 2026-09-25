"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CRM2_SESSION_COOKIE,
  crm2Gateway,
  crm2SessionToken,
} from "@/lib/crm/gateway";

export async function logoutAction() {
  const token = await crm2SessionToken();

  try {
    if (token) {
      await crm2Gateway("logout", {}, token);
    }
  } catch {
    // Local session is still cleared even if the upstream logout request fails.
  }

  (await cookies()).delete(CRM2_SESSION_COOKIE);
  redirect("/login");
}
