"use client"

import { useRouter } from "next/navigation"
import { useStaff } from "@/components/admin/StaffContext"
import StaffForm from "@/components/admin/StaffForm"
import { Staff } from "@/components/admin/types"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AddStaffPage() {
  const router = useRouter()
  const { staffList, setStaffList } = useStaff()

  // Fix: exclude staff_id from the parameter type
  const handleAdd = (staff: Omit<Staff, 'staff_id'>) => {
    const newStaff: Staff = {
      ...staff,
      staff_id: Date.now(), // Simulate unique ID
    }

    setStaffList([...staffList, newStaff])
    router.push("/dashboard/admin")
  }

  return (
    <>
      <div className="max-w-xl mx-auto py-10">
        <StaffForm onSubmit={handleAdd} submitLabel="Add Staff" />
      </div>
    </>
  )
}
