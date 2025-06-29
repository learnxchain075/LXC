import PDFDocument from 'pdfkit';
import { Student, User, Class, School } from '@prisma/client';

export const generateStudentIdCard = async (
  student: Student & { user: User; class: Class; school: School & { user: User } }
): Promise<Buffer> => {
  const doc = new PDFDocument({ size: [350, 220], margin: 20 });
  const buffers: Buffer[] = [];
  doc.on('data', d => buffers.push(d));

  // Background
  doc.rect(0, 0, 350, 220).fill('#f5f5f5');

  // Header - school name and address
  doc.fillColor('#000').fontSize(16).text(student.school.schoolName, {
    align: 'center'
  });
  doc.fontSize(9).text(student.school.user.address, {
    align: 'center'
  });
  doc.moveDown();

  // Photo
  if (student.user.profilePic) {
    try {
      doc.image(student.user.profilePic, 20, 70, { width: 60, height: 60 });
    } catch (err) {
      // ignore image errors
    }
  }

  // Student info
  const startY = student.user.profilePic ? 70 : doc.y;
  const textX = 90;
  doc.fontSize(12)
    .text(`Name: ${student.user.name}`, textX, startY)
    .text(`Admission No: ${student.admissionNo}`, textX, startY + 20)
    .text(`Class: ${student.class.name}`, textX, startY + 40)
    .text(`Roll No: ${student.rollNo}`, textX, startY + 60)
    .text(`Blood Group: ${student.user.bloodType}`, textX, startY + 80)
    .text(`Contact: ${student.user.phone}`, textX, startY + 100);

  doc.end();

  return await new Promise(resolve => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
  });
};
