import { client } from '@/sanity/client';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const revalidate = 30;

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

            {/* Contact Information — form removed until it's wired to a real endpoint */}
            <section className="px-6 py-20">
                <div className="max-w-3xl mx-auto">
                    <div className="grid sm:grid-cols-2 gap-8 mb-12">
                        <div className="flex items-start gap-4">
                            <div className="bg-[#0A1F44] p-3 rounded shrink-0">
                                <Mail className="w-6 h-6 text-[#C9A84C]" />
                            </div>
                            <div>
                                <h3 className="text-[#0A1F44] mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>
                                    Email
                                </h3>
                                <a href={`mailto:${email}`} className="text-gray-700 hover:text-[#C9A84C] underline">
                                    {email}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-[#0A1F44] p-3 rounded shrink-0">
                                <Phone className="w-6 h-6 text-[#C9A84C]" />
                            </div>
                            <div>
                                <h3 className="text-[#0A1F44] mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>
                                    Phone
                                </h3>
                                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="text-gray-700 hover:text-[#C9A84C]">
                                    {phone}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-[#0A1F44] p-3 rounded shrink-0">
                                <MapPin className="w-6 h-6 text-[#C9A84C]" />
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

                        <div className="flex items-start gap-4">
                            <div className="bg-[#0A1F44] p-3 rounded shrink-0">
                                <Clock className="w-6 h-6 text-[#C9A84C]" />
                            </div>
                            <div>
                                <h3 className="text-[#0A1F44] mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>
                                    Office Hours
                                </h3>
                                <p className="text-gray-700">
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

                    <div className="bg-[#F4F6FA] rounded-lg p-8 text-center" style={{ borderLeft: '4px solid #C9A84C' }}>
                        <p className="text-gray-700 mb-4" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                            For fastest response, reach out directly by email or phone above.
                        </p>

                      <a  href={`mailto:${email}`}
                        className="inline-block bg-[#0A1F44] text-white px-8 py-3 rounded hover:bg-[#0d2a5a] transition-colors uppercase tracking-wider"
                        style={{ fontSize: '14px', fontWeight: 600 }}
                        >
                        Email Us
                    </a>
                </div>
        </div>
</section>
</div>
);
}