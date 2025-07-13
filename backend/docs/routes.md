
# API Routes

## SaaS Admin

### [src/routes/dashboard/superadmin/feedbackRoutes.ts](src/routes/dashboard/superadmin/feedbackRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /create-feedback |  |
| GET | /get-feedbacks |  |
| GET | /get-feedback/:feedbackId |  |
| GET | /schoolfeedback/:schoolId |  |
| PUT | /update-feedback/:feedbackId |  |
| DELETE | /delete-feedback/:feedbackId |  |
| PATCH | /approve-feedback/:feedbackId |  |
| PATCH | /reject-feedback/:feedbackId |  |

### [src/routes/dashboard/superadmin/handlePaymentRoutes.ts](src/routes/dashboard/superadmin/handlePaymentRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /payment/create |  |
| POST | /payment/webhook |  |

### [src/routes/dashboard/superadmin/planRoutes.ts](src/routes/dashboard/superadmin/planRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /plan/create |  |
| GET | /super/plans |  |
| GET | /plan/:id |  |
| PUT | /plan/:id |  |
| DELETE | /plan/:id |  |


### [src/routes/dashboard/superadmin/ticketRoutes.ts](src/routes/dashboard/superadmin/ticketRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /user/create-ticket |  |
| GET | /user/get-tickets |  |
| GET | /user/get-ticket/:ticketId |  |
| GET | /user/schooltickets/:schoolId |  |
| PUT | /user/update-ticket/:ticketId |  |
| DELETE | /user/delete-ticket/:ticketId |  |
| GET | /user-tickets/:userId |  |

### [src/routes/dashboard/superadmin/todoRoutes.ts](src/routes/dashboard/superadmin/todoRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /todo |  |
| GET | /todos |  |
| GET | /todo/:id |  |
| PUT | /todo/:id |  |
| DELETE | /todo/:id |  |

## Admin

### [src/routes/dashboard/admin/announcementRoutes.ts](src/routes/dashboard/admin/announcementRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /admin/announcement |  |
| GET | /admin/announcement |  |
| GET | /admin/announcement/:id |  |
| PUT | /admin/announcement/:id |  |
| DELETE | /admin/announcement/:id |  |

### [src/routes/dashboard/admin/answerRoutes.ts](src/routes/dashboard/admin/answerRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /school/doubts/:doubtId/answers |  |
| GET | /school/answers/:id |  |
| POST | /school/answers |  |
| PUT | /school/answers/:id |  |
| DELETE | /school/answers/:id |  |

### [src/routes/dashboard/admin/competitionRoutes.ts](src/routes/dashboard/admin/competitionRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /competitions |  |
| GET | /competitions/:id |  |
| POST | /competitions |  |
| PUT | /competitions/:id |  |
| DELETE | /competitions/:id |  |

### [src/routes/dashboard/admin/doubtRoutes.ts](src/routes/dashboard/admin/doubtRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/doubt |  |
| GET | /school/doubts |  |
| GET | /school/doubt/:id |  |
| PUT | /school/doubt/:id |  |
| DELETE | /school/doubt/:id |  |
| GET | /school/doubt/school/:schoolId |  |
| GET | /school/doubt/user/:userId |  |

### [src/routes/dashboard/admin/eventRoutes.ts](src/routes/dashboard/admin/eventRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /admin/school/event-create |  |
| GET | /admin/events |  |
| GET | /admin/event/:id |  |
| PUT | /admin/event/:id |  |
| DELETE | /admin/event/:id |  |
| GET | /school/:schoolId |  |
| GET | /all/:schoolId |  |

### [src/routes/dashboard/admin/featuresRoutes.ts](src/routes/dashboard/admin/featuresRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /features/get-all |  |
| POST | /features/request |  |

### [src/routes/dashboard/admin/feeRoutes.ts](src/routes/dashboard/admin/feeRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/fees |  |
| GET | /school/fees |  |
| GET | /school/fees/:id |  |
| PUT | /school/fees/:id |  |
| DELETE | /school/fees/:id |  |
| GET | /school/fees/overdue |  |
| GET | /school/fees/student/:studentId |  |
| GET | /school/fees/school/:schoolId |  |

### [src/routes/dashboard/admin/holidayRoutes.ts](src/routes/dashboard/admin/holidayRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/holiday |  |
| GET | /admin/school/holidays |  |
| GET | /school/holiday/filter |  |
| GET | /school/holiday/:id |  |
| PUT | /school/holiday/:id |  |
| DELETE | /school/holiday/:id |  |

### [src/routes/dashboard/admin/hrm/addStaffRoutes.ts](src/routes/dashboard/admin/hrm/addStaffRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/staff-register |  |
| GET | /school/staff |  |
| GET | /school/staff/:id |  |
| PUT | /school/staff/:id |  |
| DELETE | /school/staff/:id |  |
| GET | /staff/school/:schoolId |  |

### [src/routes/dashboard/admin/hrm/departmentRoutes.ts](src/routes/dashboard/admin/hrm/departmentRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /schools/departments |  |
| GET | /schools/:schoolId/departments |  |
| GET | /departments/:id |  |
| PUT | /departments/:id |  |
| DELETE | /departments/:id |  |
| POST | /departments/:departmentId/users/:userId |  |
| DELETE | /departments/:departmentId/users/:userId |  |
| GET | /departments/:departmentId/users |  |

### [src/routes/dashboard/admin/hrm/designationsRoutes.ts](src/routes/dashboard/admin/hrm/designationsRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /school/:schoolId/designations |  |
| GET | /school/designation/:id |  |
| POST | /school/:schoolId/designation |  |
| PUT | /school/designation/:id |  |
| DELETE | /school/designation/:id |  |
| POST | /school/user/:userId/assign-designation |  |
| DELETE | /school/user/:userId/remove-designation |  |

### [src/routes/dashboard/admin/hrm/dutiesRoutes.ts](src/routes/dashboard/admin/hrm/dutiesRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /school/:schoolId/duties |  |
| GET | /duties/:id |  |
| POST | /school/:schoolId/duties |  |
| PUT | /duties/:id |  |
| DELETE | /duties/:id |  |
| POST | /duties/:dutyId/assign/:userId |  |
| DELETE | /duties/:dutyId/remove/:userId |  |

### [src/routes/dashboard/admin/hrm/inventory/inventoryRoutes.ts](src/routes/dashboard/admin/hrm/inventory/inventoryRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /:schoolId/items |  |
| GET | /item/:id |  |
| POST | /:schoolId/item |  |
| PUT | /item/:id |  |
| DELETE | /item/:id |  |
| POST | /transaction |  |
| GET | /transactions/:inventoryItemId |  |

### [src/routes/dashboard/admin/hrm/payrollRoutes.ts](src/routes/dashboard/admin/hrm/payrollRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /:schoolId |  |
| GET | /single/:id |  |
| POST | /:schoolId |  |
| PUT | /:id |  |
| DELETE | /:id |  |

### [src/routes/dashboard/admin/leaderboardRoutes.ts](src/routes/dashboard/admin/leaderboardRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /leaderboard |  |
| GET | /leaderboard/:id |  |
| POST | /leaderboard |  |
| PUT | /leaderboard/:id |  |
| DELETE | /leaderboard/:id |  |

### [src/routes/dashboard/admin/noticeRoutes.ts](src/routes/dashboard/admin/noticeRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/notice |  |
| GET | /all/school/notice |  |
| GET | /school/notice/:id |  |
| PUT | /school/notice/:id |  |
| DELETE | /school/notice/:id |  |
| DELETE | /school/notice/multiple |  |

### [src/routes/dashboard/admin/paymentSecretRoute.ts](src/routes/dashboard/admin/paymentSecretRoute.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/admin/payment-secret |  |
| GET | /school/admin/payment-secret/:id |  |
| GET | /school/admin/payment-secrets |  |
| PUT | /school/admin/payment-secret/:id |  |
| DELETE | /school/admin/payment-secret/:id |  |
| GET | /school/admin/payment-secret/school/:schoolId |  |

### [src/routes/dashboard/admin/pyqRoutes.ts](src/routes/dashboard/admin/pyqRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /school/pyqs |  |
| GET | /school/pyqs/:id |  |
| PUT | /school/pyqs/:id |  |
| DELETE | /school/pyqs/:id |  |
| GET | /school/pyqs/class/:classId |  |

### [src/routes/dashboard/admin/transactionRoutes.ts](src/routes/dashboard/admin/transactionRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /users/:userId/transactions |  |
| GET | /transactions/:id |  |
| POST | /transactions |  |
| PUT | /transactions/:id |  |
| DELETE | /transactions/:id |  |

### [src/routes/dashboard/admin/visitor/visitorRoutes.ts](src/routes/dashboard/admin/visitor/visitorRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/visitor/create |  |
| GET | /school/visitor/:id |  |
| PUT | /school/visitor/:id |  |
| DELETE | /school/visitor/:id |  |
| POST | /school/visitor/verify-entry |  |
| POST | /school/visitor/verify-exit |  |
| GET | /school/:schoolId/visitors |  |

## Teacher

### [src/routes/dashboard/teacher/assignmentRoute.ts](src/routes/dashboard/teacher/assignmentRoute.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/teacher/assignment |  |
| GET | /school/teacher/assignment |  |
| GET | /school/teacher/assignment/:id |  |
| PUT | /school/teacher/assignment/:id |  |
| DELETE | /school/teacher/assignment/:id |  |

### [src/routes/dashboard/teacher/attendanceRoute.ts](src/routes/dashboard/teacher/attendanceRoute.ts)

| Method | Path | Description |
|---|---|---|
| POST | /teacher/attendance |  |
| GET | /teacher/attendance |  |
| GET | /teacher/attendance/:id |  |
| PUT | /teacher/attendance/:id |  |
| DELETE | /teacher/attendance/:id |  |
| POST | /teacher/mark-multiple |  |

### [src/routes/dashboard/teacher/classRoute.ts](src/routes/dashboard/teacher/classRoute.ts)

| Method | Path | Description |
|---|---|---|
| POST | /teacher/class |  |
| GET | /school/classes |  |
| GET | /teacher/class/:id |  |
| PUT | /teacher/class/:id |  |
| DELETE | /teacher/class/:id |  |
| GET | /school/classes/:schoolId |  |
| POST | /teacher/assign-teacher |  |
| POST | /student/assign-student |  |
| GET | /teacher/:classId/teachers |  |
| GET | /teachers/:teacherId/classes |  |
| GET | /student/:classId/students |  |
| GET | /teacher/class/:classId/students |  |
| GET | /teacher/:teacherId/classes |  |
| GET | /assigned-teachers/:schoolId |  |

### [src/routes/dashboard/teacher/examRoute.ts](src/routes/dashboard/teacher/examRoute.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/teacher/exam |  |
| GET | /school/teacher/exam/:classId |  |
| GET | /school/teacher/exam/:id |  |
| PUT | /school/teacher/exam/:id |  |
| DELETE | /school/teacher/exam/:id |  |
| POST | /school/teacher/exam/schedule |  |
| POST | /school/teacher/exam/attendance |  |
| GET | /school/teacher/exam/attendance/:id |  |
| GET | /teacher/exam/attendance/:id |  |
| GET | /exam-attendance/:classId/:studentId |  |

### [src/routes/dashboard/teacher/gradeRoute.ts](src/routes/dashboard/teacher/gradeRoute.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/teacher/grade |  |
| GET | /school/teacher/grade |  |
| GET | /school/teacher/grade/:id |  |
| PUT | /school/teacher/grade/:id |  |
| DELETE | /school/teacher/grade/:id |  |

### [src/routes/dashboard/teacher/homeWorkRoutes.ts](src/routes/dashboard/teacher/homeWorkRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/home-work |  |
| GET | /school/home-work/:id |  |
| PUT | /school/home-work/:id |  |
| DELETE | /school/home-work/:id |  |
| GET | /school/home-work/class/:classId |  |
| POST | /school/home-work/submit |  |
| GET | /school/home-work/submissions/:studentId |  |

### [src/routes/dashboard/teacher/lessonRoute.ts](src/routes/dashboard/teacher/lessonRoute.ts)

| Method | Path | Description |
|---|---|---|
| POST | /teacher/lesson |  |
| GET | /teacher/lesson |  |
| GET | /teacher/lesson/:id |  |
| PUT | /teacher/lesson/:id |  |
| DELETE | /teacher/lesson/:id |  |
| GET | /school/teacher/lesson/:id |  |

### [src/routes/dashboard/teacher/newspaperRoutes.ts](src/routes/dashboard/teacher/newspaperRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /school/newspapers |  |
| GET | /school/newspapers/:id |  |
| POST | /school/newspapers |  |
| PUT | /school/newspapers/:id |  |
| DELETE | /school/newspapers/:id |  |
| GET | /school/newspapers/class/:classId |  |

### [src/routes/dashboard/teacher/quizRoutes.ts](src/routes/dashboard/teacher/quizRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /school/quizzes |  |
| GET | /school/quizzes/:id |  |
| POST | /school/quizzes |  |
| PUT | /school/quizzes/:id |  |
| DELETE | /school/quizzes/:id |  |
| GET | /school/quizzes/class/:classId |  |

### [src/routes/dashboard/teacher/quizresultRoutes.ts](src/routes/dashboard/teacher/quizresultRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /users/:userId/quiz-results |  |
| GET | /quiz-results/:id |  |
| POST | /quiz-results |  |
| PUT | /quiz-results/:id |  |
| DELETE | /quiz-results/:id |  |

### [src/routes/dashboard/teacher/resultRoute.ts](src/routes/dashboard/teacher/resultRoute.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/teacher/result |  |
| GET | /school/teacher/result |  |
| GET | /school/teacher/result/:id |  |
| PUT | /school/teacher/result/:id |  |
| DELETE | /school/teacher/result/:id |  |
| GET | /result/:classId/:studentId |  |

### [src/routes/dashboard/teacher/marksheetRoutes.ts](src/routes/dashboard/teacher/marksheetRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /school/teacher/marksheet/:classId/:studentId | Generate marksheet for a student |
| GET | /school/teacher/marksheet/topper/:classId | List toppers of a class |

### [src/routes/dashboard/teacher/sectionRoutes.ts](src/routes/dashboard/teacher/sectionRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/class/create-section |  |
| GET | /school/class/:classId |  |
| GET | /school/class/section/:id |  |
| PUT | /school/class/section/:id |  |
| DELETE | /school/class/section/:id |  |
| GET | /:sectionId/students |  |

### [src/routes/dashboard/teacher/subjectRoute.ts](src/routes/dashboard/teacher/subjectRoute.ts)

| Method | Path | Description |
|---|---|---|
| POST | /teacher/subject |  |
| GET | /teacher/subject |  |
| GET | /teacher/subject/:id |  |
| PUT | /teacher/subject/:id |  |
| DELETE | /teacher/subject/:id |  |
| GET | /schools/:schoolId/classes/:classId/subjects |  |
| GET | /school/:schoolId/subjects |  |
| GET | /class/:classId/subjects |  |

## Student

### [src/routes/dashboard/student/roadmapRoutes.ts](src/routes/dashboard/student/roadmapRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /roadmaps |  |
| GET | /roadmaps/:id |  |
| POST | /roadmaps |  |
| PUT | /roadmaps/:id |  |
| DELETE | /roadmaps/:id |  |

### [src/routes/dashboard/student/studentAllRoutes.ts](src/routes/dashboard/student/studentAllRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /student/:studentId/lessons |  |
| GET | /student/:studentId/fees |  |
| GET | /student/:studentId/resources |  |
| POST | /student/:studentId/submit-homework |  |
| POST | /student/:studentId/submit-assignment |  |
| POST | /student/:studentId/view-homework |  |
| POST | /student/:studentId/view-assignment |  |
| GET | /student/:studentId/dashboard-resources |  |
| GET | /student/:studentId/attendance-leaves |  |
| GET | /student/:studentId/exams-results |  |
| GET | /student/:studentId/results-summary |  |
| GET | /student/:studentId/quiz-newspaper |  |
| GET | /leaderboard/monthly |  |
| GET | /class/:classId/internal |  |
| GET | /class/:classId/roadmap |  |

### [src/routes/dashboard/student/studentDetailsRoutes.ts](src/routes/dashboard/student/studentDetailsRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /student/user/:id |  |

### [src/routes/dashboard/student/topicRoutes.ts](src/routes/dashboard/student/topicRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /roadmaps/:roadmapId/topics |  |
| GET | /topics/:id |  |
| POST | /topics |  |
| PUT | /topics/:id |  |
| POST | /topics/:id/complete |  |
| DELETE | /topics/:id |  |

## Library

### [src/routes/dashboard/library/bookIssueRoutes.ts](src/routes/dashboard/library/bookIssueRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /:libraryId/books/issue |  |
| POST | /:libraryId/books/return/:issueId |  |

### [src/routes/dashboard/library/bookRoutes.ts](src/routes/dashboard/library/bookRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /:libraryId/books |  |
| GET | /:libraryId/books |  |
| GET | /:libraryId/books/:bookId |  |
| PUT | /:libraryId/books/:bookId |  |
| DELETE | /:libraryId/books/:bookId |  |

### [src/routes/dashboard/library/bookcopyRoutes.ts](src/routes/dashboard/library/bookcopyRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /:libraryId/books/:bookId/copies |  |
| GET | /:libraryId/books/:bookId/copies |  |
| PUT | /:libraryId/books/:bookId/copies/:copyId |  |
| DELETE | /:libraryId/books/:bookId/copies/:copyId |  |

### [src/routes/dashboard/library/createAuthorRoutes.ts](src/routes/dashboard/library/createAuthorRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /author |  |
| GET | /authors |  |
| GET | /:authorId |  |
| PUT | /:authorId |  |
| DELETE | /:authorId |  |

### [src/routes/dashboard/library/disputeRoutes.ts](src/routes/dashboard/library/disputeRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /:issueId |  |
| POST | /:disputeId/messages |  |
| PUT | /:disputeId |  |

### [src/routes/dashboard/library/fineManagementRoutes.ts](src/routes/dashboard/library/fineManagementRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /fine |  |
| GET | /fine |  |
| GET | /:fineId |  |
| PUT | /:fineId |  |
| DELETE | /:fineId |  |
| POST | /:fineId/pay |  |

## Hostel

### [src/routes/dashboard/hostel/accommodationRequestRoutes.ts](src/routes/dashboard/hostel/accommodationRequestRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | / |  |
| GET | /:id |  |
| POST | / |  |
| PUT | /:id |  |
| DELETE | /:id |  |

### [src/routes/dashboard/hostel/hostelExpenseRoutes.ts](src/routes/dashboard/hostel/hostelExpenseRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | / |  |
| GET | /:id |  |
| POST | / |  |
| PUT | /:id |  |
| DELETE | /:id |  |

### [src/routes/dashboard/hostel/hostelFeesRoutes.ts](src/routes/dashboard/hostel/hostelFeesRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | / |  |
| GET | /:id |  |
| POST | / |  |
| PUT | /:id |  |
| DELETE | /:id |  |

### [src/routes/dashboard/hostel/hostelInventoryRoutes.ts](src/routes/dashboard/hostel/hostelInventoryRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /room/:roomId |  |
| GET | /:id |  |
| POST | /room/:roomId |  |
| PUT | /:id |  |
| DELETE | /:id |  |

### [src/routes/dashboard/hostel/hostelRoutes.ts](src/routes/dashboard/hostel/hostelRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | / |  |
| POST | / |  |
| GET | /:id |  |
| PUT | /:id |  |
| DELETE | /:id |  |
| GET | /school/:schoolId |  |
| GET | /search |  |

### [src/routes/dashboard/hostel/medicalEmergencyRoutes.ts](src/routes/dashboard/hostel/medicalEmergencyRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | / |  |
| GET | /:id |  |
| POST | / |  |
| PUT | /:id |  |
| DELETE | /:id |  |

### [src/routes/dashboard/hostel/outpassRequestRoutes.ts](src/routes/dashboard/hostel/outpassRequestRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | / |  |
| GET | /:id |  |
| GET | /student/:studentId |  |
| POST | / |  |
| PUT | /:id |  |
| DELETE | /:id |  |

### [src/routes/dashboard/hostel/roomRoutes.ts](src/routes/dashboard/hostel/roomRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | / |  |
| GET | / |  |
| GET | /:id |  |
| PUT | /:id |  |
| DELETE | /:id |  |

## Transport

### [src/routes/dashboard/transport/assignTransportRoutes.ts](src/routes/dashboard/transport/assignTransportRoutes.ts)

| Method | Path | Description |
|---|---|---|
| PUT | /transport/school/assign-transport/:studentId |  |
| GET | /transport/school/assign-transport/:studentId |  |
| PATCH | /transport/school/assign-transport/:studentId |  |
| DELETE | /transport/school/assign-transport/:studentId |  |

### [src/routes/dashboard/transport/busAttendanceRoutes.ts](src/routes/dashboard/transport/busAttendanceRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /transport/school/bus-attendance |  |
| GET | /transport/school/bus-attendances |  |
| GET | /transport/school/bus-attendance/:studentId |  |
| PATCH | /transport/school/bus-attendance/:attendanceId |  |
| DELETE | /transport/school/bus-attendance/:attendanceId |  |

### [src/routes/dashboard/transport/busPickUpRoutes.ts](src/routes/dashboard/transport/busPickUpRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/transport/school/bus-pickup |  |
| GET | /school/transport/school/bus-pickup/:id |  |
| GET | /school/transport/school/bus-pickup/:schoolId |  |
| PUT | /school/transport/school/bus-pickup/:id |  |
| DELETE | /school/transport/school/bus-pickup/:id |  |
| GET | /school/transport/school/bus-pickup/school/:schoolId |  |

### [src/routes/dashboard/transport/busRoutes.ts](src/routes/dashboard/transport/busRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/transport/school/bus |  |
| GET | /school/transport/school/buses |  |
| GET | /school/transport/school/bus/:id |  |
| PATCH | /school/transport/school/bus/:id |  |
| DELETE | /school/transport/school/bus/:id |  |
| GET | /school/transport/school/buses/school/:schoolId |  |

### [src/routes/dashboard/transport/busStopRoutes.ts](src/routes/dashboard/transport/busStopRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/transport/school/bus-stop |  |
| GET | /school/transport/school/bus-stops |  |
| GET | /school/transport/school/bus-stop/:id |  |
| PATCH | /school/transport/school/bus-stop/:id |  |
| DELETE | /school/transport/school/bus-stop/:id |  |
| GET | /school/transport/school/bus-pickup/school/:schoolId |  |

### [src/routes/dashboard/transport/busrouteRoutes.ts](src/routes/dashboard/transport/busrouteRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/transport/school/bus-route |  |
| GET | /school/transport/school/bus-routes |  |
| GET | /school/transport/school/bus-route/:id |  |
| PATCH | /school/transport/school/bus-route/:id |  |
| DELETE | /school/transport/school/bus-route/:id |  |
| GET | /school/transport/school/routes/:schoolId |  |

### [src/routes/dashboard/transport/conductorRoutes.ts](src/routes/dashboard/transport/conductorRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /transport/school/conductor |  |
| GET | /transport/school/conductor |  |
| GET | /transport/school/conductor/:id |  |
| PATCH | /transport/school/conductor/assign |  |
| PATCH | /transport/school/conductor/:id |  |
| DELETE | /transport/school/conductor/:id |  |

### [src/routes/dashboard/transport/driverRoutes.ts](src/routes/dashboard/transport/driverRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/transport/school/driver |  |
| GET | /school/transport/school/drivers |  |
| GET | /school/transport/school/driver/:id |  |
| PATCH | /school/transport/school/driver/assign |  |
| PATCH | /school/transport/school/driver/:id |  |
| DELETE | /school/transport/school/driver/:id |  |
| GET | /school/transport/school/drivers/school/:schoolId |  |

### [src/routes/dashboard/transport/inchargeRoutes.ts](src/routes/dashboard/transport/inchargeRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /transport/school/incharge |  |
| GET | /transport/school/incharges |  |
| GET | /transport/school/incharge/:id |  |
| PATCH | /transport/school/incharge/:id |  |
| DELETE | /transport/school/incharge/:id |  |

## Accounts

### [src/routes/dashboard/accounts/accountsReportRoutes.ts](src/routes/dashboard/accounts/accountsReportRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /fees-collected |  |
| GET | /outstanding-fees |  |
| GET | /salary-payments |  |

### [src/routes/dashboard/accounts/feesRoutes.ts](src/routes/dashboard/accounts/feesRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /student/create-fee |  |
| PUT | /student/create/:id |  |
| GET | /students/fee |  |
| GET | /student/create/:id |  |
| GET | /school/student/:studentId |  |
| GET | /schools/fees/get-all |  |
| DELETE | /student/create/:id |  |

### [src/routes/dashboard/accounts/paymentRoutes.ts](src/routes/dashboard/accounts/paymentRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /cash |  |
| POST | /order |  |
| POST | /webhook |  |
| GET | / |  |
| GET | /:id |  |
| PATCH | /:id |  |
| DELETE | /:id |  |

### [src/routes/dashboard/accounts/salaryRoutes.ts](src/routes/dashboard/accounts/salaryRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /pay |  |
| GET | /payments/:teacherId |  |
| GET | /payments |  |

### [src/routes/dashboard/accounts/schoolExpenseRoutes.ts](src/routes/dashboard/accounts/schoolExpenseRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/expense |  |
| GET | /school/expense/:schoolId |  |
| PUT | /school/expense/:id |  |
| DELETE | /school/expense/:id |  |

### [src/routes/dashboard/accounts/schoolIncomeRoutes.ts](src/routes/dashboard/accounts/schoolIncomeRoutes.ts)

| Method | Path | Description |
|---|---|---|
| POST | /school/income |  |
| GET | /school/incomes |  |
| GET | /school/income/:id |  |
| PUT | /school/income/:id |  |
| DELETE | /school/income/:id |  |
| GET | /admin/school/income/:id |  |

## Parents

### [src/routes/admin/parentRoutes.ts](src/routes/admin/parentRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /school/parents/:id |  |
| GET | /schools/:schoolId/parents |  |
| GET | /school/parents/:parentId/children |  |

### [src/routes/admin/guardianRoutes.ts](src/routes/admin/guardianRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /admin/school/guardians |  |
| GET | /student/:studentId/guardian |  |
| GET | /school/:schoolId/guardians |  |
| PUT | /student/:studentId/guardian |  |
| DELETE | /student/:studentId/guardian |  |

## Project Management

### [src/modules/project/routes/projectRoutes.ts](src/modules/project/routes/projectRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /project/:id/labels | Get labels for a project |
| POST | /project/:id/labels | Create a new label |
| PUT | /label/:id | Update a label |
| DELETE | /label/:id | Delete a label |

## Logs

### [src/routes/logRoutes.ts](src/routes/logRoutes.ts)

| Method | Path | Description |
|---|---|---|
| GET | /server/logs | Fetch server logs |
| DELETE | /server/logs | Delete all logs |

# Routes Overview

This document lists the main API route files and their base paths. It serves as a quick reference for contributors to understand how the backend is organized.

```
# Example format
# /api/path -> src/routes/file.ts
```

- `/administrator` -> `src/routes/superadmin/routes`
- `/teachers` -> `src/routes/admin/schoolauthroutes/teacherRoutes`
- `/students` -> `src/routes/admin/schoolauthroutes/studentRoutes`

When new endpoints or route modules are added, please update this document so the API surface remains easy to navigate.

