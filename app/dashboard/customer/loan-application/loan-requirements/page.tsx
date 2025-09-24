"use client"

import { useLoanApplication } from "../LoanFormContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type LoanProductKey = 'personal' | 'home' | 'business' | 'gold' | 'two-wheeler'
type LoanApplicationDataKeys = 'loanProduct' | 'loanAmount' | 'tenure' | 'purposeOfLoan' | 'preferredEMIDate' | 'existingEMI'


const loanConfig: Record<LoanProductKey, {
  label: string
  minAmount: number
  maxAmount: number
  minTenure: number
  maxTenure: number
}> = {
  personal: { label: "Personal Loan", minAmount: 100000, maxAmount: 3500000, minTenure: 6, maxTenure: 84 },
  home: { label: "Home Loan", minAmount: 300000, maxAmount: 1000000000, minTenure: 60, maxTenure: 360 },
  business: { label: "Business Loan", minAmount: 50000, maxAmount: 1000000000, minTenure: 12, maxTenure: 60 },
  gold: { label: "Gold Loan", minAmount: 25001, maxAmount: 4000000, minTenure: 6, maxTenure: 36 },
  "two-wheeler": { label: "Two-Wheeler Loan", minAmount: 10000, maxAmount: 1000000, minTenure: 6, maxTenure: 60 },
}

export default function LoanRequirementsPage() {
  const { formData, updateFormData } = useLoanApplication()

  const [errors, setErrors] = useState({
    loanProduct: "",
    loanAmount: "",
    tenure: "",
    purposeOfLoan: "",
    preferredEMIDate: "",
    existingEMI: "",
  })

  const selectedLoan = formData.loanProduct as LoanProductKey | undefined
  const config = selectedLoan ? loanConfig[selectedLoan] : null

  const [showHints, setShowHints] = useState(false)

  useEffect(() => {
    if (selectedLoan) setShowHints(true)
    else setShowHints(false)
  }, [selectedLoan])

  const validateField = (field: string, value: any) => {

    let error = ""

    switch (field) {
      case "loanProduct":
        if (!value) error = "Loan Product is required"
        break

      case "loanAmount":
        if (!value) error = "Loan Amount is required"
        if (!config) error = "first select the Loan Product"
        else {
          const valNum = Number(value)
          if (isNaN(valNum)) error = "Loan Amount must be a number."
          else if (valNum < config.minAmount)
            error = `Minimum loan amount for ${config.label} is ₹${config.minAmount.toLocaleString()}.`
          else if (valNum > config.maxAmount)
            error = `Maximum loan amount for ${config.label} is ₹${config.maxAmount.toLocaleString()}.`
        }
        break

      case "tenure":
        if (!value) error = "Tenure is required."
        else if (!config)
          error = "Please select a loan product first."
        else {
          const valNum = Number(value)
          if (isNaN(valNum)) error = "Tenure must be a number."
          else if (valNum < config.minTenure)
            error = `Minimum tenure for ${config.label} is ${config.minTenure} months.`
          else if (valNum > config.maxTenure)
            error = `Maximum tenure for ${config.label} is ${config.maxTenure} months.`
        }
        break

      case "purposeOfLoan":
        if (!value.trim()) error = "Purpose of Loan is required"
        break

      case "preferredEMIDate":
        if (!value) error = "Preferred EMI Date is required"
        if (value) {
          const valNum = Number(value)
          if (isNaN(valNum)) error = "Preferred EMI Date should be positive."
          if (valNum < 1 || valNum > 28) error = "Preferred EMI Date should be in between 1 to 28."
        }
        break

      case "existingEMI":
        if(!value) error = "Existing EMI required"
        if (value) {
          const valNum = Number(value)
          if (valNum < 0)
            error = "Existing EMI must be a number ≥ 0."
        }
        break

      default:
        break
    }

    setErrors(prev => ({ ...prev, [field]: error }))
    return error === ""
  }

  const handleChange = (field: LoanApplicationDataKeys, value: any) => {
    const isValid = validateField(field, value)
    if (isValid || value === "") {
      updateFormData(field, value)
    }
  }


  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loanProduct">Loan Product *</Label>
          <Select value={formData.loanProduct || ""} onValueChange={(value) => {updateFormData("loanProduct", value)
            setErrors(prev => ({ ...prev, loanAmount: "", tenure: ""}))
          }} 
          >
            <SelectTrigger>
              <SelectValue placeholder="Select loan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal Loan</SelectItem>
              <SelectItem value="home">Home Loan</SelectItem>
              <SelectItem value="business">Business Loan</SelectItem>
              <SelectItem value="gold">Gold Loan</SelectItem>
              <SelectItem value="two-wheeler">Two Wheeler Loan</SelectItem>
            </SelectContent>
          </Select>
          {errors.loanProduct && <p className="text-red-600 text-sm">{errors.loanProduct}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
          <Input
            id="loanAmount"
            type="text"
            value={formData.loanAmount || ""}
            onChange={(e) => updateFormData("loanAmount", e.target.value)}
            placeholder="Enter loan amount"
            onBlur={(e) => validateField("loanAmount", e.target.value)}
          />
          {showHints && config  &&(<p className="text-[12px] text-gray-600">Min: ₹{config?.minAmount.toLocaleString()}, Max: ₹{config?.maxAmount.toLocaleString()} </p>
        )}
         {errors.loanAmount && <p className="text-red-600 text-sm">{errors.loanAmount}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tenure">Tenure (Months) *</Label>
          <Input
            id="tenure"
            type="text"
            value={formData.tenure || ""}
            onChange={(e) => handleChange("tenure", e.target.value)}
            onBlur={(e) => validateField("tenure", e.target.value)}
            placeholder="Enter tenure in months"
          />
          {showHints && config && (
            <p className="text-[12px] text-gray-600">
              Min: {config.minTenure} months, Max: {config.maxTenure} months
            </p>
          )}
          {errors.tenure && <p className="text-red-600 text-sm">{errors.tenure}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredEMIDate">Preferred EMI Date *</Label>
          <Input
            id="preferredEMIDate"
            type="text"
            value={formData.preferredEMIDate || ""}
            onChange={(e) => handleChange("preferredEMIDate", e.target.value)}
            onBlur={(e) => validateField("preferredEMIDate", e.target.value)}
            placeholder="Enter the preferred EMI Date"
          />
          {errors.preferredEMIDate && <p className="text-red-600 text-sm">{errors.preferredEMIDate}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purposeOfLoan">Purpose of Loan *</Label>
          <Input
            id="purposeOfLoan"
            type="text"
            value={formData.purposeOfLoan || ""}
            onChange={(e) => handleChange("purposeOfLoan", e.target.value)}
            onBlur={(e) => validateField("purposeOfLoan", e.target.value)}
            placeholder="Enter the Purpose of Loan"
          />
          {errors.purposeOfLoan && <p className="text-red-600 text-sm">{errors.purposeOfLoan}</p>}
        </div>

      <div className="space-y-2">
        <Label htmlFor="existingEMI">Existing EMI Obligations (₹)</Label>
        <Input
          id="existingEMI"
          type="text"
          value={formData.existingEMI || ""}
          onChange={(e) => handleChange("existingEMI", e.target.value)}
          onBlur={(e) => validateField("existingEMI", e.target.value)}
          placeholder="Enter existing EMI amount"
        />
        {errors.existingEMI && <p className="text-red-600 text-sm">{errors.existingEMI}</p>}
      </div>
      </div>
    </div>
  )
}
