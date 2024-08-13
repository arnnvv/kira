"use client";

import { FormEvent, useState } from "react";
import { razorpayOrderAction, razorpayVerifyAction } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { canSubmitAtom } from "@/lib/atoms";

export default function P(): JSX.Element {
  const setCanSubmit = useSetRecoilState(canSubmitAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const currency: string = "INR";
  const amount: number = 50;

  const createOrderId = async (
    amount: number,
    currency: string,
  ): Promise<string | undefined> => {
    try {
      const id: string = await razorpayOrderAction(amount, currency);
      return id;
    } catch (e) {
      console.error(e);
    }
  };

  const processPayment = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const orderId: string | undefined = await createOrderId(amount, currency);
    if (!orderId) throw new Error("Razorpay order id not defined");
    const key_id: string | undefined = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!key_id || key_id.length === 0)
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
          const result = await razorpayVerifyAction({
            orderCreationId: orderId,
            razorpayPaymentId: res.razorpay_payment_id,
            razorpaySignature: res.razorpay_signature,
          });
          if (result.isOk) {
            toast.success(result.message, {
              id: "verify",
              action: {
                label: "Dismiss",
                onClick: (): string | number => toast.dismiss("verify"),
              },
            });
            setCanSubmit(true);
            router.push("/");
          } else
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
      console.error(e);
    }
  };

  return (
    <section className="container h-screen flex flex-col justify-center items-center gap-10">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
        Checkout
      </h1>
      <Card className="max-w-[25rem] space-y-8">
        <CardHeader>
          <CardTitle className="my-4">Continue</CardTitle>
          <CardDescription>
            Pay ₹{amount} with Razorpay to us so that we can verify your it not
            a spam. Don&apos;t worry, you&apos;ll get your money back after
            verification.
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
