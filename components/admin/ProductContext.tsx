// components/admin/ProductContext.tsx
"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export type Product = {
  product_code: string
  product_name: string
  min_amount?: number | string
  max_amount?: number | string
  min_tenure?: number | string
  max_tenure?: number | string
  min_roi?: number | string
  max_roi?: number | string
  is_secured?: boolean
  foir_threshold?: number | string
  ltv_threshold?: number | string
}

type ProductContextType = {
  productList: Product[]
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [productList, setProductList] = useState<Product[]>([
    {
      product_code: "PL001",
      product_name: "Personal Loan",
      min_amount: "1000",
      max_amount: "50000",
      min_tenure: "6",
      max_tenure: "60",
      min_roi: "5.5",
      max_roi: "10.0",
      is_secured: false,
      foir_threshold: "40",
      ltv_threshold: "80",
    },
    {
      product_code: "HL002",
      product_name: "Home Loan",
      min_amount: "50000",
      max_amount: "300000",
      min_tenure: "12",
      max_tenure: "240",
      min_roi: "6.0",
      max_roi: "9.0",
      is_secured: true,
      foir_threshold: "35",
      ltv_threshold: "75",
    },
  ])

  return (
    <ProductContext.Provider value={{ productList, setProductList }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider")
  }
  return context
}
