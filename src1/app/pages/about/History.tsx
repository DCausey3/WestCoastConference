export default function History() {
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
            Our History
          </h1>
          <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
            A Legacy of Faith and Service Since 1816
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
              The African Methodist Episcopal Church
            </h2>
            <p className="text-gray-700 mb-4" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              The African Methodist Episcopal Church was founded in 1816 by Richard Allen in Philadelphia, Pennsylvania.
              Born out of a need for spiritual freedom and self-determination, the A.M.E. Church has grown to become
              one of the largest and most influential African American denominations in the world.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-[#0A1F44] mb-4" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              The Lay Organization
            </h2>
            <p className="text-gray-700 mb-4" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              The Lay Organization has been an integral part of the A.M.E. Church's mission and ministry throughout
              its rich history. Lay members have played crucial roles in building churches, supporting communities,
              and advancing the Gospel message.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-[#0A1F44] mb-4" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              The West Coast Conference
            </h2>
            <p className="text-gray-700 mb-4" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              The West Coast Conference Lay Organization serves 56 local lay organizations across three districts
              in Florida: Lakeland, St. Petersburg, and Tampa. Together, we continue the legacy of faith, service,
              and empowerment that has defined our church for over two centuries.
            </p>
          </div>

          <div className="bg-[#F4F6FA] p-8 rounded-lg">
            <h3 className="text-[#0A1F44] mb-4" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 600
            }}>
              Key Milestones
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-[#C9A84C]" style={{ fontSize: '1.5rem', fontWeight: 700, minWidth: '80px' }}>
                  1816
                </div>
                <p className="text-gray-700">
                  African Methodist Episcopal Church founded by Richard Allen
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-[#C9A84C]" style={{ fontSize: '1.5rem', fontWeight: 700, minWidth: '80px' }}>
                  Present
                </div>
                <p className="text-gray-700">
                  Serving 56 local lay organizations across 8 counties in Florida
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
