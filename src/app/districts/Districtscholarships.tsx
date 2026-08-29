import { GraduationCap } from 'lucide-react';
import type { Scholarship } from './Getdistrictfulldata';
import type { DistrictTheme } from './districtTheme';
import { getCardTopStyle } from './cardTopTreatment';

interface DistrictScholarshipsProps {
    scholarships: Scholarship[];
    districtName: string;
    theme: DistrictTheme;
}

export default function DistrictScholarships({ scholarships, districtName, theme }: DistrictScholarshipsProps) {
    const cardTop = getCardTopStyle(theme);

    return (
        <section className="px-6 py-20" style={{ background: theme.navySoft }}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <GraduationCap className="w-8 h-8 mx-auto mb-4" style={{ color: theme.accent }} />
                    <h2 className="mb-3" style={{ color: theme.navy, fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700 }}>
                        Scholarships
                    </h2>
                    <p className="text-gray-600">Investing in the future of our youth through education</p>
                </div>

                {scholarships.length === 0 ? (
                    <div
                        className="text-center rounded-lg py-16 px-6 bg-white"
                        style={{ border: `1px dashed ${theme.accent}66` }}
                    >
                        <p style={{ color: theme.navy, fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600, marginBottom: '6px' }}>
                            Scholarships Coming Soon
                        </p>
                        <p className="text-gray-600" style={{ fontSize: '14px', maxWidth: '380px', margin: '0 auto' }}>
                            The {districtName} is working on scholarship opportunities for our students. Check back soon.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {scholarships.map((s) => {
                            const deadlineLabel = s.deadline
                                ? new Date(s.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                : null;

                            return (
                                <div
                                    key={s._id}
                                    className="bg-white rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1"
                                    style={{ boxShadow: '0 2px 12px rgba(10,31,68,0.06)', ...cardTop }}
                                >
                                    <h3 className="mb-4" style={{ color: theme.navy, fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600 }}>
                                        {s.title}
                                    </h3>
                                    <div className="space-y-2 mb-4" style={{ fontSize: '14px' }}>
                                        {s.amount && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Award Amount:</span>
                                                <span style={{ color: theme.navy, fontWeight: 600 }}>{s.amount}</span>
                                            </div>
                                        )}
                                        {deadlineLabel && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Deadline:</span>
                                                <span style={{ color: theme.navy, fontWeight: 600 }}>{deadlineLabel}</span>
                                            </div>
                                        )}
                                    </div>
                                    {s.description && (
                                        <p className="text-gray-700 mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>{s.description}</p>
                                    )}
                                    {s.applicationFile?.asset?.url && (

                                       <a
                                        href={s.applicationFile.asset.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-center text-white rounded py-2.5 transition-opacity hover:opacity-90"
                                        style={{ fontSize: '14px', fontWeight: 600, background: theme.navy }}
                                        >
                                        Apply Now
                                        </a>
                                        )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}