import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  schoolIdParamSchema,
  parentIdParamSchema,
  parentIdOnlySchema,
} from "../../../../validations/Module/SchoolAuth/parentValidation";



// Controller to get all parents
export const getParentsBySchool = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const parsedParams = schoolIdParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsedParams.error.errors });
  }
  const { schoolId } = parsedParams.data;

  try {
    const parents = await prisma.parent.findMany({
      where: {
        students: {
          some: {
            schoolId: schoolId,
          },
        },
      },
      include: {
        user: true, // Include parent user info
        students: {
          where: {
            schoolId: schoolId, // Optional: Filter only students of this school
          },
          include: {
            user: true,     // Student's user profile (name, email, etc.)
            class: true,    // If you have class model relation
            // section: true,  // If section is a separate model
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: parents,
    });
  } catch (error) {
    console.error("Error fetching parents by school:", error);
    next(handlePrismaError(error));
  }
};


// Controller to get a single parent by ID
export const getParentById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const parsedParams = parentIdParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsedParams.error.errors });
  }
  const { id } = parsedParams.data;

  try {
    const parent = await prisma.parent.findUnique({
      where: { id },
      include: {
        students: true,
        user: true, // Include user details
      },
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: parent,
    });
  } catch (error) {
    console.error("Error fetching parent by ID:", error);
    next(handlePrismaError(error));
  }
};

/**
 * Controller to get children (students) of a specified parent.
 *
 * Expects a URL parameter `parentId`:
 *    GET /api/parents/:parentId/children
 *
 * Returns JSON with the parent's details along with the associated children.
 */
export const getChildrenByParent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const parsedParams = parentIdOnlySchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsedParams.error.errors });
  }
  const { parentId } = parsedParams.data;

  try {
    const parent = await prisma.parent.findUnique({
      where: {
        id: parentId,
      },
      include: {
        students: true,
        user: true, // Include user details
      },
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        parent: {
          id: parent.id,
          user: parent.user,
        },
        children: parent.students,
      },
    });
  } catch (error) {
    console.error("Error fetching children for parent:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred while retrieving children for the specified parent.",
    });
  }
};


// Update parent details
// export const updateParent = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
//   const { id } = req.params;
//   const { name, email, phoneNumber } = req.body;

//   try {
//     const updatedParent = await prisma.parent.update({
//       where: { id },
//       data: {
//         name,
//         email,
//         phoneNumber,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       data: updatedParent,
//     });
//   } catch (error) {
//     console.error("Error updating parent:", error);
//     next(handlePrismaError(error));
//   }
// };


// delete parent

export const deleteParent = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { id } = req.params;
  try {  
    await prisma.parent.delete({

      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: "Parent deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting parent:", error);
    next(handlePrismaError(error));
  }

};



// Get Children of a Parent


// export const getChildrenByParent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//   const { parentId } = req.params;

//   try {
//     const parent = await prisma.parent.findUnique({
//       where: {
//         id: parentId,
//       },
//       include: {
//         students: {
//           include: {
//             user: true, // Optional: Include student user details
//             class: true, // Optional: Include class info if you have it
//           },
//         },
//         user: true, // Parent's user profile
//       },
//     });

//     if (!parent) {
//       return res.status(404).json({
//         success: false,
//         message: "Parent not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: {
//         parent: {
//           id: parent.id,
//           user: parent.user,
//         },
//         children: parent.students,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching children for parent:", error);
//     next(handlePrismaError(error));
//   }
// };


