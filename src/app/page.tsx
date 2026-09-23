import { prisma } from "@/lib/prisma";
import StatCard from "@/components/StatCard";
import TypeBadge from "@/components/TypeBadge";
import { formatTimestamp } from "@/lib/utils";
import { IconBadge, IconUserPlus, IconCar, IconUsers } from "@/components/icons";

export const dynamic = "force-dynamic";

type ActivityRow = {
  id: string;
  kind: "vehicle" | "access";
  timestamp: Date;
  description: string;
  direction: string;
  typeLabel: string;
};

export default async function DashboardPage() {
  const [employeesWithAccess, visitorsOnSite, allVehicleLogs, visitorCountToday, employeeCount] = await Promise.all([
    prisma.employee.findMany({
      include: { accessLogs: { orderBy: { timestamp: "desc" }, take: 1 } },
    }),
    prisma.visitor.findMany({ where: { checkedOutAt: null }, orderBy: { checkedInAt: "desc" } }),
    prisma.vehicleLog.findMany({ orderBy: { timestamp: "desc" }, take: 200 }),
    prisma.visitor.count({
      where: { checkedInAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    prisma.employee.count(),
  ]);

  const employeesOnSite = employeesWithAccess.filter((e) => e.accessLogs[0]?.direction === "in");

  const seenPlates = new Set<string>();
  const vehiclesOnSite: typeof allVehicleLogs = [];
  for (const log of allVehicleLogs) {
    if (!seenPlates.has(log.plate)) {
      seenPlates.add(log.plate);
      if (log.direction === "in") vehiclesOnSite.push(log);
    }
  }

  const [recentVehicleLogs, recentAccessLogs] = await Promise.all([
    prisma.vehicleLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 8,
      include: { employee: true, visitor: true },
    }),
    prisma.accessLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 8,
      include: { employee: true },
    }),
  ]);

  const activity: ActivityRow[] = [
    ...recentVehicleLogs.map((l) => ({
      id: `v-${l.id}`,
      kind: "vehicle" as const,
      timestamp: l.timestamp,
      description: `Vehicle ${l.plate}${l.employee ? ` — ${l.employee.name}` : l.visitor ? ` — ${l.visitor.name}` : ""}`,
      direction: l.direction,
      typeLabel: l.type,
    })),
    ...recentAccessLogs.map((l) => ({
      id: `a-${l.id}`,
      kind: "access" as const,
      timestamp: l.timestamp,
      description: `Badge — ${l.employee.name} (${l.employee.department})`,
      direction: l.direction,
      typeLabel: "employee",
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <p className="text-sm text-slate-500">Live snapshot of who and what is currently on site.</p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard
          label="Employees on site"
          value={employeesOnSite.length}
          hint={`of ${employeeCount} total`}
          icon={IconBadge}
          tone="port"
        />
        <StatCard label="Visitors on site" value={visitorsOnSite.length} icon={IconUserPlus} tone="amber" />
        <StatCard label="Vehicles on site" value={vehiclesOnSite.length} icon={IconCar} tone="green" />
        <StatCard label="Visitors today" value={visitorCountToday} icon={IconUsers} tone="slate" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-card">
          <div className="border-b border-slate-100 px-5 py-3.5">
            <h2 className="text-sm font-semibold text-slate-900">Employees currently on site</h2>
          </div>
          {employeesOnSite.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400">No employees signed in yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {employeesOnSite.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-5 py-3 text-sm">
                  <span className="text-slate-700">
                    {e.name} <span className="text-slate-400">— {e.department}</span>
                  </span>
                  <span className="text-xs text-slate-400">{formatTimestamp(e.accessLogs[0].timestamp)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-card">
          <div className="border-b border-slate-100 px-5 py-3.5">
            <h2 className="text-sm font-semibold text-slate-900">Visitors currently on site</h2>
          </div>
          {visitorsOnSite.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400">No visitors checked in.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {visitorsOnSite.map((v) => (
                <li key={v.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-5 py-3 text-sm">
                  <span className="text-slate-700">
                    {v.name} <span className="text-slate-400">— {v.purpose}</span>
                  </span>
                  <span className="text-xs text-slate-400">{formatTimestamp(v.checkedInAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="border-b border-slate-100 px-5 py-3.5">
          <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
        </div>
        {activity.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400">Nothing logged yet — try the Gate or Sign-In pages.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {activity.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-5 py-3 text-sm">
                <div className="flex items-center gap-2.5">
                  <TypeBadge value={a.typeLabel} />
                  <span className="text-slate-700">{a.description}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <TypeBadge value={a.direction} />
                  <span className="text-xs text-slate-400">{formatTimestamp(a.timestamp)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
