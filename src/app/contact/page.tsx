import { client } from '@/sanity/client';
import { Mail } from 'lucide-react';

export const revalidate = 30;

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{contactEmail}`;

type ContactSettings = {
    contactEmail?: string;
} | null;

export default async function Contact() {
    const settings: ContactSettings = await client.fetch(SETTINGS_QUERY, {}, { next: { revalidate: 30 } });

    const email = settings?.contactEmail || 'info@wcclo.org';

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

            {/* Contact Information */}
            <section className="px-6 py-20">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-[#0A1F44] p-4 rounded-full inline-flex items-center justify-center mb-6" style={{ width: '64px', height: '64px' }}>
                        <Mail className="w-7 h-7 text-[#C9A84C]" />
                    </div>

                    <h3 className="text-[#0A1F44] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
                        Email Us
                    </h3>
                    <a href={`mailto:${email}`} className="text-gray-700 hover:text-[#C9A84C] underline block mb-10" style={{ fontSize: '16px' }}>
                        {email}
                    </a>

                    <div className="bg-[#F4F6FA] rounded-lg p-8" style={{ borderLeft: '4px solid #C9A84C' }}>
                        <p className="text-gray-700 mb-4" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                            For fastest response, reach out directly by email.
                        </p>

                       <a href={`mailto:${email}`}
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