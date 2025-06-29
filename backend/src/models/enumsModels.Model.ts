import { z } from 'zod';

// Enum definitions
const UserSexEnum = z.enum(['MALE', 'FEMALE', 'OTHER'], {
  errorMap: () => ({ message: 'Invalid gender value' }),
});

const RoleEnum = z.enum(['superadmin', 'admin', 'teacher', 'student', 'parent'], {
  errorMap: () => ({ message: 'Invalid role value' }),
});

const EmployeeTypeEnum = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACTOR'], {
  errorMap: () => ({ message: 'Invalid employee type' }),
});







export { UserSexEnum, RoleEnum, EmployeeTypeEnum };