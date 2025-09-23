"use client"

type Props = {
  formData: {
    personalDetails: any
    loanRequirements: any
    documents: any[]
  }
}

export function ReviewStep({ formData }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Personal Details</h3>
        <pre className="bg-muted p-4 rounded">{JSON.stringify(formData.personalDetails, null, 2)}</pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Loan Requirements</h3>
        <pre className="bg-muted p-4 rounded">{JSON.stringify(formData.loanRequirements, null, 2)}</pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Documents</h3>
        <pre className="bg-muted p-4 rounded">{JSON.stringify(formData.documents, null, 2)}</pre>
      </div>
    </div>
  )
}
