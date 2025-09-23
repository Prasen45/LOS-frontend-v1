"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import StaffManager from "@/components/admin/StaffManager"
import ProductManager from "@/components/admin/ProductManager"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()

  return (
    <div className="p-8">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Admin Dashboard</CardTitle>
          <Button variant="outline" onClick={() => router.push("/")}>
            Sign Out
          </Button>
        </CardHeader>
      </Card>

      <Tabs defaultValue="staff" className="w-full">
        <TabsList>
          <TabsTrigger value="staff">Manage Staff</TabsTrigger>
          <TabsTrigger value="products">Manage Products</TabsTrigger>
        </TabsList>

        <TabsContent value="staff">
          <StaffManager />
        </TabsContent>
        <TabsContent value="products">
          <ProductManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
