export interface IVisitorForm {
    name: string;
    phone: string;
    email?:string;
    purpose:string;
    validFrom:Date;
    validUntil:Date;
    // entryTime?:Date;
    // exitTime?:Date;
    schoolId: string;
    // classId?: string;
    // token: string;
}