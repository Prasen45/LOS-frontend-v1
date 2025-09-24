"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { Staff } from "./types" // ✅ use the shared type here

interface StaffContextType {
  staffList: Staff[]
  setStaffList: React.Dispatch<React.SetStateAction<Staff[]>>
}

const StaffContext = createContext<StaffContextType | undefined>(undefined)

export function StaffProvider({ children }: { children: ReactNode }) {
  const [staffList, setStaffList] = useState<Staff[]>([
    {
      staff_id: 101,
      username: "john",
      email: "john@example.com",
      mobile: "9876543210",
      first_name: "John",
      last_name: "Doe",
      role: "sales",
    },
    {
      staff_id: 102,
      username: "jane",
      email: "jane@example.com",
      mobile: "9123456780",
      first_name: "Jane",
      last_name: "Smith",
      role: "credit",
    },
  ])

  return (
    <StaffContext.Provider value={{ staffList, setStaffList }}>
      {children}
    </StaffContext.Provider>
  )
}

export function useStaff() {
  const context = useContext(StaffContext)
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider")
  }
  return context
}
