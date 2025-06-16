// 🔹 app/api/quiz/submit/route.ts
/**
 * @deprecated This API route is deprecated and will be removed in the next major version.
 * Please use the direct backend connection instead.
 */
import { NextResponse } from "next/server";

export async function POST(request: Request) {
   console.warn(
    ' WARNING: /api/quiz/submit route is deprecated. ' +
    'Please update your code to use the direct backend connection. ' +
    'This route will be removed in the next major version.'
  );
  try {
    const body = await request.json();

    console.log("📨 Incoming POST data to /api/quiz/submit:", body); // ✅ Log full body

    const { userId, courseId, responses } = body;

    // ✅ Validate data
    if (!userId || !courseId || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: "Invalid request. Missing userId, courseId, or responses." },
        { status: 400 }
      );
    }

    if (responses.length !== 30) {
      return NextResponse.json(
        { error: "Quiz must have exactly 30 responses." },
        { status: 400 }
      );
    }

    // ✅ Forward to Node.js backend
    const backendRes = await fetch(`http://localhost:${process.env.B_PORT}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, courseId, responses }),
    });

    if (!backendRes.ok) {
      const backendText = await backendRes.text(); // ✅ capture backend error
      console.error("⚠️ Backend error:", backendText);
      throw new Error(`Evaluation failed with status ${backendRes.status}`);
    }

    const { success, message } = await backendRes.json();
    return NextResponse.json({ success, message });

  } catch (error: any) {
    console.error(" Error in submit route:", error.message || error);
    return NextResponse.json(
      { error: "Failed to process quiz results" },
      { status: 500 }
    );
  }
}
