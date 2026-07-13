'use client';
import { useState } from 'react';

interface Church {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  district: 'Lakeland' | 'St. Petersburg' | 'Tampa';
  pastor: string;
  phone?: string;
  website?: string;
}

export default function Churches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');

  // TODO: Replace with actual church data
  const churches: Church[] = [
    {
      name: "Sample AME Church - Tampa",
      address: "123 Main Street",
      city: "Tampa",
      state: "FL",
      zip: "33601",
      county: "Hillsborough",
      district: "Tampa",
      pastor: "Rev. John Smith",
      phone: "(813) 555-0100",
      website: "https://example.com"
    },
    {
      name: "Sample AME Church - St. Petersburg",
      address: "456 Oak Avenue",
      city: "St. Petersburg",
      state: "FL",
      zip: "33701",
      county: "Pinellas",
      district: "St. Petersburg",
      pastor: "Rev. Jane Doe",
      phone: "(727) 555-0200"
    },
    {
      name: "Sample AME Church - Lakeland",
      address: "789 Pine Road",
      city: "Lakeland",
      state: "FL",
      zip: "33801",
      county: "Polk",
      district: "Lakeland",
      pastor: "Rev. Robert Johnson",
      phone: "(863) 555-0300",
      website: "https://example.com"
    }
  ];

  const filteredChurches = churches.filter(church => {
    const matchesSearch =
      church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      church.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      church.pastor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = selectedDistrict === 'all' || church.district === selectedDistrict;
    const matchesCounty = selectedCounty === 'all' || church.county === selectedCounty;

    return matchesSearch && matchesDistrict && matchesCounty;
  });

  const districts = ['Lakeland', 'St. Petersburg', 'Tampa'];
  const counties = ['DeSoto', 'Hardee', 'Hillsborough', 'Highlands', 'Manatee', 'Pinellas', 'Polk', 'Sarasota'];

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
            West Coast Conference Churches
          </h1>
          <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
            Find AME Churches Across the West Coast Conference
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-[#F4F6FA] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-[#0A1F44] mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
                Search Churches
              </label>
              <input
                type="text"
                placeholder="Search by name, city, or pastor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#C9A84C]"
              />
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-[#0A1F44] mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
                Filter by District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#C9A84C]"
              >
                <option value="all">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district} District</option>
                ))}
              </select>
            </div>

            {/* County Filter */}
            <div>
              <label className="block text-[#0A1F44] mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
                Filter by County
              </label>
              <select
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#C9A84C]"
              >
                <option value="all">All Counties</option>
                {counties.map(county => (
                  <option key={county} value={county}>{county} County</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Showing <strong>{filteredChurches.length}</strong> of <strong>{churches.length}</strong> churches
            </p>
          </div>
        </div>
      </section>

      {/* Churches List */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {filteredChurches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No churches found matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChurches.map((church, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#C9A84C] transition-colors"
                >
                  {/* Church Name */}
                  <h3 className="text-[#0A1F44] mb-3" style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.5rem',
                    fontWeight: 600
                  }}>
                    {church.name}
                  </h3>

                  {/* Address */}
                  <div className="mb-3">
                    <p className="text-gray-700">
                      <svg className="w-4 h-4 inline mr-2 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {church.address}
                    </p>
                    <p className="text-gray-700 ml-6">
                      {church.city}, {church.state} {church.zip}
                    </p>
                  </div>

                  {/* District & County */}
                  <div className="mb-3 flex gap-2">
                    <span className="bg-[#0A1F44] text-white px-3 py-1 rounded-full text-xs">
                      {church.district} District
                    </span>
                    <span className="bg-[#C9A84C] text-[#0A1F44] px-3 py-1 rounded-full text-xs">
                      {church.county} County
                    </span>
                  </div>

                  {/* Pastor */}
                  <p className="text-gray-700 mb-2">
                    <strong>Pastor:</strong> {church.pastor}
                  </p>

                  {/* Phone */}
                  {church.phone && (
                    <p className="text-gray-700 mb-2">
                      <svg className="w-4 h-4 inline mr-2 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {church.phone}
                    </p>
                  )}

                  {/* Website */}
                  {church.website && (
                    <a
                      href={church.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-[#C9A84C] hover:text-[#0A1F44] transition-colors"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Visit Website
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-[#0A1F44] px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-white mb-4" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            fontWeight: 600
          }}>
            Is Your Church Information Incorrect?
          </h2>
          <p className="text-white/80 mb-6">
            If you notice any incorrect information about your church or would like to add your church to our directory, please contact us.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#C9A84C] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#d4b76a] transition-colors uppercase tracking-wider"
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
