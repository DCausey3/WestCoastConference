import { client } from '@/sanity/client';

export const revalidate = 30;

// NOTE: requires a `resourceCategory` document type in Sanity Studio:
// { category: string, order: number, items: [{ title: string, type: string, url?: string }] }
const RESOURCES_QUERY = `*[_type == "resourceCategory"] | order(order asc){category, items}`;

type ResourceItem = { title: string; type: string; url?: string };
type ResourceCategory = { category: string; items: ResourceItem[] };

const fallbackResources: ResourceCategory[] = [
  {
    category: "Publications",
    items: [
      { title: "Lay Organization Handbook", type: "PDF" },
      { title: "Monthly Newsletter", type: "PDF" },
      { title: "Leadership Guide", type: "PDF" }
    ]
  },
  {
    category: "Training Materials",
    items: [
      { title: "New Member Orientation", type: "Video" },
      { title: "Officer Training Series", type: "Video" },
      { title: "Workshop Presentations", type: "Slides" }
    ]
  },
  {
    category: "Forms & Documents",
    items: [
      { title: "Membership Application", type: "Form" },
      { title: "Event Registration Form", type: "Form" },
      { title: "Annual Report Template", type: "Document" }
    ]
  }
];

export default async function Resources() {
  const sanityResources: ResourceCategory[] = await client.fetch(RESOURCES_QUERY, {}, { next: { revalidate: 30 } });
  const resources = sanityResources?.length ? sanityResources : fallbackResources;

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
            Resources
          </h1>
          <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
            Tools and Materials for Lay Organization Members
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((category, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-[#0A1F44] mb-6 pb-3 border-b-2 border-[#C9A84C]" style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}>
                  {category.category}
                </h2>
                <ul className="space-y-4">
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a href={item.url || "#"} className="flex items-center justify-between p-3 bg-white rounded hover:bg-[#0A1F44] hover:text-white transition-colors group">
                        <span className="text-gray-700 group-hover:text-white">{item.title}</span>
                        <span className="text-xs bg-[#C9A84C] text-[#0A1F44] px-2 py-1 rounded">
                          {item.type}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Resources Section */}
          <div className="mt-12 bg-[#0A1F44] rounded-lg p-8 text-center">
            <h2 className="text-white mb-4" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              Need Additional Resources?
            </h2>
            <p className="text-white/80 mb-6">
              Contact your district representative or reach out to the conference office for more information.
            </p>
            <button className="bg-[#C9A84C] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#d4b76a] transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
