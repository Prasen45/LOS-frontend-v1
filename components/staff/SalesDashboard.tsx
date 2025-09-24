"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

interface Lead {
    id: string
    name: string
    email: string
    phone: string
    loanType: string
    status: "new" | "contacted" | "follow-up" | "converted" | "not-interested"
    notes?: string
}

export function SalesDashboard() {
    const [leads, setLeads] = useState<Lead[]>([])
    const router = useRouter()
    const [formData, setFormData] = useState<Omit<Lead, "id" | "status">>({
        name: "",
        email: "",
        phone: "",
        loanType: "",
        notes: "",
    })

    // Validation errors state
    const [errors, setErrors] = useState<{ name?: string; phone?: string; loanType?: string }>({})

    const handleAddLead = () => {
        // Reset errors first
        const newErrors: typeof errors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required"
        }
        if (!formData.loanType.trim()) {
            newErrors.loanType = "Loan type is required"
        }

        setErrors(newErrors)

        // If any errors, don't proceed
        if (Object.keys(newErrors).length > 0) return

        const newLead: Lead = {
            id: `LEAD${Date.now()}`,
            status: "new",
            ...formData,
        }

        setLeads((prev) => [newLead, ...prev])
        setFormData({ name: "", email: "", phone: "", loanType: "", notes: "" })
        setErrors({})
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Sales Executive Dashboard</h1>
                <Button variant="outline" onClick={() => router.push("/")}>
                    Sign Out
                </Button>
            </div>

            {/* Lead Capture Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Capture New Lead
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <label className="flex flex-col">
                        <span>
                            Customer Name <span className="text-black">*</span>
                        </span>
                        <Input
                            placeholder="Enter Customer Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            aria-invalid={!!errors.name}
                            aria-describedby="name-error"
                        />
                        {errors.name && (
                            <span id="name-error" className="text-sm text-red-600 mt-1">
                                {errors.name}
                            </span>
                        )}
                    </label>

                    <label className="flex flex-col">
                        <span>Email</span>
                        <Input
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            type="email"
                        />
                    </label>

                    <label className="flex flex-col">
                        <span>
                            Phone Number <span className="text-black">*</span>
                        </span>
                        <Input
                            placeholder="Enter Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            type="tel"
                            aria-invalid={!!errors.phone}
                            aria-describedby="phone-error"
                        />
                        {errors.phone && (
                            <span id="phone-error" className="text-sm text-red-600 mt-1">
                                {errors.phone}
                            </span>
                        )}
                    </label>

                    <label className="flex flex-col">
                        <span>
                            Loan Type <span className="text-black">*</span>
                        </span>
                        <Select
                            value={formData.loanType}
                            onValueChange={(value) => setFormData({ ...formData, loanType: value })}
                            aria-invalid={!!errors.loanType}
                            aria-describedby="loanType-error"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Loan Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                                <SelectItem value="Home Loan">Home Loan</SelectItem>
                                <SelectItem value="Business Loan">Business Loan</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.loanType && (
                            <span id="loanType-error" className="text-sm text-red-600 mt-1">
                                {errors.loanType}
                            </span>
                        )}
                    </label>

                    <label className="flex flex-col col-span-2">
                        <span>Notes (optional)</span>
                        <Textarea
                            placeholder="Enter Notes (optional)"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </label>

                    <Button onClick={handleAddLead} className="col-span-2 mx-auto">
                        Save Lead
                    </Button>
                </CardContent>
            </Card>

            {/* Leads List */}
            <div className="space-y-4">
                {leads.length === 0 ? (
                    <p className="text-muted-foreground">No leads captured yet.</p>
                ) : (
                    leads.map((lead) => (
                        <Card key={lead.id}>
                            <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                                <div>
                                    <h3 className="font-semibold">{lead.name}</h3>
                                    <p className="text-sm text-muted-foreground">{lead.loanType}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {lead.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {lead.phone}
                                        </span>
                                    </div>
                                    {lead.notes && <p className="text-sm mt-1">{lead.notes}</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium capitalize">Status: {lead.status}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
