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