const mockApi = {
  attendance: {
    series: [75, 10, 15], // Present, Absent, Late
    details: [
      { date: "2025-06-01", status: "Present" },
      { date: "2025-06-02", status: "Absent" },
      { date: "2025-06-03", status: "Late" },
    ],
  },
  academicResources: {
    Assignment: [
      { id: 1, title: "Math Assignment 1", dueDate: "2025-06-10" },
      { id: 2, title: "Science Assignment 2", dueDate: "2025-06-15" },
    ],
    PYQ: [
      { id: 1, title: "Math PYQ 2024", link: "#" },
      { id: 2, title: "Science PYQ 2023", link: "#" },
    ],
    Homework: [
      { id: 1, title: "English Essay", dueDate: "2025-06-05" },
      { id: 2, title: "History Project", dueDate: "2025-06-20" },
    ],
  },
  noticeBoard: {
    notices: [
      { title: "School Reopening", date: "2025-06-01", description: "School reopens after summer break." },
      { title: "Parent-Teacher Meeting", date: "2025-06-15", description: "Meeting to discuss student progress." },
    ],
    holidays: [
      { title: "Summer Break", startDate: "2025-07-01", endDate: "2025-07-15" },
      { title: "Winter Break", startDate: "2025-12-20", endDate: "2026-01-05" },
    ],
  },
  fees: {
    total: 10000,
    paid: 6000,
    due: 4000,
  },
};

export default mockApi;