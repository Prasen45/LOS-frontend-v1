// app/customer/loan-application/LoanApplicationContext.tsx

"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  mobile: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  nationalIdType: string;
  nationalIdNumber: string;
  employmentType: string;
  monthlyIncome: string;
  consent: boolean;
  loanProduct: string;
  loanAmount: string;
  tenure: string;
  purposeOfLoan: string;
  preferredEMIDate: string;
  existingEMI: string;
  documents: any[];
}

interface LoanApplicationContextProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  resetFormData: () => void;
}

const defaultFormData: FormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  email: "",
  mobile: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  nationalIdType: "",
  nationalIdNumber: "",
  employmentType: "",
  monthlyIncome: "",
  consent: false,
  loanProduct: "",
  loanAmount: "",
  tenure: "",
  purposeOfLoan: "",
  preferredEMIDate: "",
  existingEMI: "",
  documents: [],
};

const LoanApplicationContext = createContext<LoanApplicationContextProps | undefined>(undefined);

export function LoanApplicationProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetFormData = () => {
    setFormData(defaultFormData);
  };

  return (
    <LoanApplicationContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </LoanApplicationContext.Provider>
  );
}

export function useLoanApplication() {
  const context = useContext(LoanApplicationContext);
  if (!context) {
    throw new Error("useLoanApplication must be used within a LoanApplicationProvider");
  }
  return context;
}
