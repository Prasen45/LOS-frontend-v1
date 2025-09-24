'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useProduct } from "@/components/admin/ProductContext"

export default function AddProductPage() {
  const router = useRouter()
  const { productList, setProductList } = useProduct()

  const [form, setForm] = useState({
    product_code: "",
    product_name: "",
    min_amount: "",
    max_amount: "",
    min_tenure: "",
    max_tenure: "",
    min_roi: "",
    max_roi: "",
    is_secured: false,
    foir_threshold: "",
    ltv_threshold: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }))
  }

  const validateForm = () => {
    const requiredFields = [
      "product_code",
      "product_name",
      "min_amount",
      "max_amount",
      "min_tenure",
      "max_tenure",
      "min_roi",
      "max_roi",
      "foir_threshold",
      "ltv_threshold",
    ]

    const newErrors: Record<string, string> = {}

    requiredFields.forEach((field) => {
      if (
        form[field as keyof typeof form] === '' ||
        form[field as keyof typeof form] === null
      ) {
        newErrors[field] = 'This field is required'
      }
    })

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleAdd = async () => {
    if (!validateForm()) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields.",
      })
      return
    }

    setProductList([...productList, form])

    await Swal.fire({
      icon: "success",
      title: "Added!",
      text: "Product added successfully.",
      timer: 1500,
      showConfirmButton: false,
    })

    router.push("/dashboard/admin?tab=products")
  }

  const renderLabel = (label: string, required = true) => (
    <Label>
      {label} {required && <span>*</span>}
    </Label>
  )

  const renderError = (field: string) =>
    errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>

  return (
    <div className="px-8 pb-8 pd-4">
      <Card className="max-w-xl mx-auto py-10">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              {renderLabel("Product Code")}
              <Input
                value={form.product_code}
                onChange={(e) => handleChange("product_code", e.target.value)}
                placeholder="Enter product code"
              />
              {renderError("product_code")}
            </div>

            <div>
              {renderLabel("Product Name")}
              <Input
                value={form.product_name}
                onChange={(e) => handleChange("product_name", e.target.value)}
                placeholder="Enter product name"
              />
              {renderError("product_name")}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                {renderLabel("Min Amount")}
                <Input
                  type="number"
                  value={form.min_amount}
                  onChange={(e) => handleChange("min_amount", e.target.value)}
                  placeholder="Min amount"
                />
                {renderError("min_amount")}
              </div>

              <div>
                {renderLabel("Max Amount")}
                <Input
                  type="number"
                  value={form.max_amount}
                  onChange={(e) => handleChange("max_amount", e.target.value)}
                  placeholder="Max amount"
                />
                {renderError("max_amount")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                {renderLabel("Min Tenure (months)")}
                <Input
                  type="number"
                  value={form.min_tenure}
                  onChange={(e) => handleChange("min_tenure", e.target.value)}
                  placeholder="Min tenure"
                />
                {renderError("min_tenure")}
              </div>

              <div>
                {renderLabel("Max Tenure (months)")}
                <Input
                  type="number"
                  value={form.max_tenure}
                  onChange={(e) => handleChange("max_tenure", e.target.value)}
                  placeholder="Max tenure"
                />
                {renderError("max_tenure")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                {renderLabel("Min ROI (%)")}
                <Input
                  type="number"
                  step="0.01"
                  value={form.min_roi}
                  onChange={(e) => handleChange("min_roi", e.target.value)}
                  placeholder="Min ROI"
                />
                {renderError("min_roi")}
              </div>

              <div>
                {renderLabel("Max ROI (%)")}
                <Input
                  type="number"
                  step="0.01"
                  value={form.max_roi}
                  onChange={(e) => handleChange("max_roi", e.target.value)}
                  placeholder="Max ROI"
                />
                {renderError("max_roi")}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_secured"
                checked={form.is_secured}
                onCheckedChange={(checked) =>
                  handleChange("is_secured", Boolean(checked))
                }
              />
              <Label htmlFor="is_secured">Is Secured?</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                {renderLabel("FOIR Threshold (%)")}
                <Input
                  type="number"
                  step="0.01"
                  value={form.foir_threshold}
                  onChange={(e) => handleChange("foir_threshold", e.target.value)}
                  placeholder="FOIR Threshold"
                />
                {renderError("foir_threshold")}
              </div>

              <div>
                {renderLabel("LTV Threshold (%)")}
                <Input
                  type="number"
                  step="0.01"
                  value={form.ltv_threshold}
                  onChange={(e) => handleChange("ltv_threshold", e.target.value)}
                  placeholder="LTV Threshold"
                />
                {renderError("ltv_threshold")}
              </div>
            </div>

            <Button onClick={handleAdd} className="w-full">
              Add Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
