import { validateRequest } from "@/actions";
import { Homepage } from "@/components/ui/homepage";
import { db } from "@/lib/db";
import { merchant } from "@/lib/db/schema";
import { redirect } from "next/navigation";

export default async function Home(): Promise<JSX.Element> {
  const { user } = await validateRequest();
  if (user) return redirect(`/dashboard/${user.id}`);
  const merchants = await db.select().from(merchant);

  return <Homepage merchants={merchants} />;
}
