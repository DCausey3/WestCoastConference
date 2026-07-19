import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { MapPin, User } from 'lucide-react';
import { client } from '@/sanity/client';
import ImageCarousel, { type GalleryImage } from '../../components/ui/ImageCarousel';

export const revalidate = 30;

// Pulls the district by slug, plus any `church` documents whose `district`
// field matches this district's name (see the `church` schema notes from
// the resources/churches wiring — `district` there is a plain string that
// should match `district.name` exactly, e.g. "Lakeland District").
const DISTRICT_QUERY = `*[_type == "district" && slug.current == $id][0]{
  name,
  presider,
  counties,
  "churches": *[_type == "church" && district == ^.name]{name, city, pastor},
  "images": images[]{ "url": asset->url, label, alt }
}`;

type SanityDistrictDetail = {
    name: string;
    presider?: string;
    counties?: string[];
    churches?: { name: string; city: string; pastor: string }[];
    images?: GalleryImage[];
} | null;

// Fallback data — used only if this district has no matching Sanity document yet
const districtData = {
    'lakeland': {
        name: 'Lakeland District',
        presider: 'Rev. John Smith',
        counties: ['Polk', 'Hardee', 'Highlands'],
        churches: [
            { name: 'St. Paul AME Church', city: 'Lakeland', pastor: 'Rev. Jane Doe' },
            { name: 'Bethel AME Church', city: 'Winter Haven', pastor: 'Rev. Robert Johnson' },
            { name: 'Mt. Olive AME Church', city: 'Bartow', pastor: 'Rev. Sarah Williams' },
        ],
    },
    'st-petersburg': {
        name: 'St. Petersburg District',
        presider: 'Rev. Mary Johnson',
        counties: ['Pinellas', 'Pasco', 'Hernando'],
        churches: [
            { name: 'Mt. Zion AME Church', city: 'St. Petersburg', pastor: 'Rev. James Wilson' },
            { name: 'Trinity AME Church', city: 'Clearwater', pastor: 'Rev. Sarah Brown' },
            { name: 'Greater Bethel AME Church', city: 'New Port Richey', pastor: 'Rev. Michael Davis' },
        ],
    },
    'tampa': {
        name: 'Tampa District',
        presider: 'Rev. David Williams',
        counties: ['Hillsborough', 'Manatee', 'Sarasota'],
        churches: [
            { name: 'Allen Chapel AME Church', city: 'Tampa', pastor: 'Rev. Patricia Miller' },
            { name: 'Wesley Chapel AME Church', city: 'Brandon', pastor: 'Rev. Thomas Garcia' },
            { name: 'New Hope AME Church', city: 'Bradenton', pastor: 'Rev. Linda Martinez' },
        ],
    },
} as const;

type DistrictId = keyof typeof districtData;

// Pre-renders the three known fallback slugs at build time. If you add new
// districts in Sanity with different slugs, they'll still render on-demand
// via ISR (not statically at build time) since generateStaticParams only
// knows about these three ahead of time.
export function generateStaticParams() {
    return Object.keys(districtData).map((id) => ({ id }));
}

export default async function DistrictDetail({ params }: { params: { id: string } }) {
    const sanityDistrict: SanityDistrictDetail = await client.fetch(
        DISTRICT_QUERY,
        { id: params.id },
        { next: { revalidate: 30 } }
    );

    const fallback = districtData[params.id as DistrictId];

    const district = sanityDistrict || fallback;

    if (!district) {
        notFound();
    }

    const counties = district.counties || [];
    const churches = district.churches || [];
    const images = 'images' in district ? district.images || [] : [];

    return (
        <div className="py-12 px-6 bg-gradient-to-b from-white to-[#F4F6FA] min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* District Header */}
                <div className="mb-16">
                    <div className="text-center mb-10">
                        <h1 className="mb-4" style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '52px',
                            fontWeight: 700
                        }}>
                            {district.name}
                        </h1>
                        <div className="h-1 w-24 bg-[#C9A84C] mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <Card className="border-2 border-gray-100 hover:border-[#C9A84C] hover:shadow-xl transition-all duration-300 bg-white rounded-xl">
                            <div className="h-2 bg-gradient-to-r from-[#C9A84C] to-[#d4b76a]"></div>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-[#C9A84C]/10 rounded-lg">
                                        <User className="w-6 h-6 text-[#C9A84C]" />
                                    </div>
                                    <CardTitle style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '24px',
                                        fontWeight: 700
                                    }}>
                                        Presiding Elder
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700" style={{ fontSize: '18px', fontWeight: 500 }}>
                                    {district.presider}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-gray-100 hover:border-[#C9A84C] hover:shadow-xl transition-all duration-300 bg-white rounded-xl">
                            <div className="h-2 bg-gradient-to-r from-[#0A1F44] to-[#0d2550]"></div>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-[#0A1F44]/10 rounded-lg">
                                        <MapPin className="w-6 h-6 text-[#0A1F44]" />
                                    </div>
                                    <CardTitle style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '24px',
                                        fontWeight: 700
                                    }}>
                                        Counties Served
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2 flex-wrap">
                                    {counties.map((county) => (
                                        <span
                                            key={county}
                                            className="bg-[#E8EDF5] text-[#0A1F44] px-4 py-2 rounded-full transition-colors hover:bg-[#0A1F44] hover:text-white"
                                            style={{ fontSize: '15px', fontWeight: 600 }}
                                        >
                      {county}
                    </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <ImageCarousel images={images} />

                {/* Churches Section */}
                <div className="mb-8">
                    <h2 className="mb-8 text-center" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '42px',
                        fontWeight: 700
                    }}>
                        Member Churches
                    </h2>
                    <div className="h-1 w-20 bg-[#C9A84C] mx-auto mb-12"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {churches.map((church, index) => (
                        <Card key={index} className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-gray-100 hover:border-[#C9A84C] bg-white rounded-xl overflow-hidden group">
                            <div className="h-1.5 bg-gradient-to-r from-[#C9A84C] to-[#d4b76a]"></div>
                            <CardHeader className="pb-3">
                                <CardTitle className="group-hover:text-[#C9A84C] transition-colors" style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '22px',
                                    fontWeight: 700,
                                    lineHeight: '1.3'
                                }}>
                                    {church.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-[#C9A84C]/10 rounded">
                                        <MapPin className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                                    </div>
                                    <p className="text-gray-600" style={{ fontSize: '15px' }}>{church.city}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-[#0A1F44]/10 rounded">
                                        <User className="w-4 h-4 text-[#0A1F44] flex-shrink-0" />
                                    </div>
                                    <p className="text-gray-600" style={{ fontSize: '15px' }}>{church.pastor}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}