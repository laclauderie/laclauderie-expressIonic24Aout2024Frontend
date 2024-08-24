// src/app/models/payment.model.ts
export interface Payment {
    payment_id: string;
    amount: number;
    payment_date: string; // Use string if date is in ISO format, otherwise use Date
    expiry_date: string; // Use string if date is in ISO format, otherwise use Date
    business_owner_id: string;
    latest_payment: boolean;
  }
  