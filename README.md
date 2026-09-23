# Port Visitor Management System — Demo

A local, click-through demo built with Next.js showing what a full visitor management
system for a single-gate port could look like: automatic license plate capture (ANPR),
employee badge sign-in, and a separate visitor check-in flow — all logged locally and
split into employees vs. visitors.

This is a **proof of concept for a client walkthrough**, not a production system. See
"Limitations" below.

## What's included

- **Gate / Vehicle Entry** (`/gate`) — capture a plate photo (webcam or upload), run it
  through real OCR, review/correct the result, and log it as an employee or visitor
  vehicle entry or exit.
- **Employee Sign-In** (`/employees/signin`) — scan a QR "badge" with the camera to sign
  an employee in or out.
- **Employee Directory** (`/employees`) — the seeded demo employees, each with a
  printable/scannable QR badge.
- **Visitor Check-In** (`/visitors/checkin`) — a self-service form (name, company,
  purpose, host, vehicle plate, optional ID photo) that issues a QR visitor pass.
- **Visitor Check-Out** (`/visitors/checkout`) — scan the pass (or type its code) to
  close out a visit.
- **Vehicle Log** and **Access Log** (`/logs/vehicles`, `/logs/access`) — searchable
  history of everything captured.
- **Dashboard** (`/`) — who and what is currently on site, plus recent activity.

## Requirements

- Node.js 18 or newer
- A webcam (optional — every capture screen also accepts a file upload as a fallback)
- Internet access the first time you run it, so the OCR engine (Tesseract) can download
  its language data. After that first run it's cached locally.

## Database

This project uses **Postgres** (a free [Neon](https://neon.tech) database), set via
`DATABASE_URL` in `.env`. Using a real hosted database — instead of a local SQLite file —
means the exact same setup works whether you're running locally or deployed on Vercel;
there's one database either way, not two separate setups to keep in sync.

## Setup (local)

```bash
npm install
npx prisma db push      # creates the tables in your Postgres database from the schema
npm run db:seed         # adds 6 demo employees with badges and registered vehicles
npm run dev
```

Then open **http://localhost:3000**. Camera access works on `localhost` without HTTPS.

## Deploying to Vercel

1. Push this project to a GitHub repo (Vercel deploys from git).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import that repo. Vercel
   auto-detects Next.js, no config needed.
3. Before the first deploy, add an environment variable in the Vercel project settings:
   - Name: `DATABASE_URL`
   - Value: the same Postgres connection string from your local `.env`
   (Project Settings → Environment Variables — add it for Production, Preview, and
   Development so it works on every deploy.)
4. Deploy. Vercel runs `npm install` (which also runs `prisma generate` via the
   `postinstall` script) and `next build` automatically.
5. The database schema only needs to be pushed once (from your machine, against the same
   `DATABASE_URL`) — `npx prisma db push` already did that in the setup step above, so
   there's nothing extra to run on Vercel's side for the schema itself.
6. Open the `*.vercel.app` URL Vercel gives you — that's your shareable link.

**Camera/mic note:** browsers only allow camera access on `https://` or `localhost`.
Vercel deployments are `https://` by default, so the Gate/Sign-In/Check-In/Check-Out
camera flows work the same as they do locally — no extra setup needed there.

**A known limitation on Vercel's free (Hobby) tier:** serverless functions are capped at
10 seconds each. The OCR step (`/api/ocr`) can occasionally take longer than that on a
cold start, in which case that one request would time out — the operator can just retry,
or type the plate in manually instead. This isn't an issue on Vercel Pro (60s limit) or
when running locally.

## Suggested demo script

1. Open **Employees** — show the seeded staff and their QR badges (print one, or show it
   on a phone screen).
2. Open **Gate**, capture a photo of an employee's badge-linked plate (or just type a
   registered plate, e.g. `GJ05AB1234`), confirm — show it's logged as an **employee**
   vehicle.
3. Type an unregistered plate and confirm — show it's logged as **unknown**, prompting a
   visitor check-in.
4. Open **Visitor Check-In**, fill the form, show the QR pass that's issued and the
   simulated "host notified" message.
5. Open **Employee Sign-In**, scan a badge QR (from the Employees page) with the camera —
   show the sign-in log, then scan again to show it toggles to sign-out.
6. Open **Visitor Check-Out**, scan the visitor's pass QR to close the visit.
7. Open the **Dashboard** to show live occupancy, and the two **Log** pages to show the
   full searchable history.

## Limitations (by design, for a demo)

- No real ANPR camera or RFID/card reader hardware — a webcam/photo stands in for the
  fixed gate camera, and a QR code stands in for a physical badge.
- OCR accuracy depends on photo quality; a production system would use a purpose-built
  ANPR camera and engine for reliable results in all lighting/weather conditions.
- No authentication on the dashboard or capture pages, no role-based access control, no
  multi-gate support, no integration with existing HR/access-control systems.

These are exactly the kinds of things to scope into the real costing conversation once
the client has seen the demo.

## Project structure

```
prisma/schema.prisma      Employees, visitors, vehicle log, access log
prisma/seed.ts            Demo employee data
src/app/                  Pages (App Router) and API routes
src/components/           CameraCapture, QrScanner, and shared UI bits
src/lib/                  Prisma client, OCR helper, formatting utilities
```

## Note on this build

This project's source was hand-written and has not been run through `npm install` /
`npm run build` in the environment it was created in (that environment's network policy
blocks the npm registry). It follows standard, well-established Next.js 14 + Prisma +
Tailwind patterns throughout, but if `npm run build` or `npm run dev` surfaces a small
error on your machine, it's most likely a minor one (a type mismatch or a missing
import) — happy to fix it immediately if you paste the error back.
