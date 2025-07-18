import { authorize } from './auth';

export const isSuperAdmin = authorize(['SUPER_ADMIN']);
export const isSchoolAdmin = authorize(['SCHOOL_ADMIN']);
