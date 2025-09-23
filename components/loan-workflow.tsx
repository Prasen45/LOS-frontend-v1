"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calculator,
  FileText,
  Send,
  User,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Shield,
  Banknote,
} from "lucide-react"

interface LoanApplication {
  id: string
  customerName: string
  email: string
  phone: string
  loanType: string
  amount: number
  tenure: number
  monthlyIncome: number
  existingEMI: number
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
  creditScore?: number
  foir?: number
  ltv?: number
  interestRate?: number
  processingFee?: number
  emi?: number
  workflowSteps: WorkflowStep[]
}

interface WorkflowStep {
  id: string
  name: string
  status: "pending" | "in-progress" | "completed" | "failed"
  assignedTo?: string
  completedAt?: Date
  notes?: string
  duration?: number
}

interface CreditAssessment {
  applicationId: string
  creditScore: number
  riskCategory: "low" | "medium" | "high"
  foir: number
  ltv: number
  recommendedRate: number
  maxLoanAmount: number
  assessment: string
  factors: {
    incomeStability: number
    creditHistory: number
    existingObligations: number
    collateralValue?: number
  }
}

interface LoanOffer {
  id: string
  applicationId: string
  loanAmount: number
  interestRate: number
  tenure: number
  emi: number
  processingFee: number
  totalInterest: number
  totalAmount: number
  validUntil: Date
  terms: string[]
  status: "generated" | "sent" | "accepted" | "rejected" | "expired"
}

export function LoanWorkflow({ application }: { application: LoanApplication }) {
  const [currentApplication, setCurrentApplication] = useState<LoanApplication>(application)
  const [creditAssessment, setCreditAssessment] = useState<CreditAssessment | null>(null)
  const [loanOffer, setLoanOffer] = useState<LoanOffer | null>(null)
  const [workflowNotes, setWorkflowNotes] = useState("")

  const workflowSteps = [
    { id: "document-verification", name: "Document Verification", icon: FileText },
    { id: "credit-assessment", name: "Credit Assessment", icon: Calculator },
    { id: "risk-evaluation", name: "Risk Evaluation", icon: Shield },
    { id: "approval-decision", name: "Approval Decision", icon: CheckCircle },
    { id: "offer-generation", name: "Offer Generation", icon: DollarSign },
    { id: "disbursement", name: "Disbursement", icon: Banknote },
  ]

  const calculateFOIR = (monthlyIncome: number, existingEMI: number, proposedEMI: number) => {
    return ((existingEMI + proposedEMI) / monthlyIncome) * 100
  }

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / (12 * 100)
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
    return Math.round(emi)
  }

  const performCreditAssessment = () => {
    const proposedEMI = calculateEMI(currentApplication.amount, 12, currentApplication.tenure)
    const foir = calculateFOIR(currentApplication.monthlyIncome, currentApplication.existingEMI, proposedEMI)

    // Simulate credit scoring
    const creditScore = Math.floor(Math.random() * 200) + 650 // 650-850 range
    const riskCategory: "low" | "medium" | "high" = creditScore >= 750 ? "low" : creditScore >= 650 ? "medium" : "high"

    const assessment: CreditAssessment = {
      applicationId: currentApplication.id,
      creditScore,
      riskCategory,
      foir,
      ltv: currentApplication.loanType === "home" ? 80 : 0, // LTV only for home loans
      recommendedRate: riskCategory === "low" ? 10.5 : riskCategory === "medium" ? 12.5 : 15.0,
      maxLoanAmount: Math.floor(currentApplication.monthlyIncome * 60), // 60x monthly income
      assessment: `Based on credit analysis, applicant shows ${riskCategory} risk profile with FOIR of ${foir.toFixed(1)}%`,
      factors: {
        incomeStability: Math.floor(Math.random() * 40) + 60,
        creditHistory: Math.floor(Math.random() * 40) + 60,
        existingObligations: Math.floor(Math.random() * 40) + 60,
        collateralValue: currentApplication.loanType === "home" ? Math.floor(Math.random() * 40) + 60 : undefined,
      },
    }

    setCreditAssessment(assessment)
    updateApplicationStatus("credit-assessment")
  }

  const generateLoanOffer = () => {
    if (!creditAssessment) return

    const interestRate = creditAssessment.recommendedRate
    const emi = calculateEMI(currentApplication.amount, interestRate, currentApplication.tenure)
    const totalInterest = emi * currentApplication.tenure - currentApplication.amount
    const processingFee = Math.floor(currentApplication.amount * 0.01) // 1% processing fee

    const offer: LoanOffer = {
      id: `OFFER_${Date.now()}`,
      applicationId: currentApplication.id,
      loanAmount: currentApplication.amount,
      interestRate,
      tenure: currentApplication.tenure,
      emi,
      processingFee,
      totalInterest,
      totalAmount: currentApplication.amount + totalInterest,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days validity
      terms: [
        "Interest rate is subject to change based on RBI guidelines",
        "Processing fee is non-refundable",
        "EMI will be auto-debited from your account",
        "Prepayment charges may apply as per terms",
        "Late payment charges will be levied for delayed EMIs",
      ],
      status: "generated",
    }

    setLoanOffer(offer)
    updateApplicationStatus("offer-generated")
  }

  const updateApplicationStatus = (newStatus: LoanApplication["status"]) => {
    setCurrentApplication((prev) => ({ ...prev, status: newStatus }))
  }

  const approveApplication = () => {
    updateApplicationStatus("approved")
    generateLoanOffer()
  }

  const rejectApplication = (reason: string) => {
    updateApplicationStatus("rejected")
    setWorkflowNotes(reason)
  }

  const sendOfferToCustomer = () => {
    if (loanOffer) {
      setLoanOffer((prev) => (prev ? { ...prev, status: "sent" } : null))
      // Simulate sending offer to customer
      alert("Loan offer sent to customer successfully!")
    }
  }

  const processOfferAcceptance = () => {
    if (loanOffer) {
      setLoanOffer((prev) => (prev ? { ...prev, status: "accepted" } : null))
      updateApplicationStatus("offer-accepted")
    }
  }

  const processDisbursement = () => {
    updateApplicationStatus("disbursed")
    alert("Loan disbursement initiated successfully!")
  }

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
    <div className="space-y-6">
      {/* Application Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {currentApplication.customerName} - {currentApplication.id}
              </CardTitle>
              <CardDescription>
                {currentApplication.loanType} • ₹{currentApplication.amount.toLocaleString()} •{" "}
                {currentApplication.tenure} months
              </CardDescription>
            </div>
            <Badge className={getStatusColor(currentApplication.status)}>
              {currentApplication.status.replace("-", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{currentApplication.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{currentApplication.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Submitted: {new Date(currentApplication.submittedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Income: ₹{currentApplication.monthlyIncome.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Progress</CardTitle>
          <CardDescription>Track the loan processing stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = getStepStatus(step.id, currentApplication.status) === "completed"
              const isCurrent = getStepStatus(step.id, currentApplication.status) === "current"

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-center max-w-20">{step.name}</span>
                </div>
              )
            })}
          </div>
          <Progress value={getWorkflowProgress(currentApplication.status)} className="h-2" />
        </CardContent>
      </Card>

      {/* Main Workflow Content */}
      <Tabs defaultValue="assessment" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assessment">Credit Assessment</TabsTrigger>
          <TabsTrigger value="decision">Decision</TabsTrigger>
          <TabsTrigger value="offer">Loan Offer</TabsTrigger>
          <TabsTrigger value="disbursement">Disbursement</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      ₹{currentApplication.monthlyIncome.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Monthly Income</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-secondary">
                      ₹{currentApplication.existingEMI.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Existing EMI</div>
                  </div>
                </div>

                {!creditAssessment ? (
                  <Button onClick={performCreditAssessment} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Perform Credit Assessment
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div
                          className={`text-2xl font-bold ${
                            creditAssessment.creditScore >= 750
                              ? "text-green-600"
                              : creditAssessment.creditScore >= 650
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {creditAssessment.creditScore}
                        </div>
                        <div className="text-sm text-muted-foreground">Credit Score</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div
                          className={`text-2xl font-bold ${
                            creditAssessment.foir <= 40
                              ? "text-green-600"
                              : creditAssessment.foir <= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {creditAssessment.foir.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">FOIR</div>
                      </div>
                    </div>

                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Risk Category:</strong> {creditAssessment.riskCategory.toUpperCase()} •
                        <strong> Recommended Rate:</strong> {creditAssessment.recommendedRate}% •
                        <strong> Max Amount:</strong> ₹{creditAssessment.maxLoanAmount.toLocaleString()}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Factors</CardTitle>
              </CardHeader>
              <CardContent>
                {creditAssessment ? (
                  <div className="space-y-4">
                    {Object.entries(creditAssessment.factors).map(
                      ([key, value]) =>
                        value !== undefined && (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                              <span>{value}%</span>
                            </div>
                            <Progress value={value} className="h-2" />
                          </div>
                        ),
                    )}

                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm">{creditAssessment.assessment}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4" />
                    <p>Run credit assessment to view risk factors</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="decision">
          <Card>
            <CardHeader>
              <CardTitle>Approval Decision</CardTitle>
              <CardDescription>Make the final decision on the loan application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {creditAssessment && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Credit assessment completed. Risk category:{" "}
                    <strong>{creditAssessment.riskCategory.toUpperCase()}</strong>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Decision Notes</Label>
                <Textarea
                  id="notes"
                  value={workflowNotes}
                  onChange={(e) => setWorkflowNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={approveApplication}
                  disabled={!creditAssessment || currentApplication.status === "approved"}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Application
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => rejectApplication(workflowNotes)}
                  disabled={currentApplication.status === "rejected"}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offer">
          <div className="space-y-6">
            {loanOffer ? (
              <Card>
                <CardHeader>
                  <CardTitle>Loan Offer Details</CardTitle>
                  <CardDescription>Generated offer for {currentApplication.customerName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">₹{loanOffer.loanAmount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Loan Amount</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-secondary">{loanOffer.interestRate}%</div>
                      <div className="text-sm text-muted-foreground">Interest Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-accent">₹{loanOffer.emi.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Monthly EMI</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Tenure:</strong> {loanOffer.tenure} months
                    </div>
                    <div>
                      <strong>Processing Fee:</strong> ₹{loanOffer.processingFee.toLocaleString()}
                    </div>
                    <div>
                      <strong>Total Interest:</strong> ₹{loanOffer.totalInterest.toLocaleString()}
                    </div>
                    <div>
                      <strong>Total Amount:</strong> ₹{loanOffer.totalAmount.toLocaleString()}
                    </div>
                    <div>
                      <strong>Valid Until:</strong> {loanOffer.validUntil.toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Status:</strong>
                      <Badge
                        className={`ml-2 ${
                          loanOffer.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : loanOffer.status === "sent"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {loanOffer.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Terms & Conditions</Label>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {loanOffer.terms.map((term, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    {loanOffer.status === "generated" && (
                      <Button onClick={sendOfferToCustomer}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Offer to Customer
                      </Button>
                    )}
                    {loanOffer.status === "sent" && (
                      <Button onClick={processOfferAcceptance} variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Accepted
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4" />
                    <p>Loan offer will be generated after approval</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="disbursement">
          <Card>
            <CardHeader>
              <CardTitle>Loan Disbursement</CardTitle>
              <CardDescription>Process the final loan disbursement</CardDescription>
            </CardHeader>
            <CardContent>
              {currentApplication.status === "offer-accepted" ? (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Customer has accepted the loan offer. Ready for disbursement.</AlertDescription>
                  </Alert>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Disbursement Amount:</strong> ₹{loanOffer?.loanAmount.toLocaleString()}
                    </div>
                    <div>
                      <strong>Processing Fee:</strong> ₹{loanOffer?.processingFee.toLocaleString()}
                    </div>
                    <div>
                      <strong>Net Disbursement:</strong> ₹
                      {loanOffer ? (loanOffer.loanAmount - loanOffer.processingFee).toLocaleString() : 0}
                    </div>
                    <div>
                      <strong>First EMI Date:</strong>{" "}
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>

                  <Button onClick={processDisbursement} className="w-full">
                    <Banknote className="h-4 w-4 mr-2" />
                    Process Disbursement
                  </Button>
                </div>
              ) : currentApplication.status === "disbursed" ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Loan has been successfully disbursed to the customer.</AlertDescription>
                </Alert>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>Waiting for customer to accept the loan offer</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getStepStatus(stepId: string, applicationStatus: string): "completed" | "current" | "pending" {
  const statusOrder = [
    "submitted",
    "under-review",
    "credit-assessment",
    "approved",
    "offer-generated",
    "offer-accepted",
    "disbursed",
  ]

  const stepOrder = [
    "document-verification",
    "credit-assessment",
    "risk-evaluation",
    "approval-decision",
    "offer-generation",
    "disbursement",
  ]

  const currentStatusIndex = statusOrder.indexOf(applicationStatus)
  const stepIndex = stepOrder.indexOf(stepId)

  if (stepIndex < currentStatusIndex) return "completed"
  if (stepIndex === currentStatusIndex) return "current"
  return "pending"
}

function getWorkflowProgress(status: string): number {
  const statusProgress = {
    submitted: 10,
    "under-review": 25,
    "credit-assessment": 40,
    approved: 60,
    rejected: 100,
    "offer-generated": 75,
    "offer-accepted": 90,
    disbursed: 100,
  }
  return statusProgress[status as keyof typeof statusProgress] || 0
}
