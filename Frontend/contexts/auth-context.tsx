"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

// Define user types
export interface User {
  _id: string
  username: string
  name: string
  email: string
  role: "admin" | "user"
  avatarUrl?: string
  createdAt?: string
  updatedAt?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (name: string, username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${backendUrl}/auth/me`, {
          method: 'GET',
          credentials: 'include', // Important for sending cookies
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [backendUrl])

  // Redirect unauthenticated users from protected routes
  useEffect(() => {
    if (!isLoading && !user) {
      const protectedRoutes = ["/profile", "/courses", "/dashboard"]

      // Check if current path starts with any protected route
      const isProtectedRoute = protectedRoutes.some((route) => pathname?.startsWith(route))

      if (isProtectedRoute) {
        router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`)
      }
    }
  }, [isLoading, user, pathname, router])

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for receiving cookies
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.user)
        return true
      } else {
        console.error('Login failed:', data.error)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  // Register function
  const register = async (name: string, username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for receiving cookies
        body: JSON.stringify({ name, username, email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Registration failed' }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Network error during registration' }
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Important for clearing cookies
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      router.push("/login")
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

