import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, GraduationCap, BookOpen } from "lucide-react";
import Link from "next/link";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ExamAI</h1>
              <Badge variant="secondary" className="text-xs">
                AI Grading Platform
              </Badge>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/exams" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Exams
            </Link>
            <Link href="/#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Benefits
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <GraduationCap className="w-4 h-4 mr-2" />
              Demo
            </Button>
            <Link href="/?view=create" passHref>
                <Button variant="default" size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create Exam
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;