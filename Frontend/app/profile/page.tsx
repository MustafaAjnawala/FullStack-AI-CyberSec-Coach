"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PageContainer } from "@/components/page-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, BookOpen, GraduationCap, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

export default function ProfilePage() {
  const { user } = useAuth()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/user/progress")
        if (!response.ok) {
          throw new Error("Failed to fetch user progress")
        }
        const data = await response.json()
        setUserProgress(data)
      } catch (err) {
        setError("Error loading user progress. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProgress()
  }, [])

  if (isLoading) {
    return (
      <PageContainer>
        <div className="py-6 flex justify-center items-center min-h-[50vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p>Loading profile data...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <div className="py-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses In Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress?.inProgressCourses || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress?.completedCourses || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress?.totalQuizzesTaken || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p>{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Username</p>
                    <p>{user?.username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Activity</p>
                    <p>
                      {userProgress?.lastActivity ? new Date(userProgress.lastActivity).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your overall progress across all courses</CardDescription>
              </CardHeader>
              <CardContent>
                {userProgress?.courses.map((course) => (
                  <div key={course.id} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{course.title}</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                ))}

                {(!userProgress?.courses || userProgress.courses.length === 0) && (
                  <p className="text-muted-foreground">No course progress available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
                <CardDescription>Courses you are currently enrolled in</CardDescription>
              </CardHeader>
              <CardContent>
                {userProgress?.courses.map((course) => (
                  <div key={course.id} className="mb-4 p-4 border rounded-md">
                    <h3 className="font-medium mb-2">{course.title}</h3>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2 mb-2" />
                    <div className="text-sm text-muted-foreground">
                      <p>Quiz Status: {course.quizCompleted ? "Completed" : "Not Completed"}</p>
                      {course.quizScore !== null && <p>Quiz Score: {course.quizScore}%</p>}
                    </div>
                  </div>
                ))}

                {(!userProgress?.courses || userProgress.courses.length === 0) && (
                  <p className="text-muted-foreground">You are not enrolled in any courses.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}

