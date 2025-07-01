import express from 'express';
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  validateCoupon,
} from '../../controllers/planCouponController';

const router = express.Router();

// Create coupon
router.post('/superadmin/create-coupon', createCoupon);

// Get all coupons
router.get('/superadmin/getall-coupon', getAllCoupons);

// Get coupon by id
router.get('/superadmin/get-coupon/:id', getCouponById);

// Update coupon
router.put('/superadmin/update-coupon/:id', updateCoupon);

// Delete coupon
router.delete('/superadmin/delete-coupon/:id', deleteCoupon);

// Validate coupon
router.post('/superadmin/validate-coupon', validateCoupon);

export default router;
