import Razorpay from "razorpay";

class RazorpayInstance {
  private static instance: RazorpayInstance;
  private razorpay: Razorpay;

  private constructor() {
    const { key_id, key_secret } = this.getRazorpayCredentials();
    this.razorpay = new Razorpay({ key_id, key_secret });
  }

  public static getInstance(): RazorpayInstance {
    if (!this.instance) this.instance = new RazorpayInstance();
    return this.instance;
  }

  private getRazorpayCredentials(): { key_id: string; key_secret: string } {
    const razorpayKeyId: string | undefined = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret: string | undefined =
      process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || razorpayKeyId.length === 0)
      throw new Error("Razorpay key id not found");
    if (!razorpayKeySecret || razorpayKeySecret.length === 0)
      throw new Error("Razorpay key secret not found");

    return {
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    };
  }

  public getRazorpay(): Razorpay {
    return this.razorpay;
  }
}

export const razorpay: Razorpay = RazorpayInstance.getInstance().getRazorpay();
