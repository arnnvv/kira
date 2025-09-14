import { Webhooks } from "@dodopayments/nextjs";
import { generateId } from "lucia";
import { db } from "@/lib/db";
import { link } from "@/lib/db/schema";

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,
  onPaymentSucceeded: async (payload) => {
    try {
      const metadata = payload.data.metadata;
      const { upiId, inputValue, merchantId } = metadata as {
        upiId: string;
        inputValue: string;
        merchantId: string;
      };

      if (!upiId || !inputValue || !merchantId) {
        console.error("Webhook received with missing metadata:", metadata);
        return;
      }
      await db.insert(link).values({
        id: generateId(10),
        merchantId: merchantId,
        url: inputValue,
        isverified: true,
        upi: upiId,
      });

      console.log("Successfully processed payment webhook for:", inputValue);
    } catch (error) {
      console.error("Error processing 'onPaymentSucceeded' webhook:", error);
    }
  },
});
