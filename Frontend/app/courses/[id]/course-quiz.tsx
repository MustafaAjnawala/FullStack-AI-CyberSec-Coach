"use client";
import { AlertTitle } from "@/components/ui/alert";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export function CourseQuiz() {
  const courseId = "6603e0f6b2b4e9db2f234568"; // 🔹 Hardcoded Course ID
  const userId = "6603e0f6b2b4e9db2f234567"; // 🔹 Hardcoded User ID
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [hasPreviousResult, setHasPreviousResult] = useState<boolean | null>(null); 
  const [evaluation, setEvaluation] = useState<string | null>(null); // 🔹 NEW
  const [recommendedCourses, setRecommendedCourses] = useState<string[]>([]); // 🔹 NEW
  const [score, setScore] = useState<number | null>(null); // 🔹 NEW
  const [submittedDate, setSubmittedDate] = useState<string | null>(null); // 🔹 NEW
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // use effect to check for prior quiz result
  useEffect(() => {
    const checkPreviousResult = async () => {
      try {
        const response = await fetch(`http://localhost:${process.env.B_PORT}/quiz/results/${userId}`);
        const data = await response.json();
        if (data.hasResult) {
          setHasPreviousResult(true);
          setEvaluation(data.evaluation);
          setRecommendedCourses(data.recommendedCourses);
          setScore(data.score);
          setSubmittedDate(data.createdAt);
          // console.log(data.evaluation);
        } else {
          setHasPreviousResult(false);
        }
      } catch (err) {
        console.error("Error checking previous result:", err);
        setError("Could not verify quiz attempt. Please try again.");
      }
    };

    checkPreviousResult();
  }, []);


  // Fetch quiz questions on component mount only if no results present
  useEffect(() => {
    if (hasPreviousResult === false) {
      fetchQuestions();
    }
  }, [hasPreviousResult]);


  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/quiz");
      if (!response.ok) {
        throw new Error("Failed to fetch quiz questions");
      }
      const data = await response.json();
      // console.log(data)
      setQuestions(data);
    } catch (err) {
      setError("Error loading quiz questions. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: Number.parseInt(answer),
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const completeQuiz = async () => {
    try {
      setIsSubmitting(true);
  
      // Construct responses properly
      const responses = Object.entries(selectedAnswers).map(([index, selectedAnswer]) => {
        const question = questions[Number(index)];
        
        // console.log(question)
        return {
          questionId: question.questionId,
          selectedAnswer,
          isCorrect: selectedAnswer === question.correctAnswer
        };
      });
  
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId, //  Use real ObjectId
          courseId, //  Use real ObjectId
          responses
        })
      });
  
      if (!response.ok) throw new Error("Failed to submit quiz results");
  
      setQuizCompleted(true);
    } catch (err) {
      setError("Error submitting quiz results. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (hasPreviousResult === true) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-red-500">Quiz Already Attempted</CardTitle>
            <CardDescription>
              You submitted this quiz on{" "}
              <span className="font-medium">
                {submittedDate ? new Date(submittedDate).toLocaleString() : "N/A"}
              </span>
            </CardDescription>
          </CardHeader>
  
          <CardContent className="space-y-6">
            {/* Evaluation Table */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Evaluation by Category</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr >
                      <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Proficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluation &&
                      Object.entries(evaluation).map(([category, level], idx) => (
                        <tr key={idx} >
                          <td className="border border-gray-300 px-4 py-2">{category}</td>
                          <td className="border border-gray-300 px-4 py-2">{level}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
  
            {/* Score Display */}
            {score !== null && (
              <div>
                <h3 className="text-lg font-semibold">Score</h3>
                <p className="text-base">{score}%</p>
              </div>
            )}
  
            {/* Recommended Courses */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Recommended Topics based on Results</h3>
              {recommendedCourses.length > 0 ? (
                <ul className="list-disc list-inside text-base space-y-1">
                  {recommendedCourses.map((course, idx) => (
                    <li key={idx}>{course}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-base text-muted-foreground">No course recommendations found.</p>
              )}
            </div>
          </CardContent>
  
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/courses")}>Browse Courses</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p>Loading quiz questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If quiz is completed, show success message
  if (quizCompleted) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Quiz Completed
            </CardTitle>
            <CardDescription>Your responses have been submitted successfully.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You can now access the recommended course materials.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => router.push("/courses")}>Return to Courses</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If quiz is ongoing, show questions
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Cybersecurity Course Quiz
          </CardTitle>
          <CardDescription>
            Complete this quiz to assess your cybersecurity knowledge and unlock course content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{progress.toFixed(0)}% complete</span>
            </div>
            <Progress value={progress} className="mb-6" />

            <div className="py-4">
              <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>

              <RadioGroup
                value={selectedAnswers[currentQuestionIndex]?.toString() || ""}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 rounded-md border p-3 ${
                      selectedAnswers[currentQuestionIndex] === index + 1
                        ? "border-primary bg-primary/5"
                        : "border-input"
                    }`}
                  >
                    <RadioGroupItem value={(index + 1).toString()} id={`option-${index}`} className="sr-only" />
                    <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer font-normal">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestionIndex] || isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
