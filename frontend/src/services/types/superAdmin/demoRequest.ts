export interface IDemoBooking {
  id: string;
  name: string;
  email: string;
  school: string;
  dateTime: string; // ISO date string, will be parsed via new Date() or moment()
  createdAt: string;
}
