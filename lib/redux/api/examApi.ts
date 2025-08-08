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

        getExams: builder.query<Exam[], void>({
            query: () => '/core/exams/',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Exam' as const, id })),
                        { type: 'Exam', id: 'LIST' },
                    ]
                    : [{ type: 'Exam', id: 'LIST' }],
        }),

        getExamById: builder.query<Exam, number>({
            query: (id) => `/core/exams/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Exam', id }],
        }),
    }),
});

export const { useCreateExamMutation, useGetExamsQuery, useGetExamByIdQuery } = examApi;