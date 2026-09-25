# AKBS Poultry Farming CRM 2.0

Fresh independent production CRM for AKBS Poultry Farming.

## Architecture
- Next.js 16 App Router + React + TypeScript
- Tailwind CSS
- Supabase/PostgreSQL integration
- Server-side auth and role gates
- Centralized RBAC
- Admin, Manager, Employee, Partner and Customer portals
- Website inquiry webhook/API integration
- Audit-ready relational CRM schema
- Vercel deployment target

The public AKBS website remains independent. This repository owns only the CRM application.

## Local setup
1. Copy `.env.example` to `.env.local`.
2. Configure the AKBS Supabase project keys and website webhook secret.
3. Apply reviewed migrations to the intended database.
4. Run `npm install`, `npm run lint`, `npm run typecheck`, `npm run build`.

No production secrets or fake business records are committed.
