import { Request,Response,NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import {
  createDisputeSchema,
  disputeMessageSchema,
  issueIdParamSchema,
  disputeIdParamSchema,
  resolveDisputeSchema,
} from "../../../../validations/Module/LibraryDashboard/disputeValidation";



// Create a Dispute
export const createDispute = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const paramsResult = issueIdParamSchema.safeParse(req.params);
        const bodyResult = createDisputeSchema.safeParse(req.body);
        const userId = req.user?.id;

        if (!paramsResult.success || !bodyResult.success || !userId) {
            return res.status(400).json({
                error: [
                    ...(paramsResult.success ? [] : paramsResult.error.errors),
                    ...(bodyResult.success ? [] : bodyResult.error.errors),
                    ...(userId ? [] : [{ message: "Invalid user" }]),
                ],
            });
        }

        const { issueId } = paramsResult.data;
        const { reason } = bodyResult.data;

        const dispute = await prisma.dispute.create({
            data: {
                bookIssueId: issueId,
                userId,
                reason,
            },
        });

        res.status(201).json(dispute);
    } catch (error) {
        next(error);
    }
};

// Add Message to a Dispute
export const addDisputeMessage = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const paramsResult = disputeIdParamSchema.safeParse(req.params);
        const bodyResult = disputeMessageSchema.safeParse(req.body);

        if (!paramsResult.success || !bodyResult.success) {
            return res.status(400).json({
                error: [
                    ...(paramsResult.success ? [] : paramsResult.error.errors),
                    ...(bodyResult.success ? [] : bodyResult.error.errors),
                ],
            });
        }

        const { disputeId } = paramsResult.data;
        const { message } = bodyResult.data;
        const msg = await prisma.disputeMessage.create({
            data: { disputeId, userId: req.user?.id ?? '', message },
        });
        res.status(201).json(msg);
    } catch (error) {
        next(error);
    }
};

// Resolve a Dispute
export const resolveDispute = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const paramsResult = disputeIdParamSchema.safeParse(req.params);
        const bodyResult = resolveDisputeSchema.safeParse(req.body);

        if (!paramsResult.success || !bodyResult.success) {
            return res.status(400).json({
                error: [
                    ...(paramsResult.success ? [] : paramsResult.error.errors),
                    ...(bodyResult.success ? [] : bodyResult.error.errors),
                ],
            });
        }

        const { disputeId } = paramsResult.data;
        const { resolution, status } = bodyResult.data;
        const dispute = await prisma.dispute.update({
            where: { id: disputeId },
            data: { 
                status: status as any, // Cast to any if you are sure it's valid, or use Prisma.DisputeStatus enum
                resolution 
            },
        });
        res.json(dispute);
    } catch (error) {
        next(error);
    }
};
