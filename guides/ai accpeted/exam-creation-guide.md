# Guide: Implementing a Multi-Step Exam Creation Process

This guide will walk you through the process of creating a multi-step exam creation form using Next.js, TypeScript, and RTK Query, with a Django Rest Framework (DRF) backend.

## 1. Backend: Django Models and Serializers

First, let's define the models and serializers required on the backend to store the exam data.

### `models.py`

You'll need models for `Exam` and `Question`.

```python
from django.db import models

class Exam(models.Model):
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    instructions = models.TextField(help_text="Instructions for the AI on how to grade the exam.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Question(models.Model):
    exam = models.ForeignKey(Exam, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    ideal_answer = models.TextField()
    instructions = models.TextField(blank=True, null=True, help_text="Specific instructions for grading this question.")
    mark = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Question for {self.exam.title}"
```

### `serializers.py`

Now, create the serializers to convert the model instances to JSON.

```python
from rest_framework import serializers
from .models import Exam, Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'ideal_answer', 'instructions', 'mark', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

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
```

### `views.py`

Create a `generics.CreateAPIView` to handle the creation of the exam.

```python
from rest_framework import generics
from .models import Exam
from .serializers import ExamSerializer

class ExamCreateView(generics.CreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
```

### `urls.py`

Finally, add the URL for the view.

```python
from django.urls import path
from .views import ExamCreateView

urlpatterns = [
    path('exams/create/', ExamCreateView.as_view(), name='exam-create'),
]
```

## 2. Frontend: RTK Query API Slice

Now, let's create the RTK Query endpoint to communicate with the backend.

### `lib/redux/api/examApi.ts`

Create a new file for the exam API slice.

```typescript
import { apiSlice } from "./apiSlice";
import { Exam } from "@/types"; // You will need to define this type

interface Exam {
    id: number;
    title: string;
    subject: string;
    instructions: string;
    questions: Question[];
    created_at: string;
    updated_at: string;
}

interface Question {
    id: number;
    text: string;
    ideal_answer: string;
    instructions?: string;
    mark: number;
    created_at: string;
    updated_at: string;
}

interface ExamData {
    title: string;
    subject: string;
    instructions: string;
    questions: Question[];
}


export const examApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createExam: builder.mutation<Exam, ExamData>({
            query: (examData) => ({
                url: '/exams/create/',
                method: 'POST',
                body: examData,
            }),
            invalidatesTags: ['Exam'],
        }),
    }),
});

export const { useCreateExamMutation } = examApi;
```

Remember to add `'Exam'` to the `tagTypes` in your main `apiSlice.ts` file.

## 3. Frontend: A Better Multi-Step Form

The previous example was functional, but we can make it much more robust and maintainable. This section outlines a better approach using a single `react-hook-form` instance and `useFieldArray` for dynamic questions.

### `components/ExamCreation.tsx` (Refactored)

This main component will now act as a controller, managing the form state and rendering the correct step component.

```typescript
"use client";

import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateExamMutation } from "@/lib/redux/api/examApi";
import { ExamDetailsStep } from "./ExamDetailsStep";
import { QuestionsStep } from "./QuestionsStep";
import { ReviewStep } from "./ReviewStep";
import { Button } from "@/components/ui/button";

// A single, unified schema for the entire form
const examFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  instructions: z.string().min(1, "Instructions are required"),
  questions: z.array(z.object({
    text: z.string().min(1, "Question text is required"),
    ideal_answer: z.string().min(1, "Ideal answer is required"),
    instructions: z.string().optional(),
    mark: z.any()
      .refine(val => {
        const num = Number(val);
        return !isNaN(num) && num >= 1;
      }, {
        message: "Mark must be a number and at least 1",
      })
      .transform(val => Number(val)),
  })).min(1, "You must add at least one question."),
});

export type ExamFormData = z.infer<typeof examFormSchema>;

export default function ExamCreation({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [createExam, { isLoading }] = useCreateExamMutation();

  const methods = useForm<ExamFormData>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      title: "",
      subject: "",
      instructions: "",
      questions: [{ text: "", ideal_answer: "", instructions: "", mark: 10 }],
    },
  });

  const { control, handleSubmit, trigger, getValues } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const handleNext = async () => {
    const isValid = await trigger(step === 1 ? ["title", "subject", "instructions"] : undefined);
    if (isValid) {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => setStep(s => s - 1);

  const onSubmit = async (data: ExamFormData) => {
    try {
      await createExam(data).unwrap();
      onComplete();
    } catch (error) {
      console.error("Failed to create exam:", error);
      // Here you would set an error state to show a message to the user
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && <ExamDetailsStep />}
        {step === 2 && <QuestionsStep fields={fields} append={append} remove={remove} />}
        {step === 3 && <ReviewStep examData={getValues()} />}

        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
          ) : (
            <Button type="button" variant="outline" onClick={onBack}>Cancel</Button>
          )}

          {step < 3 ? (
            <Button type="button" onClick={handleNext}>Next</Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Exam"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
```

### `components/ExamDetailsStep.tsx`

A dedicated component for the first step.

```typescript
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamFormData } from "./ExamCreation";

export const ExamDetailsStep = () => {
  const { register, formState: { errors } } = useFormContext<ExamFormData>();

  return (
    <Card>
      <CardHeader><CardTitle>Step 1: Exam Details</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input placeholder="Exam Title" {...register("title")} />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Input placeholder="Subject" {...register("subject")} />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
        </div>
        <div>
          <Textarea placeholder="Overall Instructions for AI" {...register("instructions")} />
          {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
```

### `components/QuestionsStep.tsx`

This component uses `useFieldArray` to manage the questions.

```typescript
import { useFormContext, UseFieldArrayReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamFormData } from "./ExamCreation";

interface QuestionsStepProps {
  fields: UseFieldArrayReturn<ExamFormData, "questions", "id">['fields'];
  append: UseFieldArrayReturn<ExamFormData, "questions", "id">['append'];
  remove: UseFieldArrayReturn<ExamFormData, "questions", "id">['remove'];
}

export const QuestionsStep = ({ fields, append, remove }: QuestionsStepProps) => {
  const { register, formState: { errors } } = useFormContext<ExamFormData>();

  return (
    <Card>
      <CardHeader><CardTitle>Step 2: Add Questions</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
            <h3 className="font-semibold">Question {index + 1}</h3>
            <div>
              <Textarea placeholder="Question Text" {...register(`questions.${index}.text`)} />
              {errors.questions?.[index]?.text && <p className="text-red-500 text-sm mt-1">{errors.questions?.[index]?.text?.message}</p>}
            </div>
            <div>
              <Textarea placeholder="Ideal Answer" {...register(`questions.${index}.ideal_answer`)} />
              {errors.questions?.[index]?.ideal_answer && <p className="text-red-500 text-sm mt-1">{errors.questions?.[index]?.ideal_answer?.message}</p>}
            </div>
            <div>
              <Input type="number" placeholder="Marks" {...register(`questions.${index}.mark`)} />
              {errors.questions?.[index]?.mark && <p className="text-red-500 text-sm mt-1">{errors.questions?.[index]?.mark?.message}</p>}
            </div>
            <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} className="absolute top-2 right-2">Remove</Button>
          </div>
        ))}
        {errors.questions?.root && <p className="text-red-500 text-sm mt-1">{errors.questions.root.message}</p>}
        <Button type="button" variant="outline" onClick={() => append({ text: "", ideal_answer: "", instructions: "", mark: 10 })}>
          Add Question
        </Button>
      </CardContent>
    </Card>
  );
};
```

### `components/ReviewStep.tsx`

A simple component to display the data before submission.

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamFormData } from "./ExamCreation";

interface ReviewStepProps {
  examData: ExamFormData;
}

export const ReviewStep = ({ examData }: ReviewStepProps) => {
  return (
    <Card>
      <CardHeader><CardTitle>Step 3: Review and Create</CardTitle></CardHeader>
      <CardContent>
        <h3 className="font-bold text-lg">{examData.title}</h3>
        <p className="text-muted-foreground">{examData.subject}</p>
        <p className="mt-4">{examData.instructions}</p>
        <hr className="my-4" />
        <h4 className="font-bold mb-2">Questions ({examData.questions.length})</h4>
        <ul className="list-disc pl-5 space-y-2">
          {examData.questions.map((q, i) => (
            <li key={i}>{q.text} ({q.mark} marks)</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
```

This guide provides a solid foundation for building your multi-step exam creation feature. You can further enhance it by adding more robust validation, better UI components for adding questions, and more detailed feedback to the user.

---

### A Note on State Management (`useState` vs. Redux)

You might wonder why we are using `useState` for the form's state instead of putting it in the Redux store.

For this use case, local component state (`useState`) is the recommended approach. Here's why:

1. **Local & Transient State:** The form's data (current step, exam details, questions) is only relevant within the `ExamCreation` component and only for the time the user is filling out the form. It's not global application state.
2. **Simplicity & Encapsulation:** Using `useState` keeps the component self-contained and easier to understand. It avoids adding unnecessary complexity and boilerplate that would come with creating a Redux slice for temporary form data.
3. **Clean Global Store:** It prevents the global Redux store from being cluttered with data that isn't shared across the application.

We are already using RTK Query (which is part of Redux) for its intended purpose: managing server state and API communication. For UI state that is local to a component, `useState` is the simpler and more appropriate tool.
