import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PayoutCalculator } from "@/components/dashboard/payout-calculator";
import { PayoutTable } from "@/components/dashboard/payout-table";
import { PayoutExport } from "@/components/dashboard/payout-export";

export default async function PayoutsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Payout Management</h1>
        <PayoutExport />
      </div>
      <PayoutCalculator />
      <PayoutTable />
    </div>
  );
}
