import { all_routes } from "../../../router/all_routes";
const routes = all_routes;

export type SidebarItem = {
  label: string;
  icon?: string;
  submenu?: boolean;
  showSubRoute?: boolean;
  link?: string;
  submenuOpen?: boolean;
  themeSetting?: boolean;
  roles?: string[];
  submenuItems?: SidebarItem[];
  submenuHdr?: string;
  subLink1?: string;
  subLink2?: string;
  subLink3?: string;
  subLink4?: string;
  subLink5?: string;
  subLink6?: string;
  subLink7?: string;
  version?: string;

};

export const SidebarData: SidebarItem[] = [


  {
    label: "MAIN",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Main",
    roles: ["admin", "teacher", "student", "parent", "superadmin"],
    submenuItems: [
      {
        label: "Dashboard",
        icon: "ti ti-layout-dashboard",
        submenu: true,
        showSubRoute: false,

        submenuItems: [
          { label: "Super Admin Dashboard", link: routes.superAdminDashboard, roles: ["superadmin"] },
          { label: "Admin Dashboard", link: routes.adminDashboard, roles: ["admin"] },
          { label: "Teacher Dashboard", link: routes.teacherDashboard, roles: ["teacher"] },
          { label: "Student Dashboard", link: routes.studentDashboard, roles: ["student"] },
          { label: "Parent Dashboard", link: routes.parentDashboard, roles: ["parent"] },
        ],
      },
      {
        label: "Application",
        icon: "ti ti-layout-list",
        submenu: true,
        showSubRoute: false,
        roles: ["admin", "teacher", "student", "parent", "superadmin"],
        submenuItems: [
          {
            label: "Chat",
            link: routes.chat,
            showSubRoute: false,
            roles: ["admin", "teacher", "student", "parent", "superadmin"],
          },

          {
            label: "Calendar",
            link: routes.calendar,
            showSubRoute: false,
            roles: ["admin", "teacher", "student", "parent", "superadmin"],
          },

          {
            label: "To Do",
            link: routes.todo,
            showSubRoute: false,
            roles: ["admin", "teacher", "student", "parent", "superadmin"],
          },
          {
            label: "Notes",
            link: routes.notes,
            showSubRoute: false,
            roles: ["admin", "teacher", "student", "parent", "superadmin"],
          },
          {
            label: "File Manager",
            link: routes.fileManager,
            showSubRoute: false,
            roles: ["superadmin"],
          },
        ],
      },
    ],
  },



  // **************************************** Super Admin Sidebar Data ***************************************************

  {
    label: "Register",
    icon: "ti ti-page-break",
    submenu: true,
    showSubRoute: false,
    roles: ["superadmin"],
    submenuItems: [
      {
        label: "Register School",
        link: routes.addSchools,
        showSubRoute: false,
        icon: "ti ti-page-break",
        roles: ["superadmin"],
      },
      {
        label: "Feature Requests List",
        link: routes.featuresRequestList,
        showSubRoute: false,
        icon: "ti ti-page-break",
        roles: ["superadmin"],
      },
      {
        label: "Get All Schools",
        link: routes.getSchools,
        showSubRoute: false,
        icon: "ti ti-page-break",
        roles: ["superadmin"],
      },



    ],
  },




  // **************************************** Admin Sidebar Data ***************************************************

  // Request Feature 
  {
    label: "Request",
    icon: "ti ti-page-break",
    submenu: true,
    showSubRoute: false,
    roles: ["admin"],
    submenuItems: [
      {
        label: "Request Feature",
        link: routes.requestFeatures,
        showSubRoute: false,
        icon: "ti ti-page-break",
        roles: ["admin"],
      },

    ],
  },

  // Registration

  // Peoples 
  {
    label: "Peoples",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Peoples",
    roles: ["admin"],

    submenuItems: [
      {
        label: "Students",
        icon: "ti ti-school",
        submenu: true,
        showSubRoute: false,
        roles: ["admin"],

        submenuItems: [
          {
            label: "All Students",
            link: routes.studentGrid,
            subLink1: routes.addStudent,
            subLink2: routes.editStudent,
            roles: ["admin"],
          },
          { label: "Students List", link: routes.studentList },
          {
            label: "Students Details",
            link: routes.studentDetail,
            subLink1: routes.studentLibrary,
            subLink2: routes.studentResult,
            subLink3: routes.studentFees,
            subLink4: routes.studentLeaves,
            subLink5: routes.studentTimeTable,
            roles: ["admin"],
          },
          { label: "Student Promotion", link: routes.studentPromotion },
          { label: "Student ID Card", link: routes.studentIdCard },
        ],
      },
      {
        label: "Parents",
        icon: "ti ti-user-bolt",
        showSubRoute: false,
        submenu: true,
        roles: ["admin"],
        submenuItems: [
          {
            label: "All Parents", link: routes.parentGrid,
            roles: ["admin"],
          },
          { label: "Parents List", link: routes.parentList, roles: ["admin"], },
        ],
      },
      {
        label: "Guardians",
        icon: "ti ti-user-shield",
        showSubRoute: false,
        submenu: true,
        roles: ["admin"],
        submenuItems: [
          { label: "All Guardians", link: routes.guardiansGrid, roles: ["admin"], },
          { label: "Guardians List", link: routes.guardiansList, roles: ["admin"], },
        ],
      },
      {
        label: "Teachers",
        icon: "ti ti-users",
        submenu: true,
        showSubRoute: false,
        roles: ["admin"],

        submenuItems: [
          {
            label: "All Teachers",
            link: routes.teacherGrid,
            subLink1: routes.addTeacher,
            subLink2: routes.editTeacher,
            roles: ["admin"],
          },
          {
            label: "Teacher List", link: routes.teacherList,
            roles: ["admin"],
          },
          {
            label: "Teacher Details",
            link: routes.teacherDetails,
            subLink1: routes.teacherLibrary,
            subLink2: routes.teacherSalary,
            subLink3: routes.teacherLeaves,
            roles: ["admin"],
          },
          {
            label: "Routine", link: routes.teachersRoutine,
            roles: ["admin"],
          },
        ],
      },
    ],
  },

  // Academics 

  {
    label: "Academic",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Academic",
    roles: ["admin"],
    submenuItems: [
      {
        label: "Classes",
        icon: "ti ti-school-bell",
        submenu: true,
        showSubRoute: false,
        roles: ["admin"],

        submenuItems: [
          { label: "All Classes", link: routes.classes, roles: ["admin"], },
          { label: "Schedule", link: routes.sheduleClasses, roles: ["admin"], },
        ],
      },
      {
        label: "Class Room",
        link: routes.classRoom,
        icon: "ti ti-building",
        showSubRoute: false,
        submenu: false,
        roles: ["admin"],
      },
      {
        label: "Class Routine",
        link: routes.classRoutine,
        icon: "ti ti-bell-school",
        showSubRoute: false,
        submenu: false,
        roles: ["admin"],
      },
      {
        label: "Section",
        link: routes.classSection,
        icon: "ti ti-square-rotated-forbid-2",
        showSubRoute: false,
        submenu: false,
        roles: ["admin"],
      },
      {
        label: "Subject",
        link: routes.classSubject,
        icon: "ti ti-book",
        showSubRoute: false,
        submenu: false,
        roles: ["admin"],
      },
      {
        label: "Syllabus",
        link: routes.classSyllabus,
        icon: "ti ti-book-upload",
        showSubRoute: false,
        submenu: false,
        roles: ["admin"],
      },
      {
        label: "Time Table",
        link: routes.classTimetable,
        icon: "ti ti-table",
        showSubRoute: false,
        submenu: false,
        roles: ["admin"],
      },
      {
        label: "Home Work",
        link: routes.classHomeWork,
        icon: "ti ti-license",
        showSubRoute: false,
        submenu: false,
        roles: ["admin"],
      },
      {
        label: "Examinations",
        icon: "ti ti-hexagonal-prism-plus",
        submenu: true,
        showSubRoute: false,
        roles: ["admin"],

        submenuItems: [
          { label: "Exam", link: routes.exam, roles: ["admin"] },
          { label: "Exam Schedule", link: routes.examSchedule, roles: ["admin"] },
          { label: "Grade", link: routes.grade, roles: ["admin"] },
          { label: "Exam Attendance", link: routes.examAttendance, roles: ["admin"] },
          { label: "Exam Results", link: routes.examResult, roles: ["admin"] },
        ],
      },
      {
        label: "Reasons",
        link: routes.AcademicReason,
        icon: "ti ti-lifebuoy",
        showSubRoute: false,
        submenu: false,
        roles: ["admin"],
      },
    ],
  },

  // Management

  {
    label: "MANAGEMENT",
    submenuOpen: true,
    submenuHdr: "Management",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
      {
        label: "Fees Collection",
        icon: "ti ti-report-money",
        submenu: true,
        showSubRoute: false,

        submenuItems: [
          { label: "Fees Group", link: routes.feesGroup },
          { label: "Fees Type", link: routes.feesType },
          { label: "Fees Master", link: routes.feesMaster },
          { label: "Fees Assign", link: routes.feesAssign },
          { label: "Collect Fees", link: routes.collectFees },
        ],
      },
      {
        label: "Library",
        icon: "ti ti-notebook",
        submenu: true,
        showSubRoute: false,

        submenuItems: [
          { label: "Library Members", link: routes.libraryMembers },
          { label: "Books", link: routes.libraryBooks },
          { label: "Issue Book", link: routes.libraryIssueBook },
          { label: "Return", link: routes.libraryReturn },
        ],
      },
      {
        label: "Sports",
        link: routes.sportsList,
        icon: "ti ti-run",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Players",
        link: routes.playerList,
        icon: "ti ti-play-football",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Hostel",
        icon: "ti ti-building-fortress",
        submenu: true,
        showSubRoute: false,

        submenuItems: [
          { label: "Hostel List", link: routes.hostelList },
          { label: "Hostel Rooms", link: routes.hostelRoom },
          { label: "Room Type", link: routes.hostelType },
        ],
      },
      {
        label: "Transport",
        icon: "ti ti-bus",
        submenu: true,
        showSubRoute: false,

        submenuItems: [
          { label: "Routes", link: routes.transportRoutes },
          { label: "Pickup Points", link: routes.transportPickupPoints },
          { label: "Vehicle Drivers", link: routes.transportVehicleDrivers },
          { label: "Vehicle", link: routes.transportVehicle },
          { label: "Assign Vehicle", link: routes.transportAssignVehicle },
        ],
      },
    ],
  },

  // HRM

  {
    label: "HRM",
    submenuOpen: true,
    submenuHdr: "HRM",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
      {
        label: "Staffs",
        link: routes.staff,
        subLink1: routes.addStaff,
        subLink2: routes.editStaff,
        icon: "ti ti-users-group",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Departments",
        link: routes.departments,
        icon: "ti ti-layout-distribute-horizontal",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Designation",
        link: routes.designation,
        icon: "ti ti-user-exclamation",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Attendance",
        icon: "ti ti-calendar-share",
        submenu: true,
        showSubRoute: false,

        submenuItems: [
          { label: "Student Attendance", link: routes.studentAttendance },
          { label: "Teacher Attendance", link: routes.teacherAttendance },
          { label: "Teacher Face Data", link: routes.teacherFaceData },
          { label: "Staff Attendance", link: routes.staffAttendance },
        ],
      },
      {
        label: "Leaves",
        icon: "ti ti-calendar-stats",
        submenu: true,
        showSubRoute: false,

        submenuItems: [
          { label: "List of leaves", link: routes.listLeaves },
          { label: "Approve Request", link: routes.approveRequest },
        ],
      },
      {
        label: "Holidays",
        link: routes.holidays,
        icon: "ti ti-briefcase",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Payroll",
        link: routes.payroll,
        icon: "ti ti-moneybag",
        showSubRoute: false,
        submenu: false,
      },
    ],
  },

  // Finance & Accounts

  {
    label: "Finance & Accounts",
    submenuOpen: true,
    submenuHdr: "Finance & Accounts",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
      {
        label: "Accounts",
        icon: "ti ti-swipe",
        submenu: true,
        showSubRoute: false,
        submenuItems: [
          { label: "Expenses", link: routes.expense },
          { label: "Expense Category", link: routes.expenseCategory },
          { label: "Income", link: routes.accountsIncome },
          {
            label: "Invoices",
            link: routes.accountsInvoices,
            subLink1: routes.addInvoice,
            subLink2: routes.editInvoice,
          },
          { label: "Invoice View", link: routes.invoice },
          { label: "Transactions", link: routes.accountsTransactions },
        ],
      },
    ],
  },

  // Announcements

  {
    label: "Announcements",
    submenuOpen: true,
    submenuHdr: "Announcements",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
      {
        label: "Notice Board",
        link: routes.noticeBoard,
        icon: "ti ti-clipboard-data",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Events",
        link: routes.events,
        icon: "ti ti-calendar-question",
        showSubRoute: false,
        submenu: false,
      },
    ],
  },

  // Reports

  {
    label: "Reports",
    submenuOpen: true,
    submenuHdr: "Reports",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
      {
        label: "Attendance Report",
        link: routes.attendanceReport,
        subLink1: routes.studentAttendanceType,
        subLink2: routes.staffReport,
        subLink3: routes.teacherReport,
        subLink4: routes.staffDayWise,
        subLink5: routes.teacherDayWise,
        subLink6: routes.studentDayWise,
        subLink7: routes.dailyAttendance,
        icon: "ti ti-calendar-due",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Class Report",
        link: routes.classReport,
        icon: "ti ti-graph",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Student Report",
        link: routes.studentReport,
        icon: "ti ti-chart-infographic",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Grade Report",
        link: routes.gradeReport,
        icon: "ti ti-calendar-x",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Leave Report",
        link: routes.leaveReport,
        icon: "ti ti-line",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Fees Report",
        link: routes.feesReport,
        icon: "ti ti-mask",
        showSubRoute: false,
        submenu: false,
      },
    ],
  },

  // User Management

  {
    label: "USER MANAGEMENT",
    submenuOpen: true,
    submenuHdr: "Sales",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
      {
        label: "Users",
        link: routes.manageusers,
        icon: "ti ti-users-minus",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Roles & Permission",
        link: routes.rolesPermissions,
        icon: "ti ti-shield-plus",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Delete Account Request",
        link: routes.deleteRequest,
        icon: "ti ti-user-question",
        showSubRoute: false,
        submenu: false,
      },
    ],
  },

  // Member ship

  {
    label: "MEMBERSHIP",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Finance & Accounts",
    submenuItems: [
      {
        label: "Membership Plans",
        link: routes.membershipplan,
        icon: "ti ti-user-plus",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Membership Addons",
        link: routes.membershipAddon,
        icon: "ti ti-cone-plus",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Transactions",
        link: routes.membershipTransaction,
        icon: "ti ti-file-power",
        showSubRoute: false,
        submenu: false,
      },
    ],
  },



  // **************************************** Teacher Sidebar Data ***************************************************

  // **************************************** Student Sidebar Data ***************************************************

  // **************************************** Parents Sidebar Data ***************************************************

  // **************************************** Hostel Sidebar Data ***************************************************

  // **************************************** Transport Sidebar Data ***************************************************

  // **************************************** Library Sidebar Data ***************************************************

  // **************************************** HRM Sidebar Data ***************************************************

  // ****************************************  Accounts Sidebar Data ***************************************************


  // ****************************************  Common For All  Sidebar Data ***************************************************


  // Member ship 

  {
    label: "MEMBERSHIP",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Finance & Accounts",
    roles: ["superadmin"],
    submenuItems: [
      {
        label: "Membership Plans",
        link: routes.membershipplan,
        icon: "ti ti-user-plus",
        showSubRoute: false,
        submenu: false,
        roles: ["superadmin"],
      },

      {
        label: "Transactions",
        link: routes.membershipTransaction,
        icon: "ti ti-file-power",
        showSubRoute: false,
        submenu: false,
        roles: ["superadmin"],
      },
    ],
  },

  // content 
  {
    label: "CONTENT",
    icon: "ti ti-page-break",
    submenu: true,
    showSubRoute: false,
    roles: ["admin", "teacher", "student", "parent", "superadmin"],
    submenuItems: [

      {
        label: "Feedback",
        link: routes.testimonials,
        showSubRoute: false,
        icon: "ti ti-quote",
        roles: ["admin", "teacher", "student", "parent", "superadmin"],
      },

    ],
  },

  // Support
  {
    label: "Support",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Finance & Accounts",
    roles: ["superadmin"],
    submenuItems: [

      {
        label: "Tickets",
        link: routes.tickets,
        icon: "ti ti-ticket",
        showSubRoute: false,
        submenu: false,
        roles: ["superadmin"],
      },
    ],
  },


];























export const getSidebarData = (role: string) => {
  const sidebarData = SidebarData.filter(
    (section) => {
      if (section.roles && section.roles.includes(role)) {
        const sidebarSubmenuItems = section.submenuItems ? section.submenuItems.filter((sidebarSubmenuItem) => {
          if (sidebarSubmenuItem.roles && sidebarSubmenuItem.roles.includes(role)) {
            if (sidebarSubmenuItem.submenuItems) {
              const sidebarSubmenuItems2 = sidebarSubmenuItem.submenuItems.filter((sidebarSubmenuItem2) => {
                if (sidebarSubmenuItem2.roles && sidebarSubmenuItem2.roles.includes(role)) {
                  return sidebarSubmenuItem
                }

                return null
              });

              sidebarSubmenuItem.submenuItems = sidebarSubmenuItems2;
              return sidebarSubmenuItem
            }

            return sidebarSubmenuItem
          }

          return null
        }) : []

        section.submenuItems = sidebarSubmenuItems;
        return section
      }
      return null
    }
  );

  return sidebarData
  // .map((section) => {
  //   // console.log("section", section)
  //   return ({
  //     ...section,
  //     submenuItems: (section.submenuItems || []) // Ensure submenuItems is not undefined
  //       .map((item) => {
  //         if (item.submenu) {
  //           const filteredSubmenuItems = (item.submenuItems || []).filter(
  //             (subItem) => !subItem.roles || subItem.roles.includes(role)
  //           );
  //           return {
  //             ...item,
  //             submenuItems: filteredSubmenuItems,
  //           };
  //         } else {
  //           return { ...item, submenuItems: [] };
  //         }
  //       })
  //       .filter((item) =>
  //         item.submenu
  //           ? item.submenuItems.length > 0
  //           : !item.roles || item.roles.includes(role)
  //       ),
  //   })
  // }).filter((section) => section.submenuItems.length > 0);
};
