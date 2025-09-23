"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, FileText, TrendingUp } from "lucide-react"
import { StaffDashboard } from "@/components/staff-dashboard"
import CustomerDashboard from "@/components/CustomerDashboard"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState<"customer" | "staff" | null>(null)

  if (isAuthenticated && userType) {
    return userType === "customer" ? <CustomerDashboard /> : <StaffDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">SecureLoan</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional Loan Origination System - Streamlining your loan journey from application to disbursement
          </p>
        </div>

        {/* Features */}
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

        {/* Authentication */}
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
                    onLogin={() => {
                      setIsAuthenticated(true)
                      setUserType("staff")
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

function LoginForm({ userType, onLogin }: { userType: "customer" | "staff"; onLogin: () => void }) {
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState("")

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // OTP invalid attempts & lockout
  const [invalidOtpAttempts, setInvalidOtpAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeLeft, setLockTimeLeft] = useState(0) // seconds

  // Timer for resend OTP
  const [resendTimer, setResendTimer] = useState(0)
  const router = useRouter()

  const isValidEmail = (email: string) =>
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)

  const isValidMobile = (mobile: string) =>
    /^(\+?\d{10,15})$/.test(mobile)

  const isValidUsername = (username: string) =>
    /^[a-zA-Z0-9]+$/.test(username)

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)

  // Generate and show OTP
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otp)
    alert(`Your OTP is: ${otp}`)
    setOtpSent(true)
    setResendTimer(60) // start 60 second timer
  }

  // Handle OTP verification with lock logic
  const handleVerifyOTP = () => {
    if (isLocked) {
      alert(`Account locked. Please wait ${lockTimeLeft} seconds.`)
      return
    }
    if (otp === generatedOtp) {
      setInvalidOtpAttempts(0) // reset attempts on success
      onLogin()
      router.push("/dashboard/customer")
    } else {
      const attempts = invalidOtpAttempts + 1
      setInvalidOtpAttempts(attempts)
      alert("Invalid OTP. Please try again.")
      if (attempts >= 5) {
        // Lock account for 15 minutes (900 seconds)
        setIsLocked(true)
        setLockTimeLeft(900)
      }
    }
  }

  // Staff login handler
  const handleStaffLogin = () => {
    if (username === "admin" && password === "Admin@123") {
      onLogin()
      router.push("/dashboard/admin") // Go to admin dashboard
    }

    else {
      onLogin()
      router.push("/dashboard/staff")
    }
  }

  // Main submit handler
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

  // Resend OTP handler
  const handleResendOtp = () => {
    if (resendTimer === 0 && !isLocked) {
      generateOtp()
      setOtp("")
    }
  }

  // Countdown timer effect for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendTimer])

  // Countdown timer effect for lockout
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
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent}
            />
            {email && !isValidEmail(email) && (
              <p className="text-sm text-red-500">Enter a valid email address.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              disabled={otpSent}
            />
            {mobile && !isValidMobile(mobile) && (
              <p className="text-sm text-red-500">Enter a valid mobile number.</p>
            )}
          </div>

          {otpSent && (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLocked}
                />
              </div>

              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isLocked}
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </Button>
                {isLocked && (
                  <p className="text-sm text-red-600 font-semibold">
                    Account locked. Try again in {lockTimeLeft}s
                  </p>
                )}
              </div>
            </>
          )}

          <Button
            className="w-full"
            type="submit"
            disabled={
              !isValidEmail(email) ||
              !isValidMobile(mobile) ||
              (otpSent && otp.length !== 6) ||
              isLocked
            }
          >
            {otpSent ? "Verify OTP & Sign In" : "Send OTP"}
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {username && !isValidUsername(username) && (
              <p className="text-sm text-red-500">Username must be alphanumeric only.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && !isValidPassword(password) && (
              <p className="text-sm text-red-500">
                Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
              </p>
            )}
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={!isValidUsername(username) || !isValidPassword(password)}
          >
            Sign In
          </Button>
        </>
      )}
    </form>
  )
}
