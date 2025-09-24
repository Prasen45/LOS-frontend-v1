"use client"

import React, { useState } from "react"
import Swal from "sweetalert2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

interface Application {
  id: string
  applicantName: string
  loanType: string
  documents: string[]
  bureauScore: number
  salarySlipVerified: boolean
  systemScore: number
  overriddenScore?: number
  overriddenScoreJustification?: string
  status?: string
  rejectionReason?: string
}

interface CreditManagerDashboardProps {
  applications: Application[]
}

export function CreditManagerDashboard({ applications }: CreditManagerDashboardProps) {
  const [apps, setApps] = useState(applications)
  const [rejectionReason, setRejectionReason] = useState("")
  const router = useRouter()

  const approveApplication = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure you want to approve this application?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      setApps((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "approved", rejectionReason: undefined } : app,
        ),
      )
      setRejectionReason("")
      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "The application has been approved.",
        timer: 1500,
        showConfirmButton: false,
      })
    }
  }

  const rejectApplication = async (id: string, reason: string) => {
    if (!reason.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter a rejection reason.",
      })
      return
    }

    const result = await Swal.fire({
      title: "Are you sure you want to reject this application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      setApps((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "rejected", rejectionReason: reason } : app,
        ),
      )
      setRejectionReason("")
      Swal.fire({
        icon: "success",
        title: "Rejected!",
        text: "The application has been rejected.",
        timer: 1500,
        showConfirmButton: false,
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Credit Manager Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Sign Out
          </Button>
        </div>
      </div>

      {apps.length === 0 && (
        <p className="text-muted-foreground">No applications available.</p>
      )}

      {apps.map((app) => (
        <Card key={app.id}>
          <CardHeader>
            <CardTitle>Application: {app.applicantName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Loan Type:</strong> {app.loanType}
            </p>

            <p>
              <strong>Bureau Score:</strong> {app.bureauScore}
            </p>

            <p>
              <strong>Salary Slip Verified:</strong>{" "}
              {app.salarySlipVerified ? "Yes" : "No"}
            </p>

            <p>
              <strong>System Score:</strong> {app.systemScore}
            </p>

            {app.overriddenScore !== undefined && (
              <>
                <p>
                  <strong>Overridden Score:</strong> {app.overriddenScore}
                </p>
                <p>
                  <strong>Justification:</strong> {app.overriddenScoreJustification}
                </p>
              </>
            )}

            <p className="mt-4">
              <strong>Status:</strong>{" "}
              {app.status ? app.status.toUpperCase() : "PENDING"}
            </p>

            {app.status === "rejected" && (
              <p className="text-red-600">
                <strong>Rejection Reason:</strong> {app.rejectionReason}
              </p>
            )}

            {app.status === "pending" && (
              <div className="mt-4 space-y-2">
                <Textarea
                  placeholder="Rejection reason (required if rejecting)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full max-w-lg"
                />
                <div className="flex gap-4">
                  <Button
                    onClick={() => approveApplication(app.id)}
                    variant="outline"
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => rejectApplication(app.id, rejectionReason)}
                    variant="outline"
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
