'use client'

import React, { useState } from 'react'
import Swal from 'sweetalert2' // <--- Import SweetAlert2 here
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Staff } from './types' // Make sure this points to your actual types file

// Make staff_id optional in the form props
type StaffFormProps<T extends Partial<Staff>> = {
  initialData?: T
  onSubmit: (data: T) => void
  submitLabel: string
}

export default function StaffForm<T extends Partial<Staff>>({
  initialData,
  onSubmit,
  submitLabel,
}: StaffFormProps<T>) {
  const [form, setForm] = useState<T>({
    username: '',
    email: '',
    mobile: '',
    first_name: '',
    last_name: '',
    role: 'sales',
    ...initialData,
  } as T)

  const handleChange = (field: keyof Staff, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value } as T))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !form.username ||
      !form.email ||
      !form.mobile ||
      !form.first_name ||
      !form.last_name
    ) {
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields.',
      })
      return
    }

    const result = await Swal.fire({
      title: `Do you want to ${submitLabel.toLowerCase()} this staff member?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    })

    if (result.isConfirmed) {
      onSubmit(form)
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Staff member has been ${submitLabel.toLowerCase()}ed.`,
        timer: 1500,
        showConfirmButton: false,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submitLabel} Staff</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Username</Label>
            <Input
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div>
            <Label>Mobile</Label>
            <Input
              type="tel"
              value={form.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
            />
          </div>

          <div>
            <Label>First Name</Label>
            <Input
              value={form.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
            />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input
              value={form.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
            />
          </div>

          <div>
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(value) => handleChange('role', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            {submitLabel} Staff
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
