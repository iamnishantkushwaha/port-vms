import { prisma } from "@/lib/prisma";
import TypeBadge from "@/components/TypeBadge";
import { formatTimestamp } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccessLogPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim();

  const logs = await prisma.accessLog.findMany({
    where: q ? { employee: { name: { contains: q } } } : undefined,
    orderBy: { timestamp: "desc" },
    take: 200,
    include: { employee: true },
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Every employee badge sign-in and sign-out.</p>

      <form className="max-w-xs">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by employee name..."
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-port-500 focus:outline-none focus:ring-2 focus:ring-port-100"
        />
      </form>

      {/* Mobile: stacked cards */}
      <div className="space-y-3 sm:hidden">
        {logs.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-400 shadow-card">
            No badge activity yet.
          </p>
        )}
        {logs.map((log) => (
          <div key={log.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-800">{log.employee.name}</span>
              <TypeBadge value={log.direction} />
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-slate-500">
              <span>{log.employee.department}</span>
              <span className="text-xs text-slate-400">{formatTimestamp(log.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tablet and up: table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Employee</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Direction</th>
                <th className="px-5 py-3 font-semibold">Method</th>
                <th className="px-5 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{log.employee.name}</td>
                  <td className="px-5 py-3 text-slate-600">{log.employee.department}</td>
                  <td className="px-5 py-3">
                    <TypeBadge value={log.direction} />
                  </td>
                  <td className="px-5 py-3 capitalize text-slate-600">{log.method}</td>
                  <td className="px-5 py-3 text-slate-400">{formatTimestamp(log.timestamp)}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                    No badge activity yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
