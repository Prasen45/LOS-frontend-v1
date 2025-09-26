"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Application {
  id: string
  customerName: string
  email: string
  phone: string
  loanType: string
  amount: number
  status: string
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
  // ... other applications
]

export default function CreditAnalystDashboard() {
  const [applications] = useState<Application[]>(mockApplications)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === "all"
          ? ["under-review", "credit-assessment", "submitted"].includes(app.status)
          : app.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [applications, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "under-review":
        return "bg-yellow-100 text-yellow-800"
      case "credit-assessment":
        return "bg-purple-100 text-purple-800"
      // add other cases
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Credit Analyst Dashboard</h1>
          <Button variant="outline" onClick={() => router.push("/")}>Sign Out</Button>
        </div>

        {/* Search and filter */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or application ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Relevant Statuses</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="credit-assessment">Credit Assessment</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {filteredApplications.length === 0 && (
            <p className="text-center text-muted-foreground">No applications found.</p>
          )}

          {filteredApplications.map((application) => (
            <Card key={application.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{application.customerName}</h3>
                    <p className="text-sm text-muted-foreground">{application.id}</p>
                  </div>

                  <div className="text-right">
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.replace("-", " ").toUpperCase()}
                    </Badge>
                    <p className="text-lg font-bold text-primary">₹{application.amount.toLocaleString()}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/staff/credit-analyst/review/${application.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
