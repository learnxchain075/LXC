import { Request, Response } from "express";
import { prisma } from "../../../db/prisma";
import { userIdParamSchema } from "../../../validations/Module/SuperadminDashboard/userValidation";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profilePic: true,
        address: true,
        city: true,
        state: true,
        country: true,
        pincode: true,
        bloodType: true,
        sex: true,
        teacherId: true,
        role: true,
        school: {
          select: {
            schoolName: true,
            schoolLogo: true,
          },
        },
        teacher: true, // Include full Teacher data
        student: true, // Include full Student data
        parent: true, // Include full Parent data
        library: true, // Include full Library data
        hostel: true, // Include full Hostel data
        transport: true, // Include full Transport data
        account: true, // Include full Account data
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) :Promise<any> => {
  try {
    const params = userIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ success: false, message: "Invalid id", errors: params.error.errors });
    }

    const { id } = params.data;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profilePic: true,
        address: true,
        city: true,
        state: true,
        country: true,
        pincode: true,
        bloodType: true,
        sex: true,
        role: true,
        teacherId: true,
        school: {
          select: {
            schoolName: true,
            schoolLogo: true,
          },
        },
        teacher: true, // Include full Teacher data
        student: true, // Include full Student data
        parent: true, // Include full Parent data
        library: true, // Include full Library data
        hostel: true, // Include full Hostel data
        transport: true, // Include full Transport data
        account: true, // Include full Account data
        createdAt: true,

        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
