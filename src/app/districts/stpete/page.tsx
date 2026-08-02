import type { Metadata } from 'next';
import { getDistrictFullData } from '../Getdistrictfulldata';
import DistrictHero from '../DistrictHero';
import DistrictEvents from '../Districtevents';
import DistrictOfficers from '../Districtofficers';
import DistrictCarousel from '../Districtcarousel';
import DistrictChurchCards from '../Districtchurchcards';
import DistrictScholarships from '../Districtscholarships';
import DistrictDocuments from '../Districtdocuments';
import DistrictContactForm from '..//Districtcontactform';
import ScrollReveal from "@/app/districts/ ScrollReveal";
import SectionDivider from "@/app/districts/sectionDivider";
import {getDistrictTheme} from "@/app/districts/districtTheme";

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
            <div
                className="bg-white"
                style={{ '--navy': theme.navy, '--accent': theme.accent, '--accent-soft': theme.navySoft } as React.CSSProperties}
            >
                <DistrictHero district={info} fallbackHeroImage="/assets/districts/tampa-hero.jpg" />

                <ScrollReveal>
                    <DistrictEvents events={events} districtName={info.name} />
                </ScrollReveal>

                <SectionDivider variant={theme.dividerVariant} flip background="#FFFFFF" color="#F4F6FA" />

                <ScrollReveal>
                    <DistrictOfficers officers={officers} districtName={info.name} />
                </ScrollReveal>

                <DistrictCarousel photos={gallery} districtName={info.name} />

                <SectionDivider variant={theme.dividerVariant} background="#FFFFFF" color="#F4F6FA" />

                <ScrollReveal>
                    <DistrictChurchCards churches={churches} districtName={info.name} />
                </ScrollReveal>

                <ScrollReveal>
                    <DistrictScholarships scholarships={scholarships} districtName={info.name} />
                </ScrollReveal>

                <DistrictDocuments documents={documents} />
            <DistrictContactForm
                districtName={info.name}
                contactEmail="stpete@wcclo.org"
                endpoint="https://YOUR-ENDPOINT-HERE/prod/handle"
                orgId="stpete"
            />
        </div>
    );
}