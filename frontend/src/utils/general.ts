import { UserRole } from "../config/constants";
import { all_routes } from "../router/all_routes";

export const getBaseUrl = (isLoggedIn: boolean, role: string) => {
  let returnValue = `/`;

  if (isLoggedIn) {
    if (role === UserRole.superadmin) {
      returnValue = `${all_routes.superAdminDashboard}`;
    }

    if (role === UserRole.admin) {
      returnValue = `${all_routes.adminDashboard}`;
    }

    if (role === UserRole.teacher) {
      returnValue = `${all_routes.teacherDashboard}`;
    }
  }

  return returnValue;
};

/**
 * Get student ID from localStorage with proper error handling
 * @returns student ID or null if not found
 */
export const getStudentId = (): string | null => {
  const studentId = localStorage.getItem("studentId");
  return studentId;
};

/**
 * Set student ID in localStorage with validation
 * @param studentId - The student ID to set
 */
export const setStudentId = (studentId: string): void => {
  if (studentId && studentId.trim()) {
    localStorage.setItem("studentId", studentId.trim());
  }
};
