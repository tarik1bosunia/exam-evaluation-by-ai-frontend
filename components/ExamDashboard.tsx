import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Upload, 
  Eye, 
  Download, 
  BarChart3,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExamDashboardProps {
  onBack: () => void;
}

const ExamDashboard = ({ onBack }: ExamDashboardProps) => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  // Mock data
  const examData = {
    title: "Mid-term Mathematics Exam",
    subject: "Mathematics",
    questions: 10,
    totalPoints: 100,
    students: [
      { id: "1", name: "Alice Johnson", uploaded: true, graded: true, score: 85 },
      { id: "2", name: "Bob Smith", uploaded: true, graded: true, score: 92 },
      { id: "3", name: "Carol Davis", uploaded: true, graded: false, score: null },
      { id: "4", name: "David Wilson", uploaded: false, graded: false, score: null },
      { id: "5", name: "Emma Brown", uploaded: true, graded: true, score: 78 },
    ]
  };

  const gradedStudents = examData.students.filter(s => s.graded);
  const averageScore = gradedStudents.length > 0 
    ? Math.round(gradedStudents.reduce((sum, s) => sum + (s.score || 0), 0) / gradedStudents.length) 
    : 0;

  const handleFileUpload = (studentId: string) => {
    setProcessing(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          toast({
            title: "Upload complete",
            description: "Answer sheet uploaded and processing started."
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusBadge = (student: any) => {
    if (student.graded) {
      const percentage = (student.score / examData.totalPoints) * 100;
      return (
        <Badge variant={percentage >= 70 ? "default" : "destructive"}>
          {student.score}/{examData.totalPoints} ({percentage}%)
        </Badge>
      );
    } else if (student.uploaded) {
      return <Badge variant="secondary">Processing</Badge>;
    } else {
      return <Badge variant="outline">Pending Upload</Badge>;
    }
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
            <h1 className="text-3xl font-bold">{examData.title}</h1>
            <p className="text-muted-foreground">{examData.subject} • {examData.questions} questions • {examData.totalPoints} points</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{examData.students.length}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{examData.students.filter(s => s.uploaded).length}</p>
                  <p className="text-sm text-muted-foreground">Uploaded</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{gradedStudents.length}</p>
                  <p className="text-sm text-muted-foreground">Graded</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{averageScore}%</p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>
                  Upload answer sheets and track grading progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examData.students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-foreground">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(student)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!student.uploaded ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept=".pdf"
                              className="w-40"
                              onChange={() => handleFileUpload(student.id)}
                            />
                            <Button size="sm" disabled={processing}>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        ) : student.graded ? (
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Processing...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {processing && (
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-medium">AI Processing in Progress</span>
                    </div>
                    <Progress value={uploadProgress} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      OCR extracting text and AI analyzing answers...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>90-100%</span>
                      <div className="flex items-center gap-2">
                        <Progress value={20} className="w-24" />
                        <span className="text-sm">1 student</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>80-89%</span>
                      <div className="flex items-center gap-2">
                        <Progress value={40} className="w-24" />
                        <span className="text-sm">1 student</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>70-79%</span>
                      <div className="flex items-center gap-2">
                        <Progress value={20} className="w-24" />
                        <span className="text-sm">1 student</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Below 70%</span>
                      <div className="flex items-center gap-2">
                        <Progress value={0} className="w-24" />
                        <span className="text-sm">0 students</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Question Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Most Difficult Question</span>
                        <Badge variant="destructive">Question 7</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Average score: 45%</p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Easiest Question</span>
                        <Badge variant="default">Question 3</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Average score: 95%</p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Class Average</span>
                        <Badge variant="secondary">{averageScore}%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="export">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Export Results</CardTitle>
                <CardDescription>
                  Download grading results in various formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Export Options</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Export to CSV
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Export to PDF Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Download Individual Results
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Quick Stats</h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Total Students:</span>
                        <span className="font-medium">{examData.students.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span className="font-medium">{gradedStudents.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Score:</span>
                        <span className="font-medium">{averageScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pass Rate:</span>
                        <span className="font-medium">
                          {Math.round((gradedStudents.filter(s => (s.score! / examData.totalPoints) >= 0.7).length / gradedStudents.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExamDashboard;