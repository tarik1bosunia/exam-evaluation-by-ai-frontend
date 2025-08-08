"use client";

import { useGetExamsQuery } from "@/lib/redux/api/examApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, AlertCircle, ArrowRight, HelpCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const ExamList = () => {
    const { data: exams, error, isLoading } = useGetExamsQuery();

    if (isLoading) {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full" />
                            <div className="flex justify-end mt-4">
                                <Skeleton className="h-10 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load exams. Please try again later.
                </AlertDescription>
            </Alert>
        );
    }

    if (!exams || exams.length === 0) {
        return (
            <div className="text-center py-16">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No exams found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Get started by creating a new exam.
                </p>
                {/* Optional: Add a button to create an exam */}
            </div>
        );
    }


    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
                <Link key={exam.id} href={`/exams/${exam.id}`} className="flex">
                    <Card className="flex flex-col w-full hover:border-primary transition-colors duration-200 hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="line-clamp-2">{exam.title}</CardTitle>
                            <CardDescription>{exam.subject}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <HelpCircle className="w-4 h-4 mr-2" />
                                {exam.questions.length} Questions
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-2" />
                                Created on {format(new Date(exam.created_at), "PPP")}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                             <div className="flex items-center text-sm font-medium text-primary">
                                View Details
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    );
};

export default ExamList;