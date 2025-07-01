export const all_routes = {



  // ************************************ Super Admin Routes *********************************************************

  superAdminDashboard: "/super-dashboard",


  // membership routes
  membershipplan: "/membership-plans",
  membershipAddon: "/membership-addons",
  membershipTransaction: "/membership-transactions",
  membershipcard: "/membership-card",
  CouponManager: "/coupon-manager",


  addSchools: "/super-admin/add-schools",
  getSchools: "/super-admin/get-schools",
  setSchoolLocation: "/super-admin/set-school-location/:schoolId",
  featuresRequestList: "/super-admin/features-request-list",
  schoolProfile: "/superadmin/school/:schoolId",
  logs: "/super-admin/logs",
  // Plan Subscriptions
  schoolPlanSubscription: "/super-admin/school-subscribe",



  // ************************************  Admin Routes *********************************************************

  adminDashboard: "/admin-dashboard",




  requestFeatures: "/admin/request-features",



  schoolProfilePage: "/school-profile-page/:schoolId",


  // ************************************  Teacher Routes *********************************************************
  teacherDashboard: "/teacher-dashboard",
  markFaceAttendance: "/teacher/mark-face-attendance",
  addExam: "/teacher/addexam",
  uplaodPyq: "/teacher/pyqUpload",
  assignment: "/teacher/assignment",
  classesLists: "/teacher/classesLists",
  teacherLists: "/teacher/teacherlists",
  FeesManagements: "/students/fee-management",
  payfee: "/school/student/payfee",
  gettheirstudent: "/school/teacher/student",
  homeclasses: "/school/teacher/homeclasses",
  MyClassesWithStudents: "/school/teacher/my-classes-with-students",
  AcademicUploads: "/school/teacher/academic-uploads/classs-uploads",
  SelfEnhancement: "/school/teacher/self-enhancement",
  DoubtForum: "/school/teacher/doubt-forum",
  ClassesRegisteradmin: "/school/teacher/classes-register",
  // ************************************ Student Routes *********************************************************

  studentDashboard: "/student-dashboard",
  Attendancechartstudent: "/student/attendance",
  AcademicResourcesstudent: "/student/academic-resources",
  noticeBoardstudent: "/student/notice-board",
  FeesOverviewstudent: "/student/fees-overview",
  studenthomedashboard: "/student/home-dashboard",
  studentlearderboard: "/student/leaderboard",
  // ************************************ Parents  Routes *********************************************************


  parentDashboard: "/parent-dashboard",


  // ************************************ Accounts Routes *********************************************************

  accountsDashboard: "/accounts-dashboard",



  // ************************************ Hostel Routes *********************************************************

  hostelDashboard: "/hostel-dashboard",

  // ************************************ Library Routes *********************************************************


  libraryDashboard: "/library-dashboard",


  // ************************************ Trnasport Routes *********************************************************



  transportDashboard: "/transport-dashboard",




  // ************************************ Common  Routes *********************************************************

  blankPage: "/blank-page",
  calendar: "/calendar",
  dataTables: "/data-tables",
  tablesBasic: "/tables-basic",
  notes: "/notes",
  comingSoon: "/coming-soon",
  vistor: "/vistor",
  vistordetails: "/vistorsdetails",

  // auth routes routes
  login: "/",  //for logout
  login2: "/login-2",
  login3: "/login-3",
  register: "/register",
  register2: "/register-2",
  register3: "/register-3",
  forgotPassword: "/forgot-password",
  forgotPassword2: "/forgot-password-2",
  forgotPassword3: "/forgot-password-3",
  twoStepVerification: "/two-step-verification",
  twoStepVerification2: "/two-step-verification-2",
  twoStepVerification3: "/two-step-verification-3",
  success: "/success",
  emailVerification: "/email-verification",
  emailVerification2: "/email-verification-2",
  emailVerification3: "/email-verification-3",
  lockScreen: "/lock-screen",
  resetPassword: "/reset-password",
  resetPassword2: "/reset-password-2",
  resetPassword3: "/reset-password-3",
  resetPasswordSuccess: "/reset-password-success",
  resetPasswordSuccess2: "/reset-password-success-2",
  resetPasswordSuccess3: "/reset-password-success-3",


  // pages routes
  error404: "/error-404",
  error500: "/error-500",
  underMaintenance: "/under-maintenance",

  // application routes
  todo: "/application/todo",
  email: "/application/email",
  videoCall: "/application/video-call",
  chat: "/application/chat",
  audioCall: "/application/audio-call",
  callHistory: "/application/call-history",
  fileManager: "/application/file-manager",

  //page module
  profile: "/pages/profile",
  activity: "/pages/activities",



  //lxc-home
  home: "/home",
  aboutUs: "/about-us",
  ourServices: "/our-services",
  signIn: "/sign-in",
  signUp: "/schedule-demo",
  contactus: "/contactus",
  terms: "/terms",
  privacyPolicy: "/privacy-policy",
  blog: "/blog",
  blogDetails: "/blog-details",
 
addbustopadmin: "/add-bus-stop-admin",
  RefundPolicyPage: "/refund-policy",




  // settings routes
  customFields: "/app-settings/custom-fields",
  invoiceSettings: "/app-settings/invoice-settings",

  bankAccount: "/financial-settings/bank-ccount",
  paymentGateways: "/financial-settings/payment-gateways",
  taxRates: "/financial-settings/tax-rates",

  schoolSettings: "/academic-settings/school-settings",
  religion: "/academic-settings/religion",

  connectedApps: "/general-settings/connected-apps",
  notificationssettings: "/general-settings/notifications-settings",
  profilesettings: "/general-settings/profile-settings",
  securitysettings: "/general-settings/security-settings",

  banIpAddress: "/other-settings/ban-ip-address",
  storage: "/other-settings/storage",

  emailSettings: "/system-settings/email-settings",
  emailTemplates: "/system-settings/email-templates",
  gdprCookies: "/system-settings/gdpr-cookies",
  smsSettings: "/system-settings/sms-settings",
  optSettings: "/system-settings/otp-settings",

  socialAuthentication: "/website-settings/social-authentication",
  companySettings: "/website-settings/company-settings",
  language: "/website-settings/language",
  localization: "/website-settings/localization",
  preference: "/website-settings/preference",
  prefixes: "/website-settings/prefixes",



  //content routes
  pages: "/content/pages",
  cities: "/content/cities",
  states: "/content/states",
  testimonials: "/content/testimonials",
  countries: "/content/countries",
  faq: "/content/faq",
  // blog
  allBlogs: "/content/all-blogs",
  blogCategories: "/content/blog-categories",
  blogComments: "/content/blog-comments",
  blogTags: "/content/blog-tags",

  //userManagement routes
  deleteRequest: "/user-management/delete-request",
  rolesPermissions: "/user-management/roles-permissions",
  manageusers: "/user-management/manage-users",
  permissions: "/user-management/permissions",

  //support routes
  contactMessages: "/support/contact-messages",
  tickets: "/support/tickets",
  ticketGrid: "/support/ticket-grid",
  ticketDetails: "/support/ticket-details",
  ticketDetail: "/support/ticket-detail",
  demoRequest: "/demo-requests",


  // Peoples Module
  studentGrid: "/student/student-grid",
  studentPromotion: "/student/student-promotion",
  studentDetail: "/student/student-details",
  studentTimeTable: "/student/student-time-table",
  studentLeaves: "/student/student-leaves",
  studentFees: "/student/student-fees",
  studentResult: "/student/student-result",
  studentLibrary: "/student/student-library",
  studentList: "/student/student-list",
  studentIdCard: "/student/id-card",
  addStudent: "/student/add-student",
  editStudent: "/student/edit-student",
  teacherDetails: "/teacher/teacher-details",
  teacherGrid: "/teacher/teacher-grid",
  teacherList: "/teacher/teacher-list",
  addTeacher: "/teacher/add-teacher",
  editTeacher: "/teacher/edit-teacher",
  teacherLibrary: "/teacher/teacher-library",
  teacherSalary: "/teacher/teacher-salary",
  teacherLeaves: "/teacher/teacher-leaves",
  teachersRoutine: "/teacher/teacher-routine",
  parentGrid: "/parent/parent-grid",
  parentList: "/parent/parent-list",
  guardiansGrid: "/parent/guardians-grid",
  guardiansList: "/parent/guardians-list",
addsection:"/student/add-section",



  // Management
  feesGroup: "/management/fees-group",
  feesType: "/management/fees-type",
  feesMaster: "/management/fees-master",
  feesAssign: "/management/fees-assign",
  collectFees: "/management/collect-fees",
  libraryMembers: "/management/library-members",
  libraryIssueBook: "/management/library-issue-book",
  libraryBooks: "/management/library-books",
  libraryReturn: "/management/library-return",
  playerList: "/management/players",
  sportsList: "/management/sports",
  hostelList: "/management/hostel-list",
  hostelType: "/management/hostel-type",
  hostelRoom: "/management/hostel-rooms",
  transportAssignVehicle: "/management/transport-assign-vehicle",
  transportVehicle: "/management/transport-vehicle",
  transportVehicleDrivers: "/management/transport-vehicle-drivers",
  transportPickupPoints: "/management/transport-pickup-points",
  transportRoutes: "/management/transport-routes",

  //added
  addhostel: "/people/AddHostelForm",
  addlibrary: "/people/addlibrary",
  addtransport: "/people/addtransport",


  //Academic module
  AssignTeacherToClass: "/academic/assign-teacher-to-class",
  AcademicReason: "/academic/academic-reason",
  classSyllabus: "/academic/class-syllabus",
  classSubject: "/academic/class-subject",
  classSection: "/academic/class-section",
  classRoom: "/academic/class-room",
  classRoutine: "/academic/class-routine",
  sheduleClasses: "/academic/schedule-classes",
  classes: "/academic/classes",
  classHomeWork: "/academic/class-home-work",
  exam: "/academic/exam",
  examSchedule: "/academic/exam-schedule",
  grade: "/academic/grade",
  examResult: "/academic/exam-result",
  examAttendance: "/academic/exam-attendance",
  classTimetable: "/academic/class-time-table",
  classStudent: "/academic/class-student",
  //Hrm module
  staff: "/hrm/staff",
  departments: "/hrm/departments",
  payroll: "/hrm/payroll",
  holidays: "/hrm/holidays",
  designation: "/hrm/designation",
  listLeaves: "/hrm/list-leaves",
  staffDetails: "/hrm/staff-details",
  staffPayroll: "/hrm/staff-payroll",
  staffLeave: "/hrm/staff-leave",

  approveRequest: "/hrm/approve-request",
  studentAttendance: "/hrm/student-attendance",
  teacherAttendance: "/hrm/teacher-attendance",
  teacherFaceData: "/admin/teacher-face-data",
  staffAttendance: "/hrm/staff-attendance",
  addStaff: "/hrm/add-staff",
  editStaff: "/hrm/edit-staff",
  staffsAttendance: "/hrm/staffs-attendance",

  layoutDefault: "/layout-default",
  layoutMini: "/layout-mini",
  layoutRtl: "/layout-rtl",
  layoutBox: "/layout-box",
  layoutDark: "/layout-dark",

  // finance & accounts routes
  accountsIncome: "/accounts/accounts-income",
  accountsInvoices: "/accounts/accounts-invoices",
  accountsTransactions: "/accounts/accounts-transactions",
  expense: "/accounts/expense",
  expenseCategory: "/accounts/expense-category",
  invoice: "/accounts/invoice",
  addInvoice: "/accounts/add-invoice",
  editInvoice: "/accounts/edit-invoice",

  // announcements routes
  events: "/announcements/events",
  noticeBoard: "/announcements/notice-board",

  //Report
  attendanceReport: "/report/attendance-report",
  classReport: "/report/class-report",
  studentReport: "/report/student-report",
  gradeReport: "/report/grade-report",
  leaveReport: "/report/leave-report",
  feesReport: "/report/fees-report",
  teacherReport: "/report/teacher-report",
  staffReport: "/report/staff-report",
  studentAttendanceType: "/report/student-attendance-type",
  dailyAttendance: "/report/daily-attendance",
  studentDayWise: "/report/student-day-wise",
  teacherDayWise: "/report/teacher-day-wise",
  staffDayWise: "/report/staff-day-wise",


};
