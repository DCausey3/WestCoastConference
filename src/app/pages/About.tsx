import { Link } from 'react-router';
import congregationPhoto from '/src/imports/img_1652.jpg';

export default function About() {
  const subsections = [
    {
      title: "Mission & Vision",
      description: "Our purpose and guiding principles",
      link: "/about/mission",
      icon: "🎯"
    },
    {
      title: "Our History",
      description: "A legacy of faith since 1816",
      link: "/about/history",
      icon: "📜"
    },
    {
      title: "Leadership Structure",
      description: "How we organize to serve effectively",
      link: "/about/leadership",
      icon: "⚙️"
    },
    {
      title: "Constitution & ByLaws",
      description: "Our governing documents and guidelines",
      link: "/about/constitution-bylaws",
      icon: "📋"
    }
  ];

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
            About WCCLO
          </h1>
          <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
            Serving the AME Church Community Across Florida
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-[#0A1F44] mb-6 text-center" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              Who We Are
            </h2>

            {/* Congregation Photo */}
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={congregationPhoto}
                alt="WCCLO Congregation Members"
                className="w-full h-auto object-cover"
                style={{ maxHeight: '400px' }}
              />
            </div>

            <p className="text-gray-700 mb-4" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              The West Coast Conference Lay Organization (WCCLO) serves as the teaching, training and empowering body
              for the laity of the West Coast Conference in the 11th Episcopal District of the African Methodist
              Episcopal Church.
            </p>
            <p className="text-gray-700" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              Comprised of 56 local lay organizations from churches in three Districts of the Annual Conference
              (Lakeland, St. Petersburg and Tampa), the WCCLO strives to provide dynamic training opportunities to
              its members, scholarship opportunities to our youth and fellowship opportunities to all believers in Christ.
            </p>
          </div>

          {/* Subsections Navigation */}
          <div className="mb-12">
            <h2 className="text-[#0A1F44] mb-6 text-center" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              Learn More About Us
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subsections.map((section, idx) => (
                <Link
                  key={idx}
                  to={section.link}
                  className="block bg-[#F4F6FA] p-6 rounded-lg hover:bg-[#0A1F44] hover:text-white transition-all group"
                >
                  <div className="text-4xl mb-3">{section.icon}</div>
                  <h3 className="text-[#0A1F44] group-hover:text-white mb-2" style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.5rem',
                    fontWeight: 600
                  }}>
                    {section.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white/80">
                    {section.description}
                  </p>
                  <div className="mt-4 text-[#C9A84C] group-hover:text-white flex items-center gap-2">
                    Learn more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 className="text-[#0A1F44] mb-6 text-center" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#0A1F44] p-6 rounded-lg text-center">
                <h3 className="text-[#C9A84C] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
                  Teaching
                </h3>
                <p className="text-white/80 text-sm">
                  Educating and equipping members with knowledge and understanding
                </p>
              </div>
              <div className="bg-[#0A1F44] p-6 rounded-lg text-center">
                <h3 className="text-[#C9A84C] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
                  Training
                </h3>
                <p className="text-white/80 text-sm">
                  Developing skills and abilities for effective ministry and service
                </p>
              </div>
              <div className="bg-[#0A1F44] p-6 rounded-lg text-center">
                <h3 className="text-[#C9A84C] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
                  Empowering
                </h3>
                <p className="text-white/80 text-sm">
                  Enabling members to lead and serve with confidence and purpose
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
