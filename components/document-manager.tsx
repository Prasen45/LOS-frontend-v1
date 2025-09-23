"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileText,
  ImageIcon,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  Scan,
  Shield,
  Clock,
  FileCheck,
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: "photo-id" | "address-proof" | "income-proof" | "bank-statement" | "passport" | "other"
  file: File | null
  status: "uploading" | "processing" | "verified" | "rejected" | "pending"
  uploadProgress: number
  verificationNotes?: string
  ocrData?: any
  uploadedAt: Date
  verifiedAt?: Date
  fileSize: number
  mimeType: string
}

interface DocumentManagerProps {
  applicationId?: string
  onDocumentsChange?: (documents: Document[]) => void
  readOnly?: boolean
}

export function DocumentManager({ applicationId, onDocumentsChange, readOnly = false }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const documentTypes = [
    { key: "photo-id", label: "Photo ID", required: true, description: "Aadhaar, PAN, Passport, or Driving License" },
    {
      key: "address-proof",
      label: "Address Proof",
      required: true,
      description: "Utility bill, Bank statement, or Rental agreement",
    },
    {
      key: "income-proof",
      label: "Income Proof",
      required: true,
      description: "Salary slips, ITR, or Business income proof",
    },
    { key: "bank-statement", label: "Bank Statement", required: true, description: "Last 6 months bank statements" },
    { key: "passport", label: "Passport", required: false, description: "Valid passport (if available)" },
    { key: "other", label: "Other Documents", required: false, description: "Additional supporting documents" },
  ]

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        return
      }

      if (!["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        alert(`File ${file.name} has unsupported format. Please upload PDF, JPG, or PNG files.`)
        return
      }

      const newDocument: Document = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: "other", // Default type, user can change
        file: file,
        status: "uploading",
        uploadProgress: 0,
        uploadedAt: new Date(),
        fileSize: file.size,
        mimeType: file.type,
      }

      setDocuments((prev) => [...prev, newDocument])
      simulateUpload(newDocument.id)
    })
  }

  const simulateUpload = (documentId: string) => {
    const interval = setInterval(() => {
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === documentId) {
            const newProgress = Math.min(doc.uploadProgress + 10, 100)
            if (newProgress === 100) {
              clearInterval(interval)
              setTimeout(() => simulateProcessing(documentId), 1000)
              return { ...doc, uploadProgress: newProgress, status: "processing" }
            }
            return { ...doc, uploadProgress: newProgress }
          }
          return doc
        }),
      )
    }, 200)
  }

  const simulateProcessing = (documentId: string) => {
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === documentId) {
            // Simulate OCR data extraction
            const ocrData = {
              extractedText: "Sample extracted text from document",
              confidence: 0.95,
              detectedFields: {
                name: "John Doe",
                documentNumber: "ABCD1234567",
                dateOfBirth: "1990-01-01",
              },
            }

            return {
              ...doc,
              status: "pending",
              ocrData: ocrData,
              verificationNotes: "Document processed successfully. Awaiting manual verification.",
            }
          }
          return doc
        }),
      )

      if (onDocumentsChange) {
        onDocumentsChange(documents)
      }
    }, 2000)
  }

  const updateDocumentType = (documentId: string, newType: Document["type"]) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? { ...doc, type: newType } : doc)))
  }

  const verifyDocument = (documentId: string, status: "verified" | "rejected", notes?: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, status, verificationNotes: notes, verifiedAt: new Date() } : doc,
      ),
    )
  }

  const deleteDocument = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
  }

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "uploading":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "verified":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "uploading":
        return <Upload className="h-4 w-4" />
      case "processing":
        return <Scan className="h-4 w-4" />
      case "verified":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const requiredDocs = documentTypes.filter((doc) => doc.required)
  const uploadedRequiredDocs = documents.filter(
    (doc) => requiredDocs.some((reqDoc) => reqDoc.key === doc.type) && doc.status === "verified",
  )
  const completionPercentage = (uploadedRequiredDocs.length / requiredDocs.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Document Management</h2>
          <p className="text-muted-foreground">Upload and manage your loan application documents</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">Secure & Encrypted</span>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Document Completion Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Required Documents</span>
              <span>
                {uploadedRequiredDocs.length} of {requiredDocs.length} completed
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      {!readOnly && (
        <Card>
          <CardContent className="pt-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
              <p className="text-muted-foreground mb-4">Drag and drop your files here, or click to browse</p>
              <Input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer bg-transparent">
                  Choose Files
                </Button>
              </Label>
              <p className="text-xs text-muted-foreground mt-2">Supported formats: PDF, JPG, PNG (Max 5MB each)</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Document Requirements</CardTitle>
          <CardDescription>Please ensure you upload all required documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {documentTypes.map((docType) => {
              const uploaded = documents.find((doc) => doc.type === docType.key)
              return (
                <div key={docType.key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{docType.label}</h4>
                      {docType.required && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{docType.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {uploaded ? (
                      <Badge className={getStatusColor(uploaded.status)}>
                        {getStatusIcon(uploaded.status)}
                        <span className="ml-1 capitalize">{uploaded.status}</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Uploaded</Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>Manage your uploaded documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {document.mimeType.startsWith("image/") ? (
                          <ImageIcon className="h-5 w-5 text-primary" />
                        ) : (
                          <FileText className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{document.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {(document.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded{" "}
                          {document.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(document.status)}>
                        {getStatusIcon(document.status)}
                        <span className="ml-1 capitalize">{document.status.replace("-", " ")}</span>
                      </Badge>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {document.status === "uploading" && (
                    <div className="mb-2">
                      <Progress value={document.uploadProgress} className="h-2" />
                    </div>
                  )}

                  {/* Document Type Selection */}
                  {!readOnly && document.status !== "uploading" && (
                    <div className="mb-2">
                      <Label className="text-sm">Document Type</Label>
                      <select
                        value={document.type}
                        onChange={(e) => updateDocumentType(document.id, e.target.value as Document["type"])}
                        className="w-full mt-1 p-2 border rounded-md text-sm"
                      >
                        {documentTypes.map((type) => (
                          <option key={type.key} value={type.key}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Verification Notes */}
                  {document.verificationNotes && (
                    <Alert className="mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">{document.verificationNotes}</AlertDescription>
                    </Alert>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDocument(document)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DocumentViewer document={document} onVerify={verifyDocument} readOnly={readOnly} />
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>

                    {!readOnly && (
                      <Button variant="outline" size="sm" onClick={() => deleteDocument(document.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function DocumentViewer({
  document,
  onVerify,
  readOnly,
}: {
  document: Document
  onVerify: (id: string, status: "verified" | "rejected", notes?: string) => void
  readOnly: boolean
}) {
  const [verificationNotes, setVerificationNotes] = useState("")

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Document Viewer - {document.name}</DialogTitle>
        <DialogDescription>Review document details and verification status</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          {document.ocrData && <TabsTrigger value="ocr">OCR Data</TabsTrigger>}
          {!readOnly && <TabsTrigger value="verify">Verify</TabsTrigger>}
        </TabsList>

        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <div className="bg-muted rounded-lg p-8 text-center">
                {document.mimeType.startsWith("image/") ? (
                  <div>
                    <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Image preview would appear here</p>
                  </div>
                ) : (
                  <div>
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">PDF preview would appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>File Name:</strong> {document.name}
                </div>
                <div>
                  <strong>File Size:</strong> {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                </div>
                <div>
                  <strong>File Type:</strong> {document.mimeType}
                </div>
                <div>
                  <strong>Document Type:</strong> {document.type.replace("-", " ").toUpperCase()}
                </div>
                <div>
                  <strong>Upload Date:</strong> {document.uploadedAt.toLocaleString()}
                </div>
                <div>
                  <strong>Status:</strong>
                  <Badge
                    className={`ml-2 ${
                      document.status === "verified"
                        ? "bg-green-100 text-green-800"
                        : document.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {document.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>
              {document.verifiedAt && (
                <div className="text-sm">
                  <strong>Verified At:</strong> {document.verifiedAt.toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {document.ocrData && (
          <TabsContent value="ocr">
            <Card>
              <CardHeader>
                <CardTitle>OCR Extracted Data</CardTitle>
                <CardDescription>Automatically extracted information from the document</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Confidence Score</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={document.ocrData.confidence * 100} className="flex-1 h-2" />
                    <span className="text-sm">{(document.ocrData.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {document.ocrData.detectedFields && (
                  <div>
                    <Label className="text-sm font-medium">Detected Fields</Label>
                    <div className="mt-2 space-y-2">
                      {Object.entries(document.ocrData.detectedFields).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                          <span className="font-medium">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Extracted Text</Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg text-sm">{document.ocrData.extractedText}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {!readOnly && (
          <TabsContent value="verify">
            <Card>
              <CardHeader>
                <CardTitle>Document Verification</CardTitle>
                <CardDescription>Review and verify the uploaded document</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">Verification Notes</Label>
                  <textarea
                    id="notes"
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="Add notes about document verification..."
                    className="w-full mt-2 p-3 border rounded-lg text-sm"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => onVerify(document.id, "verified", verificationNotes)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Document
                  </Button>
                  <Button variant="destructive" onClick={() => onVerify(document.id, "rejected", verificationNotes)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
