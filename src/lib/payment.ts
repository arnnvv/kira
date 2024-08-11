import Razorpay from "razorpay";

const getRazorpay = (): { key_id: string; key_secret: string } => {
  const razorpayKeyId: string | undefined = process.env.RAZORPAY_KEY_ID;
  const razorpayKeySecret: string | undefined = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpayKeyId || razorpayKeyId.length === 0)
    throw new Error("Razorpay key id not found");

  if (!razorpayKeySecret || razorpayKeySecret.length === 0)
    throw new Error("Razorpay key secret not found");

  return {
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  };
};

export const razorpay = new Razorpay({
  key_id: getRazorpay().key_id,
  key_secret: getRazorpay().key_secret,
});
