"use client"

import type { ReactNode } from "react"
import { PageContainer } from "@/components/page-container"

export function ProfileLayout({ children }: { children: ReactNode }) {
  return <PageContainer>{children}</PageContainer>
}

