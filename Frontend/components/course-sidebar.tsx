"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Shield, BookOpen, CheckCircle, Lock, ChevronDown, ChevronRight, FileText, Video, Code, Loader2 } from "lucide-react" // Keep Loader2 for loading state
import { cn } from "@/lib/utils"

// --- Interfaces remain the same ---
interface ModuleContent {
  type: "reading" | "video" | "lab"
  title: string
  url?: string
}

interface Module {
  id: number
  title: string // Assuming title matches keys in quizEvaluation
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
  quizCompleted: boolean // Whether quiz has results
  quizEvaluation: Record<string, string> | null // Evaluation data for sorting
  onModuleSelect: (moduleId: number) => void
  onContentSelect: (moduleId: number, contentType: string, contentIndex: number) => void
}

// --- Sorting helpers remain the same ---
const proficiencyOrder: Record<string, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

const getSortOrder = (level: string | undefined): number => {
  if (!level || !(level in proficiencyOrder)) {
    // Default to a high value if not found to place them last, or intermediate
    // Let's default to intermediate as before
    return proficiencyOrder.Intermediate;
  }
  return proficiencyOrder[level];
};


export function CourseSidebar({
                                courseId,
                                activeModule,
                                activeContentType,
                                quizCompleted, // Indicates if quiz results exist
                                quizEvaluation, // The actual evaluation map
                                onModuleSelect,
                                onContentSelect,
                              }: CourseSidebarProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({})

  // --- Fetching logic remains the same ---
  useEffect(() => {
    const fetchCourseData = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const response = await fetch(`/api/courses/${courseId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch course data")
        }
        const data = await response.json()
        const fetchedModules: Module[] = data.modules || [];

        const initialExpandedState: Record<number, boolean> = {}
        fetchedModules.forEach((module: Module) => {
          initialExpandedState[module.id] = false
        })

        setExpandedModules(initialExpandedState)
        setModules(fetchedModules)
      } catch (err: any) {
        setError(`Error loading modules: ${err.message}`)
        console.error(err)
        setModules([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  // --- Active module expansion logic remains the same ---
  useEffect(() => {
    if (activeModule > 0) {
      setExpandedModules((prev) => ({
        ...prev,
        [activeModule]: true,
      }))
    }
  }, [activeModule])


  // --- SORTING LOGIC remains the same ---
  const sortedModules = useMemo(() => {
    if (quizCompleted && quizEvaluation && modules.length > 0) {
      return [...modules].sort((a, b) => {
        const levelA = quizEvaluation[a.title];
        const levelB = quizEvaluation[b.title];
        const orderA = getSortOrder(levelA);
        const orderB = getSortOrder(levelB);

        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.id - b.id;
      });
    }
    return modules;
  }, [modules, quizCompleted, quizEvaluation]);
  // --- END SORTING LOGIC ---


  // --- Event handlers remain the same ---
  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const handleModuleClick = (moduleId: number) => {
    onModuleSelect(moduleId);
    // Toggle expansion regardless of lock state for consistency with original behavior
    toggleModule(moduleId);
  }

  const handleContentTypeClick = (moduleId: number, contentType: string, contentIndex = 0) => {
    onContentSelect(moduleId, contentType, contentIndex)
  }

  // --- RENDER SECTION ---
  // Restore original outer div classes and structure
  return (
      <div className="w-fit max-w-72 border-r h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Restore original header */}
        <div className="p-4 border-b">
          <h2 className="font-semibold flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            OWASP Top 10 Course
          </h2>
        </div>

        <ScrollArea className="flex-1">
          {/* Restore original padding and structure inside ScrollArea */}
          <div className="p-4">
            {/* Restore original Quiz button section */}
            <div className="mb-4">
              <Button
                  // Restore original variant logic: active if activeModule is 0 (quiz)
                  variant={activeModule === 0 ? "secondary" : "ghost"}
                  // Restore original classes
                  className="min-w-full max-w-64 justify-start"
                  onClick={() => onModuleSelect(0)} // Keep logic the same
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Course Quiz
                {quizCompleted && <CheckCircle className="h-4 w-4 ml-2 text-green-500" />}
              </Button>
            </div>

            {/* Restore original Modules section structure */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Modules</h3>
              <Separator /> {/* Keep separator as it was likely intended */}

              {isLoading ? (
                  // Simple loading text as likely was before
                  <div className="py-2 text-sm text-muted-foreground">Loading modules...</div>
              ) : error ? (
                  <div className="py-2 text-sm text-red-500">{error}</div>
              ) : sortedModules.length === 0 ? (
                  // Add an empty state message if none existed before
                  <div className="py-2 text-sm text-muted-foreground">No modules available.</div>
              ) : (
                  // Restore original container div for modules list
                  <div className="space-y-1 pt-2">
                    {/* Use the sortedModules array for rendering */}
                    {sortedModules.map((module) => {
                      // Determine lock state based on quizCompleted prop
                      const isLocked = !quizCompleted;
                      const isActiveModule = activeModule === module.id;

                      return (
                          // Restore original wrapping div per module
                          <div key={module.id} className="space-y-1">
                            {/* Restore original Module Button */}
                            <Button
                                variant={isActiveModule ? "secondary" : "ghost"}
                                className={cn(
                                    "min-w-full max-w-64 justify-between", // Original width/justify classes
                                    // Original opacity style for locked state, but allow click
                                    isLocked && "opacity-70",
                                )}
                                onClick={() => handleModuleClick(module.id)} // Click handler remains
                                // Remove the explicit 'disabled' attribute unless absolutely necessary
                            >
                              {/* Restore original span structure for icon + title */}
                              <span className="flex items-center">
                                {/* Restore original icon logic */}
                                {isLocked ? (
                                    <Lock className="h-4 w-4 mr-2" />
                                ) : module.completed ? ( // Use module.completed if it exists
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                ) : (
                                    <BookOpen className="h-4 w-4 mr-2" /> // Default icon
                                )}
                                <span className="truncate max-w-44">{module.title}</span>
                              </span>
                              {/* Restore original chevron */}
                              {expandedModules[module.id] ? (
                                  <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
                              ) : (
                                  <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
                              )}
                            </Button>

                            {/* Restore original Content Types section */}
                            {/* Show only if expanded AND quiz is completed */}
                            {expandedModules[module.id] && quizCompleted && (
                                // Restore original padding/spacing for content types
                                <div className="pl-6 pr-2 py-1 space-y-1">
                                  {/* Restore original Content Type Buttons */}
                                  <Button
                                      variant={
                                        isActiveModule && activeContentType === "reading" ? "secondary" : "ghost"
                                      }
                                      size="sm" // Original size
                                      className="w-full justify-start text-xs" // Original classes
                                      onClick={() => handleContentTypeClick(module.id, "reading", 0)}
                                  >
                                    <FileText className="h-3.5 w-3.5 mr-2" /> {/* Original icon */}
                                    Reading Materials
                                  </Button>
                                  <Button
                                      variant={isActiveModule && activeContentType === "video" ? "secondary" : "ghost"}
                                      size="sm"
                                      className="w-full justify-start text-xs"
                                      onClick={() => handleContentTypeClick(module.id, "video", 0)}
                                  >
                                    <Video className="h-3.5 w-3.5 mr-2" />
                                    Video Lessons
                                  </Button>
                                  <Button
                                      variant={isActiveModule && activeContentType === "lab" ? "secondary" : "ghost"}
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
                      );
                    })}
                  </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
  )
}