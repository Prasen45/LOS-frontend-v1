"use client"

import React from "react"
import { CreditManagerDashboard } from "@/components/staff/CreditManagerDashboard" 
const mockApplications = [
  {
    id: "app1",
    applicantName: "John Doe",
    loanType: "Home Loan",
    documents: ["ID Proof.pdf", "Salary Slip.pdf"],
    bureauScore: 720,
    salarySlipVerified: true,
    systemScore: 650,
    overriddenScore: 670,
    overriddenScoreJustification: "Good income stability",
    status: "pending",
  },
  {
    id: "app2",
    applicantName: "Jane Smith",
    loanType: "Personal Loan",
    documents: ["ID Proof.pdf"],
    bureauScore: 680,
    salarySlipVerified: false,
    systemScore: 600,
    status: "pending",
  },
]

export default function CreditManagerPage() {
  return <CreditManagerDashboard applications={mockApplications} />
}
