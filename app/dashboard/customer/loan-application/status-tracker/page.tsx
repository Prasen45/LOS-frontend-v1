"use client"

import { StatusTracker } from "@/components/status-tracker"

export default function StatusTrackerPage() {
  // You can pass the applicationId as a prop or fetch it inside StatusTracker
  const applicationId = "your-application-id" 

  return <StatusTracker applicationId={applicationId} />
}