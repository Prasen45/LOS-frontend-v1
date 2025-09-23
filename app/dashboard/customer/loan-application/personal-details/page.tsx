"use client"

import { useLoanApplication } from "@/app/dashboard/customer/loan-application/LoanFormContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function PersonalDetailsPage() {
  const { formData, updateFormData } = useLoanApplication()

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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
            placeholder="Enter your last name"
          />
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
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
            placeholder="Enter your email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <Input
            id="mobile"
            value={formData.mobile}
            onChange={(e) => updateFormData("mobile", e.target.value)}
            placeholder="Enter your mobile number"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="addressLine1">Address Line 1 *</Label>
          <Input
            id="addressLine1"
            value={formData.addressLine1}
            onChange={(e) => updateFormData("addressLine1", e.target.value)}
            placeholder="Enter your address"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addressLine2">Address Line 2</Label>
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
            placeholder="Enter your city"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => updateFormData("state", e.target.value)}
            placeholder="Enter your state"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => updateFormData("postalCode", e.target.value)}
            placeholder="Enter postal code"
          />
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
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="driving-license">Driving License</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationalIdNumber">National ID Number *</Label>
          <Input
            id="nationalIdNumber"
            value={formData.nationalIdNumber}
            onChange={(e) => updateFormData("nationalIdNumber", e.target.value)}
            placeholder="Enter ID number"
          />
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
              <SelectItem value="business">Business Owner</SelectItem>
              <SelectItem value="freelancer">Freelancer</SelectItem>
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
            placeholder="Enter monthly income"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="consent"
          checked={formData.consent}
          onCheckedChange={(checked) => updateFormData("consent", checked)}
        />
        <Label htmlFor="consent" className="text-sm">
          I agree to the Terms & Conditions and consent to KYC verification *
        </Label>
      </div>
    </div>
  )
}
