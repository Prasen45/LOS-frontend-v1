"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, FileText, TrendingUp } from "lucide-react"
import CustomerDashboard from "@/components/CustomerDashboard"
import Swal from "sweetalert2"

type UserType = "customer" | "staff" | "admin" | null

export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState<UserType>(null)

  // Redirect admin immediately on login
  useEffect(() => {
    if (isAuthenticated && userType === "admin") {
      router.replace("/dashboard/admin")
    }
  }, [isAuthenticated, userType, router])

  // Render CustomerDashboard if customer logged in
  if (isAuthenticated) {
    if (userType === "admin") {
      return (
        <div className="text-center mt-20 text-lg font-medium">
          Redirecting to admin dashboard...
        </div>
      )
    }
    if (userType === "customer") {
      return <CustomerDashboard />
    }
    // For staff: redirect to staff dashboard page (change path as needed)
    // if (userType === "staff") {
    //   router.replace("/dashboard/staff")
    //   return null
    // }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">SecureLoan</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional Loan Origination System - Streamlining your loan journey from application to disbursement
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Digital Application</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Complete your loan application online with our secure, step-by-step process
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Fast Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Advanced credit assessment and automated workflows for quick approvals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Expert Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Dedicated loan officers to guide you through every step of the process
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Access Your Account</CardTitle>
              <CardDescription className="text-center">
                Sign in to continue with your loan application or manage existing loans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="customer" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                  <TabsTrigger value="staff">Bank Staff</TabsTrigger>
                </TabsList>

                <TabsContent value="customer">
                  <LoginForm
                    userType="customer"
                    onLogin={() => {
                      setIsAuthenticated(true)
                      setUserType("customer")
                    }}
                  />
                </TabsContent>

                <TabsContent value="staff">
                  <LoginForm
                    userType="staff"
                    onLogin={(type) => {
                      setIsAuthenticated(true)
                      if (type === "admin") {
                        setUserType("admin")
                      } else {
                        setUserType("staff")
                      }
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function LoginForm({
  userType,
  onLogin,
}: {
  userType: "customer" | "staff"
  onLogin: (type?: UserType) => void
}) {
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState("")

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [invalidOtpAttempts, setInvalidOtpAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeLeft, setLockTimeLeft] = useState(0)

  const [resendTimer, setResendTimer] = useState(0)
  const router = useRouter()

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otp)
    alert(`Your OTP is: ${otp}`)
    setOtpSent(true)
    setResendTimer(60)
  }

  const handleVerifyOTP = () => {
    if (isLocked) {
      alert(`Account locked. Please wait ${lockTimeLeft} seconds.`)
      return
    }
    if (otp === generatedOtp) {
      setInvalidOtpAttempts(0)
      onLogin()
      router.push("/dashboard/customer")
    } else {
      const attempts = invalidOtpAttempts + 1
      setInvalidOtpAttempts(attempts)
      alert("Invalid OTP. Please try again.")
      if (attempts >= 5) {
        setIsLocked(true)
        setLockTimeLeft(900)
      }
    }
  }

  const handleStaffLogin = () => {
    if (username === "admin" && password === "Admin@123") {
      onLogin("admin")
      router.push("/dashboard/admin")
    } else if (username === "sales" && password === "Test@123") {
      onLogin("staff")
      router.push("/dashboard/staff/sales-executive")
    } else if (username === "creditAnalyst" && password === "Test@123") {
      onLogin("staff")
      router.push("/dashboard/staff/credit-analyst")
    } else if (username === "creditManager" && password === "Test@123") {
      onLogin("staff")
      router.push("/dashboard/staff/credit-manager")
    } else if (username === "loanOfficer" && password === "Test@123") {
      onLogin("staff")
      router.push("/dashboard/staff/loan-officer")
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Credentials",
        text: "The username or password you entered is incorrect.",
        confirmButtonColor: "#d33",
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userType === "customer") {
      if (isLocked) {
        alert(`Account is locked. Please wait ${lockTimeLeft} seconds before trying again.`)
        return
      }
      if (!otpSent) {
        generateOtp()
      } else {
        handleVerifyOTP()
      }
    } else {
      handleStaffLogin()
    }
  }

  const handleResendOtp = () => {
    if (resendTimer === 0 && !isLocked) {
      generateOtp()
      setOtp("")
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendTimer])

  useEffect(() => {
    let lockTimer: NodeJS.Timeout
    if (isLocked && lockTimeLeft > 0) {
      lockTimer = setTimeout(() => setLockTimeLeft(lockTimeLeft - 1), 1000)
    }
    if (lockTimeLeft === 0 && isLocked) {
      setIsLocked(false)
      setInvalidOtpAttempts(0)
      setOtpSent(false)
      setGeneratedOtp("")
      setOtp("")
    }
    return () => clearTimeout(lockTimer)
  }, [isLocked, lockTimeLeft])

return (
  <form onSubmit={handleSubmit} className="space-y-4">
    {userType === "customer" ? (
      <>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter the email"
            disabled={otpSent}
          />
        </div>

        <div>
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input
            id="mobile"
            type="tel"
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter the Mobile Number"
            disabled={otpSent}
          />
        </div>

        {otpSent && (
          <div>
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
            />
            <div className="flex justify-center">
              <Button
                variant="link"
                className="mt-2"
                disabled={resendTimer > 0}
                onClick={handleResendOtp}
                type="button"
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
              </Button>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={
            isLocked ||
            !email ||
            !mobile ||
            (otpSent && otp.length !== 6)
          }
        >
          {otpSent ? "Verify OTP" : "Send OTP"}
        </Button>
      </>
    ) : (
      <>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!username || !password}
        >
          Login
        </Button>
      </>
    )}
  </form>
)

}
