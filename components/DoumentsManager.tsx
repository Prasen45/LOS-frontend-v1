"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash } from "lucide-react"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

type Document = {
  name: string
  file: File
}

type Props = {
  applicationId: string
  onDocumentsChange: (documents: Document[]) => void
}

export function DocumentManager({ applicationId, onDocumentsChange }: Props) {
  const [documents, setDocuments] = useState<Document[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList && fileList.length > 0) {
      const file = fileList[0]
      const newDoc = { name: file.name, file }
      const updatedDocs = [...documents, newDoc]
      setDocuments(updatedDocs)
      onDocumentsChange(updatedDocs)
    }
  }

  const handleRemove = (index: number) => {
    const updatedDocs = documents.filter((_, i) => i !== index)
    setDocuments(updatedDocs)
    onDocumentsChange(updatedDocs)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Upload Supporting Documents</Label>
        <Input type="file" id="file" onChange={handleFileChange} />
        <p className="text-sm text-muted-foreground">Accepted formats: PDF, JPG, PNG</p>
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Documents</h4>
          <ul className="space-y-2">
            {documents.map((doc, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded"
              >
                <span className="truncate max-w-[70%]">{doc.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
