import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID?.trim();
const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

if (!keyId || !keySecret) {
  console.error("CRITICAL: Razorpay keys are missing from environment variables!");
}

export const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});
