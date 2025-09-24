"use client"

import React, { useState } from "react"
import Swal from "sweetalert2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface Application {
  id: string
  applicantName: string
  loanType: string
  status?: "pending" | "approved" | "rejected" | "disbursed"
  // add more fields as necessary
}

interface LoanOfficerDashboardProps {
  applications: Application[]
}

export function LoanOfficerDashboard({ applications }: LoanOfficerDashboardProps) {
  const [apps, setApps] = useState(applications)

  const initiateDisbursement = async (id: string) => {
    const result = await Swal.fire({
      title: "Initiate Disbursement?",
      text: "Are you sure you want to disburse funds for this loan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, disburse",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      setApps((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "disbursed" } : app,
        ),
      )

      Swal.fire({
        icon: "success",
        title: "Funds Disbursed!",
        text: "The loan funds have been successfully disbursed.",
        timer: 1500,
        showConfirmButton: false,
      })
    }
  }

  // Only show approved applications (filter out others)
  const approvedApps = apps.filter((app) => app.status === "approved")

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Loan Officer Dashboard</h1>

      {approvedApps.length === 0 && (
        <p>No approved loan applications available for disbursement.</p>
      )}

      {approvedApps.map((app) => (
        <Card key={app.id}>
          <CardHeader>
            <CardTitle>{app.applicantName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Loan Type:</strong> {app.loanType}
            </p>

            <p>
              <strong>Status:</strong> {app.status?.toUpperCase()}
            </p>

            <Button
              onClick={() => initiateDisbursement(app.id)}
              className="bg-blue-600 text-white hover:bg-blue-700 mt-4"
            >
              Initiate Disbursement
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
