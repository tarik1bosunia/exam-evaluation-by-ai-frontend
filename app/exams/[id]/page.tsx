"use client";

import { useParams } from "next/navigation";
import { useGetExamByIdQuery } from "@/lib/redux/api/examApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Book, HelpCircle, Check, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ExamDetailPage = () => {
    const params = useParams();
    const id = Number(params.id);
    const { data: exam, error, isLoading } = useGetExamByIdQuery(id, {
        skip: !id, // Don't run the query if the id is not available yet
    });

    if (isLoading || !id) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-10 w-48 mb-8" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                        <div>
                            <Skeleton className="h-6 w-32 mb-2" />
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load exam details. It might not exist or an error occurred.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!exam) {
        return <div className="container mx-auto px-4 py-8">Exam not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/exams" passHref>
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to All Exams
                </Button>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{exam.title}</CardTitle>
                    <CardDescription className="text-lg">{exam.subject}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <h3 className="font-semibold text-xl mb-2 flex items-center"><Book className="w-5 h-5 mr-2" /> Instructions</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{exam.instructions}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-xl mb-4 flex items-center"><HelpCircle className="w-5 h-5 mr-2" /> Questions ({exam.questions.length})</h3>
                        <div className="space-y-6">
                            {exam.questions.map((q, index) => (
                                <div key={q.id} className="p-4 border rounded-lg bg-muted/30">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold flex-1">{index + 1}. {q.text}</p>
                                        <span className="text-sm font-bold text-primary ml-4 whitespace-nowrap">{q.mark} Marks</span>
                                    </div>
                                    <div className="mt-3 pl-6 border-l-2 border-primary/50">
                                        <p className="text-sm text-muted-foreground flex items-start">
                                            <Check className="w-4 h-4 mr-2 mt-1 text-green-500 flex-shrink-0" />
                                            <span className="font-semibold mr-1">Ideal Answer:</span> {q.ideal_answer}
                                        </p>
                                        {q.instructions && (
                                            <p className="text-sm text-muted-foreground mt-2 flex items-start">
                                                <Hash className="w-4 h-4 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                                                <span className="font-semibold mr-1">Grading Note:</span> {q.instructions}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExamDetailPage;