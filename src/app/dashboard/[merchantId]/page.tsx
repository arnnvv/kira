import { validateRequest } from "@/actions";
import { db } from "@/lib/db";
import { Link, link } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { merchantId: string };
}): Promise<JSX.Element> {
  const { user } = await validateRequest();
  if (!user) return redirect("/login");
  const { merchantId } = params;

  const links: Link[] = await db
    .select()
    .from(link)
    .where(eq(link.merchantId, merchantId));

  return (
    <div>
      {links.length > 0 ? (
        <ul>
          {links.map(
            (link: Link): JSX.Element => (
              <li key={link.id}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </li>
            ),
          )}
        </ul>
      ) : (
        <p>No links found.</p>
      )}
    </div>
  );
}
