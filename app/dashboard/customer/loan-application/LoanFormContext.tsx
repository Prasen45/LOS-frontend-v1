"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface LoanApplicationData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email: string
  mobile: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  nationalIdType: string
  nationalIdNumber: string
  employmentType: string
  monthlyIncome: string
  consent: boolean
  loanProduct: string
  loanAmount: string
  tenure: string
  purposeOfLoan: string
  preferredEMIDate: string
  existingEMI: string
  documents: any[]
}

interface Errors {
  [key: string]: string
}

interface LoanApplicationContextType {
  formData: LoanApplicationData
  updateFormData: (field: keyof LoanApplicationData, value: any) => void
  resetFormData: () => void
  validateAllFields: () => Errors
}

const defaultFormData: LoanApplicationData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  email: "",
  mobile: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  nationalIdType: "",
  nationalIdNumber: "",
  employmentType: "",
  monthlyIncome: "",
  consent: false,
  loanProduct: "",
  loanAmount: "",
  tenure: "",
  purposeOfLoan: "",
  preferredEMIDate: "",
  existingEMI: "",
  documents: [],
}

const LoanApplicationContext = createContext<LoanApplicationContextType | undefined>(undefined)

export function LoanApplicationProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<LoanApplicationData>(defaultFormData)

  const updateFormData = (field: keyof LoanApplicationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetFormData = () => {
    setFormData(defaultFormData)
  }

  const validateField = (field: keyof LoanApplicationData, value: any, idType?: string): string => {
    if (typeof value === "string") value = value.trim()

    switch (field) {
      case "firstName":
      case "lastName":
        if (!value) return "This field is required"
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
        if (!value) return "Address is required"
        if (value.length < 5 || value.length > 100) return "Address must be 5-100 characters"
        return ""

      case "city":
        if (!value) return "City is required"
        if (!/^[A-Za-z ]+$/.test(value)) return "City must contain only letters"
        return ""

      case "state":
        if (!value) return "State is required"
        return ""

      case "postalCode":
        if (!value) return "Postal Code is required"
        if (!/^\d{4,10}$/.test(value)) return "Enter a valid Postal Code"
        return ""

      case "nationalIdType":
        if (!value) return "National ID type is required"
        return ""

      case "nationalIdNumber":
        if (!value) return "National ID number is required"
        if (idType === "pan") {
          if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value.toUpperCase()))
            return "Enter valid PAN number"
        } else if (idType === "aadhaar") {
          if (!/^\d{12}$/.test(value)) return "Aadhaar must be exactly 12 digits"
        }
        return ""

      case "employmentType":
        if (!value) return "Employment type is required"
        return ""

      case "monthlyIncome":
        if (!value) return "Monthly income is required"
        if (isNaN(Number(value)) || Number(value) <= 0) return "Must be a positive number"
        return ""

      case "consent":
        if (!value) return "You must agree to the terms and conditions"
        return ""

      default:
        return ""
    }
  }

  const validateAllFields = (): Errors => {
    const newErrors: Errors = {}
    for (const field in formData) {
      const key = field as keyof LoanApplicationData
      const value = formData[key]
      if (key === "nationalIdNumber") {
        const err = validateField(key, value, formData.nationalIdType)
        if (err) newErrors[key] = err
      } else {
        const err = validateField(key, value)
        if (err) newErrors[key] = err
      }
    }
    return newErrors
  }

  return (
    <LoanApplicationContext.Provider
      value={{ formData, updateFormData, resetFormData, validateAllFields }}
    >
      {children}
    </LoanApplicationContext.Provider>
  )
}

export function useLoanApplication() {
  const context = useContext(LoanApplicationContext)
  if (!context) {
    throw new Error("useLoanApplication must be used within a LoanApplicationProvider")
  }
  return context
}
