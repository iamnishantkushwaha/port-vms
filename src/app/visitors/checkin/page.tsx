import { prisma } from "@/lib/prisma";
import VisitorCheckinForm from "@/components/VisitorCheckinForm";

export const dynamic = "force-dynamic";

export default async function VisitorCheckinPage({
  searchParams,
}: {
  searchParams: { plate?: string };
}) {
  const employees = await prisma.employee.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, department: true },
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">A separate, self-service flow for visitors — no gate staff data entry required.</p>
      <VisitorCheckinForm employees={employees} initialPlate={searchParams.plate} />
    </div>
  );
}
