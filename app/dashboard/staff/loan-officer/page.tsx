"use client"

import React from "react"
import { LoanOfficerDashboard, Application } from "@/components/staff/LoanOfficerDashboard"

const mockApplications: Application[] = [
  {
    id: "app1",
    applicantName: "John Doe",
    loanType: "Home Loan",
    status: "approved",
  },
  {
    id: "app2",
    applicantName: "Jane Smith",
    loanType: "Personal Loan",
    status: "pending",
  },
  {
    id: "app3",
    applicantName: "Bob Johnson",
    loanType: "Car Loan",
    status: "approved",
  },
]

export default function LoanOfficerPage() {
  return <LoanOfficerDashboard applications={mockApplications} />
}
