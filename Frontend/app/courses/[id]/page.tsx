"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Code, Loader2 } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { CourseQuiz, type QuizResults } from "./course-quiz"
import { CourseSidebar } from "@/components/course-sidebar" // Assuming sidebar path is correct
import { Alert, AlertDescription } from "@/components/ui/alert"

// --- Interfaces remain the same ---
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
  // We might still fetch an initial quizCompleted status, but evaluation drives the dynamic state
  quizCompletedInitially: boolean // Renamed to avoid confusion
}

export default function CoursePage() {
  const params = useParams()
  const courseId = params.id as string
  const [activeModule, setActiveModule] = useState(0)
  const [activeContentType, setActiveContentType] = useState<string>("")
  const [activeContentIndex, setActiveContentIndex] = useState(0)
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contentSelected, setContentSelected] = useState(false)
  // State to hold the quiz evaluation results. Its presence indicates completion.
  const [quizEvaluation, setQuizEvaluation] = useState<Record<string, string> | null>(null);
  // Flag to track if initial check for results is done (prevents flicker)
  const [initialQuizCheckDone, setInitialQuizCheckDone] = useState(false);

  // Determine quiz completion status based on evaluation data OR initial fetch
  const isQuizConsideredComplete = !!quizEvaluation || (initialQuizCheckDone && course?.quizCompletedInitially && !quizEvaluation);


  // Fetch course data and potentially initial quiz results
  useEffect(() => {
    const fetchCourseAndInitialQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setQuizEvaluation(null); // Reset evaluation on course change
        setInitialQuizCheckDone(false);

        // Fetch course details
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course data");
        }
        const courseData = await courseResponse.json();
        // Adapt course data structure if needed
        const adaptedCourseData: Course = {
          ...courseData,
          quizCompletedInitially: courseData.quizCompleted || false // Store initial status
        };
        setCourse(adaptedCourseData);


        // Fetch initial quiz results for the user (replace with your actual user ID logic)
        const userId = "6603e0f6b2b4e9db2f234567"; // Example User ID
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const resultsResponse = await fetch(`${backendUrl}/quiz/results/${userId}`);

        if (resultsResponse.ok) {
          const resultsData = await resultsResponse.json();
          if (resultsData.hasResult && resultsData.evaluation) {
            console.log("Initial quiz results found, setting evaluation.");
            setQuizEvaluation(resultsData.evaluation);
          } else {
            console.log("No initial quiz results found for this user.");
            setQuizEvaluation(null); // Ensure it's null if no results
          }
        } else if (resultsResponse.status === 404) {
          console.log("No initial quiz results found (404).");
          setQuizEvaluation(null); // Ensure it's null if no results endpoint hit 404
        } else {
          // Handle other errors fetching results, maybe log them
          console.error(`Error fetching initial quiz results: ${resultsResponse.status}`);
          // Decide if this should block loading or just proceed without evaluation
          // setQuizEvaluation(null); // Keep it null on error
        }

      } catch (err: any) {
        setError(`Error loading course: ${err.message}`);
        console.error(err);
        setCourse(null);
        setQuizEvaluation(null);
      } finally {
        setIsLoading(false);
        setInitialQuizCheckDone(true); // Mark initial check as complete
      }
    };

    if (courseId) {
      fetchCourseAndInitialQuiz();
    }
  }, [courseId]); // Rerun only when courseId changes


  // This function is called by CourseQuiz when it loads results OR finishes submission
  // It now primarily updates the evaluation state.
  const handleQuizCompleteOrLoaded = (results: QuizResults | null) => {
    console.log("handleQuizCompleteOrLoaded called with results:", results);
    if (results && results.evaluation) {
      setQuizEvaluation(results.evaluation);
      // Optional: Persist if necessary (CourseQuiz might handle this already)
      // Consider if you need to update the course object's status in the DB here
      // await fetch("/api/user/progress", { ... });
    } else {
      // If CourseQuiz calls this with null (e.g., on load with no results)
      // We don't necessarily want to clear evaluation if it was set during initial fetch
      // Only clear if results explicitly come back as null *after* an attempt might have been made?
      // For simplicity, let's assume CourseQuiz only calls with results object or not at all on load without results.
      // If it *does* call with null after submission failure, we might need different logic.
    }
  };


  const handleModuleSelect = (moduleId: number) => {
    setActiveModule(moduleId)
    if (moduleId === 0) {
      setContentSelected(true) // Let CourseQuiz handle display
      setActiveContentType("")
    } else {
      setContentSelected(false) // Require content type selection for modules
      setActiveContentType("")
    }
  }

  const handleContentSelect = (moduleId: number, contentType: string, contentIndex = 0) => {
    setActiveModule(moduleId)
    setActiveContentType(contentType)
    setActiveContentIndex(contentIndex)
    setContentSelected(true)
  }

  // --- Render Module Content function remains the same ---
  const renderModuleContent = (module: Module) => {
    // ... (keep existing renderModuleContent logic from previous steps) ...
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
                        <p>{module.content?.readings?.[0]}</p>
                        <h3>Details</h3>
                        <p>{module.content?.readings?.[1]}</p>
                        <h3>Mitigation</h3>
                        <p>{module.content?.readings?.[2]}</p>
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
      const labUrl = module.subContent?.find((c) => c.type === "lab")?.url || "https://ctf.hacker101.com/lab" // Example fallback

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
                    {module.content?.exercises?.map((exercise, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-muted-foreground" />
                          <span>{exercise}</span>
                        </li>
                    )) ?? <li>No exercises listed.</li>}
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
  if (isLoading && !initialQuizCheckDone) { // Show loading until initial check is done
    return (
        <ProtectedRoute>
          <div className="flex h-[calc(100vh-3.5rem)]">
            <div className="w-72 border-r bg-muted/40 p-4"> {/* Placeholder */} </div>
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
            <div className="w-72 border-r bg-muted/40 p-4"> {/* Placeholder */} </div>
            <div className="flex-1 p-6">
              <Alert variant="destructive">
                <AlertDescription>{error || "Course could not be loaded."}</AlertDescription>
              </Alert>
            </div>
          </div>
        </ProtectedRoute>
    )
  }

  // --- Render Main Content ---
  const renderMainContent = () => {
    // 1. Quiz View Selected
    if (activeModule === 0) {
      // Always render CourseQuiz, it handles showing results or questions internally
      // Pass the callback function
      return <CourseQuiz courseId={courseId} onComplete={handleQuizCompleteOrLoaded} />;
    }

    // 2. Module Selected, Content Type NOT Selected
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

    // 3. Module AND Content Type Selected
    if (activeModule > 0 && contentSelected) {
      const selectedModule = course.modules.find(m => m.id === activeModule);
      if (!selectedModule) {
        return <p>Module not found.</p>;
      }

      // ** Check completion status based on quizEvaluation **
      return isQuizConsideredComplete ? (
          renderModuleContent(selectedModule) // Render actual content
      ) : (
          // Render locked state
          <div className="space-y-4 flex flex-col items-center justify-center min-h-[50vh]">
            <Lock className="h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-center">Module Content Locked</h1>
            <p className="text-center max-w-md text-muted-foreground">
              Please complete the course quiz first to unlock this module's content.
            </p>
            <Button onClick={() => handleModuleSelect(0)} className="mt-4">Take Quiz</Button>
          </div>
      )
    }

    // 4. Default View (nothing selected yet)
    return (
        <div className="space-y-4 flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold">Welcome to {course.title}</h1>
          <p className="text-center max-w-md text-muted-foreground">
            Select the Course Quiz or a Module from the sidebar to begin.
          </p>
          <Button onClick={() => handleModuleSelect(0)} className="mt-4">Start Quiz</Button>
        </div>
    )
  }

  return (
      <ProtectedRoute>
        <div className="flex h-[calc(100vh-3.5rem)]">
          {/* Pass the derived completion status and evaluation results */}
          <CourseSidebar
              courseId={courseId}
              // modules={course.modules} // Sidebar fetches its own modules now
              activeModule={activeModule}
              activeContentType={activeContentType}
              // Use the derived state for sidebar locking/unlocking
              quizCompleted={isQuizConsideredComplete}
              quizEvaluation={quizEvaluation} // Pass evaluation for sorting
              onModuleSelect={handleModuleSelect}
              onContentSelect={handleContentSelect}
          />

          <div className="flex-1 p-6 overflow-y-auto">
            {/* Render loading state for main content area if course is still loading */}
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                renderMainContent()
            )}
          </div>
        </div>
      </ProtectedRoute>
  )
}