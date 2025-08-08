import { apiSlice } from "./apiSlice";

import { Exam, ExamData } from "@/lib/types";


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

        updateExam: builder.mutation<Exam, { id: number; examData: Partial<ExamData> }>({
            query: ({ id, examData }) => ({
                url: `/core/exams/${id}/`,
                method: 'PUT', // or 'PATCH' if you allow partial updates
                body: examData,
            }),
            // Invalidate the specific exam cache and the list cache
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