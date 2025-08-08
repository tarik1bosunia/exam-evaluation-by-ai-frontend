import { apiSlice } from "./apiSlice";

interface Question {
    id: number;
    text: string;
    ideal_answer: string;
    instructions?: string;
    mark: number;
    created_at: string;
    updated_at: string;
}

interface Exam {
    id: number;
    title: string;
    subject: string;
    instructions: string;
    questions: Question[];
    created_at: string;
    updated_at: string;
}

interface ExamData {
    title: string;
    subject: string;
    instructions: string;
    questions: Omit<Question, "id" | "created_at" | "updated_at">[];
}


export const examApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createExam: builder.mutation<Exam, ExamData>({
            query: (examData) => ({
                url: '/core/exams/create/',
                method: 'POST',
                body: examData,
            }),
            invalidatesTags: ['Exam'],
        }),
    }),
});

export const { useCreateExamMutation } = examApi;