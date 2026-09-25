# AKBS CRM 2.0 Architecture

## Boundary
The public website remains independent. CRM 2.0 is a separate Next.js application and repository.

## Existing assets reused
- `public.akbs_inquiries` remains the website inquiry source of truth.
- Existing `akbs_crm.leads`, activities, documents, workflows and commissions are retained.
- New tables are additive only.
- New Supabase Auth identities are linked to existing `akbs_crm.users` with `auth_user_id`.

## Security
- Browser receives only the Supabase publishable key.
- Service role key is server-only and used only by trusted route handlers/services.
- Role checks run on server routes/layouts and must also be enforced in service methods.
- Existing RLS remains enabled; new private CRM tables are not directly granted to anon/authenticated.
- Website inquiry ingress requires a separate webhook secret and validates payloads with Zod.

## Portals
Admin, Manager, Employee, Partner and Customer share one design system but have separate navigation and role gates.

## Workflow
Website Inquiry → Lead → Follow-up → Site Visit → DPR → Proposal → Loan → Conversion → Partner Commission.
