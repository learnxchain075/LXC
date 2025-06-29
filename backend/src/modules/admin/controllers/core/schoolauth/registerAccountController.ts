import { Request, Response } from "express";
import bcrypt from "bcryptjs";
// import { prisma } from "../../../../db/prisma";
// import { uploadFile } from "../../../../config/upload";
// import { sendRegistrationEmail } from "../../../../config/email";
import { randomBytes } from "crypto";
import { sendRegistrationEmail } from "../../../../../config/email";
import { uploadFile } from "../../../../../config/upload";
import { prisma } from "../../../../../db/prisma";
import {
  registerAccountSchema,
  updateAccountSchema,
} from "../../../../../validations/Module/SchoolAuth/accountValidation";

// Register  account

export const registeraccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const parsed = registerAccountSchema.safeParse(req.body);
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

    const [user, account] = await prisma.$transaction(async (tx) => {
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
          role: "account",
        },
      });

      const account = await tx.account.create({
        data: {
          user: { connect: { id: user.id } },
          school: { connect: { id: schoolId } },
        },
      });

      return [user, account];
    });

    // Send registration email outside the transaction
    await sendRegistrationEmail(email, tempPassword);

    res.status(200).json({ message: "Account created successfully", user, account });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};


// Get all Super accounts

export const getAllaccount = async (req: Request, res: Response) => {
  try {
    const account = await prisma.user.findMany({
      where: {
        role: "account",
      },
    });

    res.status(200).json(account);
  } catch (error) {
    console.error("Error getting Super accounts:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get Super account by ID

export const getaccountById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const account = await prisma.user.findUnique({
      where: { id },
    });

    if (!account) {
      res.status(404).json({ error: " account not found." });
      return;
    }

    res.status(200).json(account);
  } catch (error) {
    console.error("Error getting  account:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Update Super account

export const updateaccount = async (req: Request, res: Response) :Promise<any> => {
  try {
    const { id } = req.params;
    const parsed = updateAccountSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error.errors });
    }
    const { name, email, phone, address, city, state, country, pincode } =
      parsed.data;

    const account = await prisma.user.findUnique({
      where: { id },
    });

    if (!account) {
      res.status(404).json({ error: " account not found." });
      return;
    }

    const accounts = await prisma.user.update({
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

    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error updating  account:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Delete  account

export const deleteaccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const account = await prisma.user.findUnique({
      where: { id },
    });

    if (!account) {
      res.status(404).json({ error: " account not found." });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: " account deleted successfully" });
  } catch (error) {
    console.error("Error deleting  account:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
