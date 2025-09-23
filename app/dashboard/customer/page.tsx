"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function CustomerDashboard() {
  const router = useRouter()
  const [applications, setApplications] = useState<any[]>([])

  // useEffect(() => {
  //   const savedApps = JSON.parse(localStorage.getItem("applications") || "[]")
  //   setApplications(savedApps)
  // }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome, Om</h1>
            <p className="text-muted-foreground">Manage your loan applications and track progress</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>Sign Out</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>New Loan Application</CardTitle>
              <CardDescription>Start a new loan application process</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <Button
                  className="w-full"
                  onClick={() => router.push("/dashboard/customer/loan-application/personal-details")}
                >
                  Start Application
                </Button>
              ) : (
                <p className="text-muted-foreground">You already have active applications</p>
              )}
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
                  {applications.map((app) => (
                    <div key={app.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{app.loanProduct}</span>
                        <span className="text-sm text-muted-foreground capitalize">
                          {app.status?.replace("-", " ") || "Submitted"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Amount: ₹{Number(app.loanAmount).toLocaleString()}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/dashboard/customer/loan-application/status-tracker")}
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
