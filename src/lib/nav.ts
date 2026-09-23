import {
  IconGrid,
  IconCar,
  IconBadge,
  IconUserPlus,
  IconUserCheck,
  IconList,
  IconUsers,
} from "@/components/icons";

export type NavLink = {
  href: string;
  label: string;
  icon: (props: { className?: string }) => JSX.Element;
};

export type NavSection = { title: string; links: NavLink[] };

export const navSections: NavSection[] = [
  {
    title: "Overview",
    links: [{ href: "/", label: "Dashboard", icon: IconGrid }],
  },
  {
    title: "Gate operations",
    links: [
      { href: "/gate", label: "Vehicle entry (ANPR)", icon: IconCar },
      { href: "/employees/signin", label: "Employee sign-in", icon: IconBadge },
    ],
  },
  {
    title: "Visitors",
    links: [
      { href: "/visitors/checkin", label: "Check-in", icon: IconUserPlus },
      { href: "/visitors/checkout", label: "Check-out", icon: IconUserCheck },
    ],
  },
  {
    title: "Records",
    links: [
      { href: "/logs/vehicles", label: "Vehicle log", icon: IconList },
      { href: "/logs/access", label: "Access log", icon: IconList },
      { href: "/employees", label: "Employees", icon: IconUsers },
    ],
  },
];
