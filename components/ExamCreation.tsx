import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Users, 
  Upload,
  Trash2,
  BookOpen,
  Target,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExamCreationProps {
  onBack: () => void;
  onComplete: () => void;
}

interface Question {
  id: string;
  text: string;
  points: number;
  answer: string;
}


const ExamCreation = ({ onBack, onComplete }: ExamCreationProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [examTitle, setExamTitle] = useState("");
  const [examSubject, setExamSubject] = useState("");
  const [examInstructions, setExamInstructions] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({ text: "", points: 10, answer: "" });

  const addQuestion = () => {
    if (newQuestion.text && newQuestion.answer) {
      setQuestions([...questions, {
        id: Date.now().toString(),
        ...newQuestion
      }]);
      setNewQuestion({ text: "", points: 10, answer: "" });
      toast({
        title: "Question added",
        description: "Question has been added to the exam."
      });
    }
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };


  const canProceed = () => {
    switch (step) {
      case 1: return examTitle && examSubject;
      case 2: return questions.length > 0;
      default: return false;
    }
  };

  const completeExam = () => {
    toast({
      title: "Exam created successfully!",
      description: "Your exam is ready for student submissions."
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Exam</h1>
            <p className="text-muted-foreground">Set up your exam in a few simple steps</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                  stepNum <= step 
                    ? 'bg-gradient-primary text-primary-foreground shadow-soft' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNum < step ? <CheckCircle className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-1 mx-2 rounded transition-all ${
                    stepNum < step ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {step === 1 && (
            <Card className="shadow-card border-0">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Exam Details</CardTitle>
                <CardDescription>
                  Set up the basic information for your exam
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Exam Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Mid-term Mathematics Exam"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Mathematics, Physics, History"
                      value={examSubject}
                      onChange={(e) => setExamSubject(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Provide any special instructions for this exam..."
                    value={examInstructions}
                    onChange={(e) => setExamInstructions(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="shadow-card border-0">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Questions & Answer Key</CardTitle>
                <CardDescription>
                  Add questions and provide the ideal answers for comparison
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Question Form */}
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold">Add New Question</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question Text *</Label>
                      <Textarea
                        placeholder="Enter the question..."
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Points</Label>
                        <Input
                          type="number"
                          min="1"
                          value={newQuestion.points}
                          onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Ideal Answer *</Label>
                      <Textarea
                        placeholder="Provide the ideal answer for comparison..."
                        value={newQuestion.answer}
                        onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <Button onClick={addQuestion} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </div>

                {/* Questions List */}
                {questions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Questions ({questions.length})</h3>
                      <Badge variant="secondary">
                        Total: {questions.reduce((sum, q) => sum + q.points, 0)} points
                      </Badge>
                    </div>
                    {questions.map((question, index) => (
                      <div key={question.id} className="bg-card rounded-lg p-4 border shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline">Question {index + 1}</Badge>
                          <div className="flex items-center gap-2">
                            <Badge>{question.points} pts</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(question.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="font-medium mb-2">{question.text}</p>
                        <div className="text-sm text-muted-foreground">
                          <strong>Answer:</strong> {question.answer.substring(0, 100)}
                          {question.answer.length > 100 && "..."}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="shadow-card border-0">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">Exam Created Successfully!</CardTitle>
                <CardDescription>
                  Your exam is ready. You can now manage student submissions in the dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Exam Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Title:</strong> {examTitle}</div>
                        <div><strong>Subject:</strong> {examSubject}</div>
                        <div><strong>Questions:</strong> {questions.length}</div>
                        <div><strong>Total Points:</strong> {questions.reduce((sum, q) => sum + q.points, 0)}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">What's Next?</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Add students in the dashboard
                        </div>
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload student answer sheets
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          AI will grade automatically
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                variant="default"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={completeExam}
                variant="success"
              >
                Create Exam
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCreation;