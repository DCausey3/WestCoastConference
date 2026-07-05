export default function Leadership() {
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
              The West Coast Conference Lay Organization operates under a structured leadership model designed to
              effectively serve our 56 local lay organizations across three districts.
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
                  The Executive Board provides strategic direction and oversight for the entire conference,
                  ensuring alignment with our mission of teaching, training, and empowering the laity.
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
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#C9A84C] rounded-full"></span>
                    <span className="text-gray-700"><strong>Lakeland District:</strong> Emily Davis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#C9A84C] rounded-full"></span>
                    <span className="text-gray-700"><strong>St. Petersburg District:</strong> Linnell Baker</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#C9A84C] rounded-full"></span>
                    <span className="text-gray-700"><strong>Tampa District:</strong> Sandra Mitchell</span>
                  </li>
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
                  Our 56 local lay organizations serve individual churches and communities, implementing programs
                  and initiatives that support spiritual growth and community engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
