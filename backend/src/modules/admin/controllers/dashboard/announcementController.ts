import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "../../../../validations/Module/AdminDashboard/announcementValidation";


export const createAnnouncement = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsed = createAnnouncementSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error.errors });
    }

    const { title, description, date, classId } = parsed.data;

    const announcement = await prisma.announcement.create({
      data: {
        title,
        date: new Date(date),
        description,
        classId,
      },
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};

// get all announcements

    export const getAnnouncements = async (req: Request, res: Response) => {
        try {
        const announcements = await prisma.announcement.findMany();
        res.status(200).json(announcements);
        } catch (error) {
        res.status(400).json({ error: (error as any).message });
        }
    };
    
    // get announcement by id
    
    export const getAnnouncementById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const announcement = await prisma.announcement.findUnique({
            where: {id},
        });
        if (!announcement) {
            res.status(404).json({ error: "Announcement not found." });
            return;
        }
        res.status(200).json(announcement);
        } catch (error) {
        res.status(400).json({ error: (error as any).message });
        }
    };


    // update announcement

export const updateAnnouncement = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const parsed = updateAnnouncementSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error.errors });
    }

    const { title, description, date, classId } = parsed.data;
    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        date: date ? new Date(date) : undefined,
        description,
        classId,
      },
    });
    res.status(200).json(announcement);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};

    // delete announcement

    export const deleteAnnouncement = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        await prisma.announcement.delete({
            where: {id},
        });
        res.status(200).json({ message: "Announcement deleted successfully." });
        } catch (error) {
        res.status(400).json({ error: (error as any).message });
        }
    };