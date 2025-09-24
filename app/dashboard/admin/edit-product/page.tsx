"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useProduct, Product } from "@/components/admin/ProductContext"

type ProductForm = {
  product_code: string
  product_name: string
  min_amount: string
  max_amount: string
  min_tenure: string
  max_tenure: string
  min_roi: string
  max_roi: string
  is_secured: boolean
  foir_threshold: string
  ltv_threshold: string
}

// Converts Product (context data) to ProductForm (form strings)
function productToForm(product: Product): ProductForm {
  return {
    product_code: product.product_code,
    product_name: product.product_name,
    min_amount: product.min_amount !== undefined ? String(product.min_amount) : "",
    max_amount: product.max_amount !== undefined ? String(product.max_amount) : "",
    min_tenure: product.min_tenure !== undefined ? String(product.min_tenure) : "",
    max_tenure: product.max_tenure !== undefined ? String(product.max_tenure) : "",
    min_roi: product.min_roi !== undefined ? String(product.min_roi) : "",
    max_roi: product.max_roi !== undefined ? String(product.max_roi) : "",
    is_secured: product.is_secured ?? false,
    foir_threshold: product.foir_threshold !== undefined ? String(product.foir_threshold) : "",
    ltv_threshold: product.ltv_threshold !== undefined ? String(product.ltv_threshold) : "",
  }
}

// Converts form back to Product (context format)
function formToProduct(form: ProductForm): Product {
  return {
    product_code: form.product_code,
    product_name: form.product_name,
    min_amount: form.min_amount !== "" ? form.min_amount : undefined,
    max_amount: form.max_amount !== "" ? form.max_amount : undefined,
    min_tenure: form.min_tenure !== "" ? form.min_tenure : undefined,
    max_tenure: form.max_tenure !== "" ? form.max_tenure : undefined,
    min_roi: form.min_roi !== "" ? form.min_roi : undefined,
    max_roi: form.max_roi !== "" ? form.max_roi : undefined,
    is_secured: form.is_secured,
    foir_threshold: form.foir_threshold !== "" ? form.foir_threshold : undefined,
    ltv_threshold: form.ltv_threshold !== "" ? form.ltv_threshold : undefined,
  }
}

export default function EditProductPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const indexParam = searchParams.get("index")

  const { productList, setProductList } = useProduct()

  const [form, setForm] = useState<ProductForm>({
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

  useEffect(() => {
    if (indexParam) {
      const idx = Number(indexParam)
      if (idx >= 0 && idx < productList.length) {
        setForm(productToForm(productList[idx]))
      }
    }
  }, [indexParam, productList])

  const handleChange = (field: keyof ProductForm, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdate = async () => {
    if (!form.product_code.trim() || !form.product_name.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter the product code and product name.",
      })
      return
    }

    if (indexParam) {
      const idx = Number(indexParam)
      const updatedProducts = [...productList]
      updatedProducts[idx] = formToProduct(form)
      setProductList(updatedProducts)

      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Product updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      })

      router.push("/dashboard/admin?tab=products")
    }
  }

  return (
    <div className="px-8 pb-8 pd-4">
      <Card className="max-w-xl mx-auto py-10">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
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

            {/* Other inputs */}
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

            <Button onClick={handleUpdate} className="w-full">
              Update Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
