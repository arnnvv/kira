"use client";

import { razorpayOrderAction, razorpayVerifyAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Script from "next/script";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

export default function P(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const currency: string = "INR";
  const createOrderId = async (
    amount: number,
    currency: string,
  ): Promise<string | undefined> => {
    try {
      const order = await razorpayOrderAction(amount, currency);
      if (!order) throw new Error("Razorpay order action failed");
      return order.id;
    } catch (e) {
      console.error(e);
    }
  };
  const processPayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const orderId: string | undefined = await createOrderId(
        Number(amount),
        currency,
      );
      if (!orderId) throw new Error("Razorpay order id not defined");
      const key_id: string | undefined = process.env.RAZORPAY_KEY_ID;
      if (!key_id || key_id === "" || key_id.length === 0)
        throw new Error("Razorpay key id not defined");
      //@ts-ignore
      const paymentObject = new window.Razorpay({
        key: key_id,
        amount: parseFloat(amount) * 100,
        currency: currency,
        name: "name",
        description: "description",
        order_id: orderId,
        handler: async () => {
          const result: boolean = await razorpayVerifyAction(orderId, "", "");
          if (!result) throw new Error("Razorpay verify action failed");
          else {
            toast.success("Payment successful", {
              action: {
                label: "Close",
                onClick: (): string | number =>
                  toast.dismiss("payment-success"),
              },
            });
          }
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: "#3399cc",
        },
      });
      paymentObject.on("payment.failed", (res: any) => {
        toast.error(res.error.description, {
          id: "payment-failed",
          action: {
            label: "Close",
            onClick: (): string | number => toast.dismiss("payment-failed"),
          },
        });
      });
      paymentObject.open();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <section className="min-h-[94vh] flex flex-col gap-6 h-14 mx-5 sm:mx-10 2xl:mx-auto 2xl:w-[1400px] items-center pt-36 ">
        <form
          className="flex flex-col gap-6 w-full sm:w-80"
          onSubmit={processPayment}
        >
          <div className="space-y-1">
            <Label>Full name</Label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                setName(e.target.value)
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="user@gmail.com"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Amount</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="1"
                min={5}
                required
                value={amount}
                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                  setAmount(e.target.value)
                }
              />
            </div>
          </div>

          <Button type="submit">Pay</Button>
        </form>
      </section>
    </>
  );
}
