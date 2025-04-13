import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, BookOpen, Users, Clock } from "lucide-react"
import { PageContainer } from "@/components/page-container"
import Image from "next/image"

export default function Home() {
  // Add this creators array above the component or in a separate data file
  const creators = [
    {
      name: "Shriram",
      role: "Role/Position",
      description: "Brief description about the creator and their contribution to the platform.",
      image: "/creators/creator1.jpg" // Optional: Add actual images in public/creators folder
    },
    {
      name: "Neel",
      role: "Role/Position",
      description: "Brief description about the creator and their contribution to the platform.",
      image: "/creators/creator2.jpg"
    },
    {
      name: "Aditya",
      role: "Role/Position",
      description: "Brief description about the creator and their contribution to the platform.",
      image: "/creators/creator3.jpg"
    },
    {
      name: "Mustafa",
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

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Featured Course</h2>
            <Card className="hover:shadow-lg transition-shadow max-w-3xl mx-auto">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <CardTitle>OWASP Top 10 Vulnerabilities</CardTitle>
                </div>
                <CardDescription>
                  Learn about the most critical web application security risks and how to mitigate them.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Instructor: Dr. Nitin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Duration: 10 weeks</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    This comprehensive course covers the OWASP Top 10 security vulnerabilities including Broken Access
                    Control, Cryptographic Failures, Injection Attacks, and more. Perfect for developers and security
                    professionals.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/courses/1">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Course
                  </Link>
                </Button>
              </CardFooter>
            </Card>
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

