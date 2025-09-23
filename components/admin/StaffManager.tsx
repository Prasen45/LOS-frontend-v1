"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type Staff = {
  id: number
  name: string
  username: string
  role: "sales" | "credit" | "operations"
}

export default function StaffManager() {
  const [staffList, setStaffList] = useState<Staff[]>([
    { id: 1, name: "John Doe", username: "john", role: "sales" },
    { id: 2, name: "Jane Smith", username: "jane", role: "credit" },
  ])

  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [role, setRole] = useState<Staff["role"]>("sales")

  const [editId, setEditId] = useState<number | null>(null)

  const resetForm = () => {
    setName("")
    setUsername("")
    setRole("sales")
    setEditId(null)
  }

  const handleAddOrUpdate = () => {
    if (!name || !username) {
      alert("Name and Username are required.")
      return
    }

    const confirmAction = window.confirm(
      editId
        ? "Are you sure you want to update this staff member?"
        : "Are you sure you want to add this staff member?"
    )

    if (!confirmAction) return

    if (editId) {
      // Update existing staff
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === editId ? { ...s, name, username, role } : s
        )
      )
    } else {
      // Add new staff
      const newStaff: Staff = {
        id: Date.now(),
        name,
        username,
        role,
      }
      setStaffList([...staffList, newStaff])
    }

    resetForm()
  }

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this staff member?"
    )
    if (!confirmDelete) return
    setStaffList(staffList.filter((s) => s.id !== id))
  }

  const handleEdit = (staff: Staff) => {
    setEditId(staff.id)
    setName(staff.name)
    setUsername(staff.username)
    setRole(staff.role)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form */}
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div>
            <Label>Name</Label>
            <Input
              placeholder="Enter staff name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label>Username</Label>
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as Staff["role"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddOrUpdate}>
            {editId ? "Update" : "Add"}
          </Button>
        </div>

        {/* Table/List */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border rounded">
            <thead className="bg-muted text-foreground">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Username</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id} className="border-t">
                  <td className="p-2 border">{staff.id}</td>
                  <td className="p-2 border">{staff.username}</td>
                  <td className="p-2 border">{staff.name}</td>
                  <td className="p-2 border capitalize">{staff.role}</td>
                  <td className="p-2 border text-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(staff)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(staff.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
              {staffList.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-muted-foreground">
                    No staff added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
