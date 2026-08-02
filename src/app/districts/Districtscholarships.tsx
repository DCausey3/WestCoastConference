import { GraduationCap } from 'lucide-react';
import type { Scholarship } from './Getdistrictfulldata';

interface DistrictScholarshipsProps {
    scholarships: Scholarship[];
    districtName: string;
}

export default function DistrictScholarships({ scholarships, districtName }: DistrictScholarshipsProps) {
    if (scholarships.length === 0) return null;

    return (
        <section className="px-6 py-20 bg-[#F4F6FA]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <GraduationCap className="w-8 h-8 mx-auto mb-4 text-[#C9A84C]" />
                    <h2 className="text-[#0A1F44] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700 }}>
                        Scholarships
                    </h2>
                    <p className="text-gray-600">Investing in the future of our youth through education</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {scholarships.map((s) => {
                        const deadlineLabel = s.deadline
                            ? new Date(s.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                            : null;

                        return (
                            <div key={s._id} className="bg-white rounded-lg p-6" style={{ borderTop: '3px solid #C9A84C', boxShadow: '0 2px 12px rgba(10,31,68,0.06)' }}>
                                <h3 className="text-[#0A1F44] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600 }}>
                                    {s.title}
                                </h3>
                                <div className="space-y-2 mb-4" style={{ fontSize: '14px' }}>
                                    {s.amount && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Award Amount:</span>
                                            <span className="text-[#0A1F44]" style={{ fontWeight: 600 }}>{s.amount}</span>
                                        </div>
                                    )}
                                    {deadlineLabel && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Deadline:</span>
                                            <span className="text-[#0A1F44]" style={{ fontWeight: 600 }}>{deadlineLabel}</span>
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
                                        className="block text-center bg-[#0A1F44] text-white rounded py-2.5 hover:bg-[#0d2a5a] transition-colors"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        Apply Now
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}