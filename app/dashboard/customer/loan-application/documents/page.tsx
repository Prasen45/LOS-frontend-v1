"use client"

import { useLoanApplication } from "../LoanFormContext"
import { DocumentManager } from "@/components/document-manager"

export default function DocumentsPage() {
  const { updateFormData } = useLoanApplication()

  return (
    <div>
      <p className="text-muted-foreground mb-4">
        Upload your KYC and income proof documents. Supported formats: PDF, PNG, JPEG.
      </p>
      <DocumentManager
        applicationId="temp-app-id"
        onDocumentsChange={(docs) => updateFormData("documents", docs)}
      />
    </div>
  )
}
