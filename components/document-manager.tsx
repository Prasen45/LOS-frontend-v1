"use client"

// import type React from "react"
import React from "react"
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
  status: "uploading" | "processing" | "uploaded" | "verified" | "rejected" | "pending"
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
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const documentTypes: Array<{
    key: Document["type"]
    label: string
    required: boolean
    description: string
    allowedFormats: string[]
    maxSizeMB: number
    minSize?: number
  }> = [
      {
        key: "photo-id", label: "Photo ID", required: true, description: "Aadhaar, PAN",
        allowedFormats: ["application/pdf", "image/jpeg", "image/png"],
        maxSizeMB: 5,
      },
      {
        key: "address-proof",
        label: "Address Proof",
        required: true,
        description: "Utility bill, Bank statement",
        allowedFormats: ["application/pdf", "image/jpeg", "image/png"],
        maxSizeMB: 5,
      },
      {
        key: "passport",
        label: "Passport Photo",
        required: true,
        description: "Scanned passport document",
        allowedFormats: ["image/jpeg", "image/png"],
        maxSizeMB: 2,
        minSize: 500,
      },
      {
        key: "income-proof",
        label: "Income Proof",
        required: true,
        description: "Salary slips, ITR",
        allowedFormats: ["application/pdf", "image/jpeg", "image/png"],
        maxSizeMB: 5,
      },
      {
        key: "bank-statement",
        label: "Bank Statement",
        required: true,
        description: "Last 6 months bank statements",
        allowedFormats: ["application/pdf"],
        minSize: 10,
        maxSizeMB: 20,
      },
    ]

  const [currentUploadingDocType, setCurrentUploadingDocType] = useState<Document["type"] | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileType = file.type;
    const fileSizeMB = file.size / 1024 / 1024;
    const fileSizeKB = file.size / 1024;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      e.target.value = "";
      return;
    }

    // Find the relevant doc type constraints
    const docType = currentEditingDocId
      ? documents.find((doc) => doc.id === currentEditingDocId)?.type
      : currentUploadingDocType;

    const docMeta = documentTypes.find((d) => d.key === docType);

    if (!docMeta) {
      alert("Unknown document type.");
      return;
    }

    // Validate file format
    if (!docMeta.allowedFormats.includes(fileType)) {
      alert(`Unsupported file format. Allowed: ${docMeta.allowedFormats.join(", ")}`);
      return;
    }

    // Validate size
    if (fileSizeMB > docMeta.maxSizeMB) {
      alert(`File size exceeds limit of ${docMeta.maxSizeMB}MB`);
      return;
    }

    if (docMeta.minSize && fileSizeKB < docMeta.minSize) {
      alert(`File is too small. Minimum size is ${docMeta.minSize / 1024}MB`);
      return;
    }

    // if (!["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
    //   alert("Unsupported file type. Upload PDF, JPG, or PNG.");
    //   e.target.value = "";
    //   return;
    // }

    if (currentEditingDocId) {
      // Replace existing document's file and reset upload state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === currentEditingDocId
            ? {
              ...doc,
              file,
              name: file.name,
              fileSize: file.size,
              mimeType: file.type,
              status: "uploading",
              uploadProgress: 0,
              uploadedAt: new Date(),
            }
            : doc,
        ),
      );
      simulateUpload(currentEditingDocId);
      setCurrentEditingDocId(null);
    } else if (currentUploadingDocType) {
      const newDocument: Document = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: currentUploadingDocType,  // use the selected doc type here
        file,
        status: "uploading",
        uploadProgress: 0,
        uploadedAt: new Date(),
        fileSize: file.size,
        mimeType: file.type,
      };

      setDocuments((prev) => [...prev, newDocument]);
      simulateUpload(newDocument.id);
      setCurrentUploadingDocType(null);
    }

    e.target.value = "";
  };


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
            // const ocrData = {
            //   extractedText: "Sample extracted text from document",
            //   confidence: 0.95,
            //   detectedFields: {
            //     name: "John Doe",
            //     documentNumber: "ABCD1234567",
            //     dateOfBirth: "1990-01-01",
            //   },
            // }

            return {
              ...doc,
              status: "uploaded",
              // ocrData: ocrData,
              verificationNotes: "Document processed sucessfully and uploaded.",
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
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleDownload = (document: Document) => {
    if (!document.file) {
      alert("No file available for download");
      return;
    }
    const url = URL.createObjectURL(document.file);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = document.name; // Suggests the file name
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const requiredDocs = documentTypes.filter((doc) => doc.required)
  const uploadedRequiredDocs = documents.filter(
    (doc) => requiredDocs.some((reqDoc) => reqDoc.key === doc.type) && doc.status === "uploaded",
  )
  const completionPercentage = (uploadedRequiredDocs.length / requiredDocs.length) * 100
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [currentEditingDocId, setCurrentEditingDocId] = useState<string | null>(null);



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
                        <span className="capitalize">{uploaded.status}</span>
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentUploadingDocType(docType.key)
                          fileInputRef.current?.click()
                        }}
                      >
                        Upload
                      </Button>
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

          <CardContent className="overflow-visible relative">
            <div className="space-y-4">
              {documents.map((document) => {
                const docMeta = documentTypes.find((dt) => dt.key === document.type)

                return (
                  <div
                    key={document.id}
                    className="relative group border rounded-lg p-4 hover:bg-muted/10 transition-colors"
                  >
                    {/* Hover Info Block */}
                    <div className="absolute top-2 right-2 p-2 bg-white border rounded shadow text-xs text-muted-foreground hidden group-hover:block z-10">
                      <span className="block">
                        <strong>Doc Type:</strong> {docMeta?.label || document.type}
                      </span>
                      <span className="block">
                        <strong>Allowed:</strong>{" "}
                        {docMeta?.allowedFormats
                          ?.map((f) =>
                            f
                              .replace("application/", "")
                              .replace("image/", "")
                              .toUpperCase(),
                          )
                          .join(", ")}
                      </span>
                      <div><strong>Max Size:</strong> {docMeta?.maxSizeMB} MB</div>
                      {docMeta?.minSize && (
                        <div><strong>Min Size:</strong> {(docMeta.minSize / 1024).toFixed(2)} MB</div>
                      )}
                    </div>

                    <div
                      key={document.id}
                      className="relative group border rounded-lg p-4 hover:bg-muted/10 transition-colors"
                    >

                      {/* Document Details */}
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
                          <p className="mt-1 p-2 border rounded-md text-sm bg-gray-100">{documentTypes.find(dt => dt.key === document.type)?.label || document.type}</p>
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
                        {(document.status === "processing" || document.status === "uploaded") && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => setSelectedDocument(document)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>

                            <Button variant="outline" size="sm" onClick={() => handleDownload(document)}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </>
                        )}

                        {!readOnly && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCurrentEditingDocId(document.id)
                                fileInputRef.current?.click()
                              }}
                              disabled={document.status === "uploading"}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteDocument(document.id)}>
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <Dialog
                      open={selectedDocument !== null}
                      onOpenChange={(open) => {
                        if (!open) setSelectedDocument(null)
                      }}
                    >
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>{selectedDocument?.name}</DialogTitle>
                          <DialogDescription>
                            Uploaded on: {selectedDocument?.uploadedAt.toLocaleString()}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4">
                          {selectedDocument?.mimeType.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(selectedDocument.file!)}
                              alt={selectedDocument.name}
                              className="max-w-full max-h-[60vh] object-contain rounded"
                            />
                          ) : selectedDocument?.mimeType === "application/pdf" ? (
                            <iframe
                              src={URL.createObjectURL(selectedDocument.file!)}
                              className="w-full h-[60vh]"
                              title={selectedDocument.name}
                            />
                          ) : (
                            <p>Preview not available for this file type.</p>
                          )}
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                            Close
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <input
        type="file"
        accept=".pdf,image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  )
}

