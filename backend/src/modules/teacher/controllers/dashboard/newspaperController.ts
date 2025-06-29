import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import { uploadFile } from "../../../../config/upload";
import {
  createNewspaperSchema,
  updateNewspaperSchema,
} from "../../../../validations/Module/TeacherDashboard/newspaperValidation";


  // Create a new newspaper
export const createNewspaper = async (req: Request, res: Response, next:NextFunction):Promise<any> => {
    const result = createNewspaperSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }
    const { title, content, userId, classId } = result.data;


    const attachmentFile = req.file;
    // Upload attachment to Cloudinary
    let url: string | undefined = undefined;
    if (attachmentFile && attachmentFile.buffer) {
      const uploadResult = await uploadFile(
        attachmentFile.buffer,
        "newspaper",
        "image"
      );
      url = uploadResult.url;
    }
    

    try {
      const newspaper = await prisma.newspaper.create({
        data: { title, content,  userId, classId, attachment: url },
      });
      res.status(201).json(newspaper);
    } catch (error) {
         next(handlePrismaError(error));
    }
  };
  

// Get all newspapers
export const getAllNewspapers = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const newspapers = await prisma.newspaper.findMany();
      res.status(200).json(newspapers);
    } catch (error) {
         next(handlePrismaError(error));
    }
  };
  
  // Get a single newspaper by ID
  export const getNewspaperById = async (req: Request, res: Response, next:NextFunction):Promise<any> => {
    const { id } = req.params;
    try {
      const newspaper = await prisma.newspaper.findUnique({
        where: { id },
      });
      if (!newspaper) {
        return res.status(404).json({ error: 'Newspaper not found' });
      }
      res.status(200).json(newspaper);
    } catch (error) {
         next(handlePrismaError(error));
    }
  };
  

  // Update a newspaper
export const updateNewspaper = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    const result = updateNewspaperSchema.safeParse(req.body);
    if (!result.success) {
      return next(handlePrismaError({ message: 'Validation failed', details: result.error.errors }));
    }
    const { title, content } = result.data;
    try {
      const newspaper = await prisma.newspaper.update({
        where: { id },
        data: { title, content,  },
      });
      res.status(200).json(newspaper);
    } catch (error) {
         next(handlePrismaError(error));
    }
  };
  
  // Delete a newspaper
  export const deleteNewspaper = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.newspaper.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
         next(handlePrismaError(error));
    }
  };

// Get all newspapers of a class by classId

export const getNewspapersByClassId = async (req: Request, res: Response, next:NextFunction) => {
    const { classId } = req.params;
    try {
      const newspapers = await prisma.newspaper.findMany({
        where: { classId },
      });
      res.status(200).json(newspapers);
    } catch (error) {
         next(handlePrismaError(error));
    }
  };