export interface Ilesson {
    name: string;
    day: string;
    startTime: Date;
    endTime: Date;
    subjectId: string;
    classId: string;
    teacherId: string;
    section?:string;
    id?:string;

}