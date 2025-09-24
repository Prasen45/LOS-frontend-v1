'use client'

import React, { useState } from 'react'
import Swal from 'sweetalert2'
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
import { Staff } from './types'

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
    role: 'sales_executive', // Updated default role
    ...initialData,
  } as T)

  const [errors, setErrors] = useState<Partial<Record<keyof Staff, string>>>({})

  const handleChange = (field: keyof Staff, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value } as T))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Staff, string>> = {}

    if (!form.username) newErrors.username = 'Username is required'
    if (!form.email) newErrors.email = 'Email is required'
    if (!form.mobile) newErrors.mobile = 'Mobile is required'
    if (!form.first_name) newErrors.first_name = 'First name is required'
    if (!form.last_name) newErrors.last_name = 'Last name is required'
    if (!form.role) newErrors.role = 'Role is required'

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      await Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields.',
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
            <Label>Username *</Label>
            <Input
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <Label>Mobile *</Label>
            <Input
              type="tel"
              placeholder="Enter mobile number"
              value={form.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
            />
            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
          </div>

          <div>
            <Label>First Name *</Label>
            <Input
              placeholder="Enter first name"
              value={form.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
            />
            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
          </div>

          <div>
            <Label>Last Name *</Label>
            <Input
              placeholder="Enter last name"
              value={form.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
            />
            {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
          </div>

          <div>
            <Label>Role *</Label>
            <Select
              value={form.role}
              onValueChange={(value) => handleChange('role', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales_executive">Sales Executive</SelectItem>
                <SelectItem value="credit_analyst">Credit Analyst</SelectItem>
                <SelectItem value="credit_manager">Credit Manager</SelectItem>
                <SelectItem value="loan_officer">Loan Officer</SelectItem> {/* Changed here */}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>

          <Button type="submit" className="w-full">
            {submitLabel} Staff
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
