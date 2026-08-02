import { client } from '@/sanity/client';

export type District = {
    name: string;
    nickname?: string;
    description?: string;
    counties?: string[];
    heroImage?: any;
};

export type Church = {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    county?: string;
    pastor?: string;
    phone?: string;
    website?: string;
};

export type DistrictEvent = {
    _id: string;
    title: string;
    date: string;
    location: string;
    description: string;
};

export type Officer = {
    _id: string;
    name: string;
    title: string;
    photo?: any;
};

export type Scholarship = {
    _id: string;
    title: string;
    amount?: string;
    deadline?: string;
    description?: string;
    applicationFile?: { asset?: { url: string } };
};

export type DistrictDocument = {
    _id: string;
    title: string;
    date?: string;
    file?: { asset?: { url: string; originalFilename?: string } };
};

export type GalleryPhoto = {
    _id: string;
    image: any;
    label?: string;
    alt?: string;
};

const DISTRICT_QUERY = `*[_type == "district" && slug.current == $slug][0]{name, nickname, description, counties, heroImage}`;
const CHURCHES_QUERY = `*[_type == "church" && district == $districtName] | order(name asc){name, address, city, state, zip, county, pastor, phone, website}`;
const EVENTS_QUERY = `*[_type == "event" && district == $districtName && date >= now()] | order(date asc){_id, title, date, location, description}`;
const OFFICERS_QUERY = `*[_type == "officer" && district == $districtName] | order(order asc){_id, name, title, photo}`;
const SCHOLARSHIPS_QUERY = `*[_type == "scholarship" && district == $districtName] | order(deadline asc){_id, title, amount, deadline, description, applicationFile{asset->{url}}}`;
const DOCUMENTS_QUERY = `*[_type == "districtDocument" && district == $districtName] | order(_createdAt desc){_id, title, date, file{asset->{url, originalFilename}}}`;
const GALLERY_QUERY = `*[_type == "galleryImage" && district == $districtName] | order(order asc){_id, image, label, alt}`;

export async function getDistrictFullData(slug: string, districtName: string) {
    const params = { slug, districtName };
    // Always fetch live from Sanity — no caching layer to go stale or diverge
    // across edge nodes/browsers. Revisit once on-demand revalidation is wired up.
    const opts = { cache: 'no-store' as const };

    const [district, churches, events, officers, scholarships, documents, gallery] = await Promise.all([
        client.fetch<District | null>(DISTRICT_QUERY, params, opts),
        client.fetch<Church[]>(CHURCHES_QUERY, params, opts),
        client.fetch<DistrictEvent[]>(EVENTS_QUERY, params, opts),
        client.fetch<Officer[]>(OFFICERS_QUERY, params, opts),
        client.fetch<Scholarship[]>(SCHOLARSHIPS_QUERY, params, opts),
        client.fetch<DistrictDocument[]>(DOCUMENTS_QUERY, params, opts),
        client.fetch<GalleryPhoto[]>(GALLERY_QUERY, params, opts),
    ]);

    return { district, churches, events, officers, scholarships, documents, gallery };
}