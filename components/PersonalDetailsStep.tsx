"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

interface PersonalDetails {
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: string
  email?: string
  mobile?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  nationalIdType?: string
  nationalIdNumber?: string
  employmentType?: string
  monthlyIncome?: string
  consent?: boolean
}

interface PersonalDetailsStepProps {
  formData?: PersonalDetails
  updateFormData: (data: PersonalDetails) => void
}

export default function PersonalDetailsStep({
  formData = {}, // ✅ Set default empty object to avoid undefined access
  updateFormData,
}: PersonalDetailsStepProps) {
  const updateField = (field: keyof PersonalDetails, value: any) => {
    updateFormData({
      ...formData,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName || ""}
            onChange={(e) => updateField("firstName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName || ""}
            onChange={(e) => updateField("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ""}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
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

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile</Label>
          <Input
            id="mobile"
            value={formData.mobile || ""}
            onChange={(e) => updateField("mobile", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input
          id="addressLine1"
          value={formData.addressLine1 || ""}
          onChange={(e) => updateField("addressLine1", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="addressLine2">Address Line 2</Label>
        <Input
          id="addressLine2"
          value={formData.addressLine2 || ""}
          onChange={(e) => updateField("addressLine2", e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={formData.city || ""} onChange={(e) => updateField("city", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" value={formData.state || ""} onChange={(e) => updateField("state", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            value={formData.postalCode || ""}
            onChange={(e) => updateField("postalCode", e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nationalIdType">National ID Type</Label>
          <Select
            value={formData.nationalIdType}
            onValueChange={(value) => updateField("nationalIdType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aadhaar">Aadhaar</SelectItem>
              <SelectItem value="pan">PAN</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="driving-license">Driving License</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationalIdNumber">ID Number</Label>
          <Input
            id="nationalIdNumber"
            value={formData.nationalIdNumber || ""}
            onChange={(e) => updateField("nationalIdNumber", e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment Type</Label>
          <Select
            value={formData.employmentType}
            onValueChange={(value) => updateField("employmentType", value)}
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
          <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
          <Input
            id="monthlyIncome"
            type="number"
            value={formData.monthlyIncome || ""}
            onChange={(e) => updateField("monthlyIncome", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="consent"
          checked={formData.consent ?? false}
          onCheckedChange={(checked) => updateField("consent", checked)}
        />
        <Label htmlFor="consent" className="text-sm">
          I agree to the Terms & Conditions and consent to KYC verification
        </Label>
      </div>
    </div>
  )
}
