import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { createNoticeSchema, updateNoticeSchema } from "../../../../validations/Module/AdminDashboard/noticeValidation";
import { cuidSchema, schoolIdParamSchema } from "../../../../validations/common/commonValidation";
import { z } from "zod";
import { UserType } from "@prisma/client";
import { uploadFile } from "../../../../config/upload";

// Create a new notice
export const createNotice = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsed = createNoticeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
    }
    const { title, message, noticeDate, publishDate, attachment, recipients, createdById, schoolId } = parsed.data;

    const attachmentFile = req.file;

    if (!attachmentFile || !attachmentFile.buffer) {
      return res.status(400).json({ error: "Profile picture is required." });
    }

    const { url } = await uploadFile(attachmentFile.buffer, "Notice_Data", "raw", attachmentFile.originalname);

    const notice = await prisma.notice.create({
      data: {
        title,
        message,
        noticeDate: new Date(noticeDate),
        publishDate: new Date(publishDate),
        attachment: url,
        createdById,
        schoolId,
        recipients: {
          create: recipients.map((userType: string) => ({ userType: userType as UserType })),
        },
      },
      include: {
        recipients: true,
        creator: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create notice" });
  }
};

// Get all notices (optionally filtered by schoolId)
export const getAllNotices = async (req: Request, res: Response) => {
  try {
    const schoolId = req.query.schoolId as string | undefined;

    const notices = await prisma.notice.findMany({
      where: schoolId ? { schoolId } : {},
      include: {
        recipients: true,
        creator: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Notices fetched successfully",
      data: notices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch notices" });
  }
};

// Get single notice by ID
export const getNoticeById = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = z.object({ id: cuidSchema }).safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { id } = params.data;

    const notice = await prisma.notice.findUnique({
      where: { id },
      include: {
        recipients: true,
        creator: true,
      },
    });

    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notice fetched successfully",
      data: notice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch notice" });
  }
};

// Update notice
export const updateNotice = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = z.object({ id: cuidSchema }).safeParse(req.params);
    const body = updateNoticeSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
      });
    }
    const { id } = params.data;
    const { title, message, noticeDate, publishDate, attachment, recipients } = body.data;

    await prisma.noticeRecipient.deleteMany({
      where: { noticeId: id },
    });

    const notice = await prisma.notice.update({
      where: { id },
      data: {
        title,
        message,
        noticeDate: noticeDate ? new Date(noticeDate) : undefined,
        publishDate: publishDate ? new Date(publishDate) : undefined,
        attachment,
        recipients: {
          create: (recipients ?? []).map((userType: string) => ({ userType: userType as UserType })),
        },
      },
      include: {
        recipients: true,
        creator: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: notice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update notice" });
  }
};

// Delete a single notice
export const deleteNotice = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = z.object({ id: cuidSchema }).safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { id } = params.data;

    await prisma.notice.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete notice" });
  }
};

// Delete multiple notices
export const deleteMultipleNotices = async (req: Request, res: Response): Promise<any> => {
  try {
    const body = z.object({ ids: z.array(cuidSchema).min(1) }).safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ errors: body.error.errors });
    }
    const { ids } = body.data;

    console.log("Received request to delete multiple notices:", ids);

    if (!Array.isArray(ids) || ids.length === 0) {
      console.warn("Invalid or empty 'ids' array received:", ids);
      return res.status(400).json({
        success: false,
        message: "Invalid or empty 'ids' array",
      });
    }

    const result = await prisma.notice.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    console.log(`Requested to delete ${ids.length} notices. Actually deleted: ${result.count}`);

    res.status(200).json({
      success: true,
      message: `${result.count} notices deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error while deleting multiple notices:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete notices",
      error: error.message,
    });
  }
};
