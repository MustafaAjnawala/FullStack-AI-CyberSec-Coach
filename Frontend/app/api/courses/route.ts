/**
 * @deprecated This API route is deprecated and will be removed in the next version.
 * Please use the Express backend endpoint directly: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses`
 * 
 * Reason for deprecation:
 * - Reducing unnecessary API layers
 * - Moving to direct backend communication
 * - Improving performance by eliminating extra hop
 * 
 * Migration guide:
 * Replace: fetch("/api/courses")
 * With: fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses`)
 */
import { NextResponse } from "next/server"

export async function GET() {
  // Simulating a database fetch with a delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const courses = [
    {
      id: 1,
      title: "OWASP Top 10 Vulnerabilities",
      description: "Learn about the most critical web application security risks and how to mitigate them.",
      instructor: "Dr. Nitin",
      enrolledStudents: 1248,
      duration: "10 weeks",
      rating: 4.8,
      modules: [
        { id: 1, title: "Broken Access Control", completed: false },
        { id: 2, title: "Cryptographic Failures", completed: false },
        { id: 3, title: "Injection", completed: false },
        { id: 4, title: "Insecure Design", completed: false },
        { id: 5, title: "Security Misconfiguration", completed: false },
        { id: 6, title: "Vulnerable and Outdated Components", completed: false },
        { id: 7, title: "Identification and Authentication Failures", completed: false },
        { id: 8, title: "Software and Data Integrity Failures", completed: false },
        { id: 9, title: "Security Logging and Monitoring Failures", completed: false },
        { id: 10, title: "Server-Side Request Forgery (SSRF)", completed: false },
      ],
      quizCompleted: false,
    },
  ]

  return NextResponse.json(courses)
}

