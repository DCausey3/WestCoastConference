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
    name: 'Lakeland District',
    nickname: 'The Lively Lakeland District',
    description: 'Serving AME churches in the central Florida region with a commitment to spiritual growth and community outreach.',
    counties: ['Polk', 'Hardee', 'Highlands'],
};

export const metadata: Metadata = {
    title: 'Lakeland District | West Coast Conference Lay Organization',
    description: 'Explore the Lakeland District of the West Coast Conference Lay Organization and the AME churches it serves.',
};

export default async function LakelandDistrictPage() {
    const { district, churches, events, officers, scholarships, documents, gallery } =
        await getDistrictFullData('lakeland', 'Lakeland District');

    const info = district || fallbackDistrict;
    const theme = getDistrictTheme('lakeland');

    return (
        <div className="bg-white">
            <DistrictHero district={info} fallbackHeroImage="/assets/districts/tampa-hero.jpg" theme={theme} />

            <div id="events">
                <ScrollReveal delay={0}>
                    <DistrictEvents events={events} districtName={info.name} theme={theme} />
                </ScrollReveal>
            </div>

            <SectionDivider variant={theme.dividerVariant} flip background="#FFFFFF" color={theme.navySoft} />

            <div id="officers" style={{ background: theme.navySoft }}>
                <ScrollReveal delay={0.1}>
                    <DistrictOfficers officers={officers} districtName={info.name} theme={theme} />
                </ScrollReveal>
            </div>

            {info.nickname && <DistrictQuoteBand quote={info.nickname} theme={theme} />}

            <div id="gallery">
                <DistrictCarousel photos={gallery} districtName={info.name} />
            </div>

            <SectionDivider variant={theme.dividerVariant} background="#FFFFFF" color={theme.navySoft} />

            <div id="churches" style={{ background: theme.navySoft }}>
                <ScrollReveal delay={0.1}>
                    <DistrictChurchCards churches={churches} districtName={info.name} />
                </ScrollReveal>
            </div>

            <div id="scholarships">
                <ScrollReveal delay={0.15}>
                    <DistrictScholarships scholarships={scholarships} districtName={info.name} theme={theme} />
                </ScrollReveal>
            </div>

            <DistrictDocuments documents={documents} theme={theme} />

            {/*<DistrictContactForm*/}
            {/*    districtName={info.name}*/}
            {/*    contactEmail="lakeland@wcclo.org"*/}
            {/*    endpoint="https://YOUR-ENDPOINT-HERE/prod/handle"*/}
            {/*    orgId="lakeland"*/}
            {/*/>*/}
        </div>
    );
}