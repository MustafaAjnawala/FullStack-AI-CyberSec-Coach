"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Shield, BookOpen, CheckCircle, Lock, ChevronDown, ChevronRight, FileText, Video, Code } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModuleContent {
  type: "reading" | "video" | "lab"
  title: string
  url?: string
}

interface Module {
  id: number
  title: string
  completed: boolean
  content?: {
    readings: string[]
    videoUrl: string
    exercises: string[]
  }
  subContent?: ModuleContent[]
}

interface CourseSidebarProps {
  courseId: string | number
  activeModule: number
  activeContentType: string
  quizCompleted: boolean
  onModuleSelect: (moduleId: number) => void
  onContentSelect: (moduleId: number, contentType: string, contentIndex: number) => void
}

export function CourseSidebar({
  courseId,
  activeModule,
  activeContentType,
  quizCompleted,
  onModuleSelect,
  onContentSelect,
}: CourseSidebarProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/courses/${courseId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch course data")
        }
        const data = await response.json()

        // Initialize expanded state for all modules
        const initialExpandedState: Record<number, boolean> = {}
        data.modules.forEach((module: Module) => {
          initialExpandedState[module.id] = false
        })

        setExpandedModules(initialExpandedState)
        setModules(data.modules)
      } catch (err) {
        setError("Error loading course data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  // Set the active module to expanded when it changes
  useEffect(() => {
    if (activeModule > 0) {
      setExpandedModules((prev) => ({
        ...prev,
        [activeModule]: true,
      }))
    }
  }, [activeModule])

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const handleModuleClick = (moduleId: number) => {
    toggleModule(moduleId)
    if (quizCompleted) {
      onModuleSelect(moduleId)
    }
  }

  const handleContentTypeClick = (moduleId: number, contentType: string, contentIndex = 0) => {
    onContentSelect(moduleId, contentType, contentIndex)
  }

  return (
    <div className="w-fit max-w-72 border-r h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          OWASP Top 10 Course
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="mb-4">
            <Button
              variant={!activeModule ? "default" : "outline"}
              className="min-w-full max-w-64 justify-start"
              onClick={() => onModuleSelect(0)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Course Quiz
              {quizCompleted && <CheckCircle className="h-4 w-4 ml-2 text-green-500" />}
            </Button>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Modules</h3>
            <Separator />

            {isLoading ? (
              <div className="py-2 text-sm text-muted-foreground">Loading modules...</div>
            ) : error ? (
              <div className="py-2 text-sm text-red-500">{error}</div>
            ) : (
              <div className="space-y-1 pt-2">
                {modules.map((module) => (
                  <div key={module.id} className="space-y-1">
                    <Button
                        variant={activeModule === module.id ? "secondary" : "ghost"}
                        className={cn(
                            "min-w-full max-w-64 justify-between",
                            !quizCompleted && "cursor-not-allowed opacity-50",
                        )}
                        disabled={!quizCompleted}
                        onClick={() => handleModuleClick(module.id)}
                    >
                      <span className="flex items-center">
                        {module.completed ? (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500"/>
                        ) : !quizCompleted ? (
                            <Lock className="h-4 w-4 mr-2"/>
                        ) : (
                            <BookOpen className="h-4 w-4 mr-2"/>
                        )}
                        <span className="truncate max-w-44">{module.title}</span>
  </span>
                      {expandedModules[module.id] ? (
                          <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0"/>
                      ) : (
                          <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0"/>
                      )}
                    </Button>

                    {expandedModules[module.id] && quizCompleted && (
                        <div className="pl-6 pr-2 py-1 space-y-1">
                        <Button
                          variant={
                            activeModule === module.id && activeContentType === "reading" ? "secondary" : "ghost"
                          }
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => handleContentTypeClick(module.id, "reading", 0)}
                        >
                          <FileText className="h-3.5 w-3.5 mr-2" />
                          Reading Materials
                        </Button>
                        <Button
                          variant={activeModule === module.id && activeContentType === "video" ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => handleContentTypeClick(module.id, "video", 0)}
                        >
                          <Video className="h-3.5 w-3.5 mr-2" />
                          Video Lessons
                        </Button>
                        <Button
                          variant={activeModule === module.id && activeContentType === "lab" ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => handleContentTypeClick(module.id, "lab", 0)}
                        >
                          <Code className="h-3.5 w-3.5 mr-2" />
                          Practical Lab
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

