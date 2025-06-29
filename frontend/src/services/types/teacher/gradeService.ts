export interface Igrade {
  level: number;
  grade: string;
  marksFrom: number;
  marksUpto: number;
  gradePoint: number;
  status: string;
  description?: string;
  studentId?: string;
} 