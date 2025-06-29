import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { sendRegistrationEmail } from "../../../../../config/email";
import { uploadFile } from "../../../../../config/upload";
import { prisma } from "../../../../../db/prisma";
import { registerHostelSchema, updateHostelSchema } from "../../../../../validations/Module/SchoolAuth/hostelValidation";

// Register  hostel

export const registerhostel = async (req: Request, res: Response):Promise<any>  => {
  try {
    const parsed = registerHostelSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error.errors });
    }
    const {
      name,
      email,
      hostelName,
      capacity,
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

    // Upload profile picture
    const { url } = await uploadFile(
      profilePicFile.buffer,
      "profile_pics",
      "image"
    );

    const tempPassword = randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create user + hostel in a transaction
    const [user, hostel] = await prisma.$transaction(async (tx) => {
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
          role: "hostel",
        },
      });

      const hostel = await tx.hostel.create({
        data: {
          hostelName,
          capacity: parseInt(capacity, 10),
          user: { connect: { id: user.id } },
          school: { connect: { id: schoolId } },
        },
      });

      return [user, hostel];
    });

    // Send email outside transaction
    await sendRegistrationEmail(email, tempPassword);

    res.status(200).json({ message: "Hostel created successfully", user, hostel });
  } catch (error) {
    console.error("Error creating hostel:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};


// Get all Super hostels

export const getAllhostel = async (req: Request, res: Response) => {
  try {
    const hostel = await prisma.user.findMany({
      where: {
        role: "hostel",
      },
    });

    res.status(200).json(hostel);
  } catch (error) {
    console.error("Error getting Super hostels:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get Super hostel by ID

export const gethostelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hostel = await prisma.user.findUnique({
      where: { id },
    });

    if (!hostel) {
      res.status(404).json({ error: " hostel not found." });
      return;
    }

    res.status(200).json(hostel);
  } catch (error) {
    console.error("Error getting  hostel:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Update Super hostel

export const updatehostel = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;
    const parsed = updateHostelSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error.errors });
    }
    const { name, email, phone, address, city, state, country, pincode } =
      parsed.data;

    const hostel = await prisma.user.findUnique({
      where: { id },
    });

    if (!hostel) {
      res.status(404).json({ error: " hostel not found." });
      return;
    }

    const hostels = await prisma.user.update({
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

    res.status(200).json(hostels);
  } catch (error) {
    console.error("Error updating  hostel:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Delete  hostel

export const deletehostel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hostel = await prisma.user.findUnique({
      where: { id },
    });

    if (!hostel) {
      res.status(404).json({ error: " hostel not found." });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: " hostel deleted successfully" });
  } catch (error) {
    console.error("Error deleting  hostel:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
