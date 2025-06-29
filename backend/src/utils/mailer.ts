import nodemailer from "nodemailer";
import ejs from "ejs";
import * as aws from "@aws-sdk/client-ses";
import Mail from "nodemailer/lib/mailer";

import { CONFIG } from "../config";
import Logger from "./logger";
import { getErrorMessage, getErrorStack } from "./common_utils";
import { prisma } from "../db/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendExceptionToSupport = (error: any, subject = "Exception Occurred", extraData: string = "") => {
  if (!CONFIG.IS_DEVELOPMENT) {
    Logger.error(error);
    sendErrorMessageToSupport(getErrorStack(error), subject, extraData);
  } else {
    console.error(error);
  }
};

export const sendErrorMessageToSupport = (
  message: string,
  subject: string = "Error Occurred",
  extraData: string = ""
) => {
  renderAndSendEmail(
    "error",
    {
      error: message,
      extraData: extraData,
    },
    subject,
    CONFIG.SUPPORT_EMAIL
  ).catch((error) => {
    Logger.error(getErrorMessage(error));
  });
};

// Send invoice email

export const sendInvoiceEmail = async (
  emailTo: string,
  invoiceNumber: string,
  amount: number,
  gstDetails?: { baseAmount: number; gstAmount: number; totalAmount: number }
) => {
  const { baseAmount = 0, gstAmount = 0, totalAmount = amount } = gstDetails || {};

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Invoice - ${invoiceNumber}</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          color: #333;
          background: #f9f9f9;
          padding: 40px;
        }

        .invoice-box {
          max-width: 700px;
          margin: auto;
          padding: 30px;
          border: 1px solid #eee;
          background: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        }

        .logo {
          max-height: 60px;
          margin-bottom: 20px;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
          margin-top: 10px;
        }

        .details, .totals {
          margin: 20px 0;
        }

        .details table, .totals table {
          width: 100%;
          line-height: 1.5;
          text-align: left;
        }

        .totals td {
          padding: 8px 0;
        }

        .totals .label {
          font-weight: bold;
        }

        .footer {
          text-align: center;
          font-size: 12px;
          color: #777;
          margin-top: 30px;
        }

        .highlight {
          color: #007bff;
          font-weight: bold;
        }
      </style>
    </head>

    <body>
      <div class="invoice-box">
        <img src="https://learnxchain.io/logo.png" alt="LearnXChain Logo" class="logo" />

        <div class="title">Payment Invoice</div>

        <div class="details">
          <table>
            <tr>
              <td><strong>Invoice Number:</strong> ${invoiceNumber}</td>
              <td><strong>Date:</strong> ${new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td><strong>To:</strong> ${emailTo}</td>
              <td><strong>Status:</strong> Paid</td>
            </tr>
          </table>
        </div>

        <hr />

        <div class="totals">
          <table>
            <tr>
              <td class="label">Base Amount:</td>
              <td>₹ ${baseAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="label">GST (18%):</td>
              <td>₹ ${gstAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="label highlight">Total Amount Paid:</td>
              <td class="highlight">₹ ${totalAmount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <p>Thank you for subscribing to <strong>LearnXChain</strong>!</p>

        <div class="footer">
          LearnXChain LLLP.<br />
          support@learnxchain.io | +91-7015290569<br />
          CIN: ACM-8542 | GSTIN: XXXXXXXXXXXX
        </div>
      </div>
    </body>
  </html>
  `;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});


  await transporter.sendMail({
    from: `"LearnXChain" <${process.env.MAIL_USER}>`,
    to: emailTo,
    subject: "Payment Invoice",
    html: htmlContent,
  });
};

// Send transfer certificate email with attachment
export const sendTransferCertificateEmail = async (
  emailTo: string,
  studentName: string,
  admissionNo: string,
  certificateUrl: string
) => {
  await renderAndSendEmail(
    "transfer-certificate",
    {
      studentName,
      admissionNo,
      date: new Date().toLocaleDateString(),
    },
    "Transfer Certificate",
    emailTo,
    { attachments: [{ filename: "TransferCertificate.pdf", path: certificateUrl }] }
  );
};

export const sendInvoicePdfEmail = async (
  emailTo: string,
  invoiceUrl: string,
  pdfBuffer?: Buffer
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const attachment = pdfBuffer
    ? { filename: "invoice.pdf", content: pdfBuffer }
    : { filename: "invoice.pdf", path: invoiceUrl };

  await transporter.sendMail({
    from: `"LearnXChain" <${process.env.MAIL_USER}>`,
    to: emailTo,
    subject: "Invoice",
    text: "Please find your invoice attached.",
    attachments: [attachment],
  });
};

export const renderAndSendEmail = async (
  templateName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateData: { [key: string]: any },
  emailSubject: string,
  emailTo: string,
  mailOptions: Mail.Options = {}
) => {
  const emailContent = (await ejs.renderFile(`src/templates/${templateName}.ejs`, {
    ...templateData,
    imageBaseUrl: CONFIG.EMAIL_IMAGE_BASE_URL,
    teamName: CONFIG.TEAM_NAME,
  })) as string;

  const content = (await ejs.renderFile(`src/templates/main.ejs`, {
    content: emailContent,
    subject: emailSubject,
    imageBaseUrl: CONFIG.EMAIL_IMAGE_BASE_URL,
  })) as string;

  try {
    await sendMail(content, emailTo, emailSubject, mailOptions);
  } catch (error) {
    Logger.error(error);
  }
};

const getGmailMailTransporter = async () => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: CONFIG.EMAIL_AUTH_USERNAME,
      pass: CONFIG.EMAIL_AUTH_PASSWORD,
    },
    secure: true, // true for 465, false for other ports
  });

  return transporter;
};

const getAWSSESMailTransporter = async () => {
  // console.log(CONFIG.EMAIL_AWSSES_REGION, CONFIG.EMAIL_AUTH_USERNAME, CONFIG.EMAIL_AUTH_PASSWORD);

  const ses = new aws.SES({
    apiVersion: "2010-12-01",
    region: CONFIG.EMAIL_AWSSES_REGION,
    credentials: {
      accessKeyId: CONFIG.EMAIL_AUTH_USERNAME,
      secretAccessKey: CONFIG.EMAIL_AUTH_PASSWORD,
    },
  });

  const transporter = nodemailer.createTransport({
    SES: { ses, aws },
  });

  return transporter;
};

const sendMail = async (
  htmlEmailContent: string,
  receiver: string,
  subject: string,
  mailOptions: Mail.Options = {}
) => {
  try {
    const transporter =
      CONFIG.EMAIL_TRANSPORT === "AWSSES" ? await getAWSSESMailTransporter() : await getGmailMailTransporter();

    const mailData = {
      from: `${CONFIG.EMAIL_FROM_NAME} <${CONFIG.EMAIL_FROM_EMAIL}>`, // sender address
      to: receiver,
      subject: subject,
      html: htmlEmailContent,
      ...mailOptions,
    };

    const sendMailResponseObj = await transporter.sendMail(mailData);

    if (sendMailResponseObj && CONFIG.EMAIL_TRANSPORT === "ETHEREAL") {
      Logger.info("Preview URL: " + nodemailer.getTestMessageUrl(sendMailResponseObj));
    }

    if (sendMailResponseObj && sendMailResponseObj.messageId) {
      return sendMailResponseObj;
    }
  } catch (err) {
    throw err;
  }
};

export const sendFeeInvoiceEmail = async (to: string, paymentId: string, amountPaid: number) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      fee: {
        include: {
          student: {
            include: {
              user: true,
              parent: {
                include: {
                  user: true,
                },
              },
            },
          },
          school: true,
        },
      },
    },
  });

  if (!payment || !payment.fee || !payment.fee.student || !payment.fee.school) return;

  const { fee } = payment;
  const { student, school } = fee;

  const pendingAmount = fee.amount - fee.amountPaid;

  const classInfo = await prisma.class.findUnique({
  where: { id: student.classId },
  select: { name: true },
});
const paymentDate = new Date(payment.updatedAt);
const formattedDate = paymentDate.toLocaleDateString();
const formattedTime = paymentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


  const emailHTML = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Fee Invoice</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          background: #fff;
          max-width: 700px;
          margin: 40px auto;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          color: #333;
        }
        .header {
          text-align: center;
        }
        .header img {
          max-height: 80px;
          margin-bottom: 10px;
        }
        .header h2 {
          color: #2d6cdf;
          margin: 0;
        }
        .invoice-title {
          margin-top: 30px;
          font-size: 20px;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }
        .info-table {
          width: 100%;
          margin-top: 20px;
          border-collapse: collapse;
        }
        .info-table td {
          padding: 12px 10px;
          border-bottom: 1px solid #eee;
        }
        .info-table td.label {
          font-weight: 600;
          color: #555;
          width: 45%;
        }
        .status-paid {
          color: #28a745;
          font-weight: bold;
        }
        .status-partial {
          color: #ff9800;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 14px;
          color: #777;
        }
        .footer strong {
          color: #444;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${school.schoolLogo ? `<img src="${school.schoolLogo}" alt="${school.schoolName} Logo" />` : ""}
          <h2>${school.schoolName}</h2>
        </div>

        <div class="invoice-title">📄 Fee Payment Invoice</div>

        <table class="info-table">
          <tr><td class="label">Student Name:</td><td>${student.user?.name || "N/A"}</td></tr>
          <tr><td class="label">Email:</td><td>${student.user?.email || "N/A"}</td></tr>
          <tr><td class="label">Phone:</td><td>${student.user?.phone || "N/A"}</td></tr>
          <tr><td class="label">Class:</td><td>${classInfo?.name || "N/A"}</td></tr>
          <tr><td class="label">Invoice Number:</td><td>${payment.id}</td></tr>
          <tr><td class="label">Payment Date:</td><td>${formattedDate}</td></tr>
        <tr><td class="label">Payment Time:</td><td>${formattedTime}</td></tr>
          <tr><td class="label">Payment Date:</td><td>${new Date(payment.updatedAt).toLocaleDateString()}</td></tr>
          <tr><td class="label">Payment Method:</td><td>${payment.paymentMethod || "N/A"}</td></tr>
          <tr><td class="label">Total Fee:</td><td>₹${fee.amount}</td></tr>
          <tr><td class="label">Amount Paid:</td><td>₹${amountPaid}</td></tr>
          <tr><td class="label">Pending Amount:</td><td>₹${pendingAmount}</td></tr>
          <tr>
            <td class="label">Fee Status:</td>
            <td class="${fee.status === "PAID" ? "status-paid" : "status-partial"}">${fee.status}</td>
          </tr>
        </table>

        <div class="footer">
          <p>Thank you for your payment!</p>
          <p><strong>Powered by LearnXChain</strong></p>
        </div>
      </div>
    </body>
  </html>
  `;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

  // ✅ Collect emails
  const recipients = new Set<string>();

  if (to) recipients.add(to);
  if (student.user?.email) recipients.add(student.user.email);
  if (student.guardianEmail) recipients.add(student.guardianEmail);
  if (Array.isArray(student.parent)) {
    for (const parent of student.parent) {
      if (parent.user?.email) {
        recipients.add(parent.user.email);
      }
    }
  }

  for (const email of recipients) {
    await transporter.sendMail({
      from: `"${school.schoolName} via LearnXChain" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "🎓 Fee Invoice – Payment Confirmation",
      html: emailHTML,
    });
  }
};
