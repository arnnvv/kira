import { razorpayOrderAction, razorpayVerifyAction } from "@/actions";
import Script from "next/script";
import { FormEvent } from "react";

export default function P(): JSX.Element {
  const createOrderId = async (
    amount: number,
    currency: string,
  ): Promise<string | undefined> => {
    try {
      const res = await razorpayOrderAction(amount, currency);
      if (!res) throw new Error("Razorpay order action failed");
      return res.id;
    } catch (e) {
      console.error(e);
    }
  };
  const processPayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const orderId = await createOrderId(100, "INR");
      if (!orderId) throw new Error("Razorpay order id generation failed");
      const res = await razorpayVerifyAction(orderId, "", "");
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Script
      id="razorpay-checkout-js"
      src="https://checkout.razorpay.com/v1/checkout.js"
    />
  );
}
