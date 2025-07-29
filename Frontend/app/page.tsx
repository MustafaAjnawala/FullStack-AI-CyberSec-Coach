"use client" 

import { useState, useEffect } from "react" 
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, BookOpen, Users, Clock, Loader2 } from "lucide-react" 
import { PageContainer } from "@/components/page-container"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define the shape of the course data from the API
interface Course {
  _id: string;
  title: string;
  description: string;
  courseId: number;
  long_description: string;
}

export default function Home() {
  const [featuredCourse, setFeaturedCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch the course data when the component mounts
  useEffect(() => {
    const fetchFeaturedCourse = async () => {
      try {
        setIsLoading(true)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        const response = await fetch(`${backendUrl}/api/courses`)

        if (!response.ok) {
          throw new Error("Failed to fetch the featured course.")
        }

        const courses: Course[] = await response.json()

        // Set the first course in the array as the featured course
        if (courses && courses.length > 0) {
          setFeaturedCourse(courses[0])
        } else {
          throw new Error("No courses are available at the moment.")
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedCourse()
  }, []) // Empty dependency array ensures this runs only once

  const creators = [
    {
      name: "Shriram",
      role: "Role/Position",
      description: "Brief description about the creator and their contribution to the platform.",
      image: "/creators/creator1.jpg"
    },
    {
      name: "Neel",
      role: "Role/Position",
      description: "Brief description about the creator and their contribution to the platform.",
      image: "/creators/creator2.jpg"
    },
    {
      name: "Mustafa",
      role: "Role/Position",
      description: "Brief description about the creator and their contribution to the platform.",
      image: "/creators/creator3.jpg"
    },
    {
      name: "Prajal",
      role: "Role/Position",
      description: "Brief description about the creator and their contribution to the platform.",
      image: "/creators/creator3.jpg"
    },
    {
      name: "Varun",
      role: "Role/Position",
      description: "Brief description about the creator and their contribution to the platform.",
      image: "/creators/creator3.jpg"
    }
  ];

  return (
    <main className="flex-grow">
      <PageContainer>
        <div className="py-12">
          {/* University Logo Section */}
          <div className="flex justify-center mb-2">
            <div className="w-48 h-48 relative rounded-2xl overflow-hidden">
              <Image
                  src="/img.png"
                  alt="Vishwakarma University Logo"
                  fill
                  className="object-fit rounded-3xl"
                  priority
              />
            </div>
          </div>

          <section className="mt-12 mb-24 text-center">
            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-600 to-pink-500 text-transparent bg-clip-text">
              Welcome to Learning Agent by <br/>
              Vishwakarma University
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Discover AI-powered courses tailored to your learning style and goals. Unlock your potential with
              personalized education.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
          </section>

          {/* --- DYNAMIC FEATURED COURSE SECTION --- */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Featured Course</h2>
            <div className="max-w-3xl mx-auto">
              {isLoading && (
                <div className="flex justify-center items-center p-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!isLoading && !error && featuredCourse && (
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      <CardTitle>{featuredCourse.title}</CardTitle>
                    </div>
                    <CardDescription>
                      {featuredCourse.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {featuredCourse.long_description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/courses/${featuredCourse.courseId}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Course
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose LearnAI?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-col items-center">
                    <Shield className="w-8 h-8 mb-2 text-orange-600" />
                    Expert-Led Content
                  </CardTitle>
                </CardHeader>
                <CardContent>Learn from industry professionals with years of real-world experience.</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-col items-center">
                    <Users className="w-8 h-8 mb-2 text-orange-600" />
                    Interactive Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>Engage with hands-on exercises and practical assessments.</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-col items-center">
                    <BookOpen className="w-8 h-8 mb-2 text-orange-600" />
                    Comprehensive Curriculum
                  </CardTitle>
                </CardHeader>
                <CardContent>Cover all essential topics with structured, in-depth learning materials.</CardContent>
              </Card>
            </div>
          </section>

          {/* Creators Information Section */}
          <section className="mt-16 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Meet the Creators</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {creators.map((creator, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex justify-center mb-2">
                        <div className="w-24 h-24 rounded-full bg-muted">
                          {creator.image && (
                              <Image
                                  src={creator.image}
                                  alt={creator.name}
                                  width={96}
                                  height={96}
                                  className="rounded-full object-cover"
                              />
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-center">{creator.name}</CardTitle>
                      <CardDescription className="text-center">{creator.role}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p>{creator.description}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </section>
        </div>
      </PageContainer>
    </main>
  )
}