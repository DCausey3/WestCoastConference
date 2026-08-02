'use client';
import { useState } from 'react';
import { Mail } from 'lucide-react';

interface DistrictContactFormProps {
    districtName: string;
    contactEmail: string;
    endpoint: string; // your form-handling API endpoint, e.g. an AWS Lambda URL
    orgId: string;    // identifier your backend uses to route this district's messages
}

export default function DistrictContactForm({ districtName, contactEmail, endpoint, orgId }: DistrictContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, org: orgId }),
            });
            if (response.ok) {
                setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
                alert('Message sent successfully!');
            } else {
                alert('There was an error sending your message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent';
    const labelClass = 'block text-sm text-gray-700 mb-1';

    return (
        <section className="px-6 py-20 bg-[#F4F6FA]">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-[#0A1F44] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700 }}>
                        Get In Touch
                    </h2>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Have a question for the {districtName}? Send us a message and someone will get back to you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-lg p-8" style={{ boxShadow: '0 2px 12px rgba(10,31,68,0.06)' }}>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className={labelClass}>First Name</label>
                                    <input id="firstName" className={inputClass} value={formData.firstName} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className={labelClass}>Last Name</label>
                                    <input id="lastName" className={inputClass} value={formData.lastName} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className={labelClass}>Email</label>
                                <input id="email" type="email" className={inputClass} value={formData.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor="phone" className={labelClass}>Phone</label>
                                <input id="phone" type="tel" className={inputClass} value={formData.phone} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="subject" className={labelClass}>Subject</label>
                                <input id="subject" className={inputClass} value={formData.subject} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor="message" className={labelClass}>Message</label>
                                <textarea id="message" rows={5} className={inputClass} value={formData.message} onChange={handleChange} required />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#0A1F44] text-white rounded py-3 hover:bg-[#0d2a5a] transition-colors uppercase tracking-wider disabled:opacity-60"
                                style={{ fontSize: '14px', fontWeight: 600 }}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-lg p-8" style={{ boxShadow: '0 2px 12px rgba(10,31,68,0.06)' }}>
                        <h3 className="text-[#0A1F44] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600 }}>
                            Contact Information
                        </h3>
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-[#C9A84C] mt-1 shrink-0" />
                            <div>
                                <p className="text-[#0A1F44] mb-1" style={{ fontWeight: 600, fontSize: '14px' }}>Email</p>
                                <a href={`mailto:${contactEmail}`} className="text-gray-600 hover:text-[#C9A84C] underline" style={{ fontSize: '14px' }}>
                                    {contactEmail}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}