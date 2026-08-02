import type { Metadata } from 'next';
import { client } from '@/sanity/client';
import DistrictsLanding from "@/app/components/ui/districtsLanding";

export const metadata: Metadata = {
    title: 'Our Districts | West Coast Conference Lay Organization',
    description:
        'The West Coast Conference Lay Organization is organized into three districts — Lakeland, St. Petersburg, and Tampa — serving AME churches across Florida.',
    openGraph: {
        title: 'Our Districts | West Coast Conference Lay Organization',
        description:
            'Explore the Lakeland, St. Petersburg, and Tampa districts of the West Coast Conference Lay Organization.',
        type: 'website',
    },
};

const DISTRICTS_QUERY = `*[_type == "district"] | order(order asc){
    _id,
    name,
    slug,
    nickname,
    description,
    counties,
    heroImage
}`;

export default async function DistrictsPage() {
    // Always fetch live from Sanity — no caching layer to go stale for now.
    const districts = await client.fetch(DISTRICTS_QUERY, {}, { cache: 'no-store' });

    return <DistrictsLanding districts={districts} />;
}