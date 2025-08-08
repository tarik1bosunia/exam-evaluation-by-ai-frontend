"use client";

import { useParams, useRouter } from 'next/navigation';
import { useGetExamByIdQuery } from '@/lib/redux/api/examApi';
import ExamEditForm from '@/components/ExamEditForm'; 
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function EditExamPage() {
    const router = useRouter();
    const params = useParams();
    const examId = Number(params.id);

    const { data: exam, isLoading, isError } = useGetExamByIdQuery(examId, {
        skip: !examId, 
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-10 w-32" />
            </div>
        );
    }

    if (isError || !exam) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load the exam. It might not exist or an error occurred.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const handleUpdateComplete = () => {
        router.push('/exams');
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Exam: {exam.title}</h1>
            <ExamEditForm 
                exam={exam} 
                onUpdateComplete={handleUpdateComplete}
                onCancel={handleCancel}
            />
        </div>
    );
}