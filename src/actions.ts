"use server";

import { Session, User as LuciaUser, LegacyScrypt } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import { lucia } from "./lib/auth";
import { ActionResult } from "./app/_components/FormComponent";
import { redirect } from "next/navigation";
import { db } from "./lib/db";
import { validateEmail } from "./lib/validate";
import { Merchant } from "./lib/db/schema";

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
  if (user) return redirect("/");
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
  } catch (e) {
    console.error(e);
    return { error: "Something went wrong" };
  }
  return redirect("/");
};
