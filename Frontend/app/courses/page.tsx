"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PageContainer } from "@/components/page-container"
import { ProtectedRoute } from "@/components/protected-route"
import { Shield, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Course {
  id: number
  title: string
  description: string
  instructor: string
  enrolledStudents: number
  duration: string
  rating: number
  modules: {
    id: number
    title: string
    completed: boolean
  }[]
  quizCompleted: boolean
}

interface UserProgress {
  completedCourses: number
  inProgressCourses: number
  totalQuizzesTaken: number
  averageScore: number
  lastActivity: string
  courses: {
    id: number
    title: string
    progress: number
    quizCompleted: boolean
    quizScore: number | null
  }[]
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch courses
        const coursesResponse = await fetch("/api/courses")
        if (!coursesResponse.ok) {
          throw new Error("Failed to fetch courses")
        }
        const coursesData = await coursesResponse.json()

        // Fetch user progress
        const progressResponse = await fetch("/api/user/progress")
        if (!progressResponse.ok) {
          throw new Error("Failed to fetch user progress")
        }
        const progressData = await progressResponse.json()

        setCourses(coursesData)
        setUserProgress(progressData)
      } catch (err) {
        setError("Error loading data. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <PageContainer>
          <div className="py-6 flex justify-center items-center min-h-[50vh]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p>Loading courses...</p>
            </div>
          </div>
        </PageContainer>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <PageContainer>
          <div className="py-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </PageContainer>
      </ProtectedRoute>
    )
  }

  const cybersecCourse = courses.find((course) => course.id === 1)
  const courseProgress = userProgress?.courses.find((course) => course.id === 1)

  if (!cybersecCourse) {
    return (
      <ProtectedRoute>
        <PageContainer>
          <div className="py-6">
            <Alert>
              <AlertDescription>No courses available at this time.</AlertDescription>
            </Alert>
          </div>
        </PageContainer>
      </ProtectedRoute>
    )
  }

  // Calculate progress based on completed modules and quiz
  const totalModules = cybersecCourse.modules.length
  const completedModules = cybersecCourse.modules.filter((m) => m.completed).length
  const quizCompleted = cybersecCourse.quizCompleted ? 1 : 0
  const progress = totalModules > 0 ? ((completedModules + quizCompleted) / (totalModules + 1)) * 100 : 0

  return (
    <ProtectedRoute>
      <PageContainer>
        <div className="py-6">
          <h1 className="text-3xl font-bold mb-6">Your Courses</h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Current Course</h2>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>{cybersecCourse.title}</CardTitle>
                </div>
                <CardDescription>{cybersecCourse.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Course Progress</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Instructor:</span> {cybersecCourse.instructor}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span> {cybersecCourse.duration}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quiz Status:</span>{" "}
                    {cybersecCourse.quizCompleted ? "Completed" : "Not Completed"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Modules:</span> {completedModules}/{totalModules} completed
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/courses/${cybersecCourse.id}`}>
                    {progress > 0 ? "Continue Course" : "Start Course"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
}

