"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Shield, CheckCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Question {
  id: number
  questionId: string // Ensure this exists if used in completeQuiz
  question: string
  options: string[]
  correctAnswer: number
}

interface QuizResults {
  score: number
  evaluation: Record<string, string>
  recommendedCourses: string[]
}

export function CourseQuiz({
                             courseId,
                             // Allow null for the case where it loads without results
                             onComplete,
                           }: {
  courseId: string | number
  onComplete: (results: QuizResults | null) => void // Modified to accept null
}) {
  const { user } = useAuth()
  const userId = user?._id // Get userId from authenticated user
  // const courseId = "6603e0f6b2b4f9db2f234567"
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [quizCompletedInternally, setQuizCompletedInternally] = useState(false) // Internal state for after submission animation
  const [hasPreviousResult, setHasPreviousResult] = useState<boolean | null>(null)
  const [evaluation, setEvaluation] = useState<Record<string, string> | null>(null); // Allow null initially
  const [recommendedCourses, setRecommendedCourses] = useState<string[]>([])
  const [score, setScore] = useState<number | null>(null)
  const [submittedDate, setSubmittedDate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  // Effect to check for prior quiz result
  useEffect(() => {
    const checkPreviousResult = async () => {
      if (!userId) {
        setIsLoading(false)
        setError("User not authenticated")
        return
      }
      
      setIsLoading(true); // Start loading before fetch
      setError(null); // Reset error
      try {
        // Use environment variable for backend URL
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${backendUrl}/quiz/results/${userId}`); 

        if (!response.ok) {
          if (response.status === 404) {
            console.log("No previous quiz results found for user.");
            setHasPreviousResult(false);
            // Fetch questions if no results
            fetchQuestions();
            onComplete(null); // Notify parent no results found on load
            return; // Exit early
          }
          // Handle other errors (like 500)
          throw new Error(`Failed to check previous results. Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.hasResult) {
          setHasPreviousResult(true);
          setEvaluation(data.evaluation || {}); // Ensure evaluation is an object
          setRecommendedCourses(data.recommendedCourses || []);
          setScore(data.score ?? null); // Handle potential null score
          setSubmittedDate(data.createdAt || null);

          // *** IMPORTANT FIX: Call onComplete when previous results are loaded ***
          onComplete({
            score: data.score ?? 0, // Provide default if null
            evaluation: data.evaluation || {},
            recommendedCourses: data.recommendedCourses || [],
          });
          // No need to fetch questions if results exist
          setIsLoading(false); // Stop loading here if results found

        } else {
          setHasPreviousResult(false);
          // Fetch questions if no results
          fetchQuestions();
          onComplete(null); // Notify parent no results found on load
        }
      } catch (err: any) {
        console.error("Error checking previous result:", err);
        setError(`Could not verify previous quiz attempt: ${err.message}. Please try refreshing.`);
        setHasPreviousResult(null); // Indicate error state
        setIsLoading(false); // Stop loading on error
      }
      // Removed finally setIsLoading(false) as it's handled within try/catch branches
    };

    checkPreviousResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Depend only on userId, onComplete, courseId (if needed by fetchQuestions)


  // Fetch quiz questions (only called if hasPreviousResult is false)
  const fetchQuestions = async () => {
    // No need to set isLoading true here, it's handled by the checkPreviousResult effect
    setError(null); // Reset error before fetching
    try {
      // Ensure API route exists and works
      const response = await fetch("/api/quiz") // Ensure this route is correct
      if (!response.ok) {
        throw new Error("Failed to fetch quiz questions")
      }
      const data = await response.json()
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No questions received from API");
      }
      setQuestions(data)
    } catch (err: any) {
      setError(`Error loading quiz questions: ${err.message}. Please try again later.`)
      console.error(err)
    } finally {
      // Stop loading *after* fetching questions or if an error occurred
      setIsLoading(false);
    }
  }

  const handleAnswerSelect = (answer: string) => {
  const questionId = questions[currentQuestionIndex]?.questionId;
  if (!questionId) return;
  setSelectedAnswers({
    ...selectedAnswers,
    [questionId]: Number.parseInt(answer),
  });
};

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      completeQuiz() // Call submit function on the last question
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const completeQuiz = async () => {
    setError(null); // Reset error
    
    if (!userId) {
      setError("User not authenticated. Please log in to submit the quiz.");
      return;
    }
    
    if (Object.keys(selectedAnswers).length !== questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try{
    const responses = questions.map((question) => ({
      questionId: question.questionId,
      selectedAnswer: selectedAnswers[question.questionId],
      isCorrect: selectedAnswers[question.questionId] === question.correctAnswer,
    }));

      // const backendUrl = `http://localhost:5000`;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${backendUrl}/evaluate`, { // Use dynamic URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          courseId: "6603e0f6b2b4e9db2f234567", // Ensure courseId is string if needed by backend
          responses,
        }),
      })

      if (!response.ok) {
        const errorData = await response.text(); // Get more error details
        console.error("Submission error response:", errorData);
        throw new Error(`Failed to submit quiz results. Status: ${response.status}`);
      }

      const result = await response.json() // Assuming backend returns results on successful submission

      // Update state based on the submission response
      setQuizCompletedInternally(true); // Show the "Completed" message briefly
      setHasPreviousResult(true); // Mark as having results now
      setScore(result.score ?? null);
      setEvaluation(result.evaluation || {});
      setRecommendedCourses(result.recommendedCourses || []);
      setSubmittedDate(new Date().toISOString()); // Set submission date to now

      // Notify parent component about quiz completion with results
      onComplete({
        score: result.score ?? 0,
        evaluation: result.evaluation || {},
        recommendedCourses: result.recommendedCourses || [],
      });


    } catch (err: any) {
      setError(`Error submitting quiz results: ${err.message}. Please try again.`)
      console.error(err)
      // Don't set quizCompletedInternally on error
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Render Logic ---

  // 1. Loading State (while checking for results or fetching questions)
  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Card className="w-full max-w-2xl">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              {/* Provide more context based on state */}
              <p>{hasPreviousResult === null ? "Checking previous attempts..." : "Loading quiz questions..."}</p>
            </CardContent>
          </Card>
        </div>
    )
  }

  // 2. Error State
  if (error) {
    return (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Card className="w-full max-w-2xl border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive-foreground">{error}</p>
              <Button onClick={hasPreviousResult === false ? fetchQuestions : () => window.location.reload()} className="mt-4">
                {hasPreviousResult === false ? "Retry Loading Questions" : "Refresh Page"}
              </Button>
            </CardContent>
          </Card>
        </div>
    );
  }

  // 3. Display Results/Progress Report (if hasPreviousResult is true)
  // This now correctly shows the report instead of the "Quiz Completed" message after submission
  if (hasPreviousResult === true && evaluation && score !== null) {
    return (
        <div className="flex justify-center items-center min-h-[50vh] py-6">
          <Card className="w-full max-w-3xl">
            <CardHeader>
  {/* Change title slightly */}
  <CardTitle className="text-blue-600 dark:text-blue-400">Quiz Progress Report</CardTitle>
  <CardDescription>
      {/* Use the actual submitted date in Indian time format */}
      Quiz submitted on{" "}
     <span className="font-medium">
       {submittedDate
         ? new Date(submittedDate).toLocaleString("en-IN", {
             timeZone: "Asia/Kolkata", // ← ✅ Added IST timezone
             year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })
          : "N/A"}
     </span>
      </CardDescription>
    </CardHeader>


            <CardContent className="space-y-6">
              {/* Score Display */}
              {score !== null && (
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Overall Score</h3>
                    <p className="text-2xl font-bold text-primary">{score}%</p>
                  </div>
              )}
              {/* Evaluation Table */}
              {evaluation && Object.keys(evaluation).length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Evaluation by Category</h3>
                    <div className="overflow-x-auto rounded-md border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Category</th>
                          <th className="px-4 py-2 text-left font-medium">Proficiency</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(evaluation).map(([category, level], idx) => (
                            <tr key={idx} className="border-t">
                              <td className="px-4 py-2">{category}</td>
                              <td className="px-4 py-2">{level}</td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
              ) : (
                  <p>Detailed evaluation not available.</p>
              )}


              {/* Recommended Courses */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Recommended Topics</h3>
                {recommendedCourses.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {recommendedCourses.map((topic, idx) => (
                          <li key={idx}>{topic}</li>
                      ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">Great job! No specific topic recommendations based on this quiz.</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end">
              {/* Changed button text */}

              {/* Optionally add a button to review answers if that feature exists */}
            </CardFooter>
          </Card>
        </div>
    )
  }

  // 4. If quiz was *just* submitted, show a temporary success message
  // (This state is brief before the results view takes over)
  if (quizCompletedInternally) {
    return (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Quiz Submitted!
              </CardTitle>
              <CardDescription>Your responses have been saved. Loading results...</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
    )
  }

  // 5. No results, no error, not loading -> Show Quiz Questions
  if (questions.length > 0 && !hasPreviousResult) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    // Check if currentQuestion exists before rendering
    if (!currentQuestion) {
      // This might happen briefly if questions are cleared or during state transitions
      return (
          <div className="flex justify-center items-center min-h-[50vh]">
            <p>Loading question...</p>
          </div>
      );
    }

    return (
        <div className="flex justify-center items-center min-h-[50vh] py-6">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Cybersecurity Course Quiz
              </CardTitle>
              <CardDescription>
                Complete this quiz to assess your knowledge and unlock course content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                     <span>
                       Question {currentQuestionIndex + 1} of {questions.length}
                     </span>
                  <span>{progress.toFixed(0)}% complete</span>
                </div>
                <Progress value={progress} className="mb-6" />

                <div className="py-4">
                  <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>

                  <RadioGroup
                      key={currentQuestion.questionId} // FIX: Add key to reset component state on question change
                      // Ensure value is always a string or undefined
                      value={selectedAnswers[currentQuestion.questionId]?.toString()}
                      onValueChange={handleAnswerSelect}
                      className="space-y-3"
                  >
                    {currentQuestion.options.map((option, index) => {
                      const optionValue = index + 1; // Options seem 1-based
                      return (
                          <Label
                              key={index} // Use index as key if options are static per question
                              htmlFor={`option-${currentQuestion.id}-${index}`} // More unique ID
                              className={`flex items-center space-x-3 rounded-md border p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
  selectedAnswers[currentQuestion.questionId] === optionValue
    ? "border-primary bg-primary/5 ring-1 ring-primary"
    : "border-input"
}`}
                          >
                            <RadioGroupItem value={optionValue.toString()} id={`option-${currentQuestion.id}-${index}`} />
                            <span className="flex-grow font-normal"> {/* Moved span inside Label */}
                              {option}
                                </span>
                          </Label>
                      );
                    })}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0 || isSubmitting}>
                Previous
              </Button>
              <Button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion.questionId] === undefined || isSubmitting}
              >
                {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </div>
    );
  }

  // 6. Fallback if none of the above conditions are met (e.g., no questions and no results)
  return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-10 text-center">
            <p>Quiz content is currently unavailable. Please check back later or contact support.</p>
          </CardContent>
        </Card>
      </div>
  );

}

export type { QuizResults }