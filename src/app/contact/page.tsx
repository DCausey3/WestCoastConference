import { client } from '@/sanity/client';

export const revalidate = 30;

// NOTE: extends the existing `siteSettings` singleton in Sanity Studio with
// optional fields: contactEmail, contactPhone, addressLines (array of strings),
// officeHours (array of strings).
const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{contactEmail, contactPhone, addressLines, officeHours}`;

type ContactSettings = {
  contactEmail?: string;
  contactPhone?: string;
  addressLines?: string[];
  officeHours?: string[];
} | null;

export default async function Contact() {
  const settings: ContactSettings = await client.fetch(SETTINGS_QUERY, {}, { next: { revalidate: 30 } });

  const email = settings?.contactEmail || 'info@wcclo.org';
  const phone = settings?.contactPhone || '(555) 123-4567';
  const addressLines = settings?.addressLines?.length
    ? settings.addressLines
    : ['West Coast Conference', 'Florida AME Church', 'Tampa, FL'];
  const officeHours = settings?.officeHours?.length
    ? settings.officeHours
    : ['Monday - Friday: 9:00 AM - 5:00 PM', 'Saturday: By Appointment', 'Sunday: Closed'];

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
            Contact Us
          </h1>
          <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
            Get in Touch with WCCLO
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-[#0A1F44] mb-6" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              Send Us a Message
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#C9A84C]"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#C9A84C]"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#C9A84C]"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#C9A84C]"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0A1F44] text-white py-3 rounded hover:bg-[#0d2a5a] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-[#0A1F44] mb-6" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600
            }}>
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#0A1F44] p-3 rounded">
                  <svg className="w-6 h-6 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[#0A1F44] mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>
                    Email
                  </h3>
                  <p className="text-gray-700">{email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#0A1F44] p-3 rounded">
                  <svg className="w-6 h-6 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[#0A1F44] mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>
                    Phone
                  </h3>
                  <p className="text-gray-700">{phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#0A1F44] p-3 rounded">
                  <svg className="w-6 h-6 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[#0A1F44] mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>
                    Address
                  </h3>
                  <p className="text-gray-700">
                    {addressLines.map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx < addressLines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-[#0A1F44] p-6 rounded-lg">
              <h3 className="text-[#C9A84C] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
                Office Hours
              </h3>
              <p className="text-white/80">
                {officeHours.map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < officeHours.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
