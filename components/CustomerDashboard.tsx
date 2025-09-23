
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoanApplication } from "@/components/loan-application"
import { StatusTracker } from "@/components/status-tracker"
import { useRouter } from "next/navigation"

export default function CustomerDashboard() {
  const [showApplication, setShowApplication] = useState(false)
  const [showStatusTracker, setShowStatusTracker] = useState(false)
  const router = useRouter()
  const [applications, setApplications] = useState<any[]>([
    {
      id: "APP001",
      loanProduct: "Personal Loan",
      loanAmount: 500000,
      status: "credit-assessment",
      submittedDate: "2024-01-15",
    },
  ])

  if (showApplication) {
    return (
      <LoanApplication
        onComplete={(applicationData) => {
          setApplications([...applications, applicationData])
          setShowApplication(false)
        }}
        onCancel={() => setShowApplication(false)}
      />
    )
  }

  if (showStatusTracker) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
              <p className="text-muted-foreground">Track your loan application progress</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowStatusTracker(false)}>
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>Sign Out</Button>
            </div>
          </div>
          <StatusTracker applicationId="APP001" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
            <p className="text-muted-foreground">Manage your loan applications and track progress</p>
          </div>
          <Button variant="outline">Sign Out</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>New Loan Application</CardTitle>
              <CardDescription>Start a new loan application process</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setShowApplication(true)}>
                Start Application
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Applications</CardTitle>
              <CardDescription>View and manage your current applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-2">
                  {applications.map((app, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{app.loanProduct}</span>
                        <span className="text-sm text-muted-foreground capitalize">
                          {app.status?.replace("-", " ") || "Submitted"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Amount: ₹{app.loanAmount?.toLocaleString()}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setShowStatusTracker(true)}
                      >
                        Track Status
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No active applications</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
