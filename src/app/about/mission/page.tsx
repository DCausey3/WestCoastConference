import { client } from '@/sanity/client';

export const revalidate = 30;

// NOTE: requires a `missionPage` singleton document type in Sanity Studio:
// { missionStatement: text, visionStatement: text, coreValues: [{ title, description }] }
const MISSION_QUERY = `*[_type == "missionPage"][0]`;

type CoreValue = { title: string; description: string };
type MissionPageData = {
  missionStatement?: string;
  visionStatement?: string;
  coreValues?: CoreValue[];
} | null;

const fallbackCoreValues: CoreValue[] = [
  { title: 'Faith', description: 'Grounded in our belief in God and committed to living out our Christian faith' },
  { title: 'Service', description: 'Dedicated to serving our church, community, and those in need' },
  { title: 'Excellence', description: "Committed to excellence in all we do, reflecting God's glory" },
  { title: 'Unity', description: 'Building strong relationships and working together in fellowship' },
];

export default async function Mission() {
  const mission: MissionPageData = await client.fetch(MISSION_QUERY, {}, { next: { revalidate: 30 } });

  const missionStatement = mission?.missionStatement ||
    `The West Coast Conference Lay Organization exists to teach, train, and empower lay persons to serve
    effectively within the African Methodist Episcopal Church community. We are dedicated to strengthening
    our churches and communities through active participation, spiritual development, and dedicated service.`;

  const visionStatement = mission?.visionStatement ||
    `To be a model lay organization that equips and empowers members to fulfill their calling as lay persons
    working with God, creating vibrant, engaged, and spiritually mature church communities across the West
    Coast Conference.`;

  const coreValues = mission?.coreValues?.length ? mission.coreValues : fallbackCoreValues;

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
            Our Mission & Vision
          </h1>
          <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
            Teaching, Training & Empowering the Laity
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
              Mission Statement
            </h2>
            <p className="text-gray-700 mb-4" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              {missionStatement}
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-[#0A1F44] mb-4" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              Our Vision
            </h2>
            <p className="text-gray-700 mb-4" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              {visionStatement}
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-[#0A1F44] mb-4" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              Core Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {coreValues.map((value, idx) => (
                <div key={idx} className="border-l-4 border-[#C9A84C] pl-4">
                  <h3 className="text-[#0A1F44] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600 }}>
                    {value.title}
                  </h3>
                  <p className="text-gray-700">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
