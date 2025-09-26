"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { mockApplications, Application } from "@/components/mockApplications"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Eye } from "lucide-react"

interface PageProps {
  params: {
    id: string
  }
}

// Simple Toast component for sweet notifications
function Toast({
  message,
  type = "success",
  onClose,
}: {
  message: string
  type?: "success" | "error"
  onClose: () => void
}) {
  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-3 rounded shadow-lg text-white font-semibold transition-opacity duration-300 cursor-pointer ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
      role="alert"
      onClick={onClose}
    >
      {message}
    </div>
  )
}

export default function ReviewPage({ params }: PageProps) {
  const router = useRouter()
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  // Toast state
  const [toast, setToast] = useState<
    { message: string; type: "success" | "error" } | null
  >(null)

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3000) // auto-hide after 3 seconds
  }

  // Track open document dialog id (null if none)
  const [openDocId, setOpenDocId] = useState<string | null>(null)

  // Local state to track verification status and note per document
  // key: doc.id, value: { verified: boolean | null, note: string }
  const [docStates, setDocStates] = useState<
    Record<
      string,
      {
        verified: boolean | null
        note: string
      }
    >
  >({})

  const application = useMemo<Application | undefined>(() => {
    return mockApplications.find(
      (app) => app.id.toLowerCase() === params.id.toLowerCase()
    )
  }, [params.id])

  // Local status state to show after approve/reject
  const [currentStatus, setCurrentStatus] = useState(application?.status ?? "")

  if (!application) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Application Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The application you're trying to view does not exist.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  // Initialize docStates for all documents on first render
  // Only if not already initialized
  if (
    Object.keys(docStates).length === 0 &&
    application.documents.length > 0
  ) {
    const initialStates: typeof docStates = {}
    application.documents.forEach((doc) => {
      initialStates[doc.id] = { verified: null, note: "" }
    })
    setDocStates(initialStates)
  }

  const updateDocumentVerification = (
    appId: string,
    docId: string,
    verified: boolean,
    note: string
  ) => {
    setDocStates((prev) => ({
      ...prev,
      [docId]: { verified, note },
    }))
  }

  const handleApprove = () => {
    setIsApproving(true)
    setTimeout(() => {
      setIsApproving(false)
      setCurrentStatus("approved") // Update status locally
      showToast("Application approved!", "success") // Sweet toast instead of alert
      router.push("/dashboard/staff/credit-analyst")
    }, 1500)
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      showToast("Please enter a justification for rejection.", "error")
      return
    }
    setIsRejecting(true)
    setTimeout(() => {
      setIsRejecting(false)
      setIsRejectOpen(false)
      setCurrentStatus("rejected") // Update status locally
      showToast(`Application rejected with reason: ${rejectionReason}`, "error")
      router.push("/dashboard/staff/credit-analyst")
    }, 1500)
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            Review Application — {application.customerName}
          </h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/staff/credit-analyst")}
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-6">
          <strong>Status: </strong>
          <span
            className={`font-semibold ${
              currentStatus === "approved"
                ? "text-green-600"
                : currentStatus === "rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {currentStatus.replace(/-/g, " ").toUpperCase()}
          </span>
        </div>

        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Application Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <div>
              <strong>Application ID:</strong> {application.id}
            </div>
            <div>
              <strong>Submitted:</strong>{" "}
              {new Date(application.submittedDate).toLocaleDateString()}
            </div>
            <div>
              <strong>Loan Type:</strong> {application.loanType}
            </div>
            <div>
              <strong>Loan Amount:</strong> ₹
              {application.amount.toLocaleString()}
            </div>

            {/* Bureau Score */}
            <div>
              <div className="border border-yellow-300 rounded-lg p-2 text-center shadow-sm">
                <div className="text-1xl font-bold text-yellow-700">
                  {application.bureauScore ?? "N/A"}
                </div>
                <div className="text-sm text-yellow-600">Bureau Score</div>
              </div>
            </div>

            {/* System Score */}
            <div>
              <div className="border border-purple-300 rounded-lg p-2 text-center shadow-sm">
                <div className="text-1xl font-bold text-purple-700">
                  {application.systemScore?.toFixed(2) ?? "N/A"}
                </div>
                <div className="text-sm text-purple-600">System Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <div>
              <strong>Name:</strong> {application.firstName} {application.lastName}
            </div>
            <div>
              <strong>DOB:</strong>{" "}
              {new Date(application.dateOfBirth).toLocaleDateString()}
            </div>
            <div>
              <strong>Gender:</strong> {application.gender}
            </div>
            <div>
              <strong>Email:</strong> {application.email}
            </div>
            <div>
              <strong>Mobile:</strong> {application.mobile}
            </div>
            <div>
              <strong>Address:</strong> {application.addressLine1},{" "}
              {application.addressLine2}, {application.city}, {application.state} -{" "}
              {application.postalCode}
            </div>
            <div>
              <strong>ID Type:</strong> {application.nationalIdType}
            </div>
            <div>
              <strong>ID Number:</strong> {application.nationalIdNumber}
            </div>
            <div>
              <strong>Monthly Income:</strong> ₹
              {application.monthlyIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Loan Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Loan Requirements</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <div>
              <strong>Loan Product:</strong> {application.loanProduct}
            </div>
            <div>
              <strong>Loan Amount:</strong> ₹
              {application.loanAmount.toLocaleString()}
            </div>
            <div>
              <strong>Tenure (months):</strong> {application.tenureMonths}
            </div>
            <div>
              <strong>Purpose:</strong> {application.loanPurpose}
            </div>
            <div>
              <strong>Preferred EMI Date:</strong> {application.preferredEmiDate}
            </div>
            <div>
              <strong>Existing EMI:</strong> {application.existingEmiObligations}
            </div>
          </CardContent>
        </Card>

        {/* KYC / Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">KYC / Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-base">
            {application.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between border p-3 rounded hover:bg-gray-50 transition"
              >
                <span className="font-medium">{doc.name}</span>

                {/* Dialog trigger for view */}
                <Dialog
                  open={openDocId === doc.id}
                  onOpenChange={(open) => {
                    if (!open) setOpenDocId(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setOpenDocId(doc.id)}
                    >
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl w-full">
                    {/* Increased max width */}

                    <DialogHeader>
                      <DialogTitle>{doc.name}</DialogTitle>
                    </DialogHeader>

                    {/* Embed the document if URL is suitable (PDF, image) */}
                    <div className="mb-4">
                      {doc.url ? (
                        <iframe
                          src={doc.url}
                          className="w-full h-[700px] border" // Increased height
                          title={doc.name}
                        />
                      ) : (
                        <p className="text-center text-muted-foreground">
                          No document URL available
                        </p>
                      )}
                    </div>

                    {/* Approve / Reject section */}
                    <div className="space-y-3">
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => {
                          updateDocumentVerification(application.id, doc.id, true, "")
                          setOpenDocId(null)
                        }}
                      >
                        Approve
                      </Button>

                      <div className="space-y-2">
                        <Textarea
                          placeholder="Reason for rejection (optional)"
                          rows={3}
                          value={docStates[doc.id]?.note || ""}
                          onChange={(e) =>
                            setDocStates((prev) => ({
                              ...prev,
                              [doc.id]: {
                                verified: prev[doc.id]?.verified ?? null,
                                note: e.target.value,
                              },
                            }))
                          }
                          className="w-full"
                        />
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            updateDocumentVerification(
                              application.id,
                              doc.id,
                              false,
                              docStates[doc.id]?.note || ""
                            )
                            setOpenDocId(null)
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenDocId(null)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-8 justify-end">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/staff/credit-analyst")}
            disabled={isApproving || isRejecting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsRejectOpen(true)}
            disabled={isApproving || isRejecting}
          >
            Reject
          </Button>
          <Button onClick={handleApprove} disabled={isApproving || isRejecting}>
            {isApproving ? "Approving..." : "Approve"}
          </Button>
        </div>

        {/* Reject Justification Modal */}
        <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Application</DialogTitle>
            </DialogHeader>
            <Textarea
              placeholder="Enter reason for rejection"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <DialogFooter className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isRejecting}
              >
                {isRejecting ? "Rejecting..." : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
