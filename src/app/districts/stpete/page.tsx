import type { Metadata } from 'next';
import { getDistrictFullData } from '../Getdistrictfulldata';
import DistrictHero from '../DistrictHero';
import DistrictEvents from '../Districtevents';
import DistrictOfficers from '../Districtofficers';
import DistrictCarousel from '../Districtcarousel';
import DistrictChurchCards from '../Districtchurchcards';
import DistrictScholarships from '../Districtscholarships';
import DistrictDocuments from '../Districtdocuments';
import DistrictContactForm from '../Districtcontactform';
import DistrictQuoteBand from '../DistrictQuoteBand';
import ScrollReveal from '../ ScrollReveal';
import SectionDivider from '../sectionDivider';
import { getDistrictTheme } from '../districtTheme';

const fallbackDistrict = {
    name: 'St. Petersburg District',
    nickname: 'The Sizzling Sweetie 16',
    description: "Dedicated to strengthening our faith community along Florida's west coast through worship and service.",
    counties: ['Pinellas', 'Pasco', 'Hernando'],
};

export const metadata: Metadata = {
    title: 'St. Petersburg District | West Coast Conference Lay Organization',
    description: 'Explore the St. Petersburg District of the West Coast Conference Lay Organization and the AME churches it serves.',
};

export default async function StPeteDistrictPage() {
    const { district, churches, events, officers, scholarships, documents, gallery } =
        await getDistrictFullData('stpete', 'St. Petersburg District');

    const info = district || fallbackDistrict;
    const theme = getDistrictTheme('stpete');

    return (
        <div className="bg-white">
            <DistrictHero district={info} fallbackHeroImage="/assets/districts/tampa-hero.jpg" theme={theme} />

            <div id="events">
                <ScrollReveal>
                    <DistrictEvents events={events} districtName={info.name} theme={theme} />
                </ScrollReveal>
            </div>

            <SectionDivider variant={theme.dividerVariant} flip background="#FFFFFF" color={theme.navySoft} />

            <div id="officers" style={{ background: theme.navySoft }}>
                <ScrollReveal>
                    <DistrictOfficers officers={officers} districtName={info.name} theme={theme} />
                </ScrollReveal>
            </div>

            {info.nickname && <DistrictQuoteBand quote={info.nickname} theme={theme} />}

            <div id="gallery">
                <DistrictCarousel photos={gallery} districtName={info.name} />
            </div>

            <SectionDivider variant={theme.dividerVariant} background="#FFFFFF" color={theme.navySoft} />

            <div id="churches">
                <ScrollReveal>
                    <DistrictChurchCards churches={churches} districtName={info.name} />
                </ScrollReveal>
            </div>

            <div id="scholarships">
                <ScrollReveal>
                    <DistrictScholarships scholarships={scholarships} districtName={info.name} theme={theme} />
                </ScrollReveal>
            </div>

            <DistrictDocuments documents={documents} theme={theme} />

            <DistrictContactForm
                districtName={info.name}
                contactEmail="stpete@wcclo.org"
                endpoint="https://YOUR-ENDPOINT-HERE/prod/handle"
                orgId="stpete"
            />
        </div>
    );
}