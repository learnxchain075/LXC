/**
 * User sex enum matching backend
 */
export enum UserSex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHERS = "OTHERS"
}

/**
 * Marital status enum matching backend
 */
export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED'
}

/**
 * Active status enum matching backend
 */
export enum ActiveStatus {
    ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED"
  
}
export enum ActiveStatusstudent {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED"
}

/**
 * Login response interface
 */
export interface ILoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: IUserObj;
  permissions: IUserPermission[];
  error?: string;
}

/**
 * User object interface matching backend schema
 */
export interface IUserObj {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  bloodType: string;
  sex: UserSex;
  schoolId?: string;
  reputation: number;
  coins: number;
  redeemedBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User permission interface matching backend schema
 */
export interface IUserPermission {
  id: string;
  userId: string;
  moduleId: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  managePermissions: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Register school form interface
 */
export interface IRegisterSchool {
  schoolName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  sex: UserSex;
  bloodType: string;
  profilePic?: File;
}

/**
 * Teacher form interface matching backend validation schema
 */
export interface ITeacherForm {
  name: string;
  sex: UserSex;
  email: string;
  phone: string;
  bloodType: string;
  teacherSchoolId: string;
  dateofJoin: string | Date;
  fatherName: string;
  motherName: string;
  dateOfBirth: string | Date;
  maritalStatus: MaritalStatus;
  languagesKnown: string;
  qualification: string;
  workExperience: string;
  previousSchool: string;
  previousSchoolAddress: string;
  previousSchoolPhone: string;
  panNumber?: string;
  status?: ActiveStatus;
  salary: number;
  contractType?: string;
  dateOfPayment?: string | Date;
  medicalLeave?: string;
  casualLeave?: string;
  maternityLeave?: string;
  sickLeave?: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  branchName: string;
  route?: string;
  hostelName?: string;
  roomNumber?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  schoolId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  Resume?: File;
  joiningLetter?: File;
  profilePic?: File;
  departmentId?: string;
  designationId?: string;
}

/**
 * Student form interface matching backend validation schema
 */
export interface IStudentForm {
  id?: string;
  email: string;
  phone: string;
  name: string;
  sex: UserSex;
  bloodType: string;
  primaryContact: string;
  academicYear: string;
  admissionNo: string;
  admissionDate: Date;
  rollNo: string;
  status?: ActiveStatusstudent;
  dateOfBirth: Date;
  Religion: string;
  category: string;
  caste: string;
  motherTongue: string;
  languagesKnown: string;

  fatherName: string;
  fatheremail?: string;
  fatherPhone: string;
  fatherOccupation: string;

  motherName: string;
  motherOccupation: string;
  motherEmail?: string;
  motherPhone: string;

  guardianName: string;
  guardianRelation: string;
  guardianEmail: string;
  guardianPhone: string;
  guardianOccupation: string;
  guardianAddress: string;

  areSiblingStudying: string;
  siblingName: string;
  siblingClass: string;
  siblingRollNo: string;
  siblingAdmissionNo: string;

  currentAddress: string;
  permanentAddress: string;

  vehicleNumber?: string;
  pickUpPoint?: string;
  
  hostelName?: string;
  roomNumber?: string;

  medicalCondition: string;
  allergies: string;
  medicationName: string;

  schoolName?: string;
  schoolId: string;
  classId: string;
  section: string;

  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  house?: string;

  profilePic?: File;
  medicalCertificate?: File;
  transferCertificate?: File;

  // User object for API responses
  user?: IUserObj;
}

/**
 * Accountant form interface
 */
export interface IAccountantForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  sex: UserSex;
  bloodType: string;
  schoolId: string;
  profilePic?: File;
}

/**
 * Hostel form interface
 */
export interface IHostelForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  sex: UserSex;
  bloodType: string;
  schoolId: string;
  profilePic?: File;
  hostelName: string;
  capacity: string;
}

/**
 * Transport form interface
 */
export interface ITransportForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  sex: UserSex;
  bloodType: string;
  schoolId: string;
  profilePic?: File;
}

/**
 * Library form interface
 */
export interface ILibraryForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  sex: UserSex;
  bloodType: string;
  schoolId: string;
  profilePic?: File;
}

/**
 * Password reset token interface
 */
export interface IPasswordResetToken {
  id: string;
  token: string;
  userId: string;
  email: string;
  expiresAt: Date;
  createdAt: Date;
}