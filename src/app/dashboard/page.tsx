import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: authUser.email! },
    include: {
      uploads: true,
      reports: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.full_name || "User"}!</h1>
      <p className="mt-2 text-gray-600">
        Subscription Plan: <span className="font-semibold text-blue-600">{user.subscription}</span>
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium">Total Uploads</h3>
          <p className="mt-2 text-3xl font-bold">{user.uploads.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium">Reports Generated</h3>
          <p className="mt-2 text-3xl font-bold">{user.reports.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium">Account Status</h3>
          <p className="mt-2 text-sm text-green-600">Active</p>
        </div>
      </div>
    </div>
  );
}
