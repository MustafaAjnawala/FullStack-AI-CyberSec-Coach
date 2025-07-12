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
  _id: string; // Changed from id: number
  title: string;
  description: string;
  courseId: number; // The numeric ID for matching with progress
  long_description: string;
}

interface UserProgress {
  // This interface is assumed to be correct based on the original code
  completedCourses: number;
  inProgressCourses: number;
  totalQuizzesTaken: number;
  averageScore: number;
  lastActivity: string;
  courses: {
    id: number; // This 'id' should match the 'courseId' from the Course interface
    title: string;
    progress: number;
    quizCompleted: boolean;
    quizScore: number | null;
  }[];
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
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

        // Fetch all courses
        const coursesResponse = await fetch(`${backendUrl}/api/courses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!coursesResponse.ok) {
          throw new Error(`Failed to fetch courses. Status: ${coursesResponse.status}`)
        }
        const coursesData = await coursesResponse.json()

        // Fetch user progress (assuming this API endpoint exists and is correct)
        const progressResponse = await fetch("/api/user/progress")
        if (!progressResponse.ok) {
          throw new Error(`Failed to fetch user progress. Status: ${progressResponse.status}`)
        }
        const progressData = await progressResponse.json()

        setCourses(coursesData)
        setUserProgress(progressData)
      } catch (err: any) {
        setError(`Error loading data: ${err.message}. Please try again later.`)
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
  
  // --- REFACTORED to handle no courses ---
  if (!courses || courses.length === 0) {
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

  return (
    <ProtectedRoute>
      <PageContainer>
        <div className="py-6">
          <h1 className="text-3xl font-bold mb-6">Your Courses</h1>

          {/* --- REFACTORED to dynamically render all available courses --- */}
          <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              // Find the progress for the current course in the loop
              const courseProgress = userProgress?.courses.find(
                (p) => p.id === course.courseId
              );

              const progress = courseProgress?.progress ?? 0;

              return (
                <Card key={course._id} className="hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <CardTitle>{course.title}</CardTitle>
                    </div>
                    {/* Use the description from the API response */}
                    <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Course Progress</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Quiz Status:</span>{" "}
                      {courseProgress?.quizCompleted ? `Completed (Score: ${courseProgress.quizScore ?? 'N/A'}%)` : "Not Taken"}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {/* The link now uses the courseId for navigation */}
                    <Button asChild className="w-full">
                      <Link href={`/courses/${course.courseId}`}>
                        {progress > 0 ? "Continue Course" : "Start Course"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </section>
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
}