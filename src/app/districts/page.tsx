import type { Metadata } from 'next';
import { client } from '@/sanity/client';
import DistrictDetail from "@/app/components/ui/districtLanding";

export const revalidate = 30;

const DISTRICTS_QUERY = `*[_type == "district"] | order(order asc)`;

export const metadata: Metadata = {
    title: 'Our Districts | West Coast Conference Lay Organization',
    description: 'Explore the three districts of the West Coast Conference Lay Organization — Lakeland, St. Petersburg, and Tampa — and the counties each one serves.',
};

export default async function Page() {
    const districts = await client.fetch(DISTRICTS_QUERY, {}, { next: { revalidate: 30 } });
    return <DistrictDetail districts={districts} />;
}
