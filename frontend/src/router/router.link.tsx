import { Route } from "react-router";
import { all_routes } from "./all_routes";

import Ribbon from "antd/es/badge/Ribbon";

import { Video } from "react-feather";
import AudioCall from "../apps/application/call/audioCall";
import CallHistory from "../apps/application/call/callHistory";
import Videocall from "../apps/application/call/videoCall";
import Chat from "../apps/application/chat";
import Email from "../apps/application/email";
import FileManager from "../apps/application/fileManager";
import Notes from "../apps/application/notes";
import Todo from "../apps/application/todo";
import EmailVerification from "../pages/auth/emailVerification/emailVerification";
import ForgotPassword from "../lxc-home/pages/forgot-password";
import Login from "../pages/auth/login/login";
import ResetPassword from "../lxc-home/pages/reset-password";
import ResetPasswordSuccess from "../lxc-home/pages/reset-password-success";
import AccountsIncome from "../pages/Accounts/accounts/accounts-income";
import AccountsInvoices from "../pages/Accounts/accounts/accounts-invoices";
import AccountsTransactions from "../pages/Accounts/accounts/accounts-transactions";
import AddInvoice from "../pages/Accounts/accounts/add-invoice";
import EditInvoice from "../pages/Accounts/accounts/edit-invoice";
import Expense from "../pages/Accounts/accounts/expense";
import ExpensesCategory from "../pages/Accounts/accounts/expenses-category";
import Invoice from "../pages/Accounts/accounts/invoice";
import AdminDashboard from "../dashboard/adminDashboard";
import AcademicReason from "../pages/Admin/academic/academic-reason";
import ClassHomeWork from "../pages/Admin/academic/class-home-work";
import ClassRoom from "../pages/Admin/academic/class-room";
import ClassRoutine from "../pages/Admin/academic/class-routine";
import ClassSection from "../pages/Admin/academic/class-section";
import ClassSubject from "../pages/Admin/academic/class-subject";
import ClassSyllabus from "../pages/Admin/academic/class-syllabus";
import ClassTimetable from "../pages/Admin/academic/class-timetable";
import Classes from "../pages/Admin/academic/classes";
import Exam from "../pages/Admin/academic/examinations/exam";
import ExamAttendance from "../pages/Admin/academic/examinations/exam-attendance";
import ExamResult from "../pages/Admin/academic/examinations/exam-results";
import ExamSchedule from "../pages/Admin/academic/examinations/exam-schedule";
import Grade from "../pages/Admin/academic/examinations/grade";
import ScheduleClasses from "../pages/Admin/academic/schedule-classes";
import GuardianGrid from "../pages/Admin/peoples/guardian/guardian-grid";
import GuardianList from "../pages/Admin/peoples/guardian/guardian-list";
import ParentGrid from "../pages/Admin/peoples/parent/parent-grid";
import ParentList from "../pages/Admin/peoples/parent/parent-list";
import AddStudent from "../pages/Admin/peoples/students/add-student";
import StudentDetails from "../pages/Admin/peoples/students/student-details/studentDetails";
import StudentFees from "../pages/Admin/peoples/students/student-details/studentFees";
import StudentLeaves from "../pages/Admin/peoples/students/student-details/studentLeaves";
import StudentLibrary from "../pages/Admin/peoples/students/student-details/studentLibrary";
import StudentResult from "../pages/Admin/peoples/students/student-details/studentResult";
import StudentTimeTable from "../pages/Admin/peoples/students/student-details/studentTimeTable";
import StudentGrid from "../pages/Admin/peoples/students/student-grid";
import StudentList from "../pages/Admin/peoples/students/student-list";
import StudentPromotion from "../pages/Admin/peoples/students/student-promotion";
import GetSchools from "../pages/SuperAdmin/super-admin/getSchools";
import SetSchoolLocation from "../pages/SuperAdmin/super-admin/set-school-location";
import RegisterSchool from "../pages/SuperAdmin/super-admin/registerSchools";
import TeacherDetails from "../pages/Admin/peoples/teacher/teacher-details/teacherDetails";
import TeacherLeave from "../pages/Admin/peoples/teacher/teacher-details/teacherLeave";
import TeacherLibrary from "../pages/Admin/peoples/teacher/teacher-details/teacherLibrary";
import TeacherSalary from "../pages/Admin/peoples/teacher/teacher-details/teacherSalary";
import TeachersRoutine from "../pages/Admin/peoples/teacher/teacher-details/teachersRoutine";
import TeacherGrid from "../pages/Admin/peoples/teacher/teacher-grid";
import TeacherList from "../pages/Admin/peoples/teacher/teacher-list";
import TeacherForm from "../pages/Admin/peoples/teacher/teacherForm";
import ParentDashboard from "../dashboard/parentDashboard";
import AttendanceReport from "../pages/report/attendance-report/attendanceReport";
import DailyAttendance from "../pages/report/attendance-report/dailyAttendance";
import StaffDayWise from "../pages/report/attendance-report/staffDayWise";
import StaffReport from "../pages/report/attendance-report/staffReport";
import StudentAttendanceType from "../pages/report/attendance-report/studentAttendanceType";
import StudentDayWise from "../pages/report/attendance-report/studentDayWise";
import TeacherDayWise from "../pages/report/attendance-report/teacherDayWise";
import TeacherReport from "../pages/report/attendance-report/teacherReport";
import ClassReport from "../pages/report/class-report/classReport";
import FeesReport from "../pages/report/fees-report/feesReport";
import GradeReport from "../pages/report/grade-report/gradeReport";
import LeaveReport from "../pages/report/leave-report/leaveReport";
import StudentReport from "../pages/report/student-report/studentReport";
import StudentDasboard from "../dashboard/studentDashboard";
import SuperAdminDashboard from "../dashboard/superadmindashboard";
import Events from "../pages/SuperAdmin/announcements/events";
import NoticeBoard from "../pages/SuperAdmin/announcements/notice-board";
import AllBlogs from "../pages/SuperAdmin/content/blog/allBlogs";
import BlogCategories from "../pages/SuperAdmin/content/blog/blogCategories";
import BlogComments from "../pages/SuperAdmin/content/blog/blogComments";
import BlogTags from "../pages/SuperAdmin/content/blog/blogTags";
import Faq from "../pages/SuperAdmin/content/faq";
import Cities from "../pages/SuperAdmin/content/location/cities";
import Countries from "../pages/SuperAdmin/content/location/countries";
import States from "../pages/SuperAdmin/content/location/states";
import Pages from "../pages/SuperAdmin/content/pages";
import Testimonials from "../pages/SuperAdmin/content/testimonials";
import StaffAttendance from "../pages/SuperAdmin/hrm/attendance/staff-attendance";
import StudentAttendance from "../pages/SuperAdmin/hrm/attendance/student-attendance";
import TeacherAttendance from "../pages/SuperAdmin/hrm/attendance/teacher-attendance";
import TeacherFaceDataPage from "../pages/Admin/teacher-face-data";
import MarkFaceAttendance from "../pages/Teacher/mark-face-attendance";
import Departments from "../pages/SuperAdmin/hrm/departments";
import Designation from "../pages/SuperAdmin/hrm/designation";
import Holiday from "../pages/SuperAdmin/hrm/holidays";
import ApproveRequest from "../pages/SuperAdmin/hrm/leaves/approve-request";
import ListLeaves from "../pages/SuperAdmin/hrm/leaves/list-leaves";
import Payroll from "../pages/SuperAdmin/hrm/payroll";
import AddStaff from "../pages/SuperAdmin/hrm/staff-list/add-staff";
import EditStaff from "../pages/SuperAdmin/hrm/staff-list/edit-staff";
import Staff from "../pages/SuperAdmin/hrm/staff-list/staff";
import StaffDetails from "../pages/SuperAdmin/hrm/staff-list/staff-details.tsx";
import StaffLeave from "../pages/SuperAdmin/hrm/staff-list/staff-leave";
import StaffPayRoll from "../pages/SuperAdmin/hrm/staff-list/staff-payroll.tsx";
import StaffsAttendance from "../pages/SuperAdmin/hrm/staff-list/staffs-attendance";

import CollectFees from "../pages/SuperAdmin/management/feescollection/collectFees";

import FeesAssign from "../pages/SuperAdmin/management/feescollection/feesAssign";
import FeesGroup from "../pages/SuperAdmin/management/feescollection/feesGroup";
import FeesMaster from "../pages/SuperAdmin/management/feescollection/feesMaster";
import FeesTypes from "../pages/SuperAdmin/management/feescollection/feesTypes";
import HostelList from "../pages/SuperAdmin/management/hostel/hostelList";
import HostelRooms from "../pages/SuperAdmin/management/hostel/hostelRooms";
import HostelType from "../pages/SuperAdmin/management/hostel/hostelType";
import Books from "../pages/SuperAdmin/management/library/books";
import IssueBook from "../pages/SuperAdmin/management/library/issuesBook";
import LibraryMember from "../pages/SuperAdmin/management/library/libraryMember";
import ReturnBook from "../pages/SuperAdmin/management/library/returnBook";
import PlayersList from "../pages/SuperAdmin/management/sports/playersList";
import SportsList from "../pages/SuperAdmin/management/sports/sportsList";
import TransportAssignVehicle from "../pages/SuperAdmin/management/transport/transportAssignVehicle";
import TransportPickupPoints from "../pages/SuperAdmin/management/transport/transportPickupPoints";
import TransportRoutes from "../pages/SuperAdmin/management/transport/transportRoutes";
import TransportVehicle from "../pages/SuperAdmin/management/transport/transportVehicle";
import TransportVehicleDrivers from "../pages/SuperAdmin/management/transport/transportVehicleDrivers";

import Membershipplan from "../pages/SuperAdmin/PlansMangePage/membershipplan";
import MembershipTransaction from "../pages/SuperAdmin/PlansMangePage/membershiptrasaction";
import Religion from "../pages/SuperAdmin/settings/academicSettings/religion";
import SchoolSettings from "../pages/SuperAdmin/settings/academicSettings/schoolSettings";
import CustomFields from "../pages/SuperAdmin/settings/appSettings/customFields";
import InvoiceSettings from "../pages/SuperAdmin/settings/appSettings/invoiceSettings";
import PaymentGateways from "../pages/SuperAdmin/settings/financialSettings/paymentGateways";
import TaxRates from "../pages/SuperAdmin/settings/financialSettings/taxRates";
import ConnectedApps from "../pages/SuperAdmin/settings/generalSettings/connectedApps";
import Notificationssettings from "../pages/SuperAdmin/settings/generalSettings/notifications";
import Profilesettings from "../pages/SuperAdmin/settings/generalSettings/profile";
import Securitysettings from "../pages/SuperAdmin/settings/generalSettings/security";
import BanIpAddress from "../pages/SuperAdmin/settings/otherSettings/banIpaddress";
import Emailtemplates from "../pages/SuperAdmin/settings/systemSettings/email-templates";
import EmailSettings from "../pages/SuperAdmin/settings/systemSettings/emailSettings";
import GdprCookies from "../pages/SuperAdmin/settings/systemSettings/gdprCookies";
import OtpSettings from "../pages/SuperAdmin/settings/systemSettings/otp-settings";
import SmsSettings from "../pages/SuperAdmin/settings/systemSettings/smsSettings";
import CompanySettings from "../pages/SuperAdmin/settings/websiteSettings/companySettings";
import Languagesettings from "../pages/SuperAdmin/settings/websiteSettings/language";
import Localization from "../pages/SuperAdmin/settings/websiteSettings/localization";
import Preference from "../pages/SuperAdmin/settings/websiteSettings/preference";
import Prefixes from "../pages/SuperAdmin/settings/websiteSettings/prefixes";
import Socialauthentication from "../pages/SuperAdmin/settings/websiteSettings/socialAuthentication";
import ContactMessages from "../pages/SuperAdmin/support/contactMessages";
import TicketDetails from "../pages/SuperAdmin/support/ticket-details";
import TicketDetail from "../pages/SuperAdmin/support/ticket-detail";
import TicketGrid from "../pages/SuperAdmin/support/ticket-grid";
import Tickets from "../pages/SuperAdmin/support/tickets";
import DeleteRequest from "../pages/SuperAdmin/userManagement/deleteRequest";
import Manageusers from "../pages/SuperAdmin/userManagement/manageusers";
import Permission from "../pages/SuperAdmin/userManagement/permission";
import RolesPermissions from "../pages/SuperAdmin/userManagement/rolesPermissions";
import TeacherDashboard from "../dashboard/teacherDashboard";
import BlankPage from "../pages/Common/blankPage";
import ComingSoon from "../pages/Common/comingSoon";
import Error404 from "../pages/Common/error/error-404";
import Error500 from "../pages/Common/error/error-500";
import Profile from "../pages/profile";
import NotificationActivities from "../pages/profile/activities";
import UnderMaintenance from "../pages/Common/underMaintenance";

import Calendar from "../apps/calendar";


import Storage from "../pages/SuperAdmin/settings/otherSettings/storage";

// super admin pages
import SuperAdminFetauresRequestListPage from "../pages/SuperAdmin/SuperAdminFetauresRequestListPage";

// Admin pages

import AdminRequestFetauresPage from "../pages/Admin/AdminRequestFetauresPage";
import path from "path";
import SchoolProfilePage from "../pages/SuperAdmin/SchoolProfilePage";
import MembershipAddon from "../pages/SuperAdmin/PlansMangePage/membershipaddon";
import AccountDashboard from "../dashboard/accountsDashboard";
import TransportDashboard from "../dashboard/transportDashboard";
import LibraryDashboard from "../dashboard/libraryDashboard";
import HostelDashboard from "../dashboard/hostelDashboard";
import AddHostelForm from "../pages/Admin/peoples/hostel";
import AddLibraryForm from "../pages/Admin/peoples/library";
import AddTransportForm from "../pages/Admin/peoples/transport";
import AddExam from "../pages/Teacher/addExam";
import PyqUpload from "../pages/Teacher/pyqUpload";
import Assignment from "../pages/Teacher/Assingment";
import Membershipplancard from "../pages/Admin/membershipCard";
import Classesshow from "../pages/Common/classShow";
import Teachershow from "../pages/teacherShow";
import FeesManagement from "../services/types/admin/fees/feeform";
import Vistor from "../pages/Admin/visitor/Vistor";
import VistorDetails from "../pages/Admin/visitor/VistorDetails";
import { PayFeeManagement } from "../pages/Common/payFeeManagement";
import CouponManager from "../pages/SuperAdmin/couponcode/CouponManager";
import Gettheirstudent from "../pages/Common/getTheirStudent";
import ClassStudent from "../pages/Admin/academic/class-student";
import Classeshome from "../pages/Common/homeclass";
import AssignTeacherToClass from "../pages/Common/assignclassToTeacher";
import MyClassesWithStudents from "../pages/Common/MyClassesWithStudents";
import AcademicUploads from "../pages/Common/AcademicUploads";
import SelfEnhancement from "../pages/Common/SelfEnhancement";
import DoubtForum from "../pages/Common/DoubtForum";
import FeesOverview from "../pages/Admin/peoples/students/student-details/FeesOverview";
import NoticeBoardstudent from "../pages/Admin/peoples/students/student-details/NoticeBoardstudent";
import Attendancechartstudent from "../pages/Admin/peoples/students/student-details/Attendancechartstudent";
import AcademicResources from "../pages/Admin/peoples/students/student-details/AcademicResources";
import Logs from "../pages/SuperAdmin/logs/page";

import SignIn from "../lxc-home/pages/sign-in";
import SignUp from "../lxc-home/pages/schedule-demo";

import Terms from "../lxc-home/pages/terms";
import PrivacyPolicy from "../lxc-home/pages/privacy-policy";
import RefundPolicy from "../lxc-home/pages/refund-policy";
import Blog from "../lxc-home/pages/blog";
import BlogDetails from "../lxc-home/pages/blog-details";
import AboutUs from "../lxc-home/pages/about-us";
import OurServices from "../lxc-home/pages/our-services";
import ContactUs from "../lxc-home/pages/ContactUs";
import Error from "../lxc-home/pages/Error";
import HomePage from "../lxc-home/pages/Home";
import PlansAccessPage from "../pages/SuperAdmin/plans-access";
import DemoBookingList from "../pages/SuperAdmin/demorequest/DemoBooking";
import HomeDashboard from "../pages/Admin/peoples/students/homedashboard";
import Leaderboard from "../pages/Admin/peoples/students/student-details/Leaderboard";
import ClassesRegister from "../pages/Admin/ClassesRegister";
import AddBusStop from "../pages/SuperAdmin/management/transport/addBusStop";
import RefundPolicyPage from "../lxc-home/pages/RefundPolicyPage";
import AddSectionModal from "../pages/Admin/AddSectionModal";
import StudentIdCardGenerator from "../pages/Admin/peoples/students/student-id-card";


const routes = all_routes;

export const publicRoutes = [



  // ************************************ Super Admin Routes *********************************************************
  {
    path: routes.superAdminDashboard,
    element: < SuperAdminDashboard />,
    route: Route,
    role: ["superadmin"]
  },
  {
    path: routes.addSchools,
    element: <RegisterSchool />,
    route: Route,
    role: ["superadmin"]

  },

  {
    path: routes.schoolProfile,
    element: <SchoolProfilePage />,
    route: Route,
    role: ["superadmin"]

  },
  {
    path: routes.CouponManager,
    element: <CouponManager />,
    route: Route,
    role: ["superadmin"]
  },
  {
    path: routes.getSchools,
    element: <GetSchools />,
    route: Route,
    role: ["superadmin"]
  },
  {
    path: routes.setSchoolLocation,
    element: <SetSchoolLocation />,
    route: Route,
    role: ["superadmin"]
  },
  {
    path: routes.featuresRequestList,
    element: <SuperAdminFetauresRequestListPage />,
    route: Route,
    role: ["superadmin"]
  },
  {
    path: routes.logs,
    element: <Logs />,
    route: Route,
    role: ["superadmin"]
  },
  {
    path: routes.schoolPlanSubscription,
    element: <PlansAccessPage />,
    route: Route,
    role: ["superadmin"]
  },
   {
    path: routes.addsection,
    element: < AddSectionModal/>,
    route: Route,
    role: []
  },
  {
    path: routes.demoRequest,
    element: <DemoBookingList />,
    route: Route,
    role: ["superadmin"]
  },


  // ************************************  Admin Routes *********************************************************

  {
    path: routes.adminDashboard,
    element: <AdminDashboard />,
    route: Route,
    role: ["admin"]
  },
  {
    path: routes.requestFeatures,
    element: <AdminRequestFetauresPage />,
    route: Route,
    role: ["admin"]
  },
  {
    path: routes.studentIdCard,
    element: <StudentIdCardGenerator />,
    route: Route,
    role: ["admin"]
  },

  // ************************************  Teacher Routes *********************************************************

  {

    path: routes.teacherDashboard,
    element: <TeacherDashboard />,
    route: Route,
    role: ["teacher"]
  },

  // ************************************  Student Routes *********************************************************
  {
    path: routes.studentDashboard,
    element: <StudentDasboard />,
    route: Route,
    role: ["student"]
  }, {
    path: routes.studenthomedashboard,
    element: <HomeDashboard />,
    route: Route,
    role: ["student"]
  },
  {
    path: routes.studentlearderboard,
    element: <Leaderboard />,
    route: Route,
    role: ["student"]
  },
  {
    path: routes.Attendancechartstudent,
    element: <Attendancechartstudent />,
    route: Route,
    role: ["student"]
  },
  {
    path: routes.FeesOverviewstudent,
    element: <FeesOverview />,
    route: Route,
    role: ["student"]
  },
  {
    path: routes.noticeBoardstudent,
    element: <NoticeBoardstudent />,
    route: Route,
    role: ["student"]
  },
  {
    path: routes.AcademicResourcesstudent,
    element: <AcademicResources />,
    route: Route,
    role: ["student"]
  },
  // ************************************  Parents Routes *********************************************************
  {
    path: routes.parentDashboard,
    element: <ParentDashboard />,
    route: Route,
    role: ["parent"]
  },


  // ************************************  Accounts Routes *********************************************************

  {
    path: routes.accountsDashboard,
    element: <AccountDashboard />,
    route: Route,
    role: ["superadmin", "admin", "accounts", "teacher", "student", "parent", "hostel", "transport", "library"]

  },

  // ************************************  Hostel Routes *********************************************************

  {
    path: routes.hostelDashboard,
    element: <HostelDashboard />,
    route: Route,
    role: ["superadmin", "admin", "hostel", "teacher", "student", "parent", "accounts", "transport", "library"]
  },

  // ************************************  Library Routes *********************************************************

  {
    path: routes.libraryDashboard,
    element: <LibraryDashboard />,
    route: Route,
    role: ["superadmin", "admin", "library", "teacher", "student", "parent", "accounts", "hostel", "transport"]
  },
  // ************************************  Transport Routes *********************************************************



  {
    path: routes.transportDashboard,
    element: <TransportDashboard />,
    route: Route,
    role: ["superadmin", "admin", "transport", "teacher", "student", "parent", "accounts", "hostel", "library"]
  },

  // ************************************  Common  Routes *********************************************************

  {
    path: routes.vistor,
    element: <Vistor />,
    route: Route,
    role: ["admin", "teacher"]
  },


  {
    path: routes.vistordetails,
    element: <VistorDetails />,
    route: Route,
    role: ["admin", "teacher"]
  },
  // {
  //   path: routes.vistorsdetails,
  //   element: <VistorDetails  />,
  //   route: Route,
  // },


























  {
    path: routes.audioCall,
    element: <AudioCall />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.callHistory,
    element: <CallHistory />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.callHistory,
    element: <CallHistory />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },

  {
    path: routes.connectedApps,
    element: <ConnectedApps />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.countries,
    element: <Countries />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.blankPage,
    element: <BlankPage />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.calendar,
    element: <Calendar />,
    route: Route,
    role: []
  },

  {
    path: routes.membershipplan,
    element: <Membershipplan />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],

  },
  {
    path: routes.membershipAddon,
    element: <MembershipAddon />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.membershipTransaction,
    element: <MembershipTransaction />,
    route: Route,
    role: ["superadmin"]

  },
  {
    path: routes.membershipcard,
    element: <Membershipplancard />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.notes,
    element: <Notes />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.countries,
    element: <Countries />,
    route: Route,
    role: [],
  },
  {
    path: routes.customFields,
    element: <CustomFields />,
    route: Route,
    role: [],
  },



  {
    path: routes.deleteRequest,
    element: <DeleteRequest />,
    route: Route,
    role: []

  },
  {
    path: routes.cities,
    element: <Cities />,
    route: Route,
    role: []
  },
  {
    path: routes.banIpAddress,
    element: <BanIpAddress />,
    route: Route,
    role: ["superadmin"]
  },
  // {
  //   path: routes.localization,
  //   element: <Localization />,
  //   route: Route,
  // },
  {
    path: routes.preference,
    element: <Preference />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.todo,
    element: <Todo />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.email,
    element: <Email />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.videoCall,
    element: <Videocall />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.chat,
    element: <Chat />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.pages,
    element: <Pages />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },

  {
    path: routes.fileManager,
    element: <FileManager />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.faq,
    element: <Faq />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],

  },

  {
    path: routes.states,
    element: <States />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.testimonials,
    element: <Testimonials />,
    route: Route,
    role: ["superadmin", "admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  // {
  //   path: routes.clipboard,
  //   element: <ClipBoard />,
  //   route: Route,
  // },
  // {
  //   path: routes.counter,
  //   element: <Counter />,
  //   route: Route,
  // },
  // {
  //   path: routes.dragandDrop,
  //   element: <DragAndDrop />,
  //   route: Route,
  // },
  // {
  //   path: routes.rating,
  //   element: <Rating />,
  //   route: Route,
  // },
  // {
  //   path: routes.stickyNotes,
  //   element: <Stickynote />,
  //   route: Route,
  // },
  // {
  //   path: routes.textEditor,
  //   element: <TextEditor />,
  //   route: Route,
  // },
  // {
  //   path: routes.timeLine,
  //   element: <Timeline />,
  //   route: Route,
  // },
  // {
  //   path: routes.scrollBar,
  //   element: <Scrollbar />,
  //   route: Route,
  // },
  // {
  //   path: routes.apexChat,
  //   element: <Apexchart />,
  //   route: Route,
  // },
  // {
  //   path: routes.featherIcons,
  //   element: <FeatherIcons />,
  //   route: Route,
  // },
  // {
  //   path: routes.falgIcons,
  //   element: <FeatherIcons />,
  //   route: Route,
  // },
  // {
  //   path: routes.fantawesome,
  //   element: <FontawesomeIcons />,
  //   route: Route,
  // },
  // {
  //   path: routes.fantawesome,
  //   element: <FontawesomeIcons />,
  //   route: Route,
  // },
  // {
  //   path: routes.materialIcon,
  //   element: <MaterialIcons />,
  //   route: Route,
  // },
  // {
  //   path: routes.pe7icon,
  //   element: <PE7Icons />,
  //   route: Route,
  // },
  // {
  //   path: routes.simpleLineIcon,
  //   element: <SimplelineIcons />,
  //   route: Route,
  // },
  // {
  //   path: routes.themifyIcon,
  //   element: <ThemifyIcons />,
  //   route: Route,
  // },
  // {
  //   path: routes.typicon,
  //   element: <TypiconIcons />,
  //   route: Route,
  // },
  // {
  //   path: routes.basicInput,
  //   element: <BasicInputs />,
  //   route: Route,
  // },
  // {
  //   path: routes.weatherIcon,
  //   element: <WeatherIcons />,
  //   route: Route,
  // },
  // {
  //   path: routes.checkboxandRadion,
  //   element: <CheckboxRadios />,
  //   route: Route,
  // },
  // {
  //   path: routes.inputGroup,
  //   element: <InputGroup />,
  //   route: Route,
  // },
  // {
  //   path: routes.gridandGutters,
  //   element: <GridGutters />,
  //   route: Route,
  // },
  // {
  //   path: routes.formSelect,
  //   element: <FormSelect />,
  //   route: Route,
  // },
  // {
  //   path: routes.formMask,
  //   element: <FormMask />,
  //   route: Route,
  // },
  // {
  //   path: routes.fileUpload,
  //   element: <FileUpload />,
  //   route: Route,
  // },
  // {
  //   path: routes.horizontalForm,
  //   element: <FormHorizontal />,
  //   route: Route,
  // },
  // {
  //   path: routes.verticalForm,
  //   element: <FormVertical />,
  //   route: Route,
  // },
  // {
  //   path: routes.floatingLable,
  //   element: <FloatingLabel />,
  //   route: Route,
  // },
  // {
  //   path: routes.formValidation,
  //   element: <FormValidation />,
  //   route: Route,
  // },
  // {
  //   path: routes.reactSelect,
  //   element: <FormSelect2 />,
  //   route: Route,
  // },
  // {
  //   path: routes.formWizard,
  //   element: <FormWizard />,
  //   route: Route,
  // },
  // {
  //   path: routes.dataTable,
  //   element: <DataTables />,
  //   route: Route,
  // },
  // {
  //   path: routes.tableBasic,
  //   element: <TablesBasic />,
  //   route: Route,
  // },
  // {
  //   path: routes.iconicIcon,
  //   element: <IonicIcons />,
  //   route: Route,
  // },
  // // {
  // //   path: routes.chart,
  // //   element: <ChartJs />,
  // //   route: Route,
  // // },

  // {
  //   path: routes.placeholder,
  //   element: <Placeholder />,
  //   route: Route,
  // },
  // {
  //   path: routes.sweetalert,
  //   element: <Alert />,
  //   route: Route,
  // },
  // {
  //   path: routes.alert,
  //   element: <AlertUi />,
  //   route: Route,
  // },
  // {
  //   path: routes.tooltip,
  //   element: <Tooltips />,
  //   route: Route,
  // },
  // {
  //   path: routes.ribbon,
  //   element: <Ribbon />,
  //   route: Route,
  // },


  // Peoples Module
  {
    path: routes.studentGrid,
    element: <StudentGrid />,
    route: Route,
    role: ["admin", "teacher"]
  },
  {
    path: routes.studentList,
    element: <StudentList />,
    route: Route,
    role: ["admin", "teacher"]
  },
  {
    path: routes.addStudent,
    element: <AddStudent />,
    route: Route,
    role: ["admin", "teacher"]
  },
  {
    path: routes.editStudent,
    element: <AddStudent />,
    route: Route,
    role: ["admin", "teacher"]

  },
  {
    path: routes.studentLibrary,
    element: <StudentLibrary />,
    route: Route,
    role: ["admin", "teacher", "library", "parent", "student",]
  },
  {
    path: routes.studentDetail,
    element: <StudentDetails />,
    route: Route,
    role: ["admin", "teacher", "accounts", "parent", "student"]
  },
  {
    path: routes.addbustopadmin,
    element: <AddBusStop/>,
    route: Route,
    role: ["admin", "teacher",]
  },
  {
    path: routes.studentFees,
    element: <StudentFees />,
    route: Route,
    role: ["admin", "teacher", "accounts", "parent", "student"]
  },
  {
    path: routes.studentLeaves,
    element: <StudentLeaves />,
    route: Route,
    role: ["admin", "teacher", "accounts", "parent", "student"]

  },
  {
    path: routes.studentResult,
    element: <StudentResult />,
    route: Route,
    role: ["admin", "teacher", "parent", "student"]

  },
  {
    path: routes.studentTimeTable,
    element: <StudentTimeTable />,
    route: Route,
    role: ["admin", "teacher", "parent", "student"]
  },
  {
    path: routes.studentPromotion,
    element: <StudentPromotion />,
    route: Route,
    role: ["admin", "teacher", "parent", "student", "accounts"]
  },
  {
    path: routes.AcademicReason,
    element: <AcademicReason />,

    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.classSyllabus,
    element: <ClassSyllabus />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel"],
  },
  {
    path: routes.classesLists,
    element: <Classesshow />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "library", "accounts"],
  },
  {
    path: routes.MyClassesWithStudents,
    element: <MyClassesWithStudents />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "library", "accounts"],
  },
  {
    path: routes.DoubtForum,
    element: <DoubtForum />,
    role: []
  },
   {
    path: routes.resetPassword,
    element: <ResetPassword />,
    role: []
  },
  {
    path: routes.AcademicUploads,
    element: <AcademicUploads />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.SelfEnhancement,
    element: <SelfEnhancement />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel"],
  },
  {
    path: routes.AssignTeacherToClass,
    element: <AssignTeacherToClass />,
    route: Route,
    role: ["admin", "staff"]
  },
  {
    path: routes.homeclasses,
    element: <Classeshome />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"]
  },
  {
    path: routes.classSubject,
    element: <ClassSubject />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "library"],
  },
  {
    path: routes.classStudent,
    element: <ClassStudent />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "library"],
  },
  {
    path: routes.classSection,
    element: <ClassSection />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "library"],
  },
  {
    path: routes.classRoom,
    element: <ClassRoom />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "library"],
  },

  //added hostelform ,transportform,libraryform 😌
  {
    path: routes.addhostel,
    element: <AddHostelForm />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.addlibrary,
    element: <AddLibraryForm />,

    route: Route,
    role: ["admin", "teacher", "student", "parent", "library", "accounts"],
  },
  {
    path: routes.addtransport,
    element: <AddTransportForm />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "transport", "accounts"],
  },

  {
    path: routes.classRoutine,
    element: <ClassRoutine />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.sheduleClasses,
    element: <ScheduleClasses />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.exam,
    element: <Exam />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.examSchedule,
    element: <ExamSchedule />,
    route: Route,
    role: ["admin", "teacher"],
  },
  {
    path: routes.grade,
    element: <Grade />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.staff,
    element: <Staff />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.departments,
    element: <Departments />,
    route: Route,
    role: ["admin"],
  },
  {
    path: routes.classes,
    element: <Classes />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.classHomeWork,
    element: <ClassHomeWork />,
    route: Route,
    role: ["admin", "teacher", "student", "parent"]
  },
  {
    path: routes.assignment,
    element: <Assignment />,
    route: Route,
    role: ["admin", "teacher", "student", "parent"],

  },
  {
    path: routes.examResult,
    element: <ExamResult />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.examAttendance,
    element: <ExamAttendance />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "accounts"],
  },
  {
    path: routes.teacherGrid,
    element: <TeacherGrid />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.teacherLists,
    element: <Teachershow />,
    route: Route,
    role: ["admin", "teacher", "accounts"],

  },
  {
    path: routes.teacherList,
    element: <TeacherList />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.addTeacher,
    element: <TeacherForm />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.addExam,

    element: <AddExam />,  //added
    route: Route,
    role: ["admin", "teacher",]

  },
  {
    path: routes.uplaodPyq,
    element: <PyqUpload />,  //added
    route: Route,
    role: ["admin", "teacher",],

  },
  {
    path: routes.editTeacher,
    element: <TeacherForm />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.teacherDetails,
    element: <TeacherDetails />,
    route: Route,
    role: ["admin", "teacher", "accounts", "student", "parent"],
  },
  {
    path: routes.teachersRoutine,
    element: <TeachersRoutine />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.teacherSalary,
    element: <TeacherSalary />,
    route: Route,
    role: ["admin", "teacher", "accounts"],
  },
  {
    path: routes.teacherLeaves,
    element: <TeacherLeave />,
    route: Route,
    role: ["admin", "teacher", "accounts"],
  },
  {
    path: routes.gettheirstudent,
    element: <Gettheirstudent />,
    route: Route,
    role: ["admin", "teacher", "student", "parent"],
  },

  {
    path: routes.teacherLibrary,
    element: <TeacherLibrary />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "library", "accounts"],
  },
  {
    path: routes.parentGrid,
    element: <ParentGrid />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.parentList,
    element: <ParentList />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.classTimetable,
    element: <ClassTimetable />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel",],
  },
  {
    path: routes.payroll,
    element: <Payroll />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.holidays,
    element: <Holiday />,
    route: Route,
    role: []
  },
  {
    path: routes.designation,
    element: <Designation />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.listLeaves,
    element: <ListLeaves />,
    route: Route,
    role: ["admin"],
  },
  {
    path: routes.staffDetails,
    element: <StaffDetails />,
    route: Route,
    role: ["admin",]
  },
  {
    path: routes.staffPayroll,
    element: <StaffPayRoll />,
    route: Route,
    role: ["admin", "staff", "accounts"],
  },
  {
    path: routes.staffLeave,
    element: <StaffLeave />,
    route: Route,
    role: ["admin", "staff", "accounts"],
  },

  {
    path: routes.layoutDefault,
    element: <AdminDashboard />,
    route: Route,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.layoutMini,
    element: <AdminDashboard />,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.layoutRtl,
    element: <AdminDashboard />,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.layoutBox,
    element: <AdminDashboard />,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.layoutDark,
    element: <AdminDashboard />,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.guardiansGrid,
    element: <GuardianGrid />,
    route: Route,
    role: ["admin"],
  },
  {
    path: routes.guardiansList,
    element: <GuardianList />,
    route: Route,
    role: ["admin",]
  },
  {
    path: routes.feesGroup,
    element: <FeesGroup />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.feesType,
    element: <FeesTypes />,
    route: Route,
    role: [],
  },
  {
    path: routes.feesMaster,
    element: <FeesMaster />,
    route: Route,
    role: [],

  },
  {
    path: routes.ClassesRegisteradmin,
    element: <ClassesRegister />,
    route: Route,
    role: [],

  },
  {
    path: routes.FeesManagements,
    element: <FeesManagement />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.payfee,
    element: <PayFeeManagement />,
    role: [],
  },
  {
    path: routes.feesAssign,
    element: <FeesAssign />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.collectFees,
    element: <CollectFees />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.libraryMembers,
    element: <LibraryMember />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "library", "accounts"],
  },
  {
    path: routes.libraryBooks,
    element: <Books />,
    route: Route,
    role: [],
  },
  {
    path: routes.libraryIssueBook,
    element: <IssueBook />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "library"],
  },
  {
    path: routes.libraryReturn,
    element: <ReturnBook />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "library"],
  },
  {
    path: routes.sportsList,
    element: <SportsList />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.playerList,
    element: <PlayersList />,
    route: Route,
    role: ["admin", "teacher", "accounts"],
  },
  {
    path: routes.hostelRoom,
    element: <HostelRooms />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel",],
  },
  {
    path: routes.hostelType,
    element: <HostelType />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel",],
  },
  {
    path: routes.hostelList,
    element: <HostelList />,
    route: Route,
    role: ["admin", "hostel",],
  },
  {
    path: routes.transportRoutes,
    element: <TransportRoutes />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "transport", "accounts"],
  },
  {
    path: routes.transportAssignVehicle,
    element: <TransportAssignVehicle />,
    route: Route,
    role: ["admin", "transport",],
  },
  {
    path: routes.transportPickupPoints,
    element: <TransportPickupPoints />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "transport", "accounts"],
  },
  {
    path: routes.transportVehicleDrivers,
    element: <TransportVehicleDrivers />,
    route: Route,
    role: ["admin", "transport",],
  },
  {
    path: routes.transportVehicle,
    element: <TransportVehicle />,
    route: Route,
    role: ["admin", "transport",],
  },
  {
    path: routes.approveRequest,
    element: <ApproveRequest />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.studentAttendance,
    element: <StudentAttendance />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.teacherAttendance,
    element: <TeacherAttendance />,
    route: Route,
    role: ["admin", "teacher", "accounts"],
  },
  {
    path: routes.teacherFaceData,
    element: <TeacherFaceDataPage />,
    route: Route,
    role: ["admin"],
  },
  {
    path: routes.markFaceAttendance,
    element: <MarkFaceAttendance />,
    route: Route,
    role: ["teacher"],
  },

  {
    path: routes.staffAttendance,
    element: <StaffAttendance />,
    route: Route,
    role: ["admin", "staff", "accounts"],
  },
  {
    path: routes.staffsAttendance,
    element: <StaffsAttendance />,
    route: Route,
    role: ["admin", "teacher", "accounts"],
  },
  {
    path: routes.addStaff,
    element: <AddStaff />,
    route: Route,
    role: ["admin"],
  },
  {
    path: routes.editStaff,
    element: <EditStaff />,
    route: Route,
    role: ["admin"],
  },

  {
    path: routes.accountsIncome,
    element: <AccountsIncome />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.accountsInvoices,
    element: <AccountsInvoices />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.accountsTransactions,
    element: <AccountsTransactions />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.addInvoice,
    element: <AddInvoice />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.editInvoice,
    element: <EditInvoice />,
    route: Route,
    role: ["admin", "accounts"],
  },
  {
    path: routes.guardiansList,
    element: <GuardianList />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.expense,
    element: <Expense />,
    route: Route,
    role: ["admin",],
  },
  {
    path: routes.expenseCategory,
    element: <ExpensesCategory />,
    route: Route,
    role: ["admin",],
  },
  {
    path: routes.invoice,
    element: <Invoice />,
    route: Route,
    role: []
  },
  {
    path: routes.events,
    element: <Events />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },
  {
    path: routes.noticeBoard,
    element: <NoticeBoard />,
    route: Route,
    role: ["admin", "teacher", "student", "parent", "hostel", "transport", "library", "accounts"],
  },

  //Settings

  {
    path: routes.profilesettings,
    element: <Profilesettings />,
    role: []

  },
  {
    path: routes.securitysettings,
    element: <Securitysettings />,
    role: []
  },
  {
    path: routes.notificationssettings,
    element: <Notificationssettings />,
    role: []
  },
  {
    path: routes.connectedApps,
    element: <ConnectedApps />,
    role: []
  },
  {
    path: routes.companySettings,
    element: <CompanySettings />,
    role: []
  },
  {
    path: routes.localization,
    element: <Localization />,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.prefixes,
    element: <Prefixes />,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.socialAuthentication,
    element: <Socialauthentication />,
    role: []
  },
  {
    path: routes.language,
    element: <Languagesettings />,
    role: []
  },
  {
    path: routes.invoiceSettings,
    element: <InvoiceSettings />,
    role: []
  },
  {
    path: routes.customFields,
    element: <CustomFields />,
    role: []
  },
  {
    path: routes.emailSettings,
    element: <EmailSettings />,
    role: []
  },
  {
    path: routes.emailTemplates,
    element: <Emailtemplates />,
    role: []
  },
  {
    path: routes.smsSettings,
    element: <SmsSettings />,
    role: []
  },
  {
    path: routes.optSettings,
    element: <OtpSettings />,
    role: []
  },
  {
    path: routes.gdprCookies,
    element: <GdprCookies />,
    role: []
  },

  {
    path: routes.paymentGateways,
    element: <PaymentGateways />,
    role: []
  },
  {
    path: routes.taxRates,
    element: <TaxRates />,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.schoolSettings,
    element: <SchoolSettings />,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.religion,
    element: <Religion />,
    role: []
  },
  {
    path: routes.storage,
    element: <Storage />,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.rolesPermissions,
    element: <RolesPermissions />,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.permissions,
    element: <Permission />,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.manageusers,
    element: <Manageusers />,
    role: ["superadmin", "admin"]
  },
  {
    path: routes.allBlogs,
    element: <AllBlogs />,
    role: []
  },
  {
    path: routes.blogCategories,
    element: <BlogCategories />,
    role: []
  },
  {
    path: routes.blogComments,
    element: <BlogComments />,
    role: []
  },
  {
    path: routes.blogTags,
    element: <BlogTags />,
    role: []
  },
  {
    path: routes.tickets,
    element: <Tickets />,
    role: []
  },
  {
    path: routes.ticketGrid,
    element: <TicketGrid />,
    role: []
  },
  {
    path: routes.ticketDetails,
    element: <TicketDetails />,
    role: []
  },
  {
    path: `${routes.ticketDetail}/:id`,
    element: <TicketDetail />,
    role: []
  },
  {
    path: routes.feesReport,
    element: <FeesReport />,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.leaveReport,
    element: <LeaveReport />,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.gradeReport,
    element: <GradeReport />,
    role: ["admin", "teacher", "student", "parent",],
  },
  {
    path: routes.studentReport,
    element: <StudentReport />,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.classReport,
    element: <ClassReport />,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.attendanceReport,
    element: <AttendanceReport />,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.studentAttendanceType,
    element: <StudentAttendanceType />,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.dailyAttendance,
    element: <DailyAttendance />,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.studentDayWise,
    element: <StudentDayWise />,
    role: ["admin", "teacher", "student", "parent", "hostel", "accounts"],
  },
  {
    path: routes.teacherDayWise,
    element: <TeacherDayWise />,
    role: ["admin", "teacher",],
  },
  {
    path: routes.staffDayWise,
    element: <StaffDayWise />,
    role: ["admin", "staff",],
  },
  {
    path: routes.teacherReport,
    element: <TeacherReport />,
    role: ["admin", "teacher", "accounts"],
  },
  {
    path: routes.staffReport,
    element: <StaffReport />,
    role: ["admin", "staff", "accounts"],
  },
  {
    path: routes.contactMessages,
    element: <ContactMessages />,
    role: []
  },
  {
    path: routes.events,
    element: <Events />,
    role: []
  },
  {
    path: routes.profile,
    element: <Profile />,
    role: []
  },
  {
    path: routes.activity,
    element: <NotificationActivities />,
    role: []
  },
  {
    path: routes.comingSoon,
    element: <ComingSoon />,
    route: Route,
    role: []
  },
  { path: routes.home, element: <HomePage /> },
  { path: routes.aboutUs, element: <AboutUs /> },
  { path: routes.ourServices, element: <OurServices /> },
  { path: routes.signIn, element: <SignIn /> },
  { path: routes.signUp, element: <SignUp /> },

  { path: routes.terms, element: <Terms /> },
  { path: routes.privacyPolicy, element: <PrivacyPolicy /> },
  { path: routes.blog, element: <Blog /> },
  { path: routes.blogDetails, element: <BlogDetails /> },
  { path: routes.contactus, element: <ContactUs /> },
  { path: routes.RefundPolicyPage, element: <RefundPolicyPage /> }


];
export const authRoutes = [

  {
    path: routes.login,
    element: <Login />,
    route: Route,
    role: []
  },




  {
    path: routes.emailVerification,
    element: <EmailVerification />,
    route: Route,
    role: []
  },


  {
    path: routes.forgotPassword,
    element: <ForgotPassword />,
    route: Route,
    role: []
  },

  {
    path: routes.error404,
    element: <Error404 />,
    route: Route,
    role: []
  },
  {
    path: routes.error500,
    element: <Error500 />,
    route: Route,
    role: []
  },
  {
    path: routes.underMaintenance,
    element: <UnderMaintenance />,
    route: Route,
    role: []
  },


  {
    path: routes.schoolProfilePage,
    element: <SchoolProfilePage />,

    role: []
  }

];

