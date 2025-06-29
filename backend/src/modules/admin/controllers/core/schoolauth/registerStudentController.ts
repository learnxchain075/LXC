import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

import { randomBytes } from "crypto";
import { sendRegistrationEmail } from "../../../../../config/email";
import { uploadFile } from "../../../../../config/upload";
import { prisma } from "../../../../../db/prisma";
import { ApiError } from "../../../../../utils/apiError";
import { handlePrismaError } from "../../../../../utils/prismaErrorHandler";
import {
  registerStudentSchema,
  updateStudentSchema,
} from "../../../../../validations/Module/SchoolAuth/studentValidation";

// Register  student

export const registerstudent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = registerStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
    }
    const {
      email,
      phone,
      academicYear,
      admissionNo,
      admissionDate,
      rollNo,
      status,
      name,
      sex,
      dateOfBirth,
      bloodType,
      Religion,
      category,
      primaryContact,
      caste,
      motherTongue,
      languagesKnown,
      fatherName,
      fatheremail,
      fatherPhone,
      fatherOccupation,
      motherName,
      motherOccupation,
      motherEmail,
      motherPhone,
      guardianName,
      guardianRelation,
      guardianEmail,
      guardianPhone,
      guardianOccupation,
      guardianAddress,
      areSiblingStudying,
      siblingName,
      siblingClass,
      siblingRollNo,
      siblingAdmissionNo,
      currentAddress,
      permanentAddress,
      vehicleNumber,
      // pickUpPoint,
      hostelName,
      roomNumber,
      // medicaConditon,
      medicalCondition,
      allergies,
      medicationName,
      schoolName,
      schoolId,
      classId,
      address,
      city,
      state,
      country,
      pincode,
    } = parsed.data;

    console.log("Raw request body:", req.body);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log("Media Files:", req.files);
    const profilePicFile = files?.profilePic?.[0];
    const medicalCertificate = files?.medicalCertificate?.[0];
    const transferCertificate = files?.transferCertificate?.[0];

    if (!profilePicFile || !medicalCertificate || !transferCertificate) {
      return res.status(400).json({ error: "Required files are missing." });
    }

    // ✅ Check active subscription and enforce student user limit
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        schoolId,
        isActive: true,
        endDate: { gte: new Date() },
      },
    });

    if (!activeSubscription) {
      return res.status(403).json({ error: "No active subscription found for this school." });
    }

    const currentStudentCount = await prisma.student.count({
      where: { schoolId },
    });

    if (activeSubscription.userLimit !== null && currentStudentCount >= activeSubscription.userLimit) {
      return res.status(403).json({ error: "Student limit reached for your subscription plan." });
    }

    // Upload files to Cloudinary in parallel
    const [profilePicUpload, medicalCertificateUpload, transferCertificateUpload] = await Promise.all([
      uploadFile(profilePicFile.buffer, "profile_pics", "image", profilePicFile.originalname),
      uploadFile(medicalCertificate.buffer, "medical_certificate", "raw", medicalCertificate.originalname),
      uploadFile(transferCertificate.buffer, "transfer_letters", "raw", transferCertificate.originalname),
    ]);

    // Generate temporary passwords
    const tempStudentPassword = randomBytes(6).toString("hex");

    console.log("Temp Student Password:", tempStudentPassword);
    const hashedStudentPassword = await bcrypt.hash(tempStudentPassword, 10);

    // Execute transaction
    const result = await prisma.$transaction(
      async (tx) => {
        console.log("Starting transaction");

        // Create student user
        const studentUser = await tx.user.create({
          data: {
            name,
            sex,
            email,
            phone,
            address,
            city,
            state,
            country,
            pincode,
            bloodType,
            password: hashedStudentPassword,
            role: "student",
            profilePic: profilePicUpload.url,
          },
        });
        console.log("Student user created:", studentUser.id);

        // Create student record
        const student = await tx.student.create({
          data: {
            user: { connect: { id: studentUser.id } },
            academicYear,
            admissionNo,
            admissionDate,
            rollNo,
            status,
            dateOfBirth,
            Religion,
            category,
            caste,
            motherTongue,
            languagesKnown,
            fatherName,
            fatheremail: fatheremail ?? null,
            fatherPhone,
            fatherOccupation,
            motherName,
            motherOccupation: motherOccupation ?? null,
            motherEmail: motherEmail ?? null,
            motherPhone,
            guardianName,
            guardianRelation,
            guardianEmail,
            guardianPhone,
            guardianOccupation,
            guardianAddress,
            areSiblingStudying,
            siblingName,
            siblingClass,
            siblingRollNo,
            siblingAdmissionNo,
            currentAddress,
            permanentAddress,
            vehicleNumber,

            // busPickupId,

            hostelName,
            roomNumber,
            medicalCondition,
            allergies,
            medicationName,
            schoolName,
            address,
            medicalCertificate: medicalCertificateUpload.url,
            transferCertificate: transferCertificateUpload.url,
            school: { connect: { id: schoolId } },
            class: { connect: { id: classId } },
          },
        });
        console.log("Student record created:", student.id);

        // Check for existing parent
        const existingParentUser = await tx.user.findFirst({
          where: { email: guardianEmail, role: "parent" },
          include: { parent: true },
        });
        console.log("Existing parent user:", existingParentUser ? existingParentUser.id : "not found");

        let parent;

        let tempParentPassword: string | null = null;

        if (!existingParentUser) {
          // Create new parent user
           tempParentPassword = randomBytes(6).toString("hex");
          console.log("Temp Parent Password:", tempParentPassword);
          const hashedParentPassword = await bcrypt.hash(tempParentPassword, 10);
          console.log(hashedParentPassword);

          const parentUser = await tx.user.create({
            data: {
              name: guardianName,
              email: guardianEmail,
              phone: guardianPhone,
              sex,
              address,
              city,
              state,
              country,
              pincode,
              bloodType,
              password: hashedParentPassword,
              role: "parent",
            },
          });
          console.log("Parent user created:", parentUser.id);

          // Create parent record
          parent = await tx.parent.create({
            data: {
              role: "parent",
              user: { connect: { id: parentUser.id } },
              students: { connect: { id: student.id } },
            },
          });
          console.log("Parent record created:", parent.id);
        } else {
          // Update existing parent
          const existingParentRecord = existingParentUser.parent;
          if (!existingParentRecord) {
            throw new Error("Parent record not found for existing parent user.");
          }
          parent = await tx.parent.update({
            where: { id: existingParentRecord.id },
            data: { students: { connect: { id: student.id } } },
          });
          console.log("Parent record updated:", parent.id);
        }

        // Update student user with studentId
        await tx.user.update({
          where: { id: studentUser.id },
          data: { studentId: student.id },
        });
        console.log("Student user updated with studentId");

        // Update parent user with parentId
        if (!parent.userId) throw new Error("Parent userId is undefined.");
        await tx.user.update({
          where: { id: parent.userId },
          data: { parentId: parent.id },
        });
        console.log("Parent user updated with parentId");

        return {
          student,
          parent,
          tempStudentPassword,
          // tempParentPassword: !existingParentUser ? tempStudentPassword : null,
          tempParentPassword: !existingParentUser ? tempParentPassword : null,
        };
      },
      { timeout: 15000, maxWait: 10000 }
    );

    // Send emails outside transaction
    try {
      await sendRegistrationEmail(email, result.tempStudentPassword);
      console.log("Student email sent");
    } catch (emailError) {
      console.error("Failed to send student email:", emailError);
    }

    if (result.tempParentPassword) {
      setTimeout(() => {
        sendRegistrationEmail(guardianEmail, result.tempParentPassword!).catch((emailError) =>
          console.error("Failed to send parent email:", emailError)
        );
      }, 0);
    } else {
      setTimeout(() => {
        sendNotificationEmail(guardianEmail, "A new child has been added to your account.").catch((emailError: any) =>
          console.error("Failed to send parent notification:", emailError)
        );
      }, 0);
    }

    // Send success response
    res.status(200).json({
      message: "Student and parent processed successfully",
      student: result.student,
      parent: result.parent,
    });
  } catch (error: any) {
    console.error("Transaction failed:", error);
    next(handlePrismaError(error));
  }
};

// Get all  students

export const getAllstudent = async (req: Request, res: Response) => {
  try {
    const student = await prisma.user.findMany({
      where: {
        role: "student",
      },
    });

    res.status(200).json(student);
  } catch (error) {
    console.error("Error getting Super students:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get Super student by ID

export const getstudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await prisma.user.findUnique({
      where: { id },
      include: {
        parent: true,
        student: true,
      },
    });

    if (!student) {
      res.status(404).json({ error: " student not found." });
      return;
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error getting  student:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Update Super student

export const updatestudent = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const parsed = updateStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
    }
    const { name, email, phone, address, city, state, country, pincode } = parsed.data;

    const student = await prisma.user.findUnique({
      where: { id },
    });

    if (!student) {
      res.status(404).json({ error: " student not found." });
      return;
    }

    const students = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        pincode,
      },
    });

    res.status(200).json(students);
  } catch (error) {
    console.error("Error updating  student:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Delete  student

export const deletestudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await prisma.user.findUnique({
      where: { id },
    });

    if (!student) {
      res.status(404).json({ error: " student not found." });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: " student deleted successfully" });
  } catch (error) {
    console.error("Error deleting  student:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
async function sendNotificationEmail(guardianEmail: string, message: string): Promise<void> {
  // Implement the logic to send an email
  console.log(`Sending notification email to ${guardianEmail} with message: ${message}`);
  return Promise.resolve();
}

function next(arg0: ApiError) {
  throw new Error("Function not implemented.");
}

// Get student of a school

export const getSchoolStudents = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;

    const students = await prisma.student.findMany({
      where: {
        schoolId,
      },
      include: {
        user: true, // include the related user details
      },
    });

    res.status(200).json(students);
  } catch (error) {
    console.error("Error getting school students:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
