import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

import { CONFIG } from "../config";
import { sendErrorMessageToSupport } from "../utils/mailer";
import { getErrorStack } from "../utils/common_utils";

dotenv.config();

export const prisma = new PrismaClient({
  log: [
    // {
    //   emit: "event",
    //   level: "query",
    // },
    {
      emit: "event",
      level: "error",
    },
  ],
  transactionOptions: {
    timeout: 10000,
  },
});

// prisma.$on("query", (e: any) => {
//   console.log("Query: " + e.query);
//   console.log("Params: " + e.params);
//   console.log("Duration: " + e.duration + "ms");
// });

prisma.$on("error", (e) => {
  if (CONFIG.NODE_ENV !== "development") {
    sendErrorMessageToSupport(getErrorStack(e), `DB Error Occurred`);
  }
});

export class BaseModel {
  public prisma = prisma;
}
