"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calculator,
  Shield,
  DollarSign,
  Banknote,
  Phone,
  MessageSquare,
  Bell,
  Calendar,
  Download,
  Eye,
  RefreshCw,
} from "lucide-react"

interface ApplicationStatus {
  id: string
  customerName: string
  loanType: string
  amount: number
  currentStatus:
    | "submitted"
    | "document-verification"
    | "credit-assessment"
    | "approved"
    | "rejected"
    | "offer-generated"
    | "offer-sent"
    | "offer-accepted"
    | "disbursed"
  submittedDate: string
  lastUpdated: string
  estimatedCompletion?: string
  assignedOfficer?: {
    name: string
    phone: string
    email: string
  }
  timeline: TimelineEvent[]
  notifications: Notification[]
  documents: DocumentStatus[]
  offer?: LoanOffer
}

interface TimelineEvent {
  id: string
  status: string
  title: string
  description: string
  timestamp: string
  completed: boolean
  current: boolean
  icon: any
  color: string
}

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionRequired?: boolean
}

interface DocumentStatus {
  name: string
  status: "pending" | "uploaded" | "verified" | "rejected"
  uploadedDate?: string
  verifiedDate?: string
  rejectionReason?: string
}

interface LoanOffer {
  amount: number
  interestRate: number
  tenure: number
  emi: number
  processingFee: number
  validUntil: string
  status: "generated" | "sent" | "accepted" | "rejected" | "expired"
}

const mockApplicationStatus: ApplicationStatus = {
  id: "APP001",
  customerName: "Om Sharma",
  loanType: "Personal Loan",
  amount: 500000,
  currentStatus: "credit-assessment",
  submittedDate: "2024-01-15T10:30:00Z",
  lastUpdated: "2024-01-16T14:20:00Z",
  estimatedCompletion: "2024-01-20T17:00:00Z",
  assignedOfficer: {
    name: "Priya Patel",
    phone: "+91 9876543210",
    email: "priya.patel@securebank.com",
  },
  timeline: [
    {
      id: "1",
      status: "submitted",
      title: "Application Submitted",
      description: "Your loan application has been successfully submitted",
      timestamp: "2024-01-15T10:30:00Z",
      completed: true,
      current: false,
      icon: FileText,
      color: "text-green-600",
    },
    {
      id: "2",
      status: "document-verification",
      title: "Document Verification",
      description: "All required documents have been verified",
      timestamp: "2024-01-15T16:45:00Z",
      completed: true,
      current: false,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: "3",
      status: "credit-assessment",
      title: "Credit Assessment",
      description: "Your credit profile is being evaluated",
      timestamp: "2024-01-16T09:15:00Z",
      completed: false,
      current: true,
      icon: Calculator,
      color: "text-blue-600",
    },
    {
      id: "4",
      status: "approval-decision",
      title: "Approval Decision",
      description: "Final decision on your loan application",
      timestamp: "",
      completed: false,
      current: false,
      icon: Shield,
      color: "text-gray-400",
    },
    {
      id: "5",
      status: "offer-generation",
      title: "Loan Offer",
      description: "Personalized loan offer will be generated",
      timestamp: "",
      completed: false,
      current: false,
      icon: DollarSign,
      color: "text-gray-400",
    },
    {
      id: "6",
      status: "disbursement",
      title: "Loan Disbursement",
      description: "Funds will be transferred to your account",
      timestamp: "",
      completed: false,
      current: false,
      icon: Banknote,
      color: "text-gray-400",
    },
  ],
  notifications: [
    {
      id: "1",
      type: "success",
      title: "Documents Verified",
      message: "All your uploaded documents have been successfully verified by our team.",
      timestamp: "2024-01-15T16:45:00Z",
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "Credit Assessment Started",
      message: "Our team has started evaluating your credit profile. This usually takes 2-3 business days.",
      timestamp: "2024-01-16T09:15:00Z",
      read: false,
    },
    {
      id: "3",
      type: "info",
      title: "Application Received",
      message: "Your loan application has been received and assigned to our loan officer.",
      timestamp: "2024-01-15T10:30:00Z",
      read: true,
    },
  ],
  documents: [
    {
      name: "Photo ID",
      status: "verified",
      uploadedDate: "2024-01-15T11:00:00Z",
      verifiedDate: "2024-01-15T16:30:00Z",
    },
    {
      name: "Address Proof",
      status: "verified",
      uploadedDate: "2024-01-15T11:05:00Z",
      verifiedDate: "2024-01-15T16:35:00Z",
    },
    {
      name: "Income Proof",
      status: "verified",
      uploadedDate: "2024-01-15T11:10:00Z",
      verifiedDate: "2024-01-15T16:40:00Z",
    },
    {
      name: "Bank Statement",
      status: "verified",
      uploadedDate: "2024-01-15T11:15:00Z",
      verifiedDate: "2024-01-15T16:45:00Z",
    },
  ],
}

export function StatusTracker({ applicationId }: { applicationId: string }) {
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>(mockApplicationStatus)
  const [unreadNotifications, setUnreadNotifications] = useState(2)
  const [refreshing, setRefreshing] = useState(false)

  const refreshStatus = async () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false)
      // Update last updated time
      setApplicationStatus((prev) => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
      }))
    }, 1000)
  }

  const markNotificationAsRead = (notificationId: string) => {
    setApplicationStatus((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif,
      ),
    }))
    setUnreadNotifications((prev) => Math.max(0, prev - 1))
  }

  const getStatusProgress = () => {
    const completedSteps = applicationStatus.timeline.filter((step) => step.completed).length
    return (completedSteps / applicationStatus.timeline.length) * 100
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "document-verification":
        return "bg-yellow-100 text-yellow-800"
      case "credit-assessment":
        return "bg-purple-100 text-purple-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "offer-generated":
        return "bg-indigo-100 text-indigo-800"
      case "offer-sent":
        return "bg-cyan-100 text-cyan-800"
      case "offer-accepted":
        return "bg-teal-100 text-teal-800"
      case "disbursed":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Application Status</h2>
          <p className="text-muted-foreground">Track your loan application progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshStatus} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Badge variant="outline">{applicationStatus.id}</Badge>
        </div>
      </div>

      {/* Application Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{applicationStatus.loanType}</CardTitle>
              <CardDescription>
                Amount: ₹{applicationStatus.amount.toLocaleString()} • Submitted:{" "}
                {new Date(applicationStatus.submittedDate).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(applicationStatus.currentStatus)}>
              {applicationStatus.currentStatus.replace("-", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Application Progress</span>
                <span>{Math.round(getStatusProgress())}% Complete</span>
              </div>
              <Progress value={getStatusProgress()} className="h-2" />
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Last Updated:</strong> {new Date(applicationStatus.lastUpdated).toLocaleString()}
              </div>
              {applicationStatus.estimatedCompletion && (
                <div>
                  <strong>Estimated Completion:</strong>{" "}
                  {new Date(applicationStatus.estimatedCompletion).toLocaleDateString()}
                </div>
              )}
            </div>

            {applicationStatus.assignedOfficer && (
              <Alert>
                <Phone className="h-4 w-4" />
                <AlertDescription>
                  <strong>Your Loan Officer:</strong> {applicationStatus.assignedOfficer.name} •
                  <a
                    href={`tel:${applicationStatus.assignedOfficer.phone}`}
                    className="text-primary hover:underline ml-1"
                  >
                    {applicationStatus.assignedOfficer.phone}
                  </a>{" "}
                  •
                  <a
                    href={`mailto:${applicationStatus.assignedOfficer.email}`}
                    className="text-primary hover:underline ml-1"
                  >
                    {applicationStatus.assignedOfficer.email}
                  </a>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadNotifications > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          {applicationStatus.offer && <TabsTrigger value="offer">Loan Offer</TabsTrigger>}
        </TabsList>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>Track each step of your loan application process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {applicationStatus.timeline.map((event, index) => {
                  const Icon = event.icon
                  return (
                    <div key={event.id} className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.completed
                            ? "bg-primary text-primary-foreground"
                            : event.current
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.title}</h4>
                          {event.timestamp && (
                            <span className="text-sm text-muted-foreground">
                              {new Date(event.timestamp).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        {event.current && (
                          <Badge variant="outline" className="mt-2">
                            <Clock className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Stay updated with your application progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationStatus.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      !notification.read ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"
                    }`}
                    onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${!notification.read ? "text-primary" : ""}`}>
                            {notification.title}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        {!notification.read && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Status</CardTitle>
              <CardDescription>Check the verification status of your uploaded documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationStatus.documents.map((document, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{document.name}</h4>
                        {document.uploadedDate && (
                          <p className="text-sm text-muted-foreground">
                            Uploaded: {new Date(document.uploadedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          document.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : document.status === "uploaded"
                              ? "bg-blue-100 text-blue-800"
                              : document.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {document.status.toUpperCase()}
                      </Badge>
                      {document.verifiedDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Verified: {new Date(document.verifiedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {applicationStatus.offer && (
          <TabsContent value="offer">
            <Card>
              <CardHeader>
                <CardTitle>Loan Offer</CardTitle>
                <CardDescription>Review your personalized loan offer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        ₹{applicationStatus.offer.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Loan Amount</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-secondary">{applicationStatus.offer.interestRate}%</div>
                      <div className="text-sm text-muted-foreground">Interest Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-accent">
                        ₹{applicationStatus.offer.emi.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Monthly EMI</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Tenure:</strong> {applicationStatus.offer.tenure} months
                    </div>
                    <div>
                      <strong>Processing Fee:</strong> ₹{applicationStatus.offer.processingFee.toLocaleString()}
                    </div>
                    <div>
                      <strong>Valid Until:</strong> {new Date(applicationStatus.offer.validUntil).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Status:</strong>
                      <Badge
                        className={`ml-2 ${
                          applicationStatus.offer.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : applicationStatus.offer.status === "sent"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {applicationStatus.offer.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {applicationStatus.offer.status === "sent" && (
                    <div className="flex gap-2">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Offer
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Offer Letter
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Application
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Call
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
