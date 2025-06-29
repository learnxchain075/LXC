// import PDFDocument from 'pdfkit';
// import fs from 'fs';
// import path from 'path';

// export const generateDualFeeReceiptPDF = (data: {
//   invoiceNumber: string;
//   paymentDate: string;
//   studentName: string;
//   admissionNo: string;
//   class: string;
//   rollNo: string;
//   fatherName: string;
//   motherName: string;
//   mobile: string;
//   month: string;
//   installmentName: string;
//   totalFee: number;
//   concession: number;
//   fine: number;
//   paidAmount: number;
//   balance: number;
//   paymentMode: string;
//   amountInWords: string;
//   schoolName: string;
//   schoolAddress: string;
//   schoolContact: string;
//   logoPath?: string; // optional logo image path
// }): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const filePath = path.join(
//       __dirname,
//       `../../../tmp/fee_invoice_${data.invoiceNumber}.pdf`
//     );
//     const doc = new PDFDocument({ margin: 40 });

//     const stream = fs.createWriteStream(filePath);
//     doc.pipe(stream);

//     const drawCopy = (title: string) => {
//       // Header
//       if (data.logoPath && fs.existsSync(data.logoPath)) {
//         doc.image(data.logoPath, 40, doc.y, { width: 60 });
//       }

//       doc
//         .fontSize(16)
//         .text(data.schoolName, 0, doc.y, { align: 'center' })
//         .fontSize(10)
//         .text(data.schoolAddress, { align: 'center' })
//         .text(`Tel: ${data.schoolContact}`, { align: 'center' })
//         .text(`Affiliated to CBSE. Affiliation No. XXXX`, { align: 'center' });

//       doc.moveDown(1).fontSize(12).text(`FEE RECEIPT (2025-26) — ${title}`, {
//         align: 'center',
//         underline: true,
//       });
//       doc.moveDown(0.5);

//       // Receipt Metadata
//       doc.fontSize(10);
//       doc.text(`Receipt No: ${data.invoiceNumber}`, { align: 'right' });
//       doc.text(`Receipt Date: ${data.paymentDate}`, { align: 'right' });

//       // Student Info
//       doc.moveDown(0.5);
//       const info = [
//         ['Student Name', data.studentName],
//         ['Admission No', data.admissionNo],
//         ['Class', data.class],
//         ['Roll No', data.rollNo],
//         ["Father's Name", data.fatherName],
//         ["Mother's Name", data.motherName],
//         ['Mobile No', data.mobile],
//       ];

//       info.forEach(([label, value]) => {
//         doc
//           .font('Helvetica-Bold')
//           .text(`${label}: `, { continued: true })
//           .font('Helvetica')
//           .text(value);
//       });

//       // Table Header
//       doc.moveDown(1);
//       const tableTop = doc.y;
//       const colWidths = [180, 70, 70, 60, 60, 60];

//       const drawTableRow = (y: number, row: string[], bold = false) => {
//         const font = bold ? 'Helvetica-Bold' : 'Helvetica';
//         row.forEach((text, i) => {
//           doc.font(font).text(text, 40 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
//             width: colWidths[i],
//             align: 'center',
//             border: true,
//           });
//         });
//       };

//       drawTableRow(tableTop, ['Particulars', 'Installment', 'Fee', 'Concession', 'Fine', 'Paid'], true);
//       drawTableRow(tableTop + 20, [
//         'Complete Fee',
//         data.installmentName,
//         `${data.totalFee}`,
//         `${data.concession}`,
//         `${data.fine}`,
//         `${data.paidAmount}`,
//       ]);

//       // Summary Rows
//       const summaryY = tableTop + 50;
//       doc
//         .font('Helvetica-Bold')
//         .text('Balance: ', 40, summaryY)
//         .font('Helvetica')
//         .text(`₹${data.balance}`, 100, summaryY);

//       doc
//         .font('Helvetica-Bold')
//         .text('Amount in Words: ', 40, summaryY + 15)
//         .font('Helvetica')
//         .text(data.amountInWords, 150, summaryY + 15);

//       doc
//         .font('Helvetica-Bold')
//         .text('Payment Mode: ', 40, summaryY + 30)
//         .font('Helvetica')
//         .text(data.paymentMode, 130, summaryY + 30);

//       // Footer
//       doc
//         .fontSize(9)
//         .fillColor('gray')
//         .text(
//           '*This is system generated fee receipt and does not require any stamp or signature.',
//           40,
//           summaryY + 60,
//           { align: 'center' }
//         )
//         .fillColor('black');

//       doc.moveDown(2);
//     };

//     drawCopy('Student Copy');

//     // Separator line
//     doc
//       .moveTo(40, doc.y)
//       .lineTo(550, doc.y)
//       .dash(5, { space: 3 })
//       .stroke()
//       .undash();

//     drawCopy('Office Copy');

//     doc.end();

//     stream.on('finish', () => resolve(filePath));
//     stream.on('error', reject);
//   });
// };
