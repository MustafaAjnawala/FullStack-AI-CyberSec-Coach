// Helper functions for quiz management

/**
 * Formats quiz results for download
 */
export function formatQuizResults(courseId: string | number, answers: any[]) {
  return {
    courseId,
    answers,
    submittedAt: new Date().toISOString(),
  }
}

/**
 * Downloads quiz results as JSON file
 */
export function downloadQuizResults(results: any) {
  const dataStr = JSON.stringify(results, null, 2)
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
  const exportFileDefaultName = `cybersecurity-quiz-results.json`

  const linkElement = document.createElement("a")
  linkElement.setAttribute("href", dataUri)
  linkElement.setAttribute("download", exportFileDefaultName)
  linkElement.click()
}

/**
 * Calculates course progress based on completed modules and quiz
 */
export function calculateCourseProgress(modules: any[], quizCompleted: boolean) {
  const totalModules = modules.length
  const completedModules = modules.filter((m: any) => m.completed).length
  const quizCompletedValue = quizCompleted ? 1 : 0

  return totalModules > 0 ? ((completedModules + quizCompletedValue) / (totalModules + 1)) * 100 : 0
}

