// tampa/page.tsx (same shape for stpete/lakeland — just swap slug, fallback, contactEmail)
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
import SectionDivider from '../sectionDivider';
import ScrollReveal from '../ ScrollReveal';
import { getDistrictTheme } from '../districtTheme';

const fallbackDistrict = {
    name: 'Tampa District',
    nickname: 'The Trending Tremendous Tampa District',
    description: 'Empowering congregations in the Tampa Bay area to grow in faith and serve their communities with purpose.',
    counties: ['Hillsborough', 'Manatee', 'Sarasota'],
};

export const metadata: Metadata = {
    title: 'Tampa District | West Coast Conference Lay Organization',
    description: 'Explore the Tampa District of the West Coast Conference Lay Organization and the AME churches it serves.',
};

export default async function TampaDistrictPage() {
    const { district, churches, events, officers, scholarships, documents, gallery } =
        await getDistrictFullData('tampa', 'Tampa District');

    const info = district || fallbackDistrict;
    const theme = getDistrictTheme('tampa');

    return (
        <div className="bg-white">
            <DistrictHero district={info} fallbackHeroImage="/assets/districts/tampa-hero.jpg" theme={theme} />

            <ScrollReveal>
                <DistrictEvents events={events} districtName={info.name} theme={theme} />
            </ScrollReveal>

            <SectionDivider variant={theme.dividerVariant} flip background="#FFFFFF" color={theme.navySoft} />

            <ScrollReveal>
                <DistrictOfficers officers={officers} districtName={info.name} theme={theme} />
            </ScrollReveal>

            {info.nickname && <DistrictQuoteBand quote={info.nickname} theme={theme} />}

            <DistrictCarousel photos={gallery} districtName={info.name} />

            <SectionDivider variant={theme.dividerVariant} background="#FFFFFF" color={theme.navySoft} />

            <ScrollReveal>
                <DistrictChurchCards churches={churches} districtName={info.name} />
            </ScrollReveal>

            <ScrollReveal>
                <DistrictScholarships scholarships={scholarships} districtName={info.name} theme={theme} />
            </ScrollReveal>

            <DistrictDocuments documents={documents} theme={theme} />

            {/*<DistrictContactForm*/}
            {/*    districtName={info.name}*/}
            {/*    contactEmail="tampa@wcclo.org"*/}
            {/*    endpoint="https://YOUR-ENDPOINT-HERE/prod/handle"*/}
            {/*    orgId="tampa"*/}
            {/*/>*/}
        </div>
    );
}