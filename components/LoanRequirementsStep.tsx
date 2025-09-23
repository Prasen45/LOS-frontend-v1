"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type LoanRequirements = {
  loanProduct: string
  loanAmount: string
  tenure: string
  purposeOfLoan: string
  preferredEMIDate: string
  existingEMI: string
}

type Props = {
  formData: LoanRequirements
  updateFormData: (data: LoanRequirements) => void
}

export default function LoanRequirementsStep({ formData, updateFormData }: Props) {
  const updateField = (field: keyof LoanRequirements, value: any) => {
    updateFormData({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Loan Product</Label>
          <Select value={formData.loanProduct} onValueChange={(value) => updateField("loanProduct", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select loan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal Loan</SelectItem>
              <SelectItem value="home">Home Loan</SelectItem>
              <SelectItem value="business">Business Loan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Loan Amount (₹)</Label>
          <Input
            type="number"
            value={formData.loanAmount}
            onChange={(e) => updateField("loanAmount", e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tenure (in months)</Label>
          <Input type="number" value={formData.tenure} onChange={(e) => updateField("tenure", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Preferred EMI Date</Label>
          <Input
            type="number"
            min={1}
            max={31}
            value={formData.preferredEMIDate}
            onChange={(e) => updateField("preferredEMIDate", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Purpose of Loan</Label>
        <Textarea value={formData.purposeOfLoan} onChange={(e) => updateField("purposeOfLoan", e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Existing Monthly EMI (₹)</Label>
        <Input
          type="number"
          value={formData.existingEMI}
          onChange={(e) => updateField("existingEMI", e.target.value)}
        />
      </div>
    </div>
  )
}
