"use client"

// Update the course page to work with the improved sidebar

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Code, Loader2 } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { CourseQuiz, type QuizResults } from "./course-quiz"
import { CourseSidebar } from "@/components/course-sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ModuleContent {
  type: "reading" | "video" | "lab"
  title: string
  url?: string
  content?: string
}

interface Module {
  id: number
  title: string
  description: string
  completed: boolean
  content: {
    videoUrl: string
    readings: string[]
    exercises: string[]
  }
  subContent?: ModuleContent[]
}

interface Course {
  id: number
  title: string
  description: string
  instructor: string
  modules: Module[]
  quizCompleted: boolean
}

export default function CoursePage() {
  const params = useParams()
  const courseId = params.id
  const [activeModule, setActiveModule] = useState(0) // 0 means quiz view
  const [activeContentType, setActiveContentType] = useState<string>("")
  const [activeContentIndex, setActiveContentIndex] = useState(0)
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contentSelected, setContentSelected] = useState(false)

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/courses/${courseId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch course data")
        }
        const data = await response.json()
        setCourse(data)
      } catch (err) {
        setError("Error loading course data. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  const handleQuizComplete = async (results: QuizResults) => {
    if (!course) return

    try {
      // Update local state
      setCourse({
        ...course,
        quizCompleted: true,
      })

      // Update user progress via API
      await fetch("/api/user/progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          quizCompleted: true,
          quizResults: results,
        }),
      })

      // Reset to initial state after quiz completion
      setActiveModule(0)
      setActiveContentType("")
      setContentSelected(false)
    } catch (err) {
      console.error("Failed to update progress:", err)
    }
  }

  const handleModuleSelect = (moduleId: number) => {
    setActiveModule(moduleId)
    // If selecting quiz (moduleId = 0), show it directly
    if (moduleId === 0) {
      setContentSelected(true)
      setActiveContentType("")
    } else {
      // If selecting a module, wait for content type selection
      setContentSelected(false)
      setActiveContentType("")
    }
  }

  const handleContentSelect = (moduleId: number, contentType: string, contentIndex = 0) => {
    setActiveModule(moduleId)
    setActiveContentType(contentType)
    setActiveContentIndex(contentIndex)
    setContentSelected(true)
  }

  const renderModuleContent = (module: Module) => {
    if (activeContentType === "reading") {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {module.subContent && module.subContent.find((c) => c.type === "reading")?.content ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: module.subContent.find((c) => c.type === "reading")?.content || "",
                    }}
                  />
                ) : (
                  <div>
                    <h2>Overview</h2>
                    <p>{module.content.readings[0]}</p>
                    <h3>Details</h3>
                    <p>{module.content.readings[1]}</p>
                    <h3>Mitigation</h3>
                    <p>{module.content.readings[2]}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    } else if (activeContentType === "video") {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Video Lessons: {module.title}</CardTitle>
                  <CardDescription>Watch comprehensive video tutorials</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Video content would be embedded here</p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Video Content</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span>Introduction to {module.title}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span>Common Vulnerabilities and Examples</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span>Mitigation Strategies</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    } else if (activeContentType === "lab") {
      const labUrl = module.subContent?.find((c) => c.type === "lab")?.url || "https://ctf.hacker101.com/lab"

      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Practical Lab: {module.title}</CardTitle>
                  <CardDescription>Apply your knowledge with hands-on exercises</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-background border rounded-md">
                <iframe
                  src={labUrl}
                  className="w-full h-full rounded-md"
                  title={`${module.title} Lab`}
                  sandbox="allow-same-origin allow-scripts allow-forms"
                ></iframe>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Lab Exercises</h3>
                <ul className="space-y-2">
                  {module.content.exercises.map((exercise, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <span>{exercise}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return null
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex h-[calc(100vh-3.5rem)]">
          <div className="w-64 border-r"></div>
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p>Loading course content...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !course) {
    return (
      <ProtectedRoute>
        <div className="flex h-[calc(100vh-3.5rem)]">
          <div className="w-64 border-r"></div>
          <div className="flex-1 p-6">
            <Alert variant="destructive">
              <AlertDescription>{error || "Course not found"}</AlertDescription>
            </Alert>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const renderMainContent = () => {
    // Show quiz view
    if (activeModule === 0) {
      return course.quizCompleted ? (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Quiz Completed</h1>
          <p>You have already completed the course quiz. You can now access all module content.</p>
          <p className="text-muted-foreground">Select a module and content type from the sidebar to begin learning.</p>
        </div>
      ) : (
        <CourseQuiz courseId={courseId} onComplete={handleQuizComplete} />
      )
    }

    // If module is selected but content type is not
    if (activeModule > 0 && !contentSelected) {
      return (
        <div className="space-y-4 flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold">Module: {course.modules[activeModule - 1].title}</h1>
          <p className="text-center max-w-md">
            Please select a content type (Reading, Video, or Lab) from the sidebar to view the content.
          </p>
        </div>
      )
    }

    // If module and content type are selected
    if (activeModule > 0 && contentSelected) {
      return course.quizCompleted ? (
        renderModuleContent(course.modules[activeModule - 1])
      ) : (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Module Content Locked</h1>
          <p>Please complete the course quiz to unlock module content.</p>
          <Button onClick={() => setActiveModule(0)}>Take Quiz</Button>
        </div>
      )
    }

    return (
      <div className="space-y-4 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold">Welcome to the Course</h1>
        <p className="text-center max-w-md">Please select a module from the sidebar to begin.</p>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex h-[calc(100vh-3.5rem)]">
        <CourseSidebar
          courseId={courseId}
          activeModule={activeModule}
          activeContentType={activeContentType}
          quizCompleted={course.quizCompleted}
          onModuleSelect={handleModuleSelect}
          onContentSelect={handleContentSelect}
        />

        <div className="flex-1 p-6 overflow-y-auto">{renderMainContent()}</div>
      </div>
    </ProtectedRoute>
  )
}

