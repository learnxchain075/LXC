import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { createEventSchema, updateEventSchema } from "../../../../validations/Module/AdminDashboard/eventValidation";
import { schoolIdParamSchema, cuidSchema } from "../../../../validations/common/commonValidation";
import { z } from "zod";
import { uploadFile } from "../../../../config/upload";

// create Event

export const createEvent = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsed = createEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
    }

    const {
      title,
      description,
      start,
      end,
      category,

      targetAudience,
      roleIds,
      sectionIds,
      classIds,
      schoolId,
    } = parsed.data;

    const attachmentFile = req.file;

    if (!attachmentFile || !attachmentFile.buffer) {
      return res.status(400).json({ error: "Profile picture is required." });
    }

    const { url } = await uploadFile(attachmentFile.buffer, "Events_Data", "raw", attachmentFile.originalname);

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        schoolId,
        start,
        end,
        attachment: url,
        targetAudience: targetAudience || "ALL",
        roles: {
          connect: roleIds?.map((id: string) => ({ id: Number(id) })) || [],
        },
        sections: {
          connect: sectionIds?.map((id: string) => ({ id })) || [],
        },
        Class: {
          connect: classIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        roles: true,
        sections: true,
        Class: true,
      },
    });

    return res.status(201).json(event);
  } catch (error) {
    return res.status(400).json({ error: (error as any).message });
  }
};

// get all Event
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        roles: true,
        sections: true,
        Class: true,
      },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};

// get event by id

export const getEventById = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = z.object({ id: cuidSchema }).safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { id } = params.data;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        roles: true,
        sections: true,
        Class: true,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};

// update event

export const updateEvent = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = z.object({ id: cuidSchema }).safeParse(req.params);
    const body = updateEventSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
      });
    }

    const { id } = params.data;
    const { title, description, start, end, category, attachment, targetAudience, roleIds, sectionIds, classIds } =
      body.data;

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        category,
        start,
        end,
        attachment,
        targetAudience: targetAudience || "ALL",
        roles: {
          set: roleIds?.map((id: string) => ({ id: Number(id) })) || [],
        },
        sections: {
          set: sectionIds?.map((id: string) => ({ id })) || [],
        },
        Class: {
          set: classIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        roles: true,
        sections: true,
        Class: true,
      },
    });

    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};

// delete event
export const deleteEvent = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = z.object({ id: cuidSchema }).safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { id } = params.data;
    await prisma.event.delete({
      where: { id },
    });
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};

// get events by school id

export const getEventsBySchoolId = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = schoolIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { schoolId } = params.data;
    const events = await prisma.event.findMany({
      where: { schoolId },
      include: {
        roles: true,
        sections: true,
        Class: true,
      },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};

// get all event of a scchool

export const getAllEventOfSchool = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = schoolIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { schoolId } = params.data;
    const events = await prisma.event.findMany({
      where: { schoolId },
      include: {
        roles: true,
        sections: true,
        Class: true,
      },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};
