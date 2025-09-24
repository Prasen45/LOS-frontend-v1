// app/dashboard/layout.tsx
"use client"

import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { ProductProvider } from "@/components/admin/ProductContext"
import { StaffProvider } from "@/components/admin/StaffContext"
import AdminHeader from "@/components/admin/AdminHeader"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  // Show Back button only if NOT on the root dashboard pages
  const showBackButton = pathname !== "/dashboard/admin" && pathname !== "/dashboard"

  return (
    <ProductProvider>
      <StaffProvider>
        <AdminHeader title="Admin Dashboard" />

        <div className="max-w-8xl mx-auto px-4 pt-4 flex items-start space-x-4">
          {showBackButton && (
            <Button variant="ghost" onClick={() => router.back()}>
              &larr; Back
            </Button>
          )}
          <main className="flex-1 pb-4">
            {children}
          </main>
        </div>
      </StaffProvider>
    </ProductProvider>
  )
}
