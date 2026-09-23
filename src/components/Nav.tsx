import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/gate", label: "Gate / Vehicle Entry" },
  { href: "/employees/signin", label: "Employee Sign-In" },
  { href: "/visitors/checkin", label: "Visitor Check-In" },
  { href: "/visitors/checkout", label: "Visitor Check-Out" },
  { href: "/logs/vehicles", label: "Vehicle Log" },
  { href: "/logs/access", label: "Access Log" },
  { href: "/employees", label: "Employees" },
];

export default function Nav() {
  return (
    <header className="bg-port-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">
            Port Visitor Management System <span className="text-port-500">(Demo)</span>
          </span>
        </div>
        <nav className="mt-2 flex flex-wrap gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-slate-200 hover:bg-port-800 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
