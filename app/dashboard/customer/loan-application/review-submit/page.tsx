"use client"

import { useLoanApplication } from "../LoanFormContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ReviewSubmitPage() {
  const { formData, resetFormData } = useLoanApplication()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)

    const savedApps = JSON.parse(localStorage.getItem("applications") || "[]")

    const newApp = {
      id: Date.now(),
      ...formData,
      status: "Submitted",
      submittedAt: new Date().toISOString(),
    }

    localStorage.setItem("applications", JSON.stringify([...savedApps, newApp]))

    resetFormData()
    router.push("/dashboard/customer")
  }

  return (
    <form id="review-form" onSubmit={e => e.preventDefault()}>
      <h2 className="text-xl font-semibold mb-6">Review Your Application</h2>

      <section className="mb-6">
        <h3 className="font-semibold mb-2 border-b pb-1">Personal Details</h3>
        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
        <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
        <p><strong>Gender:</strong> {formData.gender}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Mobile:</strong> {formData.mobile}</p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2 border-b pb-1">Address</h3>
        <p><strong>Address Line 1:</strong> {formData.addressLine1}</p>
        <p><strong>Address Line 2:</strong> {formData.addressLine2 || "-"}</p>
        <p><strong>City:</strong> {formData.city}</p>
        <p><strong>State:</strong> {formData.state}</p>
        <p><strong>Postal Code:</strong> {formData.postalCode}</p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2 border-b pb-1">Identification</h3>
        <p><strong>ID Type:</strong> {formData.nationalIdType}</p>
        <p><strong>ID Number:</strong> {formData.nationalIdNumber}</p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2 border-b pb-1">Employment & Income</h3>
        <p><strong>Employment Type:</strong> {formData.employmentType}</p>
        <p><strong>Monthly Income:</strong> ₹{formData.monthlyIncome}</p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2 border-b pb-1">Loan Details</h3>
        <p><strong>Loan Product:</strong> {formData.loanProduct}</p>
        <p><strong>Loan Amount:</strong> ₹{formData.loanAmount}</p>
        <p><strong>Tenure:</strong> {formData.tenure}</p>
        <p><strong>Purpose of Loan:</strong> {formData.purposeOfLoan}</p>
        <p><strong>Preferred EMI Date:</strong> {formData.preferredEMIDate}</p>
        <p><strong>Existing EMI:</strong> ₹{formData.existingEMI || "0"}</p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2 border-b pb-1">Consent</h3>
        <p>{formData.consent ? "You have given consent." : "Consent not given."}</p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2 border-b pb-1">Documents Uploaded</h3>
        <p>{formData.documents.length} document(s) uploaded</p>
      </section>

      {isSubmitting && <p className="text-muted-foreground">Submitting application...</p>}
    </form>
  )
}
