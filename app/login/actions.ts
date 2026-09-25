"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CRM2_SESSION_COOKIE, crm2Gateway, CrmApiError } from "@/lib/crm/gateway";
import type { AppRole } from "@/lib/types";

export async function loginAction(formData:FormData){
 const login=String(formData.get("login")||"").trim();
 const password=String(formData.get("password")||"");
 if(!login||!password)redirect("/login?error=invalid");
 try{
  const result=await crm2Gateway<{token:string;user:{role:AppRole}}>("login",{login,password});
  (await cookies()).set(CRM2_SESSION_COOKIE,result.token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:8*60*60});
  const destination:Record<AppRole,string>={SUPER_ADMIN:"/admin/dashboard",ADMIN:"/admin/dashboard",MANAGER:"/manager/dashboard",EMPLOYEE:"/employee/dashboard",PARTNER:"/partner/dashboard",CUSTOMER:"/customer/dashboard"};
  redirect(destination[result.user.role]||"/login");
 }catch(e){
  if(e instanceof CrmApiError){
   console.error("CRM2_LOGIN_FAILED",{status:e.status,message:e.message});
   if(e.status===401)redirect("/login?error=credentials");
   if(e.status===429)redirect("/login?error=rate");
   redirect("/login?error=backend");
  }
  console.error("CRM2_LOGIN_UNEXPECTED",{name:e instanceof Error?e.name:"unknown"});
  redirect("/login?error=backend");
 }
}
