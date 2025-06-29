import PDFDocument from 'pdfkit';
import bwipjs from 'bwip-js';
import { Student, User, Class, School } from '@prisma/client';

export const generateStudentIdCard = async (
  student: Student & { user: User; class: Class; school: School & { user: User } }
): Promise<Buffer> => {
  const doc = new PDFDocument({ size: [350, 220], margin: 5 });
  const buffers: Buffer[] = [];

  doc.on('data', d => buffers.push(d));
  doc.on('end', () => {});

  const primary = '#0d47a1';
  const accent = '#42a5f5';
  const bg = '#ffffff';

  // Background and border
  doc.rect(0, 0, 350, 220).fill(bg);
  doc.roundedRect(0.5, 0.5, 349, 219, 8).lineWidth(2).stroke(primary);

  // Header with school name and logo
  doc.fillColor(primary).rect(0, 0, 350, 40).fill();
  if (student.school.schoolLogo) {
    try {
      doc.image(student.school.schoolLogo, 10, 5, { width: 30, height: 30 });
    } catch (err) {
      console.warn('Failed to load school logo');
    }
  }
  doc.fillColor('#fff').fontSize(16).text(student.school.schoolName, 50, 12, {
    align: 'center'
  });
  if (student.school.user.address) {
    doc.fontSize(8).text(student.school.user.address, 0, 28, {
      align: 'center'
    });
  }

  // Student photo
  if (student.user.profilePic) {
    try {
      doc.image(student.user.profilePic, 20, 60, { width: 70, height: 80 });
      doc.rect(20, 60, 70, 80).lineWidth(1).stroke(accent);
    } catch (err) {
      console.warn('Failed to load student photo');
    }
  }

  // Student information
  const textX = 110;
  const startY = 60;

  doc.fillColor(primary)
    .fontSize(11)
    .text(`Name:`, textX, startY)
    .text(`Admission No:`, textX, startY + 18)
    .text(`Class:`, textX, startY + 36)
    .text(`Roll No:`, textX, startY + 54)
    .text(`Blood Group:`, textX, startY + 72)
    .text(`Contact:`, textX, startY + 90);

  doc.fillColor('#000')
    .text(student.user.name, textX + 80, startY)
    .text(student.admissionNo, textX + 80, startY + 18)
    .text(student.class.name, textX + 80, startY + 36)
    .text(student.rollNo, textX + 80, startY + 54)
    .text(student.user.bloodType || '-', textX + 80, startY + 72)
    .text(student.user.phone || '-', textX + 80, startY + 90);

  // Barcode section
  try {
    const barcode = await bwipjs.toBuffer({
      bcid: 'code128',
      text: student.admissionNo,
      scale: 2,
      height: 10,
      includetext: false
    });
    doc.image(barcode, 20, 170, { width: 150, height: 40 });
  } catch (err) {
    console.error('Barcode generation failed', err);
  }

  // Footer bar
  doc.fillColor(accent).rect(0, 210, 350, 10).fill();

  doc.end();

  return new Promise(resolve => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
  });
};
