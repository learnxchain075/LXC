import BaseApi from '../BaseApi';

export const getSchoolFees = async (schoolId: string) => {
  return await BaseApi.getRequest(`/school/fees/school/${schoolId}`);
}; 