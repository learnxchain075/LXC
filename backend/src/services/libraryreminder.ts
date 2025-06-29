import { prisma } from "../db/prisma";
import cron from "node-cron";

// reminders.js

export const sendOverdueReminders = async () => {
  const overdueIssues = await prisma.bookIssue.findMany({
    where: {
      returnDate: null,
      dueDate: { lt: new Date() },
    },
    include: { user: true, bookCopy: { include: { book: true } } },
  });

  overdueIssues.forEach((issue: { user: { email: any }; bookCopy: { book: { title: any } } }) => {
    console.log(`Reminder: User ${issue.user.email} has overdue book ${issue.bookCopy.book.title}`);
    // Implement email/notification logic here
  });
};

// const sendNewEditionReminders = async () => {
//     const booksToCheck = await prisma.book.findMany({
//       where: {
//         nextEditionCheck: { lt: new Date() },
//       },
//       include: { library: { include: { user: true } } },
//     });
  
//     booksToCheck.forEach(book => {
//       const recipient = book.library.user || book.library.schoolId.user;
//       console.log(`Reminder: Check new edition for ${book.title} to ${recipient.email}`);
//       // Implement notification logic
//     });
//   };

// Schedule tasks (e.g., run daily at midnight)
cron.schedule("0 0 * * *", sendOverdueReminders);
// cron.schedule("0 0 * * *", sendNewEditionReminders);
