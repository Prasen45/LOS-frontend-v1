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

interface LoanApplicationContextType {
  formData: LoanApplicationData
  updateFormData: (field: keyof LoanApplicationData, value: any) => void
  resetFormData: () => void
  saveApplication: (data?: Partial<LoanApplicationData>) => void
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

  const saveApplication = (data?: Partial<LoanApplicationData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...data}

      return updated
    })
  }

  return (
    <LoanApplicationContext.Provider value={{ formData, updateFormData, resetFormData, saveApplication }}>
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
