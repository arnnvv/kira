"use client";

import { FormEvent, useState } from "react";
import { razorpayOrderAction, razorpayVerifyAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function P(): JSX.Element {
  const [loading1, setLoading1] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const currency: string = "INR";
  const amount: number = 50;

  const createOrderId = async (
    amount: number,
    currency: string,
  ): Promise<string | undefined> => {
    try {
      const id = await razorpayOrderAction(amount, currency);
      setLoading1(false);
      return id;
    } catch (e) {
      console.error(e);
    }
  };
  const processPayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderId: string | undefined = await createOrderId(amount, currency);
    if (!orderId) throw new Error("Razorpay order id not defined");
    const key_id: string | undefined = process.env.RAZORPAY_KEY_ID;
    if (!key_id || key_id === "" || key_id.length === 0)
      throw new Error("Razorpay key id not defined");
    try {
      const paymentObject = new window.Razorpay({
        key: key_id,
        amount: amount * 100,
        currency,
        name: "Spam CHK",
        description: "Not a Spam",
        order_id: orderId,
        handler: async (res: any): Promise<void> => {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: res.razorpay_payment_id,
            razorpayOrderId: res.razorpay_order_id,
            razorpaySignature: res.razorpay_signature,
          };

          const result = await razorpayVerifyAction(data);
          if (result.isOk)
            toast.success(result.message, {
              id: "verify",
              action: {
                label: "Dismiss",
                onClick: (): string | number => toast.dismiss("verify"),
              },
            });
          else
            toast.error(result.message, {
              id: "not-verified",
              action: {
                label: "Dismiss",
                onClick: (): string | number => toast.dismiss("not-verified"),
              },
            });
        },
        theme: {
          color: "#3399cc",
        },
      });
      paymentObject.on("payment.failed", (response: any) => {
        toast.error(response.error.description, {
          id: "payment-failed",
          action: {
            label: "Dismiss",
            onClick: (): string | number => toast.dismiss("payment-failed"),
          },
        });
      });
      setLoading(false);
      paymentObject.open();
    } catch (e) {
      console.log(e);
    }
  };

  return loading1 ? (
    <div className="container h-screen flex justify-center items-center">
      <LoaderCircle className="animate-spin h-20 w-20 text-primary" />
    </div>
  ) : (
    <section className="container h-screen flex flex-col justify-center items-center gap-10">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
        Checkout
      </h1>
      <Card className="max-w-[25rem] space-y-8">
        <CardHeader>
          <CardTitle className="my-4">Continue</CardTitle>
          <CardDescription>
            By clicking on pay you&apos;ll purchase your plan subscription of Rs{" "}
            {amount}/month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={processPayment}>
            <Button isLoading={loading} className="w-full" type="submit">
              Pay
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex">
          <p className="text-sm text-muted-foreground underline underline-offset-4">
            Please read the terms and conditions.
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
