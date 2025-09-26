"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Eye, CheckCircle, XCircle, FileText, Edit } from "lucide-react"
import { useRouter } from "next/navigation"

interface Document {
  id: string
  name: string
  url?: string
  verified?: boolean
  note?: string
}

interface ScoreOverride {
  overriddenBy: string
  newScore: number
  reason: string
  date: string
}

interface Application {
  id: string
  customerName: string
  loanType: string
  amount: number
  submittedDate: string
  documents: Document[]
  bureauScore?: number
  systemScore?: number
  salarySlipValidated?: "pending" | "approved" | "rejected"
  salaryValidationNote?: string
  scoreOverrides?: ScoreOverride[]

  // New personal details fields
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email: string
  mobile: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  nationalIdType: string
  nationalIdNumber: string
  monthlyIncome: number

  // New loan requirements
  loanProduct: string
  loanAmount: number
  tenureMonths: number
  loanPurpose: string
  preferredEmiDate: string
  existingEmiObligations: string
}

const mockApplications: Application[] = [
  {
    id: "APP100",
    customerName: "Asha Verma",
    loanType: "Personal Loan",
    amount: 300000,
    submittedDate: "2024-02-01",
    documents: [
      { id: "doc1", name: "Photo ID - Asha.pdf", url: "#" },
      { id: "doc2", name: "Salary Slip Jan 2024.pdf", url: "#" },
      { id: "doc5", name: "Address Proof - Asha.pdf", url: "#" },
      { id: "doc6", name: "Bank Statement Jan 2024.pdf", url: "#" },
    ],
    bureauScore: 710,
    systemScore: 0.78,
    salarySlipValidated: "pending",
    scoreOverrides: [],

    firstName: "Asha",
    lastName: "Verma",
    dateOfBirth: "1990-05-20",
    gender: "Female",
    email: "asha.verma@example.com",
    mobile: "9876543210",
    addressLine1: "123 MG Road",
    addressLine2: "Apt 4B",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    nationalIdType: "Aadhaar",
    nationalIdNumber: "1234-5678-9012",
    monthlyIncome: 75000,

    loanProduct: "Personal Loan",
    loanAmount: 300000,
    tenureMonths: 24,
    loanPurpose: "Home renovation",
    preferredEmiDate: "5th of every month",
    existingEmiObligations: "Car loan - ₹10,000 monthly",
  },
  {
    id: "APP101",
    customerName: "Vikram Rao",
    loanType: "Home Loan",
    amount: 4500000,
    submittedDate: "2024-01-20",
    documents: [
      { id: "doc3", name: "Photo ID - Vikram.pdf", url: "#" },
      { id: "doc4", name: "Salary Slip Dec 2023.pdf", url: "#" },
      { id: "doc7", name: "Address Proof - Vikram.pdf", url: "#" },
      { id: "doc8", name: "Bank Statement Dec 2023.pdf", url: "#" },
    ],
    bureauScore: 640,
    systemScore: 0.62,
    salarySlipValidated: "approved",
    scoreOverrides: [
      {
        overriddenBy: "Analyst1",
        newScore: 660,
        reason: "Manual review of additional bank statements",
        date: new Date().toISOString(),
      },
    ],

    firstName: "Vikram",
    lastName: "Rao",
    dateOfBirth: "1985-11-10",
    gender: "Male",
    email: "vikram.rao@example.com",
    mobile: "9123456780",
    addressLine1: "789 Park Street",
    addressLine2: "",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "560001",
    nationalIdType: "PAN",
    nationalIdNumber: "ABCDE1234F",
    monthlyIncome: 120000,

    loanProduct: "Home Loan",
    loanAmount: 4500000,
    tenureMonths: 120,
    loanPurpose: "House purchase",
    preferredEmiDate: "10th of every month",
    existingEmiObligations: "None",
  },
]

export default function CreditAnalystDashboard() {
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [overrideScoreValue, setOverrideScoreValue] = useState<string>("")
  const [overrideReason, setOverrideReason] = useState<string>("")
  const [salaryNote, setSalaryNote] = useState<string>("")
  const router = useRouter()

  // Mark document verified / rejected with optional note
  const updateDocumentVerification = (appId: string, docId: string, verified: boolean, note?: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              documents: a.documents.map((d) => (d.id === docId ? { ...d, verified, note } : d)),
            }
          : a,
      ),
    )
  }

  // Validate salary slip with note
  const setSalaryValidation = (appId: string, status: "approved" | "rejected", note?: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, salarySlipValidated: status, salaryValidationNote: note } : a)),
    )
    setSalaryNote("")
  }

  // Override bureau score with justification and save audit
  const overrideScore = (appId: string) => {
    const newScore = Number(overrideScoreValue)
    if (Number.isNaN(newScore) || overrideReason.trim() === "") {
      alert("Please enter a valid score and justification")
      return
    }
    const overrideEntry: ScoreOverride = {
      overriddenBy: "currentAnalyst", // Replace with real user
      newScore,
      reason: overrideReason,
      date: new Date().toISOString(),
    }

    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              bureauScore: newScore,
              scoreOverrides: [...(a.scoreOverrides || []), overrideEntry],
            }
          : a,
      ),
    )

    // Clear override input and close detail panel
    setOverrideScoreValue("")
    setOverrideReason("")
    setSelectedApp(null)
  }

  const getStatusBadge = (app: Application) => {
    if (app.salarySlipValidated === "pending")
      return <Badge variant="outline">Salary: Pending</Badge>
    if (app.salarySlipValidated === "approved")
      return <Badge className="bg-green-100 text-green-800">Salary: Approved</Badge>
    if (app.salarySlipValidated === "rejected")
      return <Badge className="bg-red-100 text-red-800">Salary: Rejected</Badge>
    return <Badge>Unknown</Badge>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Credit Analyst Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <CardTitle className="text-sm font-medium">
                    {app.customerName} — {app.loanType}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {app.id} • Submitted:{" "}
                    {new Date(app.submittedDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-1">
                    <span className="text-sm font-semibold">Bureau:</span>{" "}
                    <span className="ml-1 font-bold">{app.bureauScore ?? "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold">System score:</span>{" "}
                    <span className="ml-1 font-medium">
                      {typeof app.systemScore === "number"
                        ? app.systemScore.toFixed(2)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Documents ({app.documents.length})</span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(app)}
                  <Button size="sm" variant="ghost" onClick={() => setSelectedApp(app)}>
                    <Eye className="h-4 w-4 mr-1" /> Review
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {app.documents.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between border rounded-md p-2"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{d.name}</div>
                        {d.verified !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            {d.verified ? (
                              <span className="text-green-600">Verified</span>
                            ) : (
                              <span className="text-red-600">Rejected</span>
                            )}
                            {d.note ? ` — Note: ${d.note}` : ""}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        //size="xs"
                        variant="outline"
                        onClick={() => {
                          setSelectedDoc(d)
                          setSelectedApp(app)
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show detailed panel when selected */}
              {selectedApp?.id === app.id && (
                <div className="mt-6 border-t pt-4">
                  {/* Personal Details Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><strong>First Name:</strong> {app.firstName}</div>
                      <div><strong>Last Name:</strong> {app.lastName}</div>
                      <div><strong>Date of Birth:</strong> {new Date(app.dateOfBirth).toLocaleDateString()}</div>
                      <div><strong>Gender:</strong> {app.gender}</div>
                      <div><strong>Email:</strong> {app.email}</div>
                      <div><strong>Mobile:</strong> {app.mobile}</div>
                      <div><strong>Address Line 1:</strong> {app.addressLine1}</div>
                      <div><strong>Address Line 2:</strong> {app.addressLine2 || "-"}</div>
                      <div><strong>City:</strong> {app.city}</div>
                      <div><strong>State:</strong> {app.state}</div>
                      <div><strong>Postal Code:</strong> {app.postalCode}</div>
                      <div><strong>National ID Type:</strong> {app.nationalIdType}</div>
                      <div><strong>National ID Number:</strong> {app.nationalIdNumber}</div>
                      <div><strong>Monthly Income:</strong> ₹{app.monthlyIncome.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Loan Requirements Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Loan Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><strong>Loan Product:</strong> {app.loanProduct}</div>
                      <div><strong>Loan Amount:</strong> ₹{app.loanAmount.toLocaleString()}</div>
                      <div><strong>Tenure (months):</strong> {app.tenureMonths}</div>
                      <div><strong>Purpose of Loan:</strong> {app.loanPurpose}</div>
                      <div><strong>Preferred EMI Date:</strong> {app.preferredEmiDate}</div>
                      <div><strong>Existing EMI Obligations:</strong> {app.existingEmiObligations}</div>
                    </div>
                  </div>

                  {/* KYC & Documents Upload Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">KYC & Documents Upload</h3>
                    <div className="space-y-2 text-sm">
                      {["Photo ID", "Address Proof", "Income Proof", "Bank Statement"].map((docType) => {
                        const doc = app.documents.find((d) =>
                          d.name.toLowerCase().includes(docType.toLowerCase())
                        )
                        return (
                          <div
                            key={docType}
                            className="flex items-center justify-between border rounded-md p-2"
                          >
                            <div>{docType}</div>
                            {doc ? (
                              <a
                                href={doc.url || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline"
                              >
                                {doc.name}
                              </a>
                            ) : (
                              <span className="text-red-600">Not uploaded</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog to edit document verification note */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <h3 className="mb-4 text-lg font-semibold">Verify Document</h3>
          <div className="mb-4">
            <p className="text-sm font-medium">Document: {selectedDoc?.name}</p>
          </div>

          <Textarea
            placeholder="Add note or reason (optional)"
            value={selectedDoc?.note || ""}
            onChange={(e) => {
              if (selectedDoc) {
                const note = e.target.value
                setSelectedDoc({ ...selectedDoc, note })
              }
            }}
            rows={3}
            className="mb-4"
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedDoc && selectedApp) {
                  updateDocumentVerification(selectedApp.id, selectedDoc.id, false, selectedDoc.note)
                  setSelectedDoc(null)
                }
              }}
            >
              <XCircle className="mr-2 h-4 w-4" /> Reject
            </Button>
            <Button
              onClick={() => {
                if (selectedDoc && selectedApp) {
                  updateDocumentVerification(selectedApp.id, selectedDoc.id, true, selectedDoc.note)
                  setSelectedDoc(null)
                }
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Approve
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
