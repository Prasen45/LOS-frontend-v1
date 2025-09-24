"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import StaffManager from "@/components/admin/StaffManager"
import ProductManager from "@/components/admin/ProductManager"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tab = searchParams.get("tab") || "staff"

  const handleTabChange = (value: string) => {
    const newUrl = `/dashboard/admin?tab=${value}`
    router.push(newUrl)
  }

  return (
    <div className="px-8 pb-6">
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
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
