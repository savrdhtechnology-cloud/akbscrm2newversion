import "server-only";
import type { AppRole } from "@/lib/types";
import { crm2Gateway, crm2SessionToken } from "@/lib/crm/gateway";

export type DashboardData={inquiries:number|null;leads:number;pipeline:{name:string;value:number}[];trend:{name:string;inquiries:number}[];projectValue:number};
type GatewayDashboard={inquiries:number|null;leads:number;project_value:number;stages:Record<string,number>;trend:{date:string;value:number}[]};

export async function getDashboardData(_role:AppRole,_userId:string):Promise<DashboardData>{
 const token=await crm2SessionToken();
 const data=await crm2Gateway<GatewayDashboard>("dashboard",{},token);
 const stageOrder=["NEW","CONTACTED","QUALIFIED","SITE_VISIT","DPR","PROPOSAL","LOAN_PROCESSING","CONVERTED","LOST"];
 return{
   inquiries:data.inquiries,
   leads:data.leads||0,
   projectValue:Number(data.project_value||0),
   pipeline:stageOrder.map(name=>({name,value:Number(data.stages?.[name]||0)})),
   trend:(data.trend||[]).map(x=>({name:new Date(x.date+"T00:00:00Z").toLocaleDateString("en-IN",{weekday:"short"}),inquiries:Number(x.value||0)}))
 };
}
