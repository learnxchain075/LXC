/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  registerDriverSchema,
  updateDriverSchema,
  assignDriverSchema,
  driverIdParamSchema,
  driverSchoolIdParamSchema,
} from "../../../../validations/Module/TransportDashboard/driverValidation";

// Create a Driver
import bcrypt from "bcryptjs";
// import bcrypt from "bcrypt";
import { sendRegistrationEmail } from "../../../../config/email";
import { randomBytes } from "crypto";

export const registerDriver = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = registerDriverSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const { name, email, phone, address, city, state, country, pincode, bloodType, sex, license, busId, schoolId } =
      result.data;

    // const profilePicFile = req.file;

    // if (!profilePicFile || !profilePicFile.buffer) {
    //   return res.status(400).json({ error: "Profile picture is required." });
    // }

    // const { publicId, url } = await uploadFile(
    //   profilePicFile.buffer,
    //   "profile_pics",
    //   "image"
    // );

    const tempPassword = randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const [user, driver] = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          address,
          city,
          state,
          country,
          pincode,
          bloodType,
          sex,
          // profilePic: url,
          role: "driver",
          schoolId,
        },
      });

      const driver = await tx.driver.create({
        data: {
          license,
          busId,
          schoolId,
          userId: user.id,
        },
      });

      return [user, driver];
    });

    try {
      await sendRegistrationEmail(email, tempPassword);
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
    }

    res.status(201).json({
      message: "Driver registered successfully",
      user,
      driver,
    });
  } catch (error) {
    console.error("Error registering driver:", error);
    return res.status(500).json({
      error: "Something went wrong while registering the driver.",
    });
  }
};

// Get all Drivers
export const getDrivers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: { bus: true, school: true },
    });
    res.json(drivers);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Drivers by School ID

export const getDriversBySchoolId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = driverSchoolIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { schoolId } = paramsResult.data;
  try {
    const drivers = await prisma.driver.findMany({
      where: { schoolId },
      include: { bus: true, school: true },
    });
    res.json(drivers);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Driver by ID
export const getDriver = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = driverIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: { bus: true, school: true },
    });
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Assign Driver to a Bus
export const assignDriverToBus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const result = assignDriverSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { busId, driverId } = result.data;
  try {
    const driver = await prisma.driver.update({
      where: { id: driverId },
      data: { busId },
    });
    res.json(driver);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Driver Details
export const updateDriver = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = driverIdParamSchema.safeParse(req.params);
  const bodyResult = updateDriverSchema.safeParse(req.body);

  if (!paramsResult.success || !bodyResult.success) {
    return res.status(400).json({
      error: [
        ...(paramsResult.success ? [] : paramsResult.error.errors),
        ...(bodyResult.success ? [] : bodyResult.error.errors),
      ],
    });
  }

  const { id } = paramsResult.data;
  const { license, busId, schoolId } = bodyResult.data;
  try {
    const driver = await prisma.driver.update({
      where: { id },
      data: { license, busId, schoolId },
    });
    res.json(driver);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a Driver
export const deleteDriver = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = driverIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    await prisma.driver.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
