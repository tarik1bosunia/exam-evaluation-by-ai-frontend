# Frontend Guide: Deleting an Exam

This guide outlines the steps to implement the "delete exam" functionality on the frontend.

## 1. API Layer: Add `deleteExam` Mutation

First, we need to add a `deleteExam` mutation to our Redux Toolkit Query API slice. This will allow us to send a `DELETE` request to the server.

### `lib/redux/api/examApi.ts`

```typescript
import { apiSlice } from "./apiSlice";
import { Exam, ExamData } from "@/lib/types";

export const examApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ... existing endpoints
        updateExam: builder.mutation<Exam, { id: number; examData: Partial<ExamData> }>({
            query: ({ id, examData }) => ({
                url: `/core/exams/${id}/`,
                method: 'PUT',
                body: examData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Exam', id },
                { type: 'Exam', id: 'LIST' },
            ],
        }),

        deleteExam: builder.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `/core/exams/${id}/`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Exam', id: 'LIST' }],
        }),
    }),
});

export const { useCreateExamMutation, useGetExamsQuery, useGetExamByIdQuery, useUpdateExamMutation, useDeleteExamMutation } = examApi;
```

**Changes:**

- Added a `deleteExam` mutation to the `examApi`.
- It takes the `id` of the exam to be deleted.
- It sends a `DELETE` request to the `/core/exams/{id}/` endpoint.
- It invalidates the `Exam` list cache upon successful deletion, which will trigger a refetch of the exam list.
- Exported the `useDeleteExamMutation` hook.

## 2. UI Layer: Add Delete Button and Confirmation

Next, we'll add a delete button to the `ExamList` component. To prevent accidental deletions, we'll use an `AlertDialog` to confirm the user's action.

### `components/ExamList.tsx`

```typescript
"use client";

import { useState } from "react";
import { useGetExamsQuery, useDeleteExamMutation } from "@/lib/redux/api/examApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileText, AlertCircle, ArrowRight, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";


const ExamList = () => {
    const { data: exams, error, isLoading } = useGetExamsQuery();
    const [deleteExam, { isLoading: isDeleting }] = useDeleteExamMutation();
    const { toast } = useToast();

    const handleDelete = async (id: number) => {
        try {
            await deleteExam(id).unwrap();
            toast({
                title: "Exam Deleted",
                description: "The exam has been successfully deleted.",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to delete the exam. Please try again.",
                variant: "destructive",
            });
        }
    };

    // ... (isLoading, error, no exams states remain the same)

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
                <Card key={exam.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle>{exam.title}</CardTitle>
                        <CardDescription>{exam.subject}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3">{exam.instructions}</p>
                    </CardContent>
                    <div className="p-6 pt-0 flex justify-between items-center">
                        <Link href={`/exams/${exam.id}`} passHref>
                            <Button variant="outline" size="sm">
                                View Details
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Link href={`/exams/${exam.id}/edit`} passHref>
                                <Button variant="ghost" size="icon">
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </Link>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the exam
                                            and all its associated data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDelete(exam.id)}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default ExamList;
```

**Changes:**

- Imported `useState`, `useDeleteExamMutation`, `useToast`, `AlertDialog` components, and the `Trash2` icon.
- Initialized the `useDeleteExamMutation` hook.
- Created a `handleDelete` function that calls the `deleteExam` mutation and shows a toast notification on success or failure.
- Wrapped the delete button in an `AlertDialog` component to show a confirmation dialog.
- The "Delete" button in the dialog calls the `handleDelete` function.

This completes the implementation of the delete exam feature.