"use client"

import { useLoanApplication } from "../LoanFormContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LoanRequirementsPage() {
  const { formData, updateFormData } = useLoanApplication()

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loanProduct">Loan Product *</Label>
          <Select value={formData.loanProduct} onValueChange={(value) => updateFormData("loanProduct", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select loan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal Loan (PL)</SelectItem>
              <SelectItem value="home">Home Loan (HL)</SelectItem>
              <SelectItem value="business">Business Loan (BL)</SelectItem>
              <SelectItem value="gold">Gold Loan (GL)</SelectItem>
              <SelectItem value="two-wheeler">Two Wheeler Loan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
          <Input
            id="loanAmount"
            type="number"
            value={formData.loanAmount}
            onChange={(e) => updateFormData("loanAmount", e.target.value)}
            placeholder="Enter loan amount"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tenure">Tenure (Months) *</Label>
          <Select value={formData.tenure} onValueChange={(value) => updateFormData("tenure", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select tenure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 Months</SelectItem>
              <SelectItem value="24">24 Months</SelectItem>
              <SelectItem value="36">36 Months</SelectItem>
              <SelectItem value="48">48 Months</SelectItem>
              <SelectItem value="60">60 Months</SelectItem>
              <SelectItem value="84">84 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredEMIDate">Preferred EMI Date *</Label>
          <Select value={formData.preferredEMIDate} onValueChange={(value) => updateFormData("preferredEMIDate", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select EMI date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st</SelectItem>
              <SelectItem value="5">5th</SelectItem>
              <SelectItem value="10">10th</SelectItem>
              <SelectItem value="15">15th</SelectItem>
              <SelectItem value="20">20th</SelectItem>
              <SelectItem value="25">25th</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purposeOfLoan">Purpose of Loan *</Label>
        <Textarea
          id="purposeOfLoan"
          value={formData.purposeOfLoan}
          onChange={(e) => updateFormData("purposeOfLoan", e.target.value)}
          placeholder="Describe the purpose of your loan"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="existingEMI">Existing EMI Obligations (₹)</Label>
        <Input
          id="existingEMI"
          type="number"
          value={formData.existingEMI}
          onChange={(e) => updateFormData("existingEMI", e.target.value)}
          placeholder="Enter existing EMI amount"
        />
      </div>
    </div>
  )
}
