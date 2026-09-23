import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({ orderBy: { name: "asc" } });
  const withQr = await Promise.all(
    employees.map(async (e) => ({
      ...e,
      qr: await QRCode.toDataURL(e.badgeCode, { margin: 1, width: 160 }),
    }))
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">
        Demo employee badges. Print or display one of these QR codes and scan it on the{" "}
        <a href="/employees/signin" className="font-medium text-port-700 underline underline-offset-2">
          Employee Sign-In
        </a>{" "}
        page to try the badge flow.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {withQr.map((e) => (
          <div key={e.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="flex items-center gap-4 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={e.qr}
                alt={`QR badge for ${e.name}`}
                className="h-24 w-24 rounded-lg border border-slate-100 bg-white p-1"
              />
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{e.name}</p>
                <p className="text-sm text-slate-500">{e.department}</p>
                <p className="mt-1.5 inline-block rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500">
                  {e.badgeCode}
                </p>
                {e.registeredPlate && (
                  <p className="mt-1 font-mono text-xs text-slate-400">Vehicle: {e.registeredPlate}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
