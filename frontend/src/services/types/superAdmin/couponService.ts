// Enum for discount type
export type DiscountType = 'PERCENTAGE' | 'FLAT';

// Coupon creation input (from admin or API)
export interface ICouponCreate {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiryDate: Date | string;
  maxUsage: number;
}

// Coupon update input (optional fields)
export interface ICouponUpdate {
  code?: string;
  discountType?: DiscountType;
  discountValue?: number;
  expiryDate?: Date | string;
  maxUsage?: number;
}

// Coupon response shape (matching Prisma model)
export interface ICoupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiryDate: Date;
  maxUsage: number;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Coupon apply request (when subscribing to a plan)
export interface IApplyCoupon {
  couponCode: string;
  planPrice: number;
}




// // Create coupon

// router.post('/superadmin/create-coupon', createCoupon );

// // Get all coupons
// router.get('/superadmin/getall-coupon', getAllCoupons );

// // Get coupon by id
// router.post('/superadmin/get-coupon/:id', getCouponById );
// // Update coupon
// router.post('/superadmin/update-coupon/:id', updateCoupon );

// // Delete coupon
// router.post('/superadmin/delete-coupon/:id', deleteCoupon );