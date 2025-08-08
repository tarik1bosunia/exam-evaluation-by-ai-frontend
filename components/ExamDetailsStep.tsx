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