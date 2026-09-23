import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const employees = [
  {
    name: "Aditya Sharma",
    department: "Operations",
    badgeCode: "EMP-1001",
    registeredPlate: "GJ05AB1234",
  },
  {
    name: "Priya Nair",
    department: "Security",
    badgeCode: "EMP-1002",
    registeredPlate: "GJ05CD5678",
  },
  {
    name: "Rohan Mehta",
    department: "Logistics",
    badgeCode: "EMP-1003",
    registeredPlate: "MH04EF9012",
  },
  {
    name: "Sneha Patil",
    department: "Administration",
    badgeCode: "EMP-1004",
    registeredPlate: "GJ05GH3456",
  },
  {
    name: "Vikram Singh",
    department: "Maintenance",
    badgeCode: "EMP-1005",
    registeredPlate: "MH04IJ7890",
  },
  {
    name: "Ananya Iyer",
    department: "Finance",
    badgeCode: "EMP-1006",
    registeredPlate: null,
  },
];

async function main() {
  console.log("Seeding demo employees...");
  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { badgeCode: emp.badgeCode },
      update: {},
      create: emp,
    });
  }
  console.log(`Seeded ${employees.length} employees.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
