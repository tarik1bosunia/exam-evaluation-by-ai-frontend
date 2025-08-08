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