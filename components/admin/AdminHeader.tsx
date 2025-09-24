"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AdminHeader({ title }: { title: string }) {
    const router = useRouter()
    return (
        <div className="pt-6 px-6">
            <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Admin Dashboard</CardTitle>
                    <Button variant="outline" onClick={() => router.push("/")}>
                        Sign Out
                    </Button>
                </CardHeader>
            </Card>
        </div>


    )
}
