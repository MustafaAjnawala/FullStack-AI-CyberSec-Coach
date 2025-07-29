"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Code, Loader2, Lock } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { CourseQuiz, type QuizResults } from "./course-quiz"
import { CourseSidebar } from "@/components/course-sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

// --- Interfaces updated for new API structure ---
interface ModuleContent {
  type: "reading" | "video" | "lab"
  title: string
  url?: string
  content?: string
}

interface ContentItem {
  heading: string;
  content: string;
}

interface Subtopic {
  title: string;
  content: ContentItem[];
}

interface Topic {
  title: string;
  subtopics: Subtopic[];
}

interface Level {
  level: string;
  topics: Topic[];
}

interface Module {
  _id: string;
  id: number
  courseId: number
  title: string
  overview: string
  completed: boolean
  levels: Level[]
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
  quizCompletedInitially: boolean
}

export default function CoursePage() {
  const { user } = useAuth()
  const params = useParams()
  const courseId = params.id as string
  const [activeModule, setActiveModule] = useState(0)
  const [activeContentType, setActiveContentType] = useState<string>("")
  const [activeContentIndex, setActiveContentIndex] = useState(0)
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null)
  const [activeTopic, setActiveTopic] = useState<string | null>(null) // Track selected topic
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contentSelected, setContentSelected] = useState(false)
  const [quizEvaluation, setQuizEvaluation] = useState<Record<string, string> | null>(null)
  const [initialQuizCheckDone, setInitialQuizCheckDone] = useState(false)

  const isQuizConsideredComplete = !!quizEvaluation || (initialQuizCheckDone && course?.quizCompletedInitially && !quizEvaluation)

  useEffect(() => {
    const fetchCourseAndInitialQuiz = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setQuizEvaluation(null)
        setInitialQuizCheckDone(false)

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
        const courseResponse = await fetch(`${backendUrl}/api/course/${courseId}`)
        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course data")
        }
        const courseData = await courseResponse.json()

        const adaptedCourseData: Course = {
          id: parseInt(courseId),
          title: courseData[0]?.title || "Course Title",
          description: courseData[0]?.overview || "Course Description",
          instructor: "Instructor Name",
          modules: courseData.map((item: any) => ({
            _id: item._id,
            id: item.id,
            courseId: item.courseId,
            title: item.title,
            overview: item.overview,
            completed: false,
            content: {
              videoUrl: "",
              readings: [],
              exercises: []
            },
            levels: item.levels || []
          })),
          quizCompletedInitially: false
        }
        setCourse(adaptedCourseData)

        const userId = user?._id
        if (userId) {
          const resultsResponse = await fetch(`${backendUrl}/quiz/results/${userId}`)

          if (resultsResponse.ok) {
            const resultsData = await resultsResponse.json()
            if (resultsData.hasResult && resultsData.evaluation) {
              setQuizEvaluation(resultsData.evaluation)
            } else {
              setQuizEvaluation(null)
            }
          } else if (resultsResponse.status === 404) {
            setQuizEvaluation(null)
          } else {
            console.error(`Error fetching initial quiz results: ${resultsResponse.status}`)
          }
        }

      } catch (err: any) {
        setError(`Error loading course: ${err.message}`)
        console.error(err)
        setCourse(null)
        setQuizEvaluation(null)
      } finally {
        setIsLoading(false)
        setInitialQuizCheckDone(true)
      }
    }

    if (courseId) {
      fetchCourseAndInitialQuiz()
    }
  }, [courseId])

  const handleQuizCompleteOrLoaded = (results: QuizResults | null) => {
    console.log("handleQuizCompleteOrLoaded called with results:", results)
    if (results && results.evaluation) {
      setQuizEvaluation(results.evaluation)
    }
  }

  const handleModuleSelect = (moduleId: number) => {
    // Only set activeModule for quiz (moduleId === 0)
    if (moduleId === 0) {
      setActiveModule(moduleId)
      setContentSelected(true)
      setActiveContentType("")
      setActiveTopic(null)
      setActiveSubtopic(null)
    } else {
      // For regular modules, only set activeModule for sidebar highlighting
      // but don't change content state
      setActiveModule(moduleId)
      // Don't change contentSelected, activeContentType, activeTopic, or activeSubtopic
      // This allows the module to expand/collapse without affecting content display
    }
  }

  const handleContentSelect = (moduleId: number, contentType: string, contentIndex = 0, subtopic?: string, topic?: string) => {
    setActiveModule(moduleId)
    setActiveContentType(contentType)
    setActiveContentIndex(contentIndex)
    setActiveSubtopic(subtopic || null)
    setActiveTopic(topic || null) // Set the selected topic
    setContentSelected(true)
  }

  const getCurrentTopicSubtopics = (): Subtopic[] => {
    if (!activeTopic || !course) return []
    
    const activeModuleData = course.modules.find(m => m.id === activeModule)
    if (!activeModuleData?.levels) return []

    for (const level of activeModuleData.levels) {
      for (const topic of level.topics) {
        if (topic.title === activeTopic) {
          return topic.subtopics
        }
      }
    }
    return []
  }

  const renderModuleContent = (module: Module) => {
    if (activeContentType === "reading") {
      const currentSubtopics = getCurrentTopicSubtopics()
      
      if (activeTopic && currentSubtopics.length > 0) {
        const selectedSubtopicTitle = activeSubtopic || currentSubtopics[0]?.title
        const selectedSubtopic = currentSubtopics.find(sub => sub.title === selectedSubtopicTitle)

        return (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h1 className="text-2xl font-bold">{activeTopic}</h1>
              <p className="text-muted-foreground">From module: {module.title}</p>
            </div>

            <div className="border-b">
              <nav className="flex space-x-8 overflow-x-auto">
                {currentSubtopics.map((subtopic) => (
                  <button
                    key={subtopic.title}
                    onClick={() => setActiveSubtopic(subtopic.title)}
                    className={cn(
                      "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                      selectedSubtopicTitle === subtopic.title
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                    )}
                  >
                    {subtopic.title}
                  </button>
                ))}
              </nav>
            </div>

            {selectedSubtopic && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedSubtopic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    {selectedSubtopic.content && selectedSubtopic.content.length > 0 ? (
                      selectedSubtopic.content.map((contentItem: ContentItem, index: number) => (
                        <div key={index} className="mb-6">
                          <h3 className="text-xl font-semibold mb-3 text-primary">{contentItem.heading}</h3>
                          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {contentItem.content.split('\n').map((paragraph, pIndex) => (
                              paragraph.trim() && <p key={pIndex} className="mb-3">{paragraph.trim()}</p>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No content available for this subtopic.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )
      }

      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>Module Overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {module.overview ? (
                  <div>
                    <h2>Overview</h2>
                    <p>{module.overview}</p>
                    {module.levels && module.levels.length > 0 && (
                      <div className="mt-6">
                        <h3>Available Topics:</h3>
                        <ul className="list-disc pl-6">
                          {module.levels.map((level, levelIndex) =>
                            level.topics.map((topic, topicIndex) => (
                              <li key={`${levelIndex}-${topicIndex}`} className="mb-2">
                                <strong>{topic.title}</strong> - {topic.subtopics.length} subtopic{topic.subtopics.length !== 1 ? 's' : ''}
                              </li>
                            ))
                          )}
                        </ul>
                        <p className="text-sm text-muted-foreground mt-4">
                          Select a topic from the sidebar to view its content.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h2>Overview</h2>
                    <p>No overview available for this module.</p>
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

  const renderMainContent = () => {
    if (activeModule === 0) {
      return <CourseQuiz courseId={courseId} onComplete={handleQuizCompleteOrLoaded} />
    }

    if (activeModule > 0 && !contentSelected) {
      const selectedModule = course.modules.find(m => m.id === activeModule)
      return (
        <div className="space-y-4 flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold">Module: {selectedModule?.title ?? 'Unknown Module'}</h1>
          <p className="text-center max-w-md">
            Please select a content type (Reading, Video, or Lab) from the sidebar to view the content.
          </p>
        </div>
      )
    }

    if (activeModule > 0 && contentSelected) {
      const selectedModule = course.modules.find(m => m.id === activeModule)
      if (!selectedModule) {
        return <p>Module not found.</p>
      }

      return isQuizConsideredComplete ? (
        renderModuleContent(selectedModule)
      ) : (
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
          <CourseSidebar
              courseId={courseId}
              activeModule={activeModule}
              activeContentType={activeContentType}
              activeSubtopic={activeTopic}
              quizCompleted={isQuizConsideredComplete}
              quizEvaluation={quizEvaluation}
              onModuleSelect={handleModuleSelect}
              onContentSelect={handleContentSelect}
          />

          <div className="flex-1 p-6 overflow-y-auto">
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
