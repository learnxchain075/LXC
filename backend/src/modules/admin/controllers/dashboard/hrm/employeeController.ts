import { Request, Response, NextFunction } from "express";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { sendRegistrationEmail } from "../../../../../config/email";
import { uploadFile } from "../../../../../config/upload";
import { prisma } from "../../../../../db/prisma";
import { handlePrismaError } from "../../../../../utils/prismaErrorHandler";
import {
  registerStaffSchema,
  updateStaffSchema,
} from "../../../../../validations/Module/AdminDashboard/addStaffValidation";

// Register an Employee
export const registerEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const parsed = registerStaffSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error.errors });
    }

    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      country,
      pincode,
      bloodType,
      sex,
      schoolId,
    } = parsed.data;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    console.log("Logging Request Body" , req.body);

    const profilePicFile = files?.profilePic?.[0];

    if (!profilePicFile || !profilePicFile.buffer) {
      return res.status(400).json({ error: "Profile picture is required." });
    }

    const profilePicUpload = await uploadFile(
      profilePicFile.buffer,
      "profile_pics",
      "image"
    );
    if (!profilePicUpload?.url) {
      return res.status(500).json({ error: "Failed to upload profile picture" });
    }

    const tempPassword = randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        pincode,
        bloodType,
        sex,
        password: hashedPassword,
        profilePic: profilePicUpload.url,
        role: "employee",
        schoolId,
      },
    });

    await sendRegistrationEmail(email, tempPassword);

    res.status(200).json({ message: "Employee registered successfully", user });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Employees
export const getAllEmployees = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const staff = await prisma.user.findMany({
      where: { role: "employee" },
    });
    res.status(200).json({ message: "All employees", staff });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single Employee
export const getEmployee = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const { id } = req.params;
    const staff = await prisma.user.findUnique({
      where: { id },
    });
    if (!staff || staff.role !== "employee") {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee", staff });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update an Employee
export const updateEmployee = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const { id } = req.params;
    const parsed = updateStaffSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error.errors });
    }
    const { name, phone, address, city, state, country, pincode, bloodType, sex } = parsed.data;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let profilePicUrl: string | undefined;

    const existingStaff = await prisma.user.findUnique({ where: { id } });
    if (!existingStaff || existingStaff.role !== "employee") {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (files?.profilePic?.[0]) {
      const upload = await uploadFile(
        files.profilePic[0].buffer,
        "profile_pics",
        "image"
      );
      if (!upload?.url) {
        return res.status(500).json({ message: "Failed to upload profile picture" });
      }
      profilePicUrl = upload.url;
    }

    const updatedStaff = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        address,
        city,
        state,
        country,
        pincode,
        bloodType,
        sex,
        ...(profilePicUrl && { profilePic: profilePicUrl }),
      },
    });

    res.status(200).json({ message: "Employee updated successfully", staff: updatedStaff });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete an Employee
export const deleteEmployee = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const { id } = req.params;

    const existingStaff = await prisma.user.findUnique({ where: { id } });
    if (!existingStaff || existingStaff.role !== "employee") {
      return res.status(404).json({ message: "Employee not found" });
    }

    await prisma.user.delete({ where: { id } });

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Employees of a specific school
export const getEmployeesBySchool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { schoolId } = req.params;

    const staff = await prisma.user.findMany({
      where: {
        role: "employee",
        schoolId,
      },
    });

    res.status(200).json({ message: "All employees of the school", staff });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
