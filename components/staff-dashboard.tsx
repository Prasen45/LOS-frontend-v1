"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Clock, CheckCircle, DollarSign, TrendingUp, Download, User, Phone, Mail } from "lucide-react"
import { LoanWorkflow } from "@/components/loan-workflow"
import { useRouter } from "next/navigation"


interface Application {
  id: string
  customerName: string
  email: string
  phone: string
  loanType: string
  amount: number
  status:
    | "submitted"
    | "under-review"
    | "credit-assessment"
    | "approved"
    | "rejected"
    | "offer-generated"
    | "offer-accepted"
    | "disbursed"
  submittedDate: string
  assignedTo?: string
  riskScore?: number
  monthlyIncome: number
  existingEMI: number
  tenure: number
}

const mockApplications: Application[] = [
  {
    id: "APP001",
    customerName: "Om Sharma",
    email: "om.sharma@email.com",
    phone: "+91 9876543210",
    loanType: "Personal Loan",
    amount: 500000,
    status: "submitted",
    submittedDate: "2024-01-15",
    monthlyIncome: 75000,
    existingEMI: 15000,
    tenure: 36,
  },
  {
    id: "APP002",
    customerName: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91 9876543211",
    loanType: "Home Loan",
    amount: 2500000,
    status: "credit-assessment",
    submittedDate: "2024-01-14",
    assignedTo: "John Doe",
    riskScore: 720,
    monthlyIncome: 120000,
    existingEMI: 25000,
    tenure: 240,
  },
  {
    id: "APP003",
    customerName: "Raj Kumar",
    email: "raj.kumar@email.com",
    phone: "+91 9876543212",
    loanType: "Business Loan",
    amount: 1000000,
    status: "offer-generated",
    submittedDate: "2024-01-13",
    assignedTo: "Jane Smith",
    riskScore: 680,
    monthlyIncome: 90000,
    existingEMI: 20000,
    tenure: 60,
  },
]

export function StaffDashboard() {
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "under-review":
        return "bg-yellow-100 text-yellow-800"
      case "credit-assessment":
        return "bg-purple-100 text-purple-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "offer-generated":
        return "bg-indigo-100 text-indigo-800"
      case "offer-accepted":
        return "bg-teal-100 text-teal-800"
      case "disbursed":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Staff Dashboard</h1>
            <p className="text-muted-foreground">Manage loan applications and approvals</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>Sign Out</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter((app) => ["submitted", "under-review"].includes(app.status)).length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Assessment</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {applications.filter((app) => app.status === "credit-assessment").length}
              </div>
              <p className="text-xs text-muted-foreground">In credit assessment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  applications.filter((app) => ["approved", "offer-generated", "offer-accepted"].includes(app.status))
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">Ready for disbursement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ₹{(applications.reduce((sum, app) => sum + app.amount, 0) / 10000000).toFixed(1)}Cr
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or application ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="credit-assessment">Credit Assessment</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="offer-generated">Offer Generated</SelectItem>
                      <SelectItem value="offer-accepted">Offer Accepted</SelectItem>
                      <SelectItem value="disbursed">Disbursed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{application.customerName}</h3>
                          <p className="text-sm text-muted-foreground">{application.id}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {application.email}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {application.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{application.loanType}</p>
                        <p className="text-lg font-bold text-primary">₹{application.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(application.submittedDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Process
                            </Button>
                          </DialogTrigger>
                          {/* <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                            {selectedApplication && <LoanWorkflow application={selectedApplication} />}
                          </DialogContent> */}
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                    <p>Analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                    <p>Risk analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Export loan application reports for compliance and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Download className="h-12 w-12 mx-auto mb-4" />
                  <p>Report generation coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
