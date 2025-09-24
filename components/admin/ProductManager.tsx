"use client"

import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useProduct } from "@/components/admin/ProductContext"

export default function ProductManager() {
  const router = useRouter()
  const { productList, setProductList } = useProduct()

  const handleEdit = (index: number) => {
    router.push(`/dashboard/admin/edit-product?index=${index}`)
  }

  const handleAdd = () => {
    router.push("/dashboard/admin/add-product")
  }

  const handleDelete = async (code: string) => {
    const result = await Swal.fire({
      title: `Are you sure you want to remove product "${code}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      setProductList(productList.filter((p) => p.product_code !== code))
      await Swal.fire({
        icon: "success",
        title: "Removed!",
        text: `Product "${code}" has been removed.`,
        timer: 1500,
        showConfirmButton: false,
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Loan Product Management</CardTitle>
        <Button onClick={handleAdd}>Add Product</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border rounded">
            <thead className="bg-muted text-foreground">
              <tr>
                <th className="p-2 border">Product Code</th>
                <th className="p-2 border">Product Name</th>
                <th className="p-2 border">Max Amount</th>
                <th className="p-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-muted-foreground">
                    No products available.
                  </td>
                </tr>
              )}
              {productList.map((product, index) => (
                <tr key={product.product_code} className="border-t">
                  <td className="p-2 border">{product.product_code}</td>
                  <td className="p-2 border">{product.product_name}</td>
                  <td className="p-2 border">
                    {Number(product.max_amount).toLocaleString()}
                  </td>
                  <td className="p-2 border text-center space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(index)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.product_code)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
