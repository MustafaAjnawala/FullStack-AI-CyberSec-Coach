import { NextResponse } from "next/server"

export async function GET() {
  // Simulating a database fetch with a delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const userProgress = {
    completedCourses: 0,
    inProgressCourses: 1,
    totalQuizzesTaken: 0,
    averageScore: 0,
    lastActivity: new Date().toISOString(),
    courses: [
      {
        id: 1,
        title: "Cybersecurity Fundamentals",
        progress: 0,
        moduleProgress: [
          { id: 1, completed: false },
          { id: 2, completed: false },
          { id: 3, completed: false },
          { id: 4, completed: false },
        ],
        quizCompleted: false,
        quizScore: null,
      },
    ],
  }

  return NextResponse.json(userProgress)
}

export async function PATCH(request: Request) {
  const data = await request.json()

  // In a real app, this would update the database
  // For now, just return success with the updated data

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    message: "User progress updated successfully",
    data,
  })
}

