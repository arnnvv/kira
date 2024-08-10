import { db } from "@/lib/db";
import { link } from "@/lib/db/schema";

interface PageProps {
    params: { slug: string };
}

export default async function Page({ params }: PageProps) {
    const { slug } = params; // Extract slug from params

    // Ensure that the slug is a string, which should match the merchantId type

    const links = await db.select().from(link).where({ merchantId: slug.toString() });

    return (
        <div>
            {/* Render links */}
            {links.length > 0 ? (
                <ul>
                    {links.map((link) => (
                        <li key={link.id}>
                            {/* Customize how you want to display each link */}
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.url}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No links found.</p>
            )}
        </div>
    );
}
