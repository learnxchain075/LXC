export interface IPyqForm {
    question: File | null;
    solution: File | null;
    subjectId: string;
    classId: string;
    uploaderId: string;
    topic?: string;
}

export interface IPyqResponse {
    id: string;
    question: string;
    solution: string;
    subjectId: string;
    classId: string;
    uploaderId: string;
    createdAt: string;
    updatedAt: string;
}