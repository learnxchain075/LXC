import PDFDocument from 'pdfkit';
import bwipjs from 'bwip-js';
import { Student, User, Class, School } from '@prisma/client';

export const generateStudentIdCard = async (
  student: Student & { user: User; class: Class; school: School & { user: User } }
): Promise<Buffer> => {
  const doc = new PDFDocument({ size: [350, 220], margin: 10 });
  const buffers: Buffer[] = [];
  doc.on('data', d => buffers.push(d));

  const primary = '#1976d2';
  const bg = '#e3f2fd';

  // Background
  doc.rect(0, 0, 350, 220).fill(bg);

  // Header bar with school name
  doc.fillColor(primary).rect(0, 0, 350, 40).fill(primary);
  doc.fillColor('#fff').fontSize(16).text(student.school.schoolName, 0, 12, {
    align: 'center'
  });
  doc.moveTo(0, 40);

  // Photo
  if (student.user.profilePic) {
    try {
      doc.image(student.user.profilePic, 20, 60, { width: 60, height: 70 });
    } catch (err) {
      // ignore image errors
    }
  }

  // Student info
  const startY = 60;
  const textX = 100;
  doc.fillColor(primary).fontSize(12)
    .text(`Name: ${student.user.name}`, textX, startY)
    .text(`Admission No: ${student.admissionNo}`, textX, startY + 18)
    .text(`Class: ${student.class.name}`, textX, startY + 36)
    .text(`Roll No: ${student.rollNo}`, textX, startY + 54);

  // Barcode
  try {
    const barcode = await bwipjs.toBuffer({
      bcid: 'code128',
      text: student.admissionNo,
      scale: 2,
      height: 10,
      includetext: false
    });
    doc.image(barcode, 20, 150, { width: 150, height: 40 });
  } catch (err) {
    console.error('Barcode generation failed', err);
  }

  doc.end();

  return await new Promise(resolve => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
  });
};
