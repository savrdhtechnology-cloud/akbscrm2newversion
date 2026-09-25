import { redirect } from "next/navigation";
import type { AppRole } from "@/lib/types";
import { crm2Gateway, crm2SessionToken, CrmApiError } from "@/lib/crm/gateway";

const routeRole:Record<string,AppRole[]>={
  admin:["SUPER_ADMIN","ADMIN"],
  manager:["MANAGER"],
  employee:["EMPLOYEE"],
  partner:["PARTNER"],
  customer:["CUSTOMER"]
};

type GatewayUser={id:string;name:string;login:string;role:AppRole;active:boolean;manager_id:string|null;reference:string|null;must_change_password:boolean};

export async function getCurrentIdentity(){
  const token=await crm2SessionToken();
  if(!token)return null;
  try{
    const result=await crm2Gateway<{user:GatewayUser}>("me",{},token);
    return {id:result.user.id,email:"",role:result.user.role,name:result.user.name,login:result.user.login};
  }catch(e){
    if(e instanceof CrmApiError&&e.status===401)return null;
    throw e;
  }
}
export async function requireRole(section:keyof typeof routeRole){
  const identity=await getCurrentIdentity();
  if(!identity)redirect("/login");
  if(!routeRole[section].includes(identity.role))redirect("/login?error=forbidden");
  return identity;
}
