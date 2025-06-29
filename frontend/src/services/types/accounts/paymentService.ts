/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

/**
 * Payment method enum
 */
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  NET_BANKING = 'NET_BANKING',
  CHEQUE = 'CHEQUE',
  WALLET = 'WALLET'
}

/**
 * Base payment interface
 */
export interface IPaymentBase {
  feeId: string;
  amount: number;
  method: PaymentMethod;
}

/**
 * Complete payment interface including system-generated fields
 */
export interface IPayment extends IPaymentBase {
  id?: string;
  status: PaymentStatus;
  paymentDate: Date;
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  metadata?: Record<string, any>;
  remarks?: string;
}

/**
 * Online payment order creation input
 */
export interface IOnlinePaymentOrderInput extends IPaymentBase {
  currency?: string;
  description?: string;
  customerEmail?: string;
  customerPhone?: string;
  callbackUrl?: string;
}

/**
 * Online payment order response
 */
export interface IOnlinePaymentOrder extends IOnlinePaymentOrderInput {
  id: string;
  orderId: string;
  status: PaymentStatus;
  createdAt: Date;
  expiresAt: Date;
  paymentUrl?: string;
}

/**
 * Payment webhook event interface
 */
export interface IPaymentWebhookEvent {
  eventType: string;
  paymentId: string;
  orderId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * Payment report interface
 */
export interface IPaymentReport {
  totalTransactions: number;
  totalAmount: number;
  successfulTransactions: number;
  failedTransactions: number;
  methodWiseStats: Record<PaymentMethod, {
    count: number;
    amount: number;
  }>;
  recentTransactions: Array<{
    id: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    paymentDate: Date;
  }>;
}