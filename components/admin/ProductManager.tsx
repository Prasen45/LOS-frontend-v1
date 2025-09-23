"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ProductManager() {
  const [products, setProducts] = useState<string[]>(["PL", "HL", "BL", "GL", "Two-Wheeler"])
  const [newProduct, setNewProduct] = useState("")

  const handleAdd = () => {
    if (newProduct && !products.includes(newProduct)) {
      setProducts([...products, newProduct])
      setNewProduct("")
    }
  }

  const handleDelete = (product: string) => {
    setProducts(products.filter((p) => p !== product))
  }

  const handleUpdate = (index: number, updated: string) => {
    const updatedList = [...products]
    updatedList[index] = updated
    setProducts(updatedList)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Product Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Enter new product"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
          />
          <Button onClick={handleAdd}>Add Product</Button>
        </div>

        <ul className="space-y-2">
          {products.map((product, index) => (
            <li key={index} className="flex items-center justify-between border p-2 rounded">
              <Input
                className="w-1/2"
                value={product}
                onChange={(e) => handleUpdate(index, e.target.value)}
              />
              <Button variant="destructive" onClick={() => handleDelete(product)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
