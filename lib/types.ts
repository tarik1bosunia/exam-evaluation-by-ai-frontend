export interface Question {
    id?: number; // Optional for new questions
    text: string;
    ideal_answer: string;
    instructions?: string;
    mark: number;
    created_at?: string;
    updated_at?: string;
}

export interface Exam {
    id: number;
    title: string;
    subject: string;
    instructions: string;
    questions: Question[];
    created_at: string;
    updated_at: string;
}

// Used for both creating and updating exams
export type ExamData = Omit<Exam, 'id' | 'created_at' | 'updated_at'>;