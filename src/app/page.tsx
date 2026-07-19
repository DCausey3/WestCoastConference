import { client } from "@/sanity/client";
import HomeClient from "../app/components/ui/HomeClient";

const DISTRICTS_QUERY = `*[_type == "district"] | order(order asc)`;
const OFFICERS_QUERY = `*[_type == "officer"] | order(order asc)`;
const EVENTS_QUERY = `*[_type == "event"] | order(date asc)`;
const SERVED_COUNTIES_QUERY = `*[_type == "servedCounty"].countyName`;
const SETTINGS_QUERY = `*[_type == "siteSettings"][0]`;
const GALLERY_TEASER_QUERY = `*[_type == "galleryImage"] | order(order asc)[0...6]{"url": image.asset->url, label, alt}`;

const options = { next: { revalidate: 30 } };

export default async function Page() {
    const [districts, officers, events, servedCounties, settings, galleryImages] = await Promise.all([
        client.fetch(DISTRICTS_QUERY, {}, options),
        client.fetch(OFFICERS_QUERY, {}, options),
        client.fetch(EVENTS_QUERY, {}, options),
        client.fetch(SERVED_COUNTIES_QUERY, {}, options),
        client.fetch(SETTINGS_QUERY, {}, options),
        client.fetch(GALLERY_TEASER_QUERY, {}, options),
    ]);

    return (
        <HomeClient
            districts={districts}
            officers={officers}
            events={events}
            servedCounties={servedCounties}
            settings={settings}
            galleryImages={galleryImages}
        />
    );
}