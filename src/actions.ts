"use server";

import { Session, User as LuciaUser, LegacyScrypt, generateId } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import { lucia } from "./lib/auth";
import { redirect } from "next/navigation";
import { db } from "./lib/db";
import { validateEmail } from "./lib/validate";
import { link, Merchant } from "./lib/db/schema";
import { razorpay } from "./lib/payment";
import { ActionResult } from "./app/_components/FormComponent";
import { eq } from "drizzle-orm";

export const validateRequest = cache(
  async (): Promise<
    { user: LuciaUser; session: Session } | { session: null; user: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId)
      return {
        session: null,
        user: null,
      };
    const validSession = await lucia.validateSession(sessionId);
    try {
      if (validSession.session && validSession.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(
          validSession.session.id,
        );
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!validSession.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch (e) {
      console.error(e);
    }
    return validSession;
  },
);

export const loginAction = async (
  _: any,
  formData: FormData,
): Promise<ActionResult> => {
  const { user } = await validateRequest();
  if (user) return redirect(`/dashboard/${user.id}`);
  const email = formData.get("email");
  if (typeof email !== "string") return { error: "Email is required" };
  if (!validateEmail({ email })) return { error: "Invalid email" };
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 64
  )
    return { error: "Invalid password" };
  try {
    const existingUser: Merchant | undefined =
      (await db.query.merchant.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      })) as Merchant | undefined;

    if (!existingUser) return { error: "User not found" };
    const validPassword = await new LegacyScrypt().verify(
      existingUser.password,
      password,
    );
    if (!validPassword) return { error: "Incorrect Password" };
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return {
      message: "Welcome back:)",
    };
  } catch (e) {
    console.error(e);
    return { error: "Something went wrong" };
  }
};

export const sendlinkAction = async (data: FormValues, value: string) => {
  const merchant_selected: Merchant | undefined =
    (await db.query.merchant.findFirst({
      where: (users, { eq }) => eq(users.name, value),
    })) as Merchant | undefined;

  if (!merchant_selected) return { error: "User not found" };
  else {
    await db.insert(link).values({
      upi: data.upiId,
      id: generateId(10),
      isverified: false,
      url: data.inputValue,
      merchantId: merchant_selected.id,
    });
    return { success: "Link created successfully" };
  }
};

export const handledeleteAction = async (
  _: any,
  formData: FormData,
): Promise<ActionResult> => {
  const linkId = formData.get("linkId") as string;
  try {
    const idExists: { id: string }[] = await db
      .select({ id: link.id })
      .from(link)
      .where(eq(link.id, linkId))
      .limit(1);
    if (!idExists) return { error: "Link not found" };
    await db.delete(link).where(eq(link.id, linkId));
    return {
      message: "Link deleted successfully",
    };
  } catch (e) {
    return { error: `${e}` };
  }
};

export const razorpayOrderAction = async (amount: number, currency: string) => {
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency,
  });
  console.log(order);
};

export const razorpayVerifyAction = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
) => {};
