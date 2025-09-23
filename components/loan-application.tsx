"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { DocumentManager } from "@/components/document-manager"

interface LoanApplicationProps {
  onComplete: (data: any) => void
  onCancel: () => void
}

export function LoanApplication({ onComplete, onCancel }: LoanApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Details
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

    // Loan Requirements
    loanProduct: "",
    loanAmount: "",
    tenure: "",
    purposeOfLoan: "",
    preferredEMIDate: "",
    existingEMI: "",

    // Documents
    documents: [],
  })

  const steps = [
    { number: 1, title: "Personal Details", description: "Basic information and contact details" },
    { number: 2, title: "Loan Requirements", description: "Loan amount, tenure and purpose" },
    { number: 3, title: "KYC Documents", description: "Upload required documents" },
    { number: 4, title: "Review & Submit", description: "Review and submit your application" },
  ]

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    onComplete(formData)
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Loan Application</h1>
              <p className="text-muted-foreground">Complete your application in simple steps</p>
            </div>
          </div>
          <Button variant="outline" onClick={onCancel}>
            Save & Exit
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.number ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.number ? <CheckCircle className="h-4 w-4" /> : step.number}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && <PersonalDetailsStep formData={formData} updateFormData={updateFormData} />}
            {currentStep === 2 && <LoanRequirementsStep formData={formData} updateFormData={updateFormData} />}
            {currentStep === 3 && (
              <DocumentManager
                applicationId="temp-app-id"
                onDocumentsChange={(documents) => updateFormData("documents", documents)}
              />
            )}
            {currentStep === 4 && <ReviewStep formData={formData} />}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-primary">
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function PersonalDetailsStep({ formData, updateFormData }: any) {
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

      <div className="grid md:grid-cols-2 gap-4">
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
          <Select value={formData.nationalIdType} onValueChange={(value) => updateFormData("nationalIdType", value)}>
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
          <Select value={formData.employmentType} onValueChange={(value) => updateFormData("employmentType", value)}>
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

function LoanRequirementsStep({ formData, updateFormData }: any) {
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
          <Select
            value={formData.preferredEMIDate}
            onValueChange={(value) => updateFormData("preferredEMIDate", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select EMI date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st of every month</SelectItem>
              <SelectItem value="5">5th of every month</SelectItem>
              <SelectItem value="10">10th of every month</SelectItem>
              <SelectItem value="15">15th of every month</SelectItem>
              <SelectItem value="20">20th of every month</SelectItem>
              <SelectItem value="25">25th of every month</SelectItem>
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
          placeholder="Enter total existing EMI amount (if any)"
        />
      </div>
    </div>
  )
}

function ReviewStep({ formData }: any) {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Please review your application details before submitting. You can go back to make changes if needed.
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Name:</strong> {formData.firstName} {formData.lastName}
            </div>
            <div>
              <strong>Date of Birth:</strong> {formData.dateOfBirth}
            </div>
            <div>
              <strong>Email:</strong> {formData.email}
            </div>
            <div>
              <strong>Mobile:</strong> {formData.mobile}
            </div>
            <div>
              <strong>Employment:</strong> {formData.employmentType}
            </div>
            <div>
              <strong>Monthly Income:</strong> ₹{formData.monthlyIncome}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Loan Type:</strong> {formData.loanProduct}
            </div>
            <div>
              <strong>Amount:</strong> ₹{formData.loanAmount}
            </div>
            <div>
              <strong>Tenure:</strong> {formData.tenure} months
            </div>
            <div>
              <strong>EMI Date:</strong> {formData.preferredEMIDate}th of every month
            </div>
          </div>
          <div className="text-sm">
            <strong>Purpose:</strong> {formData.purposeOfLoan}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Document upload completed</span>
            </div>
            <div className="text-muted-foreground">
              {formData.documents?.length || 0} documents uploaded and ready for verification
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
