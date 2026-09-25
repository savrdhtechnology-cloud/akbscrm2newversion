import "server-only";
import { cookies } from "next/headers";

export const CRM2_SESSION_COOKIE="akbs_crm2_session";

export class CrmApiError extends Error{
  constructor(message:string, public status=400){super(message);}
}

const API_BASE="https://www.akbspoultry.com/api/crm";

function headersWithSession(token?:string, json=false){
  const h:Record<string,string>={"Cache-Control":"no-store"};
  if(json){
    h["Content-Type"]="application/json";
    h["Origin"]="https://www.akbspoultry.com";
    h["Sec-Fetch-Site"]="same-origin";
  }
  if(token)h["Cookie"]="akbs_crm_session="+token;
  return h;
}

async function parseResponse(res:Response){
  const body=await res.json().catch(()=>({error:"Invalid backend response"}));
  if(!res.ok)throw new CrmApiError(body?.error||"CRM request failed.",res.status);
  return body;
}

export async function crm2Gateway<T=Record<string,unknown>>(action:string,data:unknown={},token=""):Promise<T>{
  if(action==="login"){
    const res=await fetch(API_BASE+"/login",{method:"POST",headers:headersWithSession("",true),body:JSON.stringify(data),cache:"no-store",signal:AbortSignal.timeout(20000)});
    const body=await parseResponse(res);
    const setCookie=res.headers.get("set-cookie")||"";
    const match=/akbs_crm_session=([^;]+)/.exec(setCookie);
    if(!match)throw new CrmApiError("Login session was not created.",502);
    return {...body,token:match[1]} as T;
  }

  if(action==="me"){
    const res=await fetch(API_BASE+"/me",{method:"GET",headers:headersWithSession(token),cache:"no-store",signal:AbortSignal.timeout(20000)});
    return await parseResponse(res) as T;
  }

  if(action==="logout"){
    const res=await fetch(API_BASE+"/logout",{method:"POST",headers:headersWithSession(token,true),body:JSON.stringify({}),cache:"no-store",signal:AbortSignal.timeout(20000)});
    return await parseResponse(res) as T;
  }

  if(action==="dashboard"){
    const res=await fetch(API_BASE+"/snapshot?page=0",{method:"GET",headers:headersWithSession(token),cache:"no-store",signal:AbortSignal.timeout(20000)});
    const body=await parseResponse(res);
    const leads=Array.isArray(body.leads)?body.leads:[];
    const start=new Date();
    start.setUTCHours(0,0,0,0);
    start.setUTCDate(start.getUTCDate()-6);
    const buckets=new Map<string,number>();
    for(let i=0;i<7;i++){
      const d=new Date(start);
      d.setUTCDate(start.getUTCDate()+i);
      buckets.set(d.toISOString().slice(0,10),0);
    }
    for(const lead of leads){
      const key=String(lead.created_at||"").slice(0,10);
      if(buckets.has(key))buckets.set(key,(buckets.get(key)||0)+1);
    }
    return {
      inquiries:null,
      leads:Number(body.total||leads.length||0),
      project_value:Number(body.stats?.project_value||0),
      stages:body.stats?.stages||{},
      trend:[...buckets.entries()].map(([date,value])=>({date,value}))
    } as T;
  }

  throw new CrmApiError("Unsupported CRM action.",400);
}

export async function crm2SessionToken(){
  return (await cookies()).get(CRM2_SESSION_COOKIE)?.value||"";
}
