"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Shield, BookOpen, CheckCircle, Lock, ChevronDown, ChevronRight, FileText, Video, Code, Loader2 } from "lucide-react" // Keep Loader2 for loading state
import { cn } from "@/lib/utils"

// --- Interfaces updated for new API structure ---
interface ModuleContent {
  type: "reading" | "video" | "lab"
  title: string
  url?: string
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
  id: number;
  courseId: number;
  title: string;
  overview: string;
  completed: boolean;
  levels: Level[];
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
  activeSubtopic?: string | null; // Track selected subtopic
  quizCompleted: boolean // Whether quiz has results
  quizEvaluation: Record<string, string> | null // Evaluation data for sorting
  onModuleSelect: (moduleId: number) => void
  onContentSelect: (moduleId: number, contentType: string, contentIndex: number, subtopic?: string, topic?: string) => void
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
                                activeSubtopic,
                                quizCompleted, // Indicates if quiz results exist
                                quizEvaluation, // The actual evaluation map
                                onModuleSelect,
                                onContentSelect,
                              }: CourseSidebarProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({})
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({}) // Track expanded topics

  // --- Fetching logic updated for new API structure ---
  useEffect(() => {
    const fetchCourseData = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/course/${courseId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch course data")
        }
        const data = await response.json()

        // Transform the API response to match our Module interface
        const fetchedModules: Module[] = data.map((item: any) => ({
          _id: item._id,
          id: item.id,
          courseId: item.courseId,
          title: item.title,
          overview: item.overview,
          completed: false,
          levels: item.levels || []
        }));

        const initialExpandedState: Record<number, boolean> = {}
        const initialTopicExpandedState: Record<string, boolean> = {};

        fetchedModules.forEach((module: Module) => {
          initialExpandedState[module.id] = false
          if (module.levels) {
            module.levels.forEach(level => {
              level.topics.forEach(topic => {
                initialTopicExpandedState[`${module.id}-${topic.title}`] = false;
              });
            });
          }
        })

        setExpandedModules(initialExpandedState)
        setExpandedTopics(initialTopicExpandedState);
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

  const toggleTopic = (moduleId: number, topicTitle: string) => {
    const key = `${moduleId}-${topicTitle}`;
    setExpandedTopics(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleModuleClick = (moduleId: number) => {
    onModuleSelect(moduleId);
    // Toggle expansion regardless of lock state for consistency with original behavior
    toggleModule(moduleId);
  }

  const handleContentTypeClick = (moduleId: number, contentType: string, contentIndex = 0, subtopic?: string, topic?: string) => {
    onContentSelect(moduleId, contentType, contentIndex, subtopic, topic)
  }

  // --- RENDER SECTION ---
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
                                    "min-w-full max-w-64 justify-between items-center", // Added items-center for proper vertical alignment
                                    // Original opacity style for locked state, but allow click
                                    isLocked && "opacity-70",
                                )}
                                onClick={() => handleModuleClick(module.id)} // Click handler remains
                                title={module.title} // Add tooltip for full module title
                                // Remove the explicit 'disabled' attribute unless absolutely necessary
                            >
                              <span className="flex items-center min-w-0 flex-1">
                                {isLocked ? (
                                    <Lock className="h-4 w-4 mr-2 flex-shrink-0" />
                                ) : module.completed ? ( // Use module.completed if it exists
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                                ) : (
                                    <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" /> // Default icon
                                )}
                                <span className="truncate">{module.title}</span>
                              </span>
                              <div className="flex items-center justify-center w-3 h-6 flex-shrink-0">
                                {expandedModules[module.id] ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                              </div>
                            </Button>

                            {/* Show content when expanded AND quiz is completed */}
                            {expandedModules[module.id] && quizCompleted && (
                                <div className="pl-6 pr-2 py-1 space-y-1">
                                  {module.levels && module.levels.length > 0 ? (
                                    // Render topics as buttons instead of nested structure
                                    module.levels.map((level, levelIndex) => (
                                      <div key={`${module.id}-${level.level}-${levelIndex}`}>
                                        {level.topics.map((topic, topicIndex) => (
                                          <Button
                                            key={`${module.id}-${topic.title}-${topicIndex}`}
                                            variant={
                                              isActiveModule &&
                                              activeContentType === "reading" &&
                                              activeSubtopic === topic.title
                                                ? "secondary"
                                                : "ghost"
                                            }
                                            size="sm"
                                            className="w-full max-w-48 justify-start text-xs mb-1 h-8"
                                            onClick={() => handleContentTypeClick(module.id, "reading", 0, undefined, topic.title)}
                                            title={topic.title} // Add tooltip for full title
                                          >
                                            <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                                            <span className="truncate text-left">{topic.title}</span>
                                          </Button>
                                        ))}
                                      </div>
                                    ))
                                  ) : (
                                    // Fallback to original content type buttons if no levels
                                    <>
                                      <Button
                                          variant={
                                            isActiveModule && activeContentType === "reading" ? "secondary" : "ghost"
                                          }
                                          size="sm"
                                          className="w-full max-w-48 justify-start text-xs h-8"
                                          onClick={() => handleContentTypeClick(module.id, "reading", 0)}
                                      >
                                        <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                                        <span className="truncate">Reading Materials</span>
                                      </Button>
                                      <Button
                                          variant={isActiveModule && activeContentType === "video" ? "secondary" : "ghost"}
                                          size="sm"
                                          className="w-full max-w-48 justify-start text-xs h-8"
                                          onClick={() => handleContentTypeClick(module.id, "video", 0)}
                                      >
                                        <Video className="h-3 w-3 mr-2 flex-shrink-0" />
                                        <span className="truncate">Video Lessons</span>
                                      </Button>
                                      <Button
                                          variant={isActiveModule && activeContentType === "lab" ? "secondary" : "ghost"}
                                          size="sm"
                                          className="w-full max-w-48 justify-start text-xs h-8"
                                          onClick={() => handleContentTypeClick(module.id, "lab", 0)}
                                      >
                                        <Code className="h-3 w-3 mr-2 flex-shrink-0" />
                                        <span className="truncate">Practical Lab</span>
                                      </Button>
                                    </>
                                  )}
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
