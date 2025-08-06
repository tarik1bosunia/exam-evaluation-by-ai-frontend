"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  Brain,
  BarChart3,
  Upload,
  CheckCircle,
  Clock,
  Zap,
  BookOpen,
  GraduationCap,
  Shield,
  ArrowRight
} from "lucide-react";
import Navigation from "@/components/Navigation";
import ExamCreation from "@/components/ExamCreation";
import ExamDashboard from "@/components/ExamDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'create' | 'dashboard'>('home');

  if (currentView === 'create') {
    return <ExamCreation onBack={() => setCurrentView('home')} onComplete={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'dashboard') {
    return <ExamDashboard onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Grading Technology
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent leading-tight">
            Effortlessly Grade Exams with the Power of AI
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Streamline your entire examination process. Create exams, upload answer sheets, and let our advanced AI provide fast, fair, and consistent grading.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              variant="hero"
              size="lg"
              className="text-lg px-8 py-4"
              onClick={() => setCurrentView('create')}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Start Grading
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              <GraduationCap className="w-5 h-5 mr-2" />
              View Demo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10x</div>
              <div className="text-sm text-muted-foreground">Faster Grading</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">100%</div>
              <div className="text-sm text-muted-foreground">Consistency</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">0</div>
              <div className="text-sm text-muted-foreground">Setup Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Core Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to revolutionize your grading process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle>Exam Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Create exams, add questions, and upload answer keys with ease. Organize everything in one place.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Add students and upload their answer sheets in PDF format. Track submission status effortlessly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle>AI Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Advanced OCR extracts text, while Gemini AI analyzes and compares against your answer keys.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle>Results & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Detailed reports, side-by-side comparisons, and class-wide analytics to improve teaching.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to transform your grading process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create & Setup</h3>
              <p className="text-muted-foreground">
                Create your exam, add questions, upload answer keys, and add your students to the roster.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload & Process</h3>
              <p className="text-muted-foreground">
                Upload student answer sheets as PDFs. Our AI extracts and analyzes the content automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Review & Export</h3>
              <p className="text-muted-foreground">
                Review detailed results, analytics, and export grades to CSV or PDF for your records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                More Time for Teaching, Less Time Grading
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our AI-powered platform eliminates the tedious manual grading process, giving you more time to focus on what matters most - your students.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-accent" />
                  <span>Save hours of manual grading time</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-accent" />
                  <span>Consistent and fair evaluation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-accent" />
                  <span>Instant results and feedback</span>
                </div>
                <div className="flex items-center gap-3">
                  <Upload className="w-6 h-6 text-accent" />
                  <span>No technical expertise required</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-subtle rounded-2xl p-8 shadow-glow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-card">
                    <span className="font-medium">Manual Grading</span>
                    <Badge variant="destructive">4-6 hours</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-card">
                    <span className="font-medium">AI Grading</span>
                    <Badge variant="default">15 minutes</Badge>
                  </div>
                  <div className="text-center pt-4">
                    <span className="text-2xl font-bold text-accent">95% Time Saved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Grading?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of educators who have already revolutionized their grading process with AI.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="text-lg px-8 py-4"
            onClick={() => setCurrentView('create')}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Start Your First Exam
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;

