import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Student } from "../types/parents/parentTypes";
import { GuardianDetails } from "../types/parents/gurdainTypes";


/**
 * Fetches a guardian by its ID, including associated student info.
 *
 * @param id - The unique identifier of the guardian.
 * @returns AxiosResponse with a payload containing the guardian object.
 */
export const getGuardianById = async (
  id: string
): Promise<AxiosResponse<{ success: boolean; data: GuardianDetails }>> => {
  return BaseApi.getRequest(`/school/guardians/${id}`);
};

/**
 * Fetches the students associated with a specific guardian.
 *
 * @param guardianId - The unique identifier of the guardian.
 * @returns AxiosResponse with a payload containing an array of student objects.
 */
export const getChildrenByGuardian = async (
  guardianId: string
): Promise<AxiosResponse<{ success: boolean; data: Student[] }>> => {
  return BaseApi.getRequest(`/school/guardians/${guardianId}/children`);
};

/**
 * Fetches all guardians whose children are enrolled in the specified school.
 *
 * @param schoolId - The unique identifier of the school.
 * @returns AxiosResponse with a payload containing an array of guardian objects.
 */
export const getGuardiansBySchool = async (
  schoolId: string
): Promise<AxiosResponse<{ success: boolean; data: GuardianDetails[] }>> => {
  return BaseApi.getRequest(`/schools/${schoolId}/guardians`);
};




// router.get('/admin/school/guardians', getAllGuardians);
// router.get('/student/:studentId/guardian', getGuardianOfStudent);
// router.get('/school/:schoolId/guardians', getGuardiansOfSchool);
// router.put('/student/:studentId/guardian', updateGuardian);
// router.delete('/student/:studentId/guardian', deleteGuardian);
export const getAllGuardians = async (): Promise<AxiosResponse<{ success: boolean; data: GuardianDetails[] }>> => {
  return BaseApi.getRequest(`/admin/school/guardians`);
};
export const getGuardianOfStudent = async (
  studentId: string
): Promise<AxiosResponse<{ success: boolean; data: GuardianDetails }>> => {
  return BaseApi.getRequest(`/student/${studentId}/guardian`);
};
export const getGuardianOfSchool = async (
  schoolId: string
): Promise<AxiosResponse<any>> => {
  return BaseApi.getRequest(`/school/${schoolId}/guardians`);
};
export const updateGuardian = async (
  studentId: string,
  updatedData: Partial<GuardianDetails>
): Promise<AxiosResponse<{ success: boolean; data: GuardianDetails }>> => {
  return BaseApi.putRequest(`/student/${studentId}/guardian`, updatedData as any);
};
export const deleteGuardian = async (
  studentId: string
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
  return BaseApi.deleteRequest(`/student/${studentId}/guardian`);
};
