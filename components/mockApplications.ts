// lib/mockApplications.ts

export interface Document {
  id: string
  name: string
  url?: string
  verified?: boolean
  note?: string
}

export interface Application {
  id: string
  customerName: string
  loanType: string
  amount: number
  submittedDate: string
  status: "submitted" | "under-review" | "credit-assessment" | "approved" | "rejected" | "offer-generated" | "offer-accepted" | "disbursed"
  documents: Document[]
  bureauScore?: number
  systemScore?: number
  salarySlipValidated?: "pending" | "approved" | "rejected"
  salaryValidationNote?: string

  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email: string
  mobile: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  nationalIdType: string
  nationalIdNumber: string
  monthlyIncome: number

  loanProduct: string
  loanAmount: number
  tenureMonths: number
  loanPurpose: string
  preferredEmiDate: string
  existingEmiObligations: string
}

export const mockApplications: Application[] = [
  {
    id: "APP100",
    customerName: "Asha Verma",
    loanType: "Personal Loan",
    amount: 300000,
    submittedDate: "2024-02-01",
    status: "submitted",
    documents: [
      { 
        id: "doc1", 
        name: "Photo ID - Asha.pdf", 
        url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Aadhaar_Card_sample.png" // sample image of Aadhaar card
      },
      { 
        id: "doc2", 
        name: "Salary Slip Jan 2024.pdf", 
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" // dummy PDF file
      },
    ],
    bureauScore: 710,
    systemScore: 0.78,
    salarySlipValidated: "pending",
    salaryValidationNote: "",

    firstName: "Asha",
    lastName: "Verma",
    dateOfBirth: "1990-05-20",
    gender: "Female",
    email: "asha.verma@example.com",
    mobile: "9876543210",
    addressLine1: "123 MG Road",
    addressLine2: "Apt 4B",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    nationalIdType: "Aadhaar",
    nationalIdNumber: "1234-5678-9012",
    monthlyIncome: 75000,

    loanProduct: "Personal Loan",
    loanAmount: 300000,
    tenureMonths: 24,
    loanPurpose: "Home renovation",
    preferredEmiDate: "5th of every month",
    existingEmiObligations: "Car loan - ₹10,000 monthly",
  },
  {
    id: "APP101",
    customerName: "Vikram Rao",
    loanType: "Home Loan",
    amount: 4500000,
    submittedDate: "2024-01-20",
    status: "credit-assessment",
    documents: [
      { 
        id: "doc3", 
        name: "Photo ID - Vikram.pdf", 
        url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" // sample profile image
      },
      { 
        id: "doc4", 
        name: "Salary Slip Dec 2023.pdf", 
        url: "https://www.orimi.com/pdf-test.pdf" // another dummy PDF file
      },
    ],
    bureauScore: 640,
    systemScore: 0.62,
    salarySlipValidated: "approved",
    salaryValidationNote: "",

    firstName: "Vikram",
    lastName: "Rao",
    dateOfBirth: "1985-11-10",
    gender: "Male",
    email: "vikram.rao@example.com",
    mobile: "9123456780",
    addressLine1: "789 Park Street",
    addressLine2: "",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "560001",
    nationalIdType: "PAN",
    nationalIdNumber: "ABCDE1234F",
    monthlyIncome: 120000,

    loanProduct: "Home Loan",
    loanAmount: 4500000,
    tenureMonths: 120,
    loanPurpose: "House purchase",
    preferredEmiDate: "10th of every month",
    existingEmiObligations: "None",
  },
]

