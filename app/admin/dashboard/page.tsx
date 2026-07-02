import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardHomePage() {
  const [userCount, linkCount, totalClicks] = await Promise.all([
    prisma.user.count(),
    prisma.link.count(),
    prisma.link.aggregate({ _sum: { clicks: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/admin/dashboard/users/new">
          <Button>Add User</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-500">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-500">
              Total Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{linkCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-500">
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalClicks._sum.clicks || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h2 className="mb-2 text-lg font-semibold">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/dashboard/users">
            <Button variant="outline">Manage Users</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
