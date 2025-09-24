"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import StaffForm from "@/components/admin/StaffForm"
import { useStaff } from "@/components/admin/StaffContext"
import { Staff } from "@/components/admin/types"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EditStaffPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const staffId = searchParams.get("id")

  const { staffList, setStaffList } = useStaff()

  const [staff, setStaff] = useState<Staff | null>(null)

  useEffect(() => {
    if (staffId) {
      const found = staffList.find((s) => s.staff_id === Number(staffId))
      setStaff(found || null)
    }
  }, [staffId, staffList])

  // Updated: make sure updatedStaff includes staff_id
  const handleUpdate = (updatedStaff: Staff) => {
    if (updatedStaff.staff_id === undefined) {
      alert("Error: staff_id missing.")
      return
    }

    setStaffList((prevList) =>
      prevList.map((s) =>
        s.staff_id === updatedStaff.staff_id ? updatedStaff : s
      )
    )
    router.push("/dashboard/admin")
  }

  if (!staff) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading staff data...
      </div>
    )
  }

  return (
    <>
      <div className="max-w-xl mx-auto py-10">
        <StaffForm
          initialData={staff}
          onSubmit={handleUpdate}
          submitLabel="Update"
        />
      </div>
    </>
  )
}
