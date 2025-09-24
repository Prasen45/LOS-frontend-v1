"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, CheckCircle, XCircle, FileText, Edit } from "lucide-react"
import { useRouter } from "next/navigation"

interface Application {
  id: string
  customerName: string
  loanType: string
  amount: number
  submittedDate: string
  documents: { id: string; name: string; url?: string; verified?: boolean; note?: string }[]
  bureauScore?: number
  systemScore?: number
  salarySlipValidated?: "pending" | "approved" | "rejected"
  salaryValidationNote?: string
  scoreOverrides?: { overriddenBy: string; newScore: number; reason: string; date: string }[]
}

const mockApplications: Application[] = [
  {
    id: "APP100",
    customerName: "Asha Verma",
    loanType: "Personal Loan",
    amount: 300000,
    submittedDate: "2024-02-01",
    documents: [
      { id: "doc1", name: "ID Proof - Asha.pdf", url: "#" },
      { id: "doc2", name: "Salary Slip Jan 2024.pdf", url: "#" },
    ],
    bureauScore: 710,
    systemScore: 0.78,
    salarySlipValidated: "pending",
    scoreOverrides: [],
  },
  {
    id: "APP101",
    customerName: "Vikram Rao",
    loanType: "Home Loan",
    amount: 4500000,
    submittedDate: "2024-01-20",
    documents: [
      { id: "doc3", name: "ID Proof - Vikram.pdf", url: "#" },
      { id: "doc4", name: "Salary Slip Dec 2023.pdf", url: "#" },
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
  },
]

export function CreditAnalystDashboard() {
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<{ id: string; name: string; url?: string } | null>(null)
  const [overrideScoreValue, setOverrideScoreValue] = useState<string>("")
  const [overrideReason, setOverrideReason] = useState<string>("")
  const [salaryNote, setSalaryNote] = useState<string>("")
  const router = useRouter()

  // mark document verified / rejected with optional note
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

  // validate salary slip
  const setSalaryValidation = (appId: string, status: "approved" | "rejected", note?: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, salarySlipValidated: status, salaryValidationNote: note } : a)),
    )
    setSalaryNote("")
  }

  // override score with justification and save an audit entry
  const overrideScore = (appId: string) => {
    const newScore = Number(overrideScoreValue)
    if (Number.isNaN(newScore) || overrideReason.trim() === "") return
    const overrideEntry = {
      overriddenBy: "currentAnalyst", // replace with real user context if available
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

    // clear local override state
    setOverrideScoreValue("")
    setOverrideReason("")
    setSelectedApp(null)
  }

  const getStatusBadge = (app: Application) => {
    if (app.salarySlipValidated === "pending") return <Badge variant="outline">Salary: Pending</Badge>
    if (app.salarySlipValidated === "approved") return <Badge className="bg-green-100 text-green-800">Salary: Approved</Badge>
    if (app.salarySlipValidated === "rejected") return <Badge className="bg-red-100 text-red-800">Salary: Rejected</Badge>
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
                  <CardTitle className="text-sm font-medium">{app.customerName} — {app.loanType}</CardTitle>
                  <div className="text-xs text-muted-foreground">{app.id} • Submitted: {new Date(app.submittedDate).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="mb-1">
                    <span className="text-sm font-semibold">Bureau:</span>{" "}
                    <span className="ml-1 font-bold">{app.bureauScore ?? "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold">System score:</span>{" "}
                    <span className="ml-1 font-medium">{typeof app.systemScore === "number" ? app.systemScore.toFixed(2) : "N/A"}</span>
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
                  <div key={d.id} className="flex items-center justify-between border rounded-md p-2">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{d.name}</div>
                        {d.verified !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            {d.verified ? <span className="text-green-600">Verified</span> : <span className="text-red-600">Rejected</span>}
                            {d.note && <span className="ml-2">• {d.note}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedDoc(d)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        {/* If you use a DialogContent component, you can render doc preview there. */}
                      </Dialog>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateDocumentVerification(app.id, d.id, true, undefined)}
                        title="Mark verified"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateDocumentVerification(app.id, d.id, false, "Suspect/Illegible")}
                        title="Mark rejected"
                      >
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Salary Slip Validation</div>
                  <div className="text-sm">{app.salarySlipValidated ?? "pending"}</div>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Notes (if rejecting)"
                    value={salaryNote}
                    onChange={(e) => setSalaryNote(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={() => setSalaryValidation(app.id, "approved")}>
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setSalaryValidation(app.id, "rejected", salaryNote || "Rejected by analyst")}>
                    Reject
                  </Button>
                </div>
                {app.salaryValidationNote && <div className="text-xs text-muted-foreground mt-2">Note: {app.salaryValidationNote}</div>}
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Override Bureau Score</div>
                  <div className="text-xs text-muted-foreground">{(app.scoreOverrides || []).length} overrides</div>
                </div>

                <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                  <Input
                    placeholder="New bureau score (number)"
                    value={selectedApp?.id === app.id ? overrideScoreValue : ""}
                    onChange={(e) => {
                      // keep changes local to selected app; set selectedApp to this app when user types
                      setSelectedApp(app)
                      setOverrideScoreValue(e.target.value)
                    }}
                    className="md:col-span-1"
                  />
                  <Textarea
                    placeholder="Justification (required)"
                    value={selectedApp?.id === app.id ? overrideReason : ""}
                    onChange={(e) => {
                      setSelectedApp(app)
                      setOverrideReason(e.target.value)
                    }}
                    className="md:col-span-2"
                  />
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => selectedApp && overrideScore(selectedApp.id)}>
                    <Edit className="h-4 w-4 mr-1" /> Override Score
                  </Button>
                </div>

                {app.scoreOverrides && app.scoreOverrides.length > 0 && (
                  <div className="mt-3 text-xs">
                    <div className="font-medium">Override history:</div>
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                      {app.scoreOverrides.map((o, idx) => (
                        <li key={idx}>
                          {o.newScore} — {o.reason} <span className="text-muted-foreground">({new Date(o.date).toLocaleString()})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document viewer modal (simple) */}
      <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">{selectedDoc?.name}</div>
            <Button variant="ghost" onClick={() => setSelectedDoc(null)}>Close</Button>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm text-muted-foreground">Document preview not implemented — replace with PDF/image viewer rendering the file URL.</p>
            <div className="mt-4">
              <a href={selectedDoc?.url || "#"} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open document</a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
