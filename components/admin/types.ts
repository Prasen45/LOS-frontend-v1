// components/admin/types.ts
export type Staff = {
  staff_id: number
  username: string
  email: string
  mobile: string
  first_name: string
  last_name: string
  role: "sales" | "credit" | "operations"
}
