import { client } from '@/sanity/client';
import ChurchesClient, { type Church } from '@/app/components/ui/ChurchesClient';

export const revalidate = 30;

// NOTE: requires a `church` document type in Sanity Studio with fields matching
// the Church interface below (name, address, city, state, zip, county, district,
// pastor, phone, website).
const CHURCHES_QUERY = `*[_type == "church"] | order(name asc)`;

const fallbackChurches: Church[] = [
  {
    name: "Sample AME Church - Tampa",
    address: "123 Main Street",
    city: "Tampa",
    state: "FL",
    zip: "33601",
    county: "Hillsborough",
    district: "Tampa District",
    pastor: "Rev. John Smith",
    phone: "(813) 555-0100",
    website: "https://example.com"
  },
  {
    name: "Sample AME Church - St. Petersburg",
    address: "456 Oak Avenue",
    city: "St. Petersburg",
    state: "FL",
    zip: "33701",
    county: "Pinellas",
    district: "St. Petersburg District",
    pastor: "Rev. Jane Doe",
    phone: "(727) 555-0200"
  },
  {
    name: "Sample AME Church - Lakeland",
    address: "789 Pine Road",
    city: "Lakeland",
    state: "FL",
    zip: "33801",
    county: "Polk",
    district: "Lakeland District",
    pastor: "Rev. Robert Johnson",
    phone: "(863) 555-0300",
    website: "https://example.com"
  }
];

export default async function Churches() {
  const sanityChurches: Church[] = await client.fetch(CHURCHES_QUERY, {}, { next: { revalidate: 30 } });
  const churches = sanityChurches?.length ? sanityChurches : fallbackChurches;

  const districts = Array.from(new Set(churches.map((c) => c.district))).sort();
  const counties = Array.from(new Set(churches.map((c) => c.county))).sort();

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-[#0A1F44] px-6 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-white mb-4" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '3rem',
            fontWeight: 700
          }}>
            West Coast Conference Churches
          </h1>
          <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
            Find AME Churches Across the West Coast Conference
          </p>
        </div>
      </section>

      <ChurchesClient churches={churches} districts={districts} counties={counties} />

      {/* Info Section */}
      <section className="bg-[#0A1F44] px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-white mb-4" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            fontWeight: 600
          }}>
            Is Your Church Information Incorrect?
          </h2>
          <p className="text-white/80 mb-6">
            If you notice any incorrect information about your church or would like to add your church to our directory, please contact us.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#C9A84C] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#d4b76a] transition-colors uppercase tracking-wider"
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
