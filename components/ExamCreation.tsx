"use client";

import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateExamMutation } from "@/lib/redux/api/examApi";
import { Button } from "@/components/ui/button";
import { ExamDetailsStep } from "./ExamDetailsStep";
import { QuestionsStep } from "./QuestionsStep";
import { ReviewStep } from "./ReviewStep";

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