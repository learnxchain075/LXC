export interface ILeaveRequest {
  id?: string; 
  userId?: string; 
  reason: string;
  fromDate: string; 
  toDate: string;   
  status?: "pending" | "approved" | "rejected"; // optional for request creation

}
