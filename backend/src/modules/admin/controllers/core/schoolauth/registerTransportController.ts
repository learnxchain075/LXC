import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { randomBytes } from "crypto";
import { sendRegistrationEmail } from "../../../../../config/email";
import { uploadFile } from "../../../../../config/upload";
import { prisma } from "../../../../../db/prisma";
import {
  registerTransportSchema,
  updateTransportSchema,
} from "../../../../../validations/Module/SchoolAuth/transportValidation";

// Register  transport

export const registertransport = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsed = registerTransportSchema.safeParse(req.body);
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

    // Check if profile picture is uploaded
    if (!profilePicFile || !profilePicFile.buffer) {
      res.status(400).json({ error: "Profile picture is required." });
      return;
    }

    // Upload profile picture to Cloudinary
    const { publicId, url } = await uploadFile(
      profilePicFile.buffer,
      "profile_pics",
      "image"
    );

    // Generate a temporary password and hash it
    const tempPassword = randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Perform user and transport creation in a transaction
    const [user, transport] = await prisma.$transaction(async (tx) => {
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
          role: "transport",
        },
      });

      const transport = await tx.transport.create({
        data: {
          user: { connect: { id: user.id } },
          school: { connect: { id: schoolId } },
        },
      });

      return [user, transport];
    });

    // Send registration email with the temporary password
    try {
      await sendRegistrationEmail(email, tempPassword);
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
      // Note: We proceed with success response since DB operations succeeded
    }

    // Send success response
    res.status(200).json({ message: "transport created successfully", user, transport });
  } catch (error) {
    console.error("Error creating transport:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get all Super transports

export const getAlltransport = async (req: Request, res: Response) => {
  try {
    const transport = await prisma.user.findMany({
      where: {
        role: "transport",
      },
    });

    res.status(200).json(transport);
  } catch (error) {
    console.error("Error getting Super transports:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get Super transport by ID

export const gettransportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transport = await prisma.user.findUnique({
      where: { id },
    });

    if (!transport) {
      res.status(404).json({ error: " transport not found." });
      return;
    }

    res.status(200).json(transport);
  } catch (error) {
    console.error("Error getting  transport:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Update Super transport

export const updatetransport = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const parsed = updateTransportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error.errors });
    }
    const { name, email, phone, address, city, state, country, pincode } =
      parsed.data;

    const transport = await prisma.user.findUnique({
      where: { id },
    });

    if (!transport) {
      res.status(404).json({ error: " transport not found." });
      return;
    }

    const transports = await prisma.user.update({
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

    res.status(200).json(transports);
  } catch (error) {
    console.error("Error updating  transport:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Delete  transport

export const deletetransport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transport = await prisma.user.findUnique({
      where: { id },
    });

    if (!transport) {
      res.status(404).json({ error: " transport not found." });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: " transport deleted successfully" });
  } catch (error) {
    console.error("Error deleting  transport:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
