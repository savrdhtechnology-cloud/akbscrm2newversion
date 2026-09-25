import "server-only";
import { createHmac } from "node:crypto";
import { cookies, headers } from "next/headers";
export const CRM2_SESSION_COOKIE = "akbs_crm2_session";
export class CrmApiError extends Error { constructor(message:string, public status=400){super(message);} }
export async function crm2Gateway<T=Record<string,unknown>>(action:string,data:unknown={},token=""):Promise<T>{
 const url=process.env.AKBS_SUPABASE_URL;
 const key=process.env.AKBS_SUPABASE_PUBLISHABLE_KEY;
 const gate=process.env.AKBS_CRM2_GATEWAY_KEY;
 if(!url||!key||!gate)throw new CrmApiError("CRM configuration is not ready.",503);
 const res=await fetch(`${url}/rest/v1/rpc/akbs_crm2_gateway`,{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({p_key:gate,p_action:action,p_data:data,p_token:token}),cache:"no-store",signal:AbortSignal.timeout(20000)});
 const result=await res.json();
 if(!res.ok)throw new CrmApiError("CRM database request failed.",502);
 if(result?.error)throw new CrmApiError(result.error,result.status||400);
 return result as T;
}
export async function crm2SessionToken(){return (await cookies()).get(CRM2_SESSION_COOKIE)?.value||"";}
export async function loginRateKey(){const h=await headers();const ip=h.get("x-vercel-forwarded-for")||h.get("x-forwarded-for")?.split(",")[0]||"local";return createHmac("sha256",process.env.AKBS_CRM2_GATEWAY_KEY||"missing").update(ip.trim()).digest("hex");}
