"use client"

// Update the course page to work with the improved sidebar

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Code, Loader2 } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
// Make sure QuizResults is exported from course-quiz.tsx
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
  quizCompleted: boolean // Still useful for sidebar locking
}

export default function CoursePage() {
  const params = useParams()
  const courseId = params.id as string // Ensure courseId is treated as string
  const [activeModule, setActiveModule] = useState(0) // 0 means quiz view
  const [activeContentType, setActiveContentType] = useState<string>("")
  const [activeContentIndex, setActiveContentIndex] = useState(0)
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contentSelected, setContentSelected] = useState(false)
  // State to track if the quiz component *itself* indicates completion (for sidebar)
  const [isQuizMarkedComplete, setIsQuizMarkedComplete] = useState(false);


  // Fetch course data (includes initial quiz completion status)
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        // Fetch initial course data (might include quizCompleted status from DB)
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course data");
        }
        const courseData = await courseResponse.json();
        setCourse(courseData);
        // Set initial quiz completed status based on fetched data
        setIsQuizMarkedComplete(courseData.quizCompleted || false);

      } catch (err) {
        setError("Error loading course data. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  // This function is called by CourseQuiz when the quiz is submitted *or*
  // when CourseQuiz mounts and finds a previous result.
  const handleQuizCompleteOrLoaded = async (results: QuizResults | null) => {
    // If results are provided (meaning quiz was just submitted or loaded with results)
    // Mark as complete for the sidebar state
    if (results && !isQuizMarkedComplete) {
      console.log("Quiz marked complete by CourseQuiz component (via onComplete/load)");
      setIsQuizMarkedComplete(true);

      // If the course state doesn't reflect completion yet, update it locally
      // and potentially persist if needed (though CourseQuiz might handle persistence)
      if (course && !course.quizCompleted) {
        setCourse(prevCourse => prevCourse ? { ...prevCourse, quizCompleted: true } : null);

        // Optional: Persist completion status if CourseQuiz doesn't already
        try {
          await fetch("/api/user/progress", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courseId,
              quizCompleted: true,
              quizResults: results, // Include results if available
            }),
          });
          console.log("User progress updated via CoursePage handler");
        } catch (err) {
          console.error("Failed to update progress from CoursePage:", err);
        }
      }
    } else if (!results) {
      // This case might occur if CourseQuiz loads without prior results
      // We don't necessarily need to do anything here unless we want to reset state
      console.log("CourseQuiz loaded without prior results.");
    }
  };


  const handleModuleSelect = (moduleId: number) => {
    setActiveModule(moduleId)
    if (moduleId === 0) {
      // Always set contentSelected true for quiz, CourseQuiz handles the view
      setContentSelected(true)
      setActiveContentType("")
    } else {
      // Reset for modules until content type is chosen
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

  // --- Render functions remain the same ---
  const renderModuleContent = (module: Module) => {
    // ... (keep existing renderModuleContent logic) ...
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
  // --- Loading and Error states remain the same ---
  if (isLoading) {
    return (
        <ProtectedRoute>
          <div className="flex h-[calc(100vh-3.5rem)]">
            {/* Keep sidebar placeholder consistent */}
            <div className="w-64 border-r bg-muted/40 p-4">
              {/* Placeholder content or skeleton */}
            </div>
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
            <div className="w-64 border-r bg-muted/40 p-4">
              {/* Placeholder content or skeleton */}
            </div>
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
    // *** MODIFIED PART ***
    // If quiz view is selected (activeModule is 0), always render CourseQuiz.
    // CourseQuiz will internally decide whether to show the questions or the results/report.
    if (activeModule === 0) {
      return <CourseQuiz courseId={courseId} onComplete={handleQuizCompleteOrLoaded} />;
    }
    // *** END MODIFIED PART ***

    // If module is selected but content type is not
    if (activeModule > 0 && !contentSelected) {
      const selectedModule = course.modules.find(m => m.id === activeModule);
      return (
          <div className="space-y-4 flex flex-col items-center justify-center min-h-[50vh]">
            <h1 className="text-2xl font-bold">Module: {selectedModule?.title ?? 'Unknown Module'}</h1>
            <p className="text-center max-w-md">
              Please select a content type (Reading, Video, or Lab) from the sidebar to view the content.
            </p>
          </div>
      )
    }

    // If module and content type are selected
    if (activeModule > 0 && contentSelected) {
      const selectedModule = course.modules.find(m => m.id === activeModule);
      if (!selectedModule) {
        return <p>Module not found.</p>; // Handle case where module ID is invalid
      }

      // Check if quiz needs to be completed to access content
      return isQuizMarkedComplete ? (
          renderModuleContent(selectedModule)
      ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Module Content Locked</h1>
            <p>Please complete the course quiz to unlock module content.</p>
            <Button onClick={() => handleModuleSelect(0)}>Take Quiz</Button> {/* Navigate to quiz */}
          </div>
      )
    }

    // Default view (e.g., when course loads but nothing is selected)
    return (
        <div className="space-y-4 flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold">Welcome to {course.title}</h1>
          <p className="text-center max-w-md">Please select the Quiz or a Module from the sidebar to begin.</p>
        </div>
    )
  }

  return (
      <ProtectedRoute>
        <div className="flex h-[calc(100vh-3.5rem)]">
          <CourseSidebar
              courseId={courseId}
              modules={course.modules} // Pass modules data
              activeModule={activeModule}
              activeContentType={activeContentType}
              // Use the state managed by handleQuizCompleteOrLoaded for sidebar locking
              quizCompleted={isQuizMarkedComplete}
              onModuleSelect={handleModuleSelect}
              onContentSelect={handleContentSelect}
          />

          <div className="flex-1 p-6 overflow-y-auto">{renderMainContent()}</div>
        </div>
      </ProtectedRoute>
  )
}