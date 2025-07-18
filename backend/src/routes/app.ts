

import express from "express";

import superAdminRoute from "../modules/superadmin/routes/core/superRoutes";
import teacherRoutes from "../modules/admin/routes/core/schoolauthroutes/teacherRoutes";
import studentRoutes from "../modules/admin/routes/core/schoolauthroutes/studentRoutes";
import accountRoutes from "../modules/admin/routes/core/schoolauthroutes/accountRoutes";
import transportRoutes from "../modules/admin/routes/core/schoolauthroutes/transportRoutes";
import hostelRoutes from "../modules/admin/routes/core/schoolauthroutes/hostelRoutes";
import assignmentRoute from "../modules/teacher/routes/dashboard/assignmentRoute";
import attendanceRoute from "../modules/teacher/routes/dashboard/attendanceRoute";
import classRoute from "../modules/teacher/routes/dashboard/classRoute";
import examRoute from "../modules/teacher/routes/dashboard/examRoute";
import gradeRoute from "../modules/teacher/routes/dashboard/gradeRoute";
import lessonRoute from "../modules/teacher/routes/dashboard/lessonRoute";
import subjectRoute from "../modules/teacher/routes/dashboard/subjectRoute";
import resultRoute from "../modules/teacher/routes/dashboard/resultRoute";
import marksheetRoutes from "../modules/teacher/routes/dashboard/marksheetRoutes";
import eventRoutes from "../modules/admin/routes/dashboard/eventRoutes";
import announcementRoutes from "../modules/admin/routes/dashboard/announcementRoutes";
import paymentSecretRoute from "../modules/admin/routes/dashboard/paymentSecretRoute";
import getProfileRoute from "./signin/getProfileRoute";
import ticketRoutes from "../modules/superadmin/routes/dashboard/ticketRoutes";
import feedbackRoutes from "../modules/superadmin/routes/dashboard/feedbackRoutes";
import todoRoutes from "../modules/superadmin/routes/dashboard/todoRoutes";
import companyAccountsRoutes from "../modules/superadmin/routes/dashboard/companyAccountsRoutes";
import answerRoutes from "../modules/admin/routes/dashboard/answerRoutes";
import competitionRoutes from "../modules/admin/routes/dashboard/competitionRoutes";
import leaderboardRoutes from "../modules/admin/routes/dashboard/leaderboardRoutes";
import pyqRoutes from "../modules/admin/routes/dashboard/pyqRoutes";
import teacherPyqRoutes from "../modules/teacher/routes/dashboard/pyqRoutes";
import transactionRoutes from "../modules/admin/routes/dashboard/transactionRoutes";
import featuresRoutes from "../modules/admin/routes/dashboard/featuresRoutes";
import roadmapRoutes from "../modules/student/routes/dashboard/roadmapRoutes";
import topicRoutes from "../modules/student/routes/dashboard/topicRoutes";
import newspaperRoutes from "../modules/teacher/routes/dashboard/newspaperRoutes";
import newspaperSubmissionRoutes from "../modules/teacher/routes/dashboard/newspaperSubmissionRoutes";
import quizresultRoutes from "../modules/teacher/routes/dashboard/quizresultRoutes";
import quizRoutes from "../modules/teacher/routes/dashboard/quizRoutes";
import doubtRoutes from "../modules/admin/routes/dashboard/doubtRoutes";
import projectRoutes from "../modules/project/routes/projectRoutes";
import libraryRoutes from "../modules/admin/routes/core/schoolauthroutes/libraryRoutes";
import attendanceMarkRoute from "./attendanceMarkRoute";
import demoRoutes from "../modules/project/routes/demoRoutes";
import teacherAttendanceRoutes from "../modules/admin/routes/dashboard/teacherAttendanceRoutes";
import teacherFaceDataRoutes from "../modules/admin/routes/dashboard/teacherFaceDataRoutes";
import bookcopyRoutes from "../modules/library/routes/dashboard/bookcopyRoutes";
import bookIssueRoutes from "../modules/library/routes/dashboard/bookIssueRoutes";
import bookRoutes from "../modules/library/routes/dashboard/bookRoutes";
import createAuthorRoutes from "../modules/library/routes/dashboard/createAuthorRoutes";
import disputeRoutes from "../modules/library/routes/dashboard/disputeRoutes";
import fineManagementRoutes from "../modules/library/routes/dashboard/fineManagementRoutes";
import assignTransportRoutes from "../modules/transport/routes/dashboard/assignTransportRoutes";
import busAttendanceRoutes from "../modules/transport/routes/dashboard/busAttendanceRoutes";
import busrouteRoutes from "../modules/transport/routes/dashboard/busrouteRoutes";
import busRoutes from "../modules/transport/routes/dashboard/busRoutes";
import busStopRoutes from "../modules/transport/routes/dashboard/busStopRoutes";
import conductorRoutes from "../modules/transport/routes/dashboard/conductorRoutes";
import driverRoutes from "../modules/transport/routes/dashboard/driverRoutes";
import inchargeRoutes from "../modules/transport/routes/dashboard/inchargeRoutes";
import accommodationRequestRoutes from "../modules/hostel/routes/dashboard/accommodationRequestRoutes";
import complaintController from "../modules/hostel/routes/dashboard/complaintController";
import hostelExpenseRoutes from "../modules/hostel/routes/dashboard/hostelExpenseRoutes";
import hostelFeesRoutes from "../modules/hostel/routes/dashboard/hostelFeesRoutes";
import hostelInventoryRoutes from "../modules/hostel/routes/dashboard/hostelInventoryRoutes";
import medicalEmergencyRoutes from "../modules/hostel/routes/dashboard/medicalEmergencyRoutes";
import outpassRequestRoutes from "../modules/hostel/routes/dashboard/outpassRequestRoutes";
import roomRoutes from "../modules/hostel/routes/dashboard/roomRoutes";
import visitorRoutes from "../modules/admin/routes/dashboard/visitor/visitorRoutes";
import departmentRoutes from "../modules/admin/routes/dashboard/hrm/departmentRoutes";
import designationsRoutes from "../modules/admin/routes/dashboard/hrm/designationsRoutes";
import dutiesRoutes from "../modules/admin/routes/dashboard/hrm/dutiesRoutes";
import payrollRoutes from "../modules/admin/routes/dashboard/hrm/payrollRoutes";
import studentPromotionRoutes from "../modules/admin/routes/dashboard/studentPromotionRoutes";
import { permit } from "../utils/jwt_utils";
import { Role } from "@prisma/client";
import userRoutes from "../modules/superadmin/routes/core/userRoutes";
import contactMessageRoutes from "../modules/superadmin/routes/core/contactMessageRoutes";
import homeWorkRoutes from "../modules/teacher/routes/dashboard/homeWorkRoutes";
import teacherLeaveRequestRoutes from "../modules/teacher/routes/dashboard/leaveRequestRoutes";
import teacherPayrollRoutes from "../modules/teacher/routes/dashboard/payrollRoutes";
import addStaffRoutes from "../modules/admin/routes/dashboard/hrm/addStaffRoutes";
import employeeRoutes from "../modules/admin/routes/dashboard/hrm/employeeRoutes";
import leaveRequestRoutes from "../modules/superadmin/routes/core/leaveRequestRoutes";
import holidayRoutes from "../modules/admin/routes/dashboard/holidayRoutes";
import analyticsRoutes from "../modules/analytics/analytics.routes";
import usageAnalyticsRoutes from "../modules/usageAnalytics/usageAnalytics.routes";

import feeHandlerRoutes from "./paymenthandler/feeHandlerRoutes";
import invoiceRoutes from "./paymenthandler/invoiceRoutes";

import feesRoutes from "../modules/accounts/routes/dashboard/feesRoutes";
import feeGroupRoutes from "../modules/accounts/routes/dashboard/feeGroupRoutes";
import noticeRoutes from "../modules/admin/routes/dashboard/noticeRoutes";
import parentRoutes from "../modules/admin/routes/core/parentRoutes";
import guardianRoutes from "../modules/admin/routes/core/guardianRoutes";
import schoolExpenseCategory from "../modules/accounts/routes/dashboard/schoolExpenseCategory";
import schoolExpenseRoutes from "../modules/accounts/routes/dashboard/schoolExpenseRoutes";
import schoolIncomeRoutes from "../modules/accounts/routes/dashboard/schoolIncomeRoutes";
import busPickUpRoutes from "../modules/transport/routes/dashboard/busPickUpRoutes";
import couponRoutes from "../modules/superadmin/routes/core/couponRoutes";
import feeRoutes from "../modules/admin/routes/dashboard/feeRoutes";
import paymentTransactionRoutes from "./paymenthandler/paymentTransactionRoutes";
import sectionRoutes from "../modules/teacher/routes/dashboard/sectionRoutes";
import studentDetailsRoutes from "../modules/student/routes/dashboard/studentDetailsRoutes";
import studentAllRoutes from "../modules/student/routes/dashboard/studentAllRoutes";
import idCardRoutes from "../modules/student/routes/dashboard/idCardRoutes";
import chatRoutes from "./application/chat/chatRoutes";
import permissionsRoute from "../modules/superadmin/routes/core/permissionsRoute";
import inventoryRoutes from "../modules/admin/routes/dashboard/hrm/inventory/inventoryRoutes";
import DashboardHomeRoutes from "./DashboardHomeRoutes/DashboardHomeRoutes";
import subscriptionRoutes from "../modules/superadmin/routes/dashboard/subscriptionRoutes";
import gpsRoutes from "../modules/driver/routes/gps.routes";
import notificationRoutes from "../modules/notification-system/routes/notificationRoutes";

// Create a main API router
const apiRouter = express.Router();

// apiRouter.use(injectUserByToken);

apiRouter.use(contactMessageRoutes);


apiRouter.use("/administrator", permit(Role.superadmin), superAdminRoute);

apiRouter.use(userRoutes);
apiRouter.use(teacherRoutes);
apiRouter.use(studentRoutes);
apiRouter.use(accountRoutes);
apiRouter.use(transportRoutes);
apiRouter.use(hostelRoutes);
apiRouter.use(assignmentRoute);
apiRouter.use(attendanceRoute);
apiRouter.use(attendanceMarkRoute);
apiRouter.use(teacherAttendanceRoutes);
apiRouter.use(teacherFaceDataRoutes);
apiRouter.use(classRoute);
apiRouter.use(examRoute);
apiRouter.use(gradeRoute);
apiRouter.use(lessonRoute);
apiRouter.use(subjectRoute);
apiRouter.use(resultRoute);
apiRouter.use(marksheetRoutes);
apiRouter.use(eventRoutes);
apiRouter.use(announcementRoutes);
apiRouter.use(paymentSecretRoute);
apiRouter.use(getProfileRoute);

apiRouter.use(ticketRoutes);
apiRouter.use(feedbackRoutes);
apiRouter.use(todoRoutes);
apiRouter.use(projectRoutes);
apiRouter.use(demoRoutes);
apiRouter.use(companyAccountsRoutes);
apiRouter.use(answerRoutes);
apiRouter.use(inventoryRoutes);
  apiRouter.use(competitionRoutes);
  apiRouter.use(leaderboardRoutes);
  apiRouter.use(pyqRoutes);
  apiRouter.use(teacherPyqRoutes);
  apiRouter.use(transactionRoutes);
apiRouter.use("/admin", featuresRoutes);
apiRouter.use( permissionsRoute);
apiRouter.use(roadmapRoutes);
apiRouter.use(topicRoutes);
apiRouter.use(newspaperRoutes);
apiRouter.use(newspaperSubmissionRoutes);
apiRouter.use(quizresultRoutes);
apiRouter.use(quizRoutes);
apiRouter.use(doubtRoutes);
apiRouter.use(libraryRoutes);
apiRouter.use(bookcopyRoutes);
apiRouter.use(bookIssueRoutes);
apiRouter.use(bookRoutes);
apiRouter.use(createAuthorRoutes);
apiRouter.use(disputeRoutes);
apiRouter.use(fineManagementRoutes);
apiRouter.use(assignTransportRoutes);
apiRouter.use(busAttendanceRoutes);
apiRouter.use(busrouteRoutes);
apiRouter.use(busRoutes);
apiRouter.use(busStopRoutes);
apiRouter.use(conductorRoutes);
apiRouter.use(driverRoutes);
apiRouter.use(inchargeRoutes);
apiRouter.use(accommodationRequestRoutes);
apiRouter.use(complaintController);
apiRouter.use(hostelExpenseRoutes);
apiRouter.use(hostelFeesRoutes);
apiRouter.use(hostelInventoryRoutes);
apiRouter.use(medicalEmergencyRoutes);
apiRouter.use(outpassRequestRoutes);
apiRouter.use(roomRoutes);
apiRouter.use(visitorRoutes);
apiRouter.use(departmentRoutes);
apiRouter.use(designationsRoutes);
apiRouter.use(dutiesRoutes);
apiRouter.use(payrollRoutes);

apiRouter.use(homeWorkRoutes);
apiRouter.use(teacherLeaveRequestRoutes);
apiRouter.use(teacherPayrollRoutes);
apiRouter.use(addStaffRoutes);
apiRouter.use(employeeRoutes);
apiRouter.use(leaveRequestRoutes);
apiRouter.use(holidayRoutes);
apiRouter.use(studentPromotionRoutes);

apiRouter.use(feeHandlerRoutes);
apiRouter.use(invoiceRoutes);

apiRouter.use(feesRoutes);
apiRouter.use(feeGroupRoutes);
apiRouter.use(noticeRoutes);
apiRouter.use(parentRoutes);
apiRouter.use(guardianRoutes);
apiRouter.use(schoolExpenseCategory);
apiRouter.use(schoolExpenseRoutes);
apiRouter.use(schoolIncomeRoutes);
apiRouter.use(busPickUpRoutes);
apiRouter.use(couponRoutes);
apiRouter.use(feeRoutes);
apiRouter.use(paymentTransactionRoutes);
apiRouter.use(sectionRoutes);
apiRouter.use(studentAllRoutes);
apiRouter.use(chatRoutes);
apiRouter.use(analyticsRoutes);
apiRouter.use(usageAnalyticsRoutes);
apiRouter.use(DashboardHomeRoutes);

// Test Todo
apiRouter.use(subscriptionRoutes);

// Student Routes

apiRouter.use(studentDetailsRoutes);
apiRouter.use(idCardRoutes);

apiRouter.use(gpsRoutes);


// Notification System

apiRouter.use(notificationRoutes);

export default apiRouter;
