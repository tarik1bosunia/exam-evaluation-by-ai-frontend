import { apiSlice } from "./apiSlice";

interface FileUploadResponse {
    id: number;
    title: string;
    pdf_file: string;
    uploaded_at: string;
}

interface FileUploadRequest {
    title: string;
    pdf_file: File;
}

export const submissionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadPdf: builder.mutation<FileUploadResponse, FormData>({
            query: (formData) => ({
                url: '/core/upload/',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['FileUpload'],
        }),
    }),
});

export const { useUploadPdfMutation } = submissionApi;