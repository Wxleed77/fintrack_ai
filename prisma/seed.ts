import { PrismaClient, TransactionType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@fintrack.ai" },
    update: {},
    create: {
      email: "demo@fintrack.ai",
      name: "Ali Khan",
      password: hashedPassword,
      currency: "PKR",
    },
  });

  // Seed transactions
  const transactions = [
    { type: TransactionType.INCOME, category: "Salary", amount: 90000, description: "Monthly salary", date: new Date("2026-05-01"), paymentMethod: "bank_transfer" },
    { type: TransactionType.INCOME, category: "Freelancing", amount: 35000, description: "Freelance - Client A", date: new Date("2026-05-22"), paymentMethod: "bank_transfer" },
    { type: TransactionType.EXPENSE, category: "Food", amount: 4800, description: "Imtiaz Superstore", date: new Date("2026-05-24"), paymentMethod: "cash" },
    { type: TransactionType.EXPENSE, category: "Transport", amount: 6500, description: "Fuel - PSO", date: new Date("2026-05-21"), paymentMethod: "cash" },
    { type: TransactionType.EXPENSE, category: "Entertainment", amount: 1100, description: "Netflix", date: new Date("2026-05-20"), paymentMethod: "credit_card" },
    { type: TransactionType.EXPENSE, category: "Bills", amount: 8200, description: "HESCO Electricity", date: new Date("2026-05-19"), paymentMethod: "bank_transfer" },
    { type: TransactionType.EXPENSE, category: "Food", amount: 3200, description: "Kolachi Restaurant", date: new Date("2026-05-18"), paymentMethod: "credit_card" },
    { type: TransactionType.EXPENSE, category: "Healthcare", amount: 2400, description: "Pharmacy - Meds", date: new Date("2026-05-17"), paymentMethod: "cash" },
    { type: TransactionType.EXPENSE, category: "Shopping", amount: 10900, description: "Khaadi - Clothes", date: new Date("2026-05-15"), paymentMethod: "credit_card" },
    { type: TransactionType.EXPENSE, category: "Bills", amount: 3200, description: "PTCL Internet", date: new Date("2026-05-10"), paymentMethod: "bank_transfer" },
    { type: TransactionType.EXPENSE, category: "Transport", amount: 5200, description: "Uber rides", date: new Date("2026-05-12"), paymentMethod: "credit_card" },
    { type: TransactionType.EXPENSE, category: "Food", amount: 14000, description: "Monthly groceries", date: new Date("2026-05-05"), paymentMethod: "cash" },
  ];

  for (const txn of transactions) {
    await prisma.transaction.create({ data: { ...txn, userId: user.id } });
  }

  // Seed budgets
  const budgets = [
    { category: "Food", limitAmount: 25000 },
    { category: "Transport", limitAmount: 15000 },
    { category: "Bills", limitAmount: 18000 },
    { category: "Entertainment", limitAmount: 10000 },
    { category: "Shopping", limitAmount: 12000 },
    { category: "Healthcare", limitAmount: 8000 },
  ];

  for (const budget of budgets) {
    await prisma.budget.upsert({
      where: { userId_category_month_year: { userId: user.id, category: budget.category, month: 5, year: 2026 } },
      update: {},
      create: { ...budget, userId: user.id, month: 5, year: 2026 },
    });
  }

  // Seed goals
  const goals = [
    { goalName: "Laptop", targetAmount: 180000, currentAmount: 120000, deadline: new Date("2026-07-31"), icon: "laptop", color: "#1D9E75" },
    { goalName: "Europe Trip", targetAmount: 350000, currentAmount: 85000, deadline: new Date("2027-06-30"), icon: "plane", color: "#378ADD" },
    { goalName: "Emergency Fund", targetAmount: 500000, currentAmount: 200000, deadline: new Date("2026-12-31"), icon: "shield", color: "#7F77DD" },
  ];

  for (const goal of goals) {
    await prisma.savingsGoal.create({ data: { ...goal, userId: user.id } });
  }

  // Seed subscriptions
  const subscriptions = [
    { serviceName: "Netflix", cost: 1100, billingDate: 20, category: "Entertainment", icon: "tv" },
    { serviceName: "Spotify", cost: 450, billingDate: 15, category: "Entertainment", icon: "music" },
    { serviceName: "PTCL Internet", cost: 3200, billingDate: 10, category: "Bills", icon: "wifi" },
    { serviceName: "Gym Membership", cost: 5000, billingDate: 1, category: "Healthcare", icon: "dumbbell" },
  ];

  for (const sub of subscriptions) {
    await prisma.subscription.create({ data: { ...sub, userId: user.id } });
  }

  console.log("✅ Database seeded successfully!");
  console.log("📧 Demo login: demo@fintrack.ai");
  console.log("🔑 Demo password: password123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
