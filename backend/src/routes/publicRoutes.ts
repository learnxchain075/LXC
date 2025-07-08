import express from "express";
import logRoutes from "./logRoutes";
import forgotRoute from "./signin/forgotRoute";
import superAdminRoute from "../modules/superadmin/routes/core/superAdminRoute";
import planRoutes from "../modules/superadmin/routes/dashboard/planRoutes";
import planHandlerRoutes from "./paymenthandler/planHandlerRoutes";
import signinRoute from "./signin/signinRoute";
import otpRoute from "./signin/otpRoute";
import googleAuthRoute from "./signin/googleAuthRoute";
import demoBookingRoutes from "../modules/superadmin/routes/core/demoBookingRoutes";


const publicRouter = express.Router();


publicRouter.use('/auth',forgotRoute);
publicRouter.use('/auth',signinRoute);
publicRouter.use('/auth', otpRoute);
publicRouter.use('/auth', googleAuthRoute);


publicRouter.use(logRoutes);
publicRouter.use('/administrator/super-admin', superAdminRoute);

publicRouter.use(planHandlerRoutes);
publicRouter.use(planRoutes);
publicRouter.use(demoBookingRoutes);



export default publicRouter;
