"use client"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { useRouter } from "next/navigation"
import { useStaff } from "./StaffContext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

const MySwal = withReactContent(Swal)

export default function StaffManager() {
  const router = useRouter()
  const { staffList, setStaffList } = useStaff()

  const handleEdit = (staff_id: number) => {
    router.push(`/dashboard/admin/edit-staff?id=${staff_id}`)
  }

  const handleAdd = () => {
    router.push("/dashboard/admin/add-staff")
  }

  const handleDelete = (staff_id: number) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this staff member?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setStaffList(staffList.filter((s) => s.staff_id !== staff_id))
        MySwal.fire("Removed!", "Staff member has been removed.", "success")
      }
    })
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Staff Management</CardTitle>
        <Button onClick={handleAdd}>Add Staff</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border rounded">
            <thead className="bg-muted text-foreground">
              <tr>
                <th className="p-2 border">Staff ID</th>
                <th className="p-2 border">Username</th>
                <th className="p-2 border">Full Name</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-muted-foreground">
                    No staff available.
                  </td>
                </tr>
              )}
              {staffList.map((staff) => (
                <tr key={staff.staff_id} className="border-t">
                  <td className="p-2 border">{staff.staff_id}</td>
                  <td className="p-2 border">{staff.username}</td>
                  <td className="p-2 border">
                    {staff.first_name} {staff.last_name}
                  </td>
                  <td className="p-2 border capitalize">{staff.role}</td>
                  <td className="p-2 border text-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(staff.staff_id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(staff.staff_id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
