import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";

import { randomBytes } from "crypto";
import { sendRegistrationEmail } from "../../../../../config/email";
import { uploadFile } from "../../../../../config/upload";
import { prisma } from "../../../../../db/prisma";
import { handlePrismaError } from "../../../../../utils/prismaErrorHandler";
import {
  registerTeacherSchema,
  updateTeacherSchema,
} from "../../../../../validations/Module/SchoolAuth/teacherValidation";

// Register  teacher

export const registerteacher = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = registerTeacherSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
    }
    const {
      name,
      sex,
      email,
      teacherSchoolId,
      phone,
      bloodType,
      dateofJoin,
      fatherName,
      maritalStatus,
      languagesKnown,
      qualification,
      workExperience,
      previousSchool,
      previousSchoolAddress,
      previousSchoolPhone,
      address,
      panNumber,
      status,
      salary,
      contractType,
      dateOfPayment,
      medicalLeave,
      casualLeave,
      maternityLeave,
      sickLeave,
      bankName,
      accountNumber,
      ifscCode,
      branchName,
      hostelName,
      roomNumber,
      facebook,
      twitter,
      linkedin,
      instagram,
      youtube,
      schoolId,
      city,
      state,
      country,
      pincode,
      motherName,
      dateOfBirth,
    } = parsed.data;

    console.log(req.body);

    // Extract files from req.files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    console.log(files);
    const profilePicFile = files?.profilePic?.[0];
    const ResumeFile = files?.Resume?.[0];
    const joiningLetterFile = files?.joiningLetter?.[0];
    console.log("Logging Requested File", profilePicFile, ResumeFile, joiningLetterFile);
    if (!profilePicFile || !ResumeFile || !joiningLetterFile) {
      return res.status(400).json({ error: "Required files are missing." });
    }

    // **Step 3: Upload files to Cloudinary in parallel**
    const [profilePicUpload, resumeUpload, joiningLetterUpload] = await Promise.all([
      uploadFile(profilePicFile.buffer, "profile_pics", "image", profilePicFile.originalname),
      uploadFile(ResumeFile.buffer, "resumes", "raw", ResumeFile.originalname),
      uploadFile(joiningLetterFile.buffer, "joining_letters", "raw", joiningLetterFile.originalname),
    ]);

    // **Step 4: Generate temporary password**
    const tempPassword = randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // **Step 5: Perform database operations in a transaction**
    const result = await prisma.$transaction(async (tx) => {
      // Create the user record
      const teacherUser = await tx.user.create({
        data: {
          name,
          sex,
          email,
          phone,
          bloodType,
          address,
          city,
          state,
          country,
          pincode,
          role: "teacher",
          profilePic: profilePicUpload.url,
          password: hashedPassword,
        },
      });

      // Create the teacher record linked to the user
      const teacher = await tx.teacher.create({
        data: {
          user: { connect: { id: teacherUser.id } },
          teacherSchoolId,
          dateofJoin,
          fatherName,
          maritalStatus,
          languagesKnown,
          qualification,
          workExperience,
          previousSchool,
          previousSchoolAddress,
          previousSchoolPhone,
          motherName,
          dateOfBirth,
          panNumber,
          status,
          salary,
          contractType,
          dateOfPayment,
          medicalLeave,
          casualLeave,
          maternityLeave,
          sickLeave,
          bankName,
          accountNumber,
          ifscCode,
          branchName,
          hostelName,
          roomNumber,
          facebook,
          twitter,
          linkedin,
          instagram,
          youtube,
          faceImage: profilePicUpload.url,
          Resume: resumeUpload.url,
          joiningLetter: joiningLetterUpload.url,
          school: { connect: { id: schoolId } },
        },
      });

      // Update the user with the teacherId
      await tx.user.update({
        where: { id: teacherUser.id },
        data: { teacherId: teacher.id },
      });

      // Return the teacher object for use after the transaction
      return teacher;
    });

    // **Step 6: Send registration email after successful transaction**
    try {
      await sendRegistrationEmail(email, tempPassword);
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
      // Log the error but don't affect the response since the database operations succeeded
    }

    // **Step 7: Send success response**
    res.status(200).json({ message: "Teacher created successfully", teacher: result });
  } catch (error) {
    // Pass any errors (including transaction rollbacks) to the error handler
    next(handlePrismaError(error));
  }
};

// Get all  teachers

export const getAllteacher = async (req: Request, res: Response) => {
  try {
    const teacher = await prisma.user.findMany({
      where: {
        role: "teacher",
      },
      include: {
        teacher: {
          include: {
            school: true,
            lessons: {
              include: {
                class: true,
                subject: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error getting Super teachers:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get  teacher by ID

export const getteacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true, // Include user details
        school: true, // Include school details
        lessons: {
          include: {
            class: {
              include: {
                Section: true, // Include section details inside class (if class -> section is nested)
              },
            },
            subject: true, // Include subject details
          },
        },
      },
    });

    if (!teacher) {
      res.status(404).json({ error: " teacher not found." });
      return;
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error getting  teacher:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Update  teacher

export const updateteacher = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const parsed = updateTeacherSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
    }
    const { name, email, phone, address, city, state, country, pincode } = parsed.data;

    const files = req.files as { [field: string]: Express.Multer.File[] } | undefined;
    const profilePicFile = files?.profilePic?.[0];
    let profilePicUrl: string | undefined;
    if (profilePicFile) {
      const uploadResult = await uploadFile(
        profilePicFile.buffer,
        'profile_pics',
        'image',
        profilePicFile.originalname
      );
      profilePicUrl = uploadResult.url;
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      res.status(404).json({ error: " teacher not found." });
      return;
    }

    const teachers = await prisma.user.update({
      where: { id: teacher.userId },
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        pincode,
        ...(profilePicUrl ? { profilePic: profilePicUrl } : {}),
      },
    });

    if (profilePicUrl) {
      await prisma.teacher.update({
        where: { id },
        data: { faceImage: profilePicUrl },
      });
    }

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error updating  teacher:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Delete  teacher

export const deleteteacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.user.findUnique({
      where: { id },
    });

    if (!teacher) {
      res.status(404).json({ error: " teacher not found." });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: " teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting  teacher:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get all  teachers by school

export const getAllteacherBySchool = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;

    const teachers = await prisma.teacher.findMany({
      where: {
        schoolId,
      },
      include: {
        user: true, // Include user details
        school: true, // Include school details
        lessons: {
          include: {
            class: true, // Include class details
            subject: true, // Include subject details
            teacher: true, // Optional: include teacher details inside each lesson
          },
        },
      },
    });

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error getting teachers:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
