import PDFDocument from 'pdfkit';
import { uploadFile } from '../config/upload';
import { Student, User, Class } from '@prisma/client';

export const generateTransferCertificate = async (
  student: Student & { user: User; class: Class }
): Promise<string> => {
  const doc = new PDFDocument({ margin: 50 });
  const buffers: Buffer[] = [];

  doc.on('data', (d) => buffers.push(d));

  doc.fontSize(20).text('Transfer Certificate', { align: 'center' });
  doc.moveDown();
  doc
    .fontSize(12)
    .text(
      `This is to certify that ${student.user.name} (Admission No: ${student.admissionNo}) has been transferred from our institution.`
    );
  doc.moveDown();
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.end();

  const pdfBuffer: Buffer = await new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
  });

  const fileName = `transfer_certificate_${student.admissionNo}.pdf`;
  const { url } = await uploadFile(pdfBuffer, 'transfer_letters', 'raw');
  return url;
};
