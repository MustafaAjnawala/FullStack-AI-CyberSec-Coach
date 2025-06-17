import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch questions from MongoDB via your backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/quiz/questions`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.statusText}`);
    }
    
    const questions = await response.json();
    
    // Ensure the response is in the expected format
    if (!Array.isArray(questions)) {
      throw new Error("Invalid data format received from the API");
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json({ error: "Failed to load quiz questions" }, { status: 500 });
  }
}
