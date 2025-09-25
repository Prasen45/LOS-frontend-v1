"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, Mail, Phone } from "lucide-react"
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
      case "submitted": return "bg-blue-100 text-blue-800"
      case "under-review": return "bg-yellow-100 text-yellow-800"
      case "credit-assessment": return "bg-purple-100 text-purple-800"
      case "approved": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      case "offer-generated": return "bg-indigo-100 text-indigo-800"
      case "offer-accepted": return "bg-teal-100 text-teal-800"
      case "disbursed": return "bg-emerald-100 text-emerald-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Credit Analyst Dashboard</h1>
            <p className="text-muted-foreground">Review and assess loan applications</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>Sign Out</Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center mb-6">
              <Input
                placeholder="Search by name or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="credit-assessment">Credit Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="pt-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{application.customerName}</h3>
                      <p className="text-sm text-muted-foreground">{application.id}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <Mail className="inline h-3 w-3 mr-1" /> {application.email}
                        <span className="ml-4"><Phone className="inline h-3 w-3 mr-1" /> {application.phone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.toUpperCase()}
                      </Badge>
                      <p className="text-sm">{application.loanType}</p>
                      <p className="font-bold">₹{application.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(application.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
