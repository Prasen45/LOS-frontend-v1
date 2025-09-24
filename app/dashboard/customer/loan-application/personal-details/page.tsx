"use client"

import { useLoanApplication } from "@/app/dashboard/customer/loan-application/LoanFormContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react'
import LoanApplicationLayout from '../layout'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ReactNode, useMemo } from "react"
import { usePathname } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import router from "next/router"



interface Errors {
  [key: string]: string
}

interface Touched {
  [key: string]: boolean
}

export default function PersonalDetailsPage() {
  const { formData, updateFormData } = useLoanApplication()
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Touched>({})
  const pathname = usePathname()
  const router = useRouter()

  const steps = [
    { number: 1, title: "Personal Details", description: "Basic information and contact details", path: "/dashboard/customer/loan-application/personal-details" },
    { number: 2, title: "Loan Requirements", description: "Loan amount, tenure and purpose", path: "/dashboard/customer/loan-application/loan-requirements" },
    { number: 3, title: "KYC Documents", description: "Upload required documents", path: "/dashboard/customer/loan-application/documents" },
    { number: 4, title: "Review & Submit", description: "Review and submit your application", path: "/dashboard/customer/loan-application/review-submit" },
  ]


  const currentStepIndex = useMemo(() => {
    return steps.findIndex((step) => pathname.startsWith(step.path))
  }, [pathname])

  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1
  const progress = (currentStep / steps.length) * 100


  const validatefield = (field: string, value: any, idType?: string): string => {
    switch (field) {
      case "firstName":
      case "lastName":
        if (!value.trim()) return "This field is required"
        if (!/^[a-zA-Z ]{2,40}$/.test(value)) return "Only letters and spaces (2-40 chars)"
        return ""

      case "dateOfBirth":
        if (!value) return "Date of Birth is required"
        const dob = new Date(value)
        const ageDifMs = Date.now() - dob.getTime()
        const ageDate = new Date(ageDifMs)
        const age = Math.abs(ageDate.getUTCFullYear() - 1970)
        if (age < 18) return "You must be at least 18 years old"
        return ""

      case "email":
        if (!value) return "Email is required"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email address"
        return ""
      case "mobile":
        if (!value) return "Mobile number is required"
        if (!/^\+?[0-9]{10,15}$/.test(value)) return "Invalid mobile number"
        return ""

      case "addressLine1":
        if (!value.trim()) return "Address is required"
        if (value.trim().length < 5 || value.trim().length > 100) return "Address must be 5-100 characters."
        return ""

      case "city":
        if (!value.trim()) return "City is required"
        if (!/^[A-Za-z ]+$/.test(value)) return "City must contain only letters and spa"
        return ""

      case "state":
        if (!value.trim()) return "Sate is required"
        return ""

      case "postalCode":
        if (!value.trim()) return "Postal Code is required"
        if (!/^\d{4,10}$/.test(value)) return "Enter valid Postal Code"
        return ""


      case "nationalIdType":
        if (!value.trim()) return "National Id is required"
        return ""

      case "nationalIdNumber":
        if (!value.trim()) return "National Id number is required"
        if (idType === "pan") {
          if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value.toUpperCase()))
            return "Enter valid Pan Number"
        } else if (idType === "aadhaar") {
          if (!/^\d{12}$/.test(value))
            return "Aadhaar must be exactly 12 digits."
        }
        return ""

      case "employmentType":
        if (!value.trim()) return "Employment type is required."
        return ""

      case "monthlyIncome":
        if (!value.trim()) return "Monthly Income is required."
        if (isNaN(Number(value)) || Number(value) <= 0)
          return "Monthly Income must be a positive number."
        return ""

      case "consent":
        if (!value) return "You must agree to the terms and conditions"
        return ""


      default:
        return ""
    }
  }
  const validateAll = (): Errors => {
    const newErrors: Errors = {}

    Object.entries(formData).forEach(([field, value]) => {
      if (field === "nationalIdNumber") {
        const err = validatefield(field, value, formData.nationalIdType)
        if (err) newErrors[field] = err
      } else {
        const err = validatefield(field, value)
        if (err) newErrors[field] = err
      }

    })

    return newErrors
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      router.push(steps[currentStep].path)
    }
  }


  const handleBlur = (field: keyof typeof formData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldError = field === "nationalIdNumber" ? validatefield(field, formData[field], formData.nationalIdType) : validatefield(field, formData[field])
    setErrors((prev) => ({ ...prev, [field]: fieldError }))
  }

  const handleSubmit = () => {
    const validationErrors = validateAll()
    setErrors(validationErrors)
    setTouched(
      Object.keys(formData).reduce((acc, key) => {
        acc[key] = true
        return acc
      }, {} as Touched)
    )

    if (Object.keys(validationErrors).length === 0) {
      alert("Form submitted successfully!")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData("firstName", e.target.value)}
            placeholder="Enter your first name"
            onBlur={() => {
              setTouched(prev => ({ ...prev, firstName: true }))
              const error = validatefield("firstName", formData.firstName)
              setErrors(prev => ({ ...prev, firstName: error }))
            }}
            required
          />
          {touched.firstName && errors.firstName && (
            <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
            onBlur={() => {
              setTouched(prev => ({ ...prev, lastName: true }))
              const error = validatefield("lastName", formData.lastName)
              setErrors(prev => ({ ...prev, lastName: error }))
            }}
            placeholder="Enter your last name"
            required
          />
          {touched.lastName && errors.lastName && (
            <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
            onBlur={() => {
              setTouched(prev => ({ ...prev, dateOfBirth: true }))
              const error = validatefield("dateOfBirth", formData.dateOfBirth)
              setErrors(prev => ({ ...prev, dateOfBirth: error }))
            }}
            required
          />
          {touched.dateOfBirth && errors.dateOfBirth && (
            <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender </Label>
          <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer not">Prefer Not</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md-grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            onBlur={() => {
              setTouched(prev => ({ ...prev, email: true }))
              const error = validatefield("email", formData.email)
              setErrors(prev => ({ ...prev, email: error }))
            }}
            placeholder="Enter your email"
            required
          />
          {touched.email && errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <Input
            id="mobile"
            value={formData.mobile}
            onChange={(e) => updateFormData("mobile", e.target.value)}
            onBlur={() => {
              setTouched(prev => ({ ...prev, mobile: true }))
              const error = validatefield("mobile", formData.mobile)
              setErrors(prev => ({ ...prev, mobile: error }))
            }}
            placeholder="Enter your mobile number"
            required
          />
          {touched.mobile && errors.mobile && (
            <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="addressLine1">Permanent Address *</Label>
          <Input
            id="addressLine1"
            value={formData.addressLine1}
            onChange={(e) => updateFormData("addressLine1", e.target.value)}
            onBlur={() => {
              setTouched(prev => ({ ...prev, addressLine1: true }))
              const error = validatefield("addressLine1", formData.addressLine1)
              setErrors(prev => ({ ...prev, addressLine1: error }))
            }}
            placeholder="Enter your address"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addressLine2">Correspondance Address</Label>
          <Input
            id="addressLine2"
            value={formData.addressLine2}
            onChange={(e) => updateFormData("addressLine2", e.target.value)}
            placeholder="Enter additional address details"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => updateFormData("city", e.target.value)}
            onBlur={() => {
              setTouched(prev => ({ ...prev, city: true }))
              const error = validatefield("city", formData.city)
              setErrors(prev => ({ ...prev, city: error }))
            }}
            placeholder="Enter your city"
            required
          />
          {touched.city && errors.city && (
            <p className="text-red-600 text-sm mt-1">{errors.city}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => updateFormData("state", e.target.value)}
            onBlur={() => {
              setTouched(prev => ({ ...prev, state: true }))
              const error = validatefield("state", formData.state)
              setErrors(prev => ({ ...prev, state: error }))
            }}
            placeholder="Enter your state"
            required
          />
          {touched.state && errors.state && (
            <p className="text-red-600 text-sm mt-1">{errors.state}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => updateFormData("postalCode", e.target.value)}
            onBlur={() => {
              setTouched(prev => ({ ...prev, postalCode: true }))
              const error = validatefield("postalCode", formData.postalCode)
              setErrors(prev => ({ ...prev, postalCode: error }))
            }}
            placeholder="Enter postal code"
            required
          />
          {touched.postalCode && errors.postalCode && (
            <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nationalIdType">National ID Type *</Label>
          <Select
            value={formData.nationalIdType}
            onValueChange={(value) => updateFormData("nationalIdType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
              <SelectItem value="pan">PAN Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationalIdNumber">National ID Number *</Label>
          <Input
            id="nationalIdNumber"
            value={formData.nationalIdNumber}
            onChange={(e) => updateFormData("nationalIdNumber", e.target.value)}
            onBlur={() => {
              setTouched(prev => ({ ...prev, nationalIdNumber: true }))
              const error = validatefield("nationalIdNumber", formData.nationalIdNumber, formData.nationalIdType)
              setErrors(prev => ({ ...prev, nationalIdNumber: error }))
            }}
            placeholder="Enter ID number"
            required
          />
          {touched.nationalIdNumber && errors.nationalIdNumber && (
            <p className="text-red-600 text-sm mt-1">{errors.nationalIdNumber}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment Type *</Label>
          <Select
            value={formData.employmentType}
            onValueChange={(value) => updateFormData("employmentType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salaried">Salaried</SelectItem>
              <SelectItem value="self-employed">Self Employed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
          <Input
            id="monthlyIncome"
            type="number"
            value={formData.monthlyIncome}
            onChange={(e) => updateFormData("monthlyIncome", e.target.value)}
            onBlur={() => {
              setTouched(prev => ({ ...prev, monthlyIncome: true }))
              const error = validatefield("monthlyIncome", formData.monthlyIncome)
              setErrors(prev => ({ ...prev, monthlyIncome: error }))
            }}
            placeholder="Enter monthly income"
            required
          />
          {touched.monthlyIncome && errors.monthlyIncome && (
            <p className="text-red-600 text-sm mt-1">{errors.monthlyIncome}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="consent"
          checked={formData.consent}
          onCheckedChange={(checked) => updateFormData("consent", checked)}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, consent: true }))
            const error = validatefield("consent", formData.consent)
            setErrors((prev) => ({ ...prev, consent: error }))
          }}
        />
        <Label htmlFor="consent" className="text-sm">
          I agree to the Terms & Conditions and consent to KYC verification *
        </Label>
        {touched.consent && errors.consent && (
          <p className="text-red-600 text-sm mt-1">{errors.consent}</p>
        )}
      </div>

    </div>
  )
}
