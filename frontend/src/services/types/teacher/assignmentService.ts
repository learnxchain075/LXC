export interface Iassignment {
    title: string;
    description: string;
    subjectId: string;
    classId: string;
    dueDate: Date | string;
    lessonId: string;
    attachment?: File;
    id?:string;
    sectionId?: string;
}