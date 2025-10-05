# Subscription Payment System Setup

## 🚀 Quick Setup

### Step 1: Create Subscriptions Table in Supabase

Run this SQL in your **Supabase SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  plan TEXT NOT NULL, -- 'basic', 'pro', 'enterprise'
  amount INTEGER NOT NULL,
  transaction_id TEXT NOT NULL,
  upi_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_transaction_id ON subscriptions(transaction_id);
```

### Step 2: Add QR Code Image

1. Generate a UPI QR code for `khnnabubakar786@paytm`
2. Save it as `/public/qr-code-payment.png`
3. Or use any QR code generator online

## 📋 Features Implemented

### **1. Payment Page** (`/payment?plan=pro`)
- Modern, minimalist design
- QR code display for UPI payment
- UPI ID: `khnnabubakar786@paytm`
- Amount pre-filled based on plan
- Transaction ID input field
- Success confirmation screen

### **2. Pricing Plans** (INR Currency)
- **Free**: ₹0
- **Pro**: ₹999/month or ₹799/year
- **Enterprise**: ₹2499/month or ₹1999/year
- All prices changed from $ to ₹
- Links to payment page

### **3. Admin Dashboard** (`/admin`)
- New "Subscriptions" tab
- View all subscription requests
- Approve/Reject buttons
- Transaction ID verification
- User details display

### **4. User Subscription Status**
- API endpoint to check subscription status
- Visual subscription badge (Crown icon)
- Shows active/expired status
- Displays plan details

## 🔄 Payment Flow

1. **User clicks plan** → Redirected to `/payment?plan=pro`
2. **Payment page shows**:
   - QR code for scanning
   - UPI ID for manual payment
   - Amount to pay (₹999, ₹2499, etc.)
3. **User pays** via any UPI app (Google Pay, PhonePe, Paytm)
4. **User enters** transaction ID/UTR number
5. **Clicks submit** → Status: "Pending"
6. **Admin reviews** in admin dashboard
7. **Admin approves/rejects** → User notified
8. **If approved** → Subscription activated for 1 month

## 🎯 Admin Actions

### View Subscriptions
- Go to `/admin`
- Click "Subscriptions" tab
- See all pending/approved/rejected subscriptions

### Approve Subscription
1. Find pending subscription
2. Verify transaction ID
3. Click "Approve"
4. System sets:
   - Status: "approved"
   - Start date: Now
   - End date: +1 month

### Reject Subscription
1. Find pending subscription
2. Click "Reject"
3. Status changes to "rejected"

## 📊 Database Schema

```typescript
interface Subscription {
  id: string
  user_id: string              // Clerk user ID
  user_email: string            // User's email
  user_name: string             // User's name
  plan: string                  // 'basic', 'pro', 'enterprise'
  amount: number                // 499, 999, 2499
  transaction_id: string        // UPI transaction ID
  upi_id: string                // khnnabubakar786@paytm
  status: string                // 'pending', 'approved', 'rejected'
  start_date?: string           // Subscription start (ISO)
  end_date?: string             // Subscription end (ISO)
  created_at: string            // Auto-generated
  updated_at: string            // Auto-updated
}
```

## 🔌 API Endpoints

### Submit Subscription
```
POST /api/subscriptions/submit
Body: { plan, amount, transactionId, upiId }
```

### Check Subscription Status
```
GET /api/subscriptions/status
Returns: { subscription, hasActiveSubscription }
```

### Admin: Get All Subscriptions
```
GET /api/admin/subscriptions
Returns: { subscriptions: [] }
```

### Admin: Approve/Reject
```
POST /api/admin/subscriptions
Body: { subscriptionId, action: 'approve' | 'reject' }
```

## ✅ Next Steps

1. Create the subscriptions table in Supabase
2. Add QR code image to `/public` folder
3. Test the payment flow
4. Verify admin approval works
5. Add subscription status badge to user profile

## 🎨 Subscription Badge (Coming Soon)

When approved, users will see:
- Crown icon next to their name
- "Pro Member" or "Enterprise Member" badge
- Subscription expiry date
- Renewal reminder

## 📝 Notes

- All payments are manual (UPI-based)
- Admin must verify each transaction
- Subscriptions are monthly (30 days)
- Auto-renewal not implemented (manual renewal required)
- Email notifications can be added later
