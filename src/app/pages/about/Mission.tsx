export default function Mission() {
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
              The West Coast Conference Lay Organization exists to teach, train, and empower lay persons to serve
              effectively within the African Methodist Episcopal Church community. We are dedicated to strengthening
              our churches and communities through active participation, spiritual development, and dedicated service.
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
              To be a model lay organization that equips and empowers members to fulfill their calling as lay persons
              working with God, creating vibrant, engaged, and spiritually mature church communities across the West
              Coast Conference.
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
              <div className="border-l-4 border-[#C9A84C] pl-4">
                <h3 className="text-[#0A1F44] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600 }}>
                  Faith
                </h3>
                <p className="text-gray-700">
                  Grounded in our belief in God and committed to living out our Christian faith
                </p>
              </div>
              <div className="border-l-4 border-[#C9A84C] pl-4">
                <h3 className="text-[#0A1F44] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600 }}>
                  Service
                </h3>
                <p className="text-gray-700">
                  Dedicated to serving our church, community, and those in need
                </p>
              </div>
              <div className="border-l-4 border-[#C9A84C] pl-4">
                <h3 className="text-[#0A1F44] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600 }}>
                  Excellence
                </h3>
                <p className="text-gray-700">
                  Committed to excellence in all we do, reflecting God's glory
                </p>
              </div>
              <div className="border-l-4 border-[#C9A84C] pl-4">
                <h3 className="text-[#0A1F44] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600 }}>
                  Unity
                </h3>
                <p className="text-gray-700">
                  Building strong relationships and working together in fellowship
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
