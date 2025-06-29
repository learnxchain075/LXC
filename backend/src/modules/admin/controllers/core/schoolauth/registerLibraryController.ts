import { Request, Response, NextFunction } from "express";

import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { sendRegistrationEmail } from "../../../../../config/email";
import { uploadFile } from "../../../../../config/upload";
import { prisma } from "../../../../../db/prisma";
import { handlePrismaError } from "../../../../../utils/prismaErrorHandler";
import {
  registerLibrarySchema,
  updateLibrarySchema,
} from "../../../../../validations/Module/SchoolAuth/libraryValidation";


// Create Library User

export const registerLibrary = async (req: Request, res: Response, next: NextFunction):Promise<any>  => {
  try {
    const parsed = registerLibrarySchema.safeParse(req.body);
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
      schoolId,
      sex,
      bloodType,
    } = parsed.data;
    const profilePicFile = req.file;


    // Check if file is uploaded
    if (!profilePicFile || !profilePicFile.buffer) {
      return res.status(400).json({ error: "Profile picture is required." });
    }

    // Upload profile picture to Cloudinary
    const { url } = await uploadFile(
      profilePicFile.buffer,
      "profile_pics",
      "image"
    );

    const tempPassword = randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Use Prisma transaction to ensure all DB ops succeed/fail together
    const [user, library] = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          address,
          city,
          state,
          country,
          pincode,
          sex,
          bloodType,
          profilePic: url,
          password: hashedPassword,
          role: "library",
        },
      });

      const library = await tx.library.create({
        data: {
          school: {
            connect: { id: schoolId },
          },
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          libraryId: library.id,
        },
      });

      return [user, library];
    });

    // Send email after transaction completes
    await sendRegistrationEmail(email, tempPassword);

    res.status(201).json({
      message: "Library User registered successfully.",
      user,
      library,
    });
  } catch (error) {
    next(handlePrismaError(error));
  }
};


// Get all Library Users

export const getAllLibrary = async (req: Request, res: Response) => {
  try {
    const library = await prisma.user.findMany({
      where: {
        role: "library",
      },
    });

    res.status(200).json(library);
  } catch (error) {
    console.error("Error getting Library Users:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get Library User by ID

export const getLibraryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const library = await prisma.library.findUnique({
      where: { id },
    });

    if (!library) {
      res.status(404).json({ error: "Library User not found." });
      return;
    }

    res.status(200).json(library);
  } catch (error) {
    console.error("Error getting Library User:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};


// Update Library User

export const updateLibrary = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const parsed = updateLibrarySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error.errors });
    }
    const { name, email, phone } = parsed.data;

    const library = await prisma.library.update({
      where: { id },
      data: {
        user: {
          update: {
            name,
            email,
            phone,
          },
        },
      },
    });

    res.status(200).json({ message: "Library User updated successfully.", library });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Library User


export const deleteLibrary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "Library User deleted successfully." });
  } catch (error) {
    console.error("Error deleting Library User:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};