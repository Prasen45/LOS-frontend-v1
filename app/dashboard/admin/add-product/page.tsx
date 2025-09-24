"use client"

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

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAdd = async () => {
    if (!form.product_code.trim() || !form.product_name.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter the product code and product name.",
      })
      return
    }

    // Add new product to global product list
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

  return (
    <div className="px-8 pb-8 pd-4">
      <Card className="max-w-xl mx-auto py-10">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="product_code">Product Code</Label>
              <Input
                id="product_code"
                value={form.product_code}
                onChange={(e) => handleChange("product_code", e.target.value)}
                placeholder="Enter product code"
              />
            </div>

            <div>
              <Label htmlFor="product_name">Product Name</Label>
              <Input
                id="product_name"
                value={form.product_name}
                onChange={(e) => handleChange("product_name", e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            {/* Other input fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_amount">Min Amount</Label>
                <Input
                  id="min_amount"
                  type="number"
                  value={form.min_amount}
                  onChange={(e) => handleChange("min_amount", e.target.value)}
                  placeholder="Min amount"
                />
              </div>

              <div>
                <Label htmlFor="max_amount">Max Amount</Label>
                <Input
                  id="max_amount"
                  type="number"
                  value={form.max_amount}
                  onChange={(e) => handleChange("max_amount", e.target.value)}
                  placeholder="Max amount"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_tenure">Min Tenure (months)</Label>
                <Input
                  id="min_tenure"
                  type="number"
                  value={form.min_tenure}
                  onChange={(e) => handleChange("min_tenure", e.target.value)}
                  placeholder="Min tenure"
                />
              </div>

              <div>
                <Label htmlFor="max_tenure">Max Tenure (months)</Label>
                <Input
                  id="max_tenure"
                  type="number"
                  value={form.max_tenure}
                  onChange={(e) => handleChange("max_tenure", e.target.value)}
                  placeholder="Max tenure"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_roi">Min ROI (%)</Label>
                <Input
                  id="min_roi"
                  type="number"
                  step="0.01"
                  value={form.min_roi}
                  onChange={(e) => handleChange("min_roi", e.target.value)}
                  placeholder="Min ROI"
                />
              </div>

              <div>
                <Label htmlFor="max_roi">Max ROI (%)</Label>
                <Input
                  id="max_roi"
                  type="number"
                  step="0.01"
                  value={form.max_roi}
                  onChange={(e) => handleChange("max_roi", e.target.value)}
                  placeholder="Max ROI"
                />
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
                <Label htmlFor="foir_threshold">FOIR Threshold (%)</Label>
                <Input
                  id="foir_threshold"
                  type="number"
                  step="0.01"
                  value={form.foir_threshold}
                  onChange={(e) => handleChange("foir_threshold", e.target.value)}
                  placeholder="FOIR Threshold"
                />
              </div>

              <div>
                <Label htmlFor="ltv_threshold">LTV Threshold (%)</Label>
                <Input
                  id="ltv_threshold"
                  type="number"
                  step="0.01"
                  value={form.ltv_threshold}
                  onChange={(e) => handleChange("ltv_threshold", e.target.value)}
                  placeholder="LTV Threshold"
                />
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
