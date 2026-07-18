import { client } from '@/sanity/client';

export const revalidate = 30;

// NOTE: requires an optional `category` string field on the `officer` schema
// in Sanity Studio with values: "executive" | "district" | "program".
// Officers without a category (or if none exist yet) fall back to "executive".
const OFFICERS_QUERY = `*[_type == "officer"] | order(order asc){name, title, category}`;
const DISTRICTS_QUERY = `*[_type == "district"] | order(order asc){name, president}`;

type SanityOfficer = { name: string; title: string; category?: 'executive' | 'district' | 'program' };
type SanityDistrict = { name: string; president?: string };

const fallbackExecutiveOfficers = [
  { name: "Lolita D. Brown", title: "President" },
  { name: "Alicia Dixon", title: "First Vice President" },
  { name: "Robbyn Hopewell", title: "Second Vice President" },
  { name: "G. Penny Demps", title: "Third Vice President" },
  { name: "MacArthur Carpenter", title: "Treasurer" },
  { name: "LaTanya Edwards", title: "Financial Secretary" },
  { name: "Emma McGriff", title: "Recording Secretary" },
  { name: "Carolyn Major-Harper", title: "Assistant Recording Secretary" },
  { name: "Amarah Scott", title: "Corresponding Secretary" }
];

const fallbackProgramOfficers = [
  { name: "Linnell Baker", title: "Director of Lay Activities" },
  { name: "Raven Gainous", title: "Young Adult Representative" },
  { name: "Samuel Scott", title: "Chaplain" },
  { name: "TBA", title: "Historiographer" },
  { name: "Rebecca Williams", title: "Parliamentarian" },
  { name: "Greg Bowers", title: "Director of Public Relations" },
  { name: "Carolyn Robinson", title: "Director of Lay Benevolence (Appointed)" }
];

const fallbackDistrictPresidents = [
  { name: "Emily Davis", title: "Lakeland District President" },
  { name: "Linnell Baker", title: "St. Petersburg District President" },
  { name: "Sandra Mitchell", title: "Tampa District President" }
];

export default async function Officers() {
  const [sanityOfficers, sanityDistricts]: [SanityOfficer[], SanityDistrict[]] = await Promise.all([
    client.fetch(OFFICERS_QUERY, {}, { next: { revalidate: 30 } }),
    client.fetch(DISTRICTS_QUERY, {}, { next: { revalidate: 30 } }),
  ]);

  const executiveOfficers = sanityOfficers?.length
    ? sanityOfficers.filter((o) => !o.category || o.category === 'executive')
    : fallbackExecutiveOfficers;

  const programOfficers = sanityOfficers?.length
    ? sanityOfficers.filter((o) => o.category === 'program')
    : fallbackProgramOfficers;

  const districtPresidents = sanityDistricts?.length
    ? sanityDistricts.filter((d) => d.president).map((d) => ({ name: d.president as string, title: `${d.name} President` }))
    : fallbackDistrictPresidents;

  const OfficerCard = ({ name, title }: { name: string; title: string }) => {
    // Create initials from name for placeholder
    const initials = name.split(' ')
      .filter(word => word !== 'TBA')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    // Generate a consistent color based on name
    const colors = ['#0A1F44', '#1a3a5e', '#2a4a6e', '#3a5a7e'];
    const colorIndex = name.length % colors.length;
    const bgColor = colors[colorIndex];

    return (
      <div className="text-center group">
        <div className="rounded-lg mb-4 overflow-hidden relative" style={{ aspectRatio: '3/4', backgroundColor: bgColor }}>
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white" style={{ fontSize: '4rem', fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>
              {name === 'TBA' ? '?' : initials}
            </span>
          </div>
        </div>
        <h3 className="text-[#0A1F44] mb-1" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.25rem',
          fontWeight: 600
        }}>
          {name}
        </h3>
        <p className="text-[#C9A84C]" style={{ fontSize: '0.875rem' }}>
          {title}
        </p>
      </div>
    );
  };

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
            Conference Officers
          </h1>
          <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
            Leading the West Coast Conference Lay Organization
          </p>
        </div>
      </section>

      {/* Officers Sections */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-gray-700 max-w-3xl mx-auto" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              Our dedicated officers work tirelessly to fulfill the mission of teaching, training, and empowering
              the laity across the West Coast Conference. Together, they provide leadership and guidance to 56 local
              lay organizations.
            </p>
          </div>

          {/* Executive Officers */}
          <div className="mb-16">
            <h2 className="text-[#0A1F44] mb-8 text-center pb-4 border-b-2 border-[#C9A84C]" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2.5rem',
              fontWeight: 700
            }}>
              Executive Officers
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {executiveOfficers.map((officer, idx) => (
                <OfficerCard key={idx} {...officer} />
              ))}
            </div>
          </div>

          {/* District Presidents */}
          <div className="mb-16">
            <h2 className="text-[#0A1F44] mb-8 text-center pb-4 border-b-2 border-[#C9A84C]" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2.5rem',
              fontWeight: 700
            }}>
              District Presidents
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {districtPresidents.map((officer, idx) => (
                <OfficerCard key={idx} {...officer} />
              ))}
            </div>
          </div>

          {/* Program Officers */}
          <div className="mb-16">
            <h2 className="text-[#0A1F44] mb-8 text-center pb-4 border-b-2 border-[#C9A84C]" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2.5rem',
              fontWeight: 700
            }}>
              Program Officers
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programOfficers.map((officer, idx) => (
                <OfficerCard key={idx} {...officer} />
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-[#F4F6FA] p-8 rounded-lg text-center">
            <h2 className="text-[#0A1F44] mb-4" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              Want to Get Involved?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              We welcome dedicated individuals who feel called to serve in leadership positions within the lay
              organization. Contact us to learn about opportunities to serve.
            </p>
            <a href="/contact" className="inline-block bg-[#C9A84C] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#d4b76a] transition-colors uppercase tracking-wider" style={{ fontSize: '14px', fontWeight: 600 }}>
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
