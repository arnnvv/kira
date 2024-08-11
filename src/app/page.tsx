import { Homepage } from "@/components/ui/homepage";
import { db } from "@/lib/db";
import { merchant } from "@/lib/db/schema";

export default async function Home(): Promise<JSX.Element> {
  const merchants = await db.select().from(merchant);

  return <Homepage merchants={merchants} />;
}
