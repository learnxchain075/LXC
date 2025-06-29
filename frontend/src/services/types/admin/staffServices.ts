export interface IStaffBase {
    id?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    bloodType?: string;
    sex?: string;
    profilePic?: File;
    schoolId: string;
}
  