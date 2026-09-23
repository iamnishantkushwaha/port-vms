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

## Setup

```bash
npm install
npx prisma db push      # creates the local SQLite database (dev.db) from the schema
npm run db:seed         # adds 6 demo employees with badges and registered vehicles
npm run dev
```

Then open **http://localhost:3000**. Camera access works on `localhost` without HTTPS.

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

- Runs entirely on your machine with a local SQLite file (`dev.db`) — no cloud hosting,
  no external database, nothing shared with anyone unless you show it to them directly.
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
