import { client } from '@/sanity/client';

export const revalidate = 30;

// NOTE: requires a `leadershipPage` singleton document type in Sanity Studio:
// { intro: text, executiveBoardDescription: text, localOrgsDescription: text }
// District president names come from the existing `district` schema's `president` field.
const LEADERSHIP_QUERY = `*[_type == "leadershipPage"][0]`;
const DISTRICTS_QUERY = `*[_type == "district"] | order(order asc){name, president}`;

type LeadershipPageData = {
  intro?: string;
  executiveBoardDescription?: string;
  localOrgsDescription?: string;
} | null;

type SanityDistrict = { name: string; president?: string };

const fallbackDistrictPresidents = [
  { name: 'Lakeland District', president: 'Emily Davis' },
  { name: 'St. Petersburg District', president: 'Linnell Baker' },
  { name: 'Tampa District', president: 'Sandra Mitchell' },
];

export default async function Leadership() {
  const [leadership, sanityDistricts]: [LeadershipPageData, SanityDistrict[]] = await Promise.all([
    client.fetch(LEADERSHIP_QUERY, {}, { next: { revalidate: 30 } }),
    client.fetch(DISTRICTS_QUERY, {}, { next: { revalidate: 30 } }),
  ]);

  const intro = leadership?.intro ||
    `The West Coast Conference Lay Organization operates under a structured leadership model designed to
    effectively serve our 56 local lay organizations across three districts.`;

  const executiveBoardDescription = leadership?.executiveBoardDescription ||
    `The Executive Board provides strategic direction and oversight for the entire conference,
    ensuring alignment with our mission of teaching, training, and empowering the laity.`;

  const localOrgsDescription = leadership?.localOrgsDescription ||
    `Our 56 local lay organizations serve individual churches and communities, implementing programs
    and initiatives that support spiritual growth and community engagement.`;

  const districtPresidents = sanityDistricts?.length
    ? sanityDistricts.filter((d) => d.president)
    : fallbackDistrictPresidents;

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
            Leadership Structure
          </h1>
          <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
            Organized for Effective Service
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-[#0A1F44] mb-4" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              Organizational Structure
            </h2>
            <p className="text-gray-700 mb-6" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              {intro}
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-[#0A1F44] mb-6" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              Conference Leadership
            </h2>
            <div className="space-y-6">
              <div className="bg-[#F4F6FA] p-6 rounded-lg">
                <h3 className="text-[#0A1F44] mb-2" style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}>
                  Executive Board
                </h3>
                <p className="text-gray-700">
                  {executiveBoardDescription}
                </p>
              </div>

              <div className="bg-[#F4F6FA] p-6 rounded-lg">
                <h3 className="text-[#0A1F44] mb-2" style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}>
                  District Presidents
                </h3>
                <p className="text-gray-700 mb-3">
                  Each of our three districts is led by a dedicated president who coordinates activities and
                  supports local lay organizations within their district.
                </p>
                <ul className="space-y-2">
                  {districtPresidents.map((d, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#C9A84C] rounded-full"></span>
                      <span className="text-gray-700"><strong>{d.name}:</strong> {d.president}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F4F6FA] p-6 rounded-lg">
                <h3 className="text-[#0A1F44] mb-2" style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}>
                  Local Lay Organizations
                </h3>
                <p className="text-gray-700">
                  {localOrgsDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
