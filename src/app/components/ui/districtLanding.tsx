import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MapPin } from 'lucide-react';

type SanityDistrict = {
    _id: string;
    name: string;
    slug?: { current: string };
    description?: string;
    counties?: string[];
};

const fallbackDistricts = [
    {
        id: 'lakeland',
        name: 'Lakeland District',
        description: 'Serving AME churches in the central Florida region with a commitment to spiritual growth and community outreach.',
        counties: ['Polk', 'Hardee', 'Highlands'],
    },
    {
        id: 'st-petersburg',
        name: 'St. Petersburg District',
        description: 'Dedicated to strengthening our faith community along Florida\'s west coast through worship and service.',
        counties: ['Pinellas', 'Pasco', 'Hernando'],
    },
    {
        id: 'tampa',
        name: 'Tampa District',
        description: 'Empowering congregations in the Tampa Bay area to grow in faith and serve their communities with purpose.',
        counties: ['Hillsborough', 'Manatee', 'Sarasota'],
    },
];

function slugify(name: string) {
    return name.toLowerCase().replace(/\s+district$/i, '').trim().replace(/\s+/g, '-');
}

interface DistrictsProps {
    districts?: SanityDistrict[];
}

export default function Districts({ districts: sanityDistricts }: DistrictsProps) {
    const districts = sanityDistricts?.length
        ? sanityDistricts.map((d) => ({
            id: d.slug?.current || slugify(d.name),
            name: d.name,
            description: d.description || '',
            counties: d.counties || [],
        }))
        : fallbackDistricts;

    return (
        <div className="py-20 px-6 bg-gradient-to-b from-white to-[#F4F6FA]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="text-[#C9A84C] mb-4" style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontWeight: 600,
                        fontSize: '13px',
                        letterSpacing: '0.15em'
                    }}>
                        WEST COAST CONFERENCE
                    </div>
                    <h1 className="mb-6" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '56px',
                        fontWeight: 700,
                        lineHeight: '1.1'
                    }}>
                        Our Districts
                    </h1>
                    <div className="h-1 w-24 bg-[#C9A84C] mx-auto mb-6"></div>
                    <p className="text-gray-600 max-w-3xl mx-auto" style={{ fontSize: '18px', lineHeight: '1.7' }}>
                        The West Coast Conference is organized into three districts, each serving AME churches across multiple counties in Florida.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {districts.map((district, idx) => (
                        <Link key={district.id} href={`/districts/${district.id}`} className="block group">
                            <Card className="h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-[#C9A84C] bg-white rounded-xl overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-[#C9A84C] to-[#d4b76a]"></div>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-[#C9A84C]/10 rounded-lg group-hover:bg-[#C9A84C] group-hover:text-white transition-colors">
                                            <MapPin className="w-6 h-6 text-[#C9A84C] group-hover:text-white transition-colors" />
                                        </div>
                                        <CardTitle className="group-hover:text-[#C9A84C] transition-colors" style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '28px',
                                            fontWeight: 700
                                        }}>
                                            {district.name}
                                        </CardTitle>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                                        {district.description}
                                    </p>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="mb-6">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>
                                            Counties Served
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {district.counties.map((county) => (
                                                <span
                                                    key={county}
                                                    className="bg-[#E8EDF5] text-[#0A1F44] px-3 py-1.5 rounded-full text-sm transition-colors group-hover:bg-[#C9A84C] group-hover:text-white"
                                                    style={{ fontWeight: 600 }}
                                                >
                          {county}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center text-[#C9A84C] font-semibold group-hover:gap-2 transition-all" style={{ fontSize: '15px' }}>
                                        <span>View District</span>
                                        <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}