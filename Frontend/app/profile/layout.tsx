"use client"

import type React from "react"
import { ProfileLayout } from "@/components/profile-layout"
import { ProtectedRoute } from "@/components/protected-route"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <ProfileLayout>{children}</ProfileLayout>
    </ProtectedRoute>
  )
}

