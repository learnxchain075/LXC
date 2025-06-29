import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Ipayment, Ionlinepayment } from "../types/accounts/paymentService";

/**
 * ✅ Create Cash Payment
 * Sends a POST request to create a cash payment
 * @param data - Cash payment data
 * @returns AxiosResponse<Ipayment>
 */
export const createCashPayment = async (
  data: Ipayment
): Promise<AxiosResponse<Ipayment>> => {
  return await BaseApi.postRequest(`/cash`, data);
};

/**
 * ✅ Create Online Payment Order
 * Creates a new online payment order
 * @param data - Online payment data
 * @returns AxiosResponse<Ionlinepayment>
 */
export const createOnlinePaymentOrder = async (
  data: Ionlinepayment
): Promise<AxiosResponse<Ionlinepayment>> => {
  return await BaseApi.postRequest(`/order`, data);
};

/**
 * ✅ Handle Payment Webhook
 * Handles payment webhook notifications from payment gateway
 * @param data - Payment webhook data
 * @returns AxiosResponse<any>
 */
export const handlePaymentWebhook = async (
  data: any
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/webhook`, data);
};

/**
 * ✅ Get All Payments
 * Fetches all payment records
 * @returns AxiosResponse<Ipayment[]>
 */
export const getAllPayments = async (): Promise<AxiosResponse<Ipayment[]>> => {
  return await BaseApi.getRequest(`/`);
};

/**
 * ✅ Get Payment By ID
 * Fetches a single payment record by ID
 * @param id - Payment ID
 * @returns AxiosResponse<Ipayment>
 */
export const getPaymentById = async (
  id: string
): Promise<AxiosResponse<Ipayment>> => {
  return await BaseApi.getRequest(`/${id}`);
};

/**
 * ✅ Update Payment
 * Updates a payment's status or details
 * @param id - Payment ID
 * @param data - Partial<Ipayment>
 * @returns AxiosResponse<Ipayment>
 */
export const updatePayment = async (
  id: string,
  data: Partial<Ipayment>
): Promise<AxiosResponse<Ipayment>> => {
  return await BaseApi.patchRequest(`/${id}`, data);
};

/**
 * ✅ Delete Payment
 * Deletes a payment record
 * @param id - Payment ID
 * @returns AxiosResponse<void>
 */
export const deletePayment = async (
  id: string
): Promise<AxiosResponse<void>> => {
  return await BaseApi.deleteRequest(`/${id}`);
};
