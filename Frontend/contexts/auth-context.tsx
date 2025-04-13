"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

// Define user types
export interface User {
  id: string
  username: string
  name: string
  email: string
  role: "admin"
  avatarUrl?: string
}

// Mock user
const ADMIN_USER: User = {
  id: "1",
  username: "admin",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  avatarUrl: "/placeholder-user.jpg",
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

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
    // Only allow admin/admin login
    if (username === "admin" && password === "admin") {
      setUser(ADMIN_USER)
      localStorage.setItem("user", JSON.stringify(ADMIN_USER))
      return true
    }

    return false
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  const value = {
    user,
    login,
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

