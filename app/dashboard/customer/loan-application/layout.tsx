"use client"

import { ReactNode, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { LoanApplicationProvider, useLoanApplication } from "./LoanFormContext"
import Swal from "sweetalert2"

const steps = [
  {
    number: 1,
    title: "Personal Details",
    description: "Basic information and contact details",
    path: "/dashboard/customer/loan-application/personal-details",
  },
  {
    number: 2,
    title: "Loan Requirements",
    description: "Loan amount, tenure and purpose",
    path: "/dashboard/customer/loan-application/loan-requirements",
  },
  {
    number: 3,
    title: "KYC Documents",
    description: "Upload required documents",
    path: "/dashboard/customer/loan-application/documents",
  },
  {
    number: 4,
    title: "Review & Submit",
    description: "Review and submit your application",
    path: "/dashboard/customer/loan-application/review-submit",
  },
]

interface LoanApplicationLayoutProps {
  children: ReactNode
  onSubmit?: () => void
}

function LoanApplicationLayoutContent({
  children,
  onSubmit,
}: LoanApplicationLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  // This function should return an object of errors for all invalid fields,
  // You already have this in your LoanFormContext.
  const { validateAllFields } = useLoanApplication()

  const currentStepIndex = useMemo(
    () => steps.findIndex((step) => pathname.startsWith(step.path)),
    [pathname]
  )
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1
  const progress = (currentStep / steps.length) * 100

  const handlePrevious = () => {
    if (currentStep > 1) router.push(steps[currentStep - 2].path)
  }

  // Modified handleNext to remove forced validation and navigation,
  // since you don't want a next button or forced navigation on valid input.
  // You can comment this out or remove if you want no next button at all.
  const handleNext = () => {
    const errors = validateAllFields()
    if (Object.keys(errors).length > 0) {
      // Show first error popup if validation fails
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorMessage = errors[firstErrorKey]

      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: firstErrorMessage,
      })
      return
    }

    if (currentStep < steps.length) router.push(steps[currentStep].path)
  }

  const handleSubmit = () => {
    if (onSubmit) onSubmit()
  }

  const handleSaveDraft = () => {
    Swal.fire({
      icon: "success",
      title: "Draft saved",
      showConfirmButton: false,
      timer: 1500,
    })
    router.push("/dashboard/customer")
  }

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Your unsaved changes will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) router.push("/dashboard/customer")
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/customer")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Loan Application
              </h1>
              <p className="text-muted-foreground">
                Complete your application in simple steps
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-center cursor-pointer"
                onClick={() => router.push(step.path)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStepIndex >= 0
                ? steps[currentStepIndex].title
                : "Loan Application"}
            </CardTitle>
            <CardDescription>
              {currentStepIndex >= 0 ? steps[currentStepIndex].description : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-between mt-8 gap-3">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 ml-2" />
              Previous
            </Button>

            <Button type="button" variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>

            <Button type="button" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
          </div>

          <div>
            {currentStep < steps.length ? (
              // Remove this button if you want no "Next" or "Save & Continue"
              <Button type="button" onClick={handleNext}>
                Save & Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} className="bg-primary">
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoanApplicationLayout(props: LoanApplicationLayoutProps) {
  return (
    <LoanApplicationProvider>
      <LoanApplicationLayoutContent {...props} />
    </LoanApplicationProvider>
  )
}
