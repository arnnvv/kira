import { handledeleteAction, validateRequest } from "@/actions";
import { FormComponent } from "@/app/_components/FormComponent";
import { db } from "@/lib/db";
import { Link, link } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa";

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Links for Merchant</h1>
        {links.length > 0 ? (
          <ul className="space-y-4">
            {links.map(
              (link: Link): JSX.Element => (
                <li
                  key={link.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {link.url}
                  </a>
                  <FormComponent action={handledeleteAction}>
                    <input
                      type="hidden"
                      name="linkId"
                      id="linkId"
                      value={link.id}
                    />
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </FormComponent>
                </li>
              ),
            )}
          </ul>
        ) : (
          <p className="text-gray-500">No links found.</p>
        )}
      </div>
    </div>
  );
}
