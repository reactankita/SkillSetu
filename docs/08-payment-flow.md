# Payment Protection Flow & Commission Engine — SkillSetu

## 1. Terminology & Compliance
> [!IMPORTANT]
> The word **"escrow"** MUST NEVER appear in visible UI, tooltips, or microcopy. The legally compliant, consumer-friendly terminology is **"Payment Protected"** or **"Payment Secured Until Completion"**.

---

## 2. Platform Commission Model
SkillSetu uses a centralized fee configuration located in `src/config/site.ts`:
* **Client Platform Convenience Fee**: `5.0%` (e.g. On a ₹2,000 service, Platform Fee is ₹100; total paid by client is ₹2,100).
* **Student Payout Rate**: Full service amount disbursed upon client confirmation (or standard student subscription perks with zero deduction).

### Mathematical Calculation
$$\text{Platform Fee} = \text{round}(\text{Service Base Price} \times 0.05)$$
$$\text{Total Client Charged} = \text{Service Base Price} + \text{Platform Fee}$$
$$\text{Student Payout Disbursed} = \text{Service Base Price}$$

---

## 3. End-to-End Payment Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant UI as SkillSetu UI
    participant Server as App Server
    participant Razorpay as Razorpay Gateway
    actor Student

    Client->>UI: Select Service, Date, Time Slot
    UI->>Server: POST /api/payment/order {serviceId, amount, slot}
    Server->>Razorpay: Create Order (INR amount + fee)
    Razorpay-->>Server: order_id
    Server-->>UI: Return order details
    UI->>Client: Open Razorpay Checkout Modal
    Client->>Razorpay: Authorize Payment (UPI / Card / NetBanking)
    Razorpay-->>UI: payment_id & signature
    UI->>Server: POST /api/payment/verify
    Server->>Server: Record Payment (Status: 'PROTECTED')
    Server->>Server: Set Booking Status to 'CONFIRMED'
    Server-->>Student: Send Notification: "New Booking Confirmed & Protected"
    
    Note over Student,Client: Student delivers work on scheduled date
    
    Student->>UI: Click "Mark Completed" (Status: 'COMPLETED_BY_STUDENT')
    UI-->>Client: Send Notification: "Service Delivered — Please Confirm"
    Client->>UI: Click "Confirm Completion" (Status: 'CONFIRMED_BY_CLIENT')
    UI->>Server: Trigger Payment Settlement
    Server->>Server: Set Payment Status to 'RELEASED'
    Server-->>Student: Disburse Funds to Bank / UPI
    Client->>UI: Submit Rating & Review
```

---

## 4. Issue & Dispute Safety Buffer
If work is incomplete or unsatisfactory:
1. Client clicks **"Report Issue"** before confirming completion.
2. Booking transitions to `DISPUTED`.
3. Payment remains **PROTECTED**; automated release is halted.
4. Admin reviews dispute evidence in `/admin/disputes` and issues either a full/partial **Refund** or **Release**.
