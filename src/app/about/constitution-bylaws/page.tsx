import { client } from '@/sanity/client';

export const revalidate = 30;

// NOTE: requires a `bylawsPage` singleton document type in Sanity Studio:
// { wccBylawsFile: file, connectionalBylawsFile: file, districtBylawsFile: file }
// each resolved to a downloadable URL via `asset->url`.
const BYLAWS_QUERY = `*[_type == "bylawsPage"][0]{
  "wccBylawsUrl": wccBylawsFile.asset->url,
  "connectionalBylawsUrl": connectionalBylawsFile.asset->url,
  "districtBylawsUrl": districtBylawsFile.asset->url
}`;

type BylawsPageData = {
  wccBylawsUrl?: string;
  connectionalBylawsUrl?: string;
  districtBylawsUrl?: string;
} | null;

export default async function ConstitutionBylaws() {
  const bylaws: BylawsPageData = await client.fetch(BYLAWS_QUERY, {}, { next: { revalidate: 30 } });

  const wccBylawsUrl = bylaws?.wccBylawsUrl || '/assets/revised-wcc-constitution-and-bylaws-5-20-18.pdf';
  const connectionalBylawsUrl = bylaws?.connectionalBylawsUrl || '/path-to-connectional-bylaws.pdf';
  const districtBylawsUrl = bylaws?.districtBylawsUrl || '/path-to-11th-district-bylaws.pdf';

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
            Constitution & ByLaws
          </h1>
          <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
            Governing Documents of the West Coast Conference Lay Organization
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* PDF Viewer */}
          <div className="mb-12">
            <h2 className="text-[#0A1F44] mb-6 text-center" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              West Coast Conference ByLaws
            </h2>

            <div className="border-2 border-[#0A1F44] rounded-lg overflow-hidden" style={{ height: '800px' }}>
              <iframe
                src={wccBylawsUrl}
                className="w-full h-full"
                title="West Coast Conference ByLaws"
              >
                <p>Your browser does not support PDFs. Please download the PDF to view it.</p>
              </iframe>
            </div>

            <div className="text-center mt-6">
              <a
                href={wccBylawsUrl}
                download="WCC-Constitution-and-Bylaws.pdf"
                className="inline-block bg-[#C9A84C] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#d4b76a] transition-colors uppercase tracking-wider"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                Download West Coast Conference ByLaws
              </a>
            </div>
          </div>

          {/* Additional ByLaws Downloads */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Connectional Lay ByLaws */}
            <div className="bg-[#F4F6FA] p-8 rounded-lg text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-[#0A1F44] mb-4" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.75rem',
                fontWeight: 600
              }}>
                Connectional Lay ByLaws
              </h3>
              <p className="text-gray-700 mb-6">
                The governing document for the Connectional Lay Organization of the African Methodist Episcopal Church.
              </p>
              <a
                href={connectionalBylawsUrl}
                download
                className="inline-block bg-[#0A1F44] text-white px-8 py-3 rounded hover:bg-[#0d2a5a] transition-colors uppercase tracking-wider"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                Download Connectional ByLaws
              </a>
            </div>

            {/* 11th Episcopal District ByLaws */}
            <div className="bg-[#F4F6FA] p-8 rounded-lg text-center">
              <div className="text-4xl mb-4">📑</div>
              <h3 className="text-[#0A1F44] mb-4" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.75rem',
                fontWeight: 600
              }}>
                11th Episcopal District ByLaws
              </h3>
              <p className="text-gray-700 mb-6">
                The governing document for the 11th Episcopal District Lay Organization.
              </p>
              <a
                href={districtBylawsUrl}
                download
                className="inline-block bg-[#0A1F44] text-white px-8 py-3 rounded hover:bg-[#0d2a5a] transition-colors uppercase tracking-wider"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                Download 11th District ByLaws
              </a>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-[#0A1F44] text-white p-8 rounded-lg text-center">
            <h3 className="text-[#C9A84C] mb-4" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 600
            }}>
              Questions About Our ByLaws?
            </h3>
            <p className="mb-6">
              If you have questions about our constitution or bylaws, please contact our leadership team.
            </p>
            <a
              href="/contact"
              className="inline-block border-2 border-[#C9A84C] text-[#C9A84C] px-8 py-3 rounded hover:bg-[#C9A84C] hover:text-[#0A1F44] transition-colors uppercase tracking-wider"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
