import HomePage from "@/components/ui/hompage";
import { db } from "@/lib/db";
import { merchant } from "@/lib/db/schema";

export default async function Home() {
  const merchants = await db.select().from(merchant);

  return (
    <HomePage merchants={merchants} />
  )

}
