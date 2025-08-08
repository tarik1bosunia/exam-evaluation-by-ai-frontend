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