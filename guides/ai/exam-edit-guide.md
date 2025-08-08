# Guide: Implementing Exam Editing

This guide details how to add functionality to edit existing exams, building upon the creation and listing features.

## 1. Backend: Handling Exam Updates

We'll start by adding the necessary views, serializers, and URLs to the Django backend to support retrieving and updating an exam.

### `serializers.py` - Update Logic

The most significant change is in the `ExamSerializer`. We need to implement the `.update()` method to handle the complex logic of updating an exam and its associated questions. This includes creating new questions, updating existing ones, and deleting those that have been removed.

```python
from rest_framework import serializers
from .models import Exam, Question

class QuestionSerializer(serializers.ModelSerializer):
    # The 'id' field is crucial for the update logic on the frontend.
    # It can be read-only for creation but needs to be present.
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Question
        fields = ['id', 'text', 'ideal_answer', 'instructions', 'mark', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Exam
        fields = ['id', 'title', 'subject', 'instructions', 'questions', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        exam = Exam.objects.create(**validated_data)
        for question_data in questions_data:
            Question.objects.create(exam=exam, **question_data)
        return exam

    def update(self, instance, validated_data):
        # Update exam instance fields
        instance.title = validated_data.get('title', instance.title)
        instance.subject = validated_data.get('subject', instance.subject)
        instance.instructions = validated_data.get('instructions', instance.instructions)
        instance.save()

        questions_data = validated_data.get('questions')

        # Get existing question IDs from the database for this exam
        existing_question_ids = set(instance.questions.values_list('id', flat=True))
        
        # Keep track of question IDs from the incoming request
        incoming_question_ids = set()

        for question_data in questions_data:
            question_id = question_data.get('id', None)
            if question_id:
                # If ID exists, it's an update to an existing question
                incoming_question_ids.add(question_id)
                question_instance = Question.objects.get(id=question_id, exam=instance)
                question_instance.text = question_data.get('text', question_instance.text)
                question_instance.ideal_answer = question_data.get('ideal_answer', question_instance.ideal_answer)
                question_instance.instructions = question_data.get('instructions', question_instance.instructions)
                question_instance.mark = question_data.get('mark', question_instance.mark)
                question_instance.save()
            else:
                # If no ID, it's a new question
                Question.objects.create(exam=instance, **question_data)

        # Determine which questions to delete
        question_ids_to_delete = existing_question_ids - incoming_question_ids
        if question_ids_to_delete:
            instance.questions.filter(id__in=question_ids_to_delete).delete()

        return instance

```

### `views.py` - Retrieve and Update View

We need a view that can handle retrieving a single exam's details (`GET`), updating it (`PUT`/`PATCH`), and deleting it (`DELETE`). A `RetrieveUpdateDestroyAPIView` is perfect for this.

```python
from rest_framework import generics
from .models import Exam
from .serializers import ExamSerializer

# Existing Views
class ExamCreateView(generics.CreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

class ExamListView(generics.ListAPIView):
    queryset = Exam.objects.all().order_by('-created_at')
    serializer_class = ExamSerializer

# New View for Details, Update, and Delete
class ExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    lookup_field = 'id' # or 'pk'
```

### `urls.py` - New URL Pattern

Finally, add a new URL pattern to map to the `ExamDetailView`.

```python
from django.urls import path
from .views import ExamCreateView, ExamListView, ExamDetailView

urlpatterns = [
    path('exams/create/', ExamCreateView.as_view(), name='exam-create'),
    path('exams/', ExamListView.as_view(), name='exam-list'),
    path('exams/<int:id>/', ExamDetailView.as_view(), name='exam-detail'), # New URL
]
```
---
## 2. Frontend: Building the Edit Interface

With the backend ready, we can now build the frontend components to fetch, display, and update the exam data.

### `lib/types.ts` - Centralized Type Definitions

To ensure our types are consistent and easy to manage, let's create a central file for them.

**Create a new file at `lib/types.ts`:**
```typescript
export interface Question {
    id?: number; // Optional for new questions
    text: string;
    ideal_answer: string;
    instructions?: string;
    mark: number;
    created_at?: string;
    updated_at?: string;
}

export interface Exam {
    id: number;
    title: string;
    subject: string;
    instructions: string;
    questions: Question[];
    created_at: string;
    updated_at: string;
}

// Used for both creating and updating exams
export type ExamData = Omit<Exam, 'id' | 'created_at' | 'updated_at'>;
```

### `lib/redux/api/examApi.ts` - New Endpoints

First, we'll add two new endpoints to our `examApi` slice: one to fetch a single exam by its ID and another to update an exam.

```typescript
import { apiSlice } from "./apiSlice";
import { Exam, ExamData } from "@/lib/types";

export const examApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ... existing endpoints: createExam, getExams
        
        // New query to get a single exam by ID
        getExamById: builder.query<Exam, number>({
            query: (id) => `/exams/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Exam', id }],
        }),

        // New mutation to update an exam
        updateExam: builder.mutation<Exam, { id: number; examData: Partial<ExamData> }>({
            query: ({ id, examData }) => ({
                url: `/exams/${id}/`,
                method: 'PUT', // or 'PATCH' if you allow partial updates
                body: examData,
            }),
            // Invalidate the specific exam cache and the list cache
            invalidatesTags: (result, error, { id }) => [
                { type: 'Exam', id },
                { type: 'Exam', id: 'LIST' },
            ],
        }),
    }),
});

export const { 
    useCreateExamMutation, 
    useGetExamsQuery,
    useGetExamByIdQuery,
    useUpdateExamMutation 
} = examApi;
```

### `app/exams/[id]/page.tsx` - The Edit Page

This new page will be the container for our editing form. It will fetch the exam data using the new `useGetExamByIdQuery` hook and pass it to a form component.

```typescript
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useGetExamByIdQuery } from '@/lib/redux/api/examApi';
import ExamEditForm from '@/components/ExamEditForm'; // We will create this next
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function EditExamPage() {
    const router = useRouter();
    const params = useParams();
    const examId = Number(params.id);

    const { data: exam, isLoading, isError } = useGetExamByIdQuery(examId, {
        skip: !examId, // Don't run query if ID is not available
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
        // Navigate back to the exam list after successful update
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
```

### `components/ExamEditForm.tsx` - The Core Edit Component

This component will be very similar to `ExamCreation.tsx`, but it will be initialized with the data of the exam being edited.

```typescript
"use client";

import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateExamMutation } from "@/lib/redux/api/examApi";
import { Exam } from "@/lib/types";
import { ExamDetailsStep } from "./ExamDetailsStep";
import { QuestionsStep } from "./QuestionsStep";
import { ReviewStep } from "./ReviewStep";
import { Button } from "@/components/ui/button";

// Use the same schema as creation
const examFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  instructions: z.string().min(1, "Instructions are required"),
  questions: z.array(z.object({
    id: z.number().optional(), // Important for tracking existing questions
    text: z.string().min(1, "Question text is required"),
    ideal_answer: z.string().min(1, "Ideal answer is required"),
    instructions: z.string().optional(),
    mark: z.any().transform(val => Number(val)),
  })).min(1, "You must add at least one question."),
});

export type ExamFormData = z.infer<typeof examFormSchema>;

interface ExamEditFormProps {
    exam: Exam;
    onUpdateComplete: () => void;
    onCancel: () => void;
}

export default function ExamEditForm({ exam, onUpdateComplete, onCancel }: ExamEditFormProps) {
  const [step, setStep] = useState(1);
  const [updateExam, { isLoading }] = useUpdateExamMutation();

  const methods = useForm<ExamFormData>({
    resolver: zodResolver(examFormSchema),
    // Pre-populate the form with the existing exam data
    defaultValues: {
      title: exam.title,
      subject: exam.subject,
      instructions: exam.instructions,
      questions: exam.questions,
    },
  });

  const { control, handleSubmit, trigger, getValues } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const handleNext = async () => {
    const isValid = await trigger(step === 1 ? ["title", "subject", "instructions"] : undefined);
    if (isValid) setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const onSubmit = async (data: ExamFormData) => {
    try {
      await updateExam({ id: exam.id, examData: data }).unwrap();
      onUpdateComplete();
    } catch (error) {
      console.error("Failed to update exam:", error);
      // Show an error toast to the user
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Reuse the same step components as ExamCreation */}
        {step === 1 && <ExamDetailsStep />}
        {/* You might need to adjust QuestionsStep if it doesn't already handle useFieldArray correctly */}
        {step === 2 && <QuestionsStep fields={fields} append={append} remove={remove} />}
        {step === 3 && <ReviewStep examData={getValues()} />}

        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
          ) : (
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          )}

          {step < 3 ? (
            <Button type="button" onClick={handleNext}>Next</Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Exam"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
```

**Note:** You can reuse `ExamDetailsStep`, `QuestionsStep`, and `ReviewStep` from the creation process. The key is that `ExamEditForm` uses `FormProvider` to provide the `react-hook-form` methods, which are pre-populated with the exam data. The `QuestionsStep` should already work correctly with `useFieldArray` as long as it's wrapped in the `FormProvider`.

### `components/ExamList.tsx` - Adding the Edit Button

Finally, update the `ExamList` component to include a link or button that navigates the user to the new edit page for each exam.

```typescript
// In components/ExamList.tsx

// ... imports
import Link from 'next/link';
import { Edit } from 'lucide-react';

// ... inside the return statement, within the .map function

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
        <Link href={`/exams/${exam.id}/edit`} passHref>
            <Button variant="ghost" size="icon">
                <Edit className="w-4 h-4" />
            </Button>
        </Link>
    </div>
</Card>
```

## 3. Conclusion

By following this guide, you have added a complete exam editing workflow:
- **Backend:** Secure endpoints for retrieving and updating exam data, including complex nested question logic.
- **Frontend:**
    - New RTK Query hooks for fetching and updating exams.
    - A dedicated, pre-populated, multi-step form for editing.
    - A clear entry point from the exam list to the edit page.
- **Data Integrity:** The system correctly handles adding, updating, and deleting questions associated with an exam.