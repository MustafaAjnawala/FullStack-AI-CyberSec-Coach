"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { PageContainer } from "@/components/page-container"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    if (!username.trim()) {
      setError("Username is required")
      return
    }
    if (!email.trim()) {
      setError("Email is required")
      return
    }
    if (!password) {
      setError("Password is required")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      const result = await register(name.trim(), username.trim(), email.trim(), password)

      if (result.success) {
        // Registration successful, redirect to home or dashboard
        router.push("/")
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (err) {
      setError("An error occurred during registration")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Sign up to access the AI CyberSecurity Coach</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister}>
              <div className="grid w-full items-center gap-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="name"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Login here
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button onClick={handleRegister} disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  )
}
