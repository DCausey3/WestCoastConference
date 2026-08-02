import { FileText, Download } from 'lucide-react';
import type { DistrictDocument } from './Getdistrictfulldata';

interface DistrictDocumentsProps {
    documents: DistrictDocument[];
}

export default function DistrictDocuments({ documents }: DistrictDocumentsProps) {
    if (documents.length === 0) return null;

    return (
        <section className="px-6 py-20 bg-white">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <FileText className="w-8 h-8 mx-auto mb-4 text-[#C9A84C]" />
                    <h2 className="text-[#0A1F44] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700 }}>
                        Documents & Downloads
                    </h2>
                    <p className="text-gray-600">Forms, bylaws, and district information</p>
                </div>

                <div className="space-y-3">
                    {documents.map((doc) => (
                        <a
                            key={doc._id}
                            href={doc.file?.asset?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 rounded-lg bg-[#F4F6FA] hover:bg-[#E8EDF5] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-[#C9A84C] shrink-0" />
                                <div>
                                    <h3 className="text-[#0A1F44]" style={{ fontWeight: 600, fontSize: '14px' }}>{doc.title}</h3>
                                    {doc.date && <p className="text-gray-500" style={{ fontSize: '13px' }}>{doc.date}</p>}
                                </div>
                            </div>
                            <Download className="w-5 h-5 text-[#0A1F44] shrink-0" />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}