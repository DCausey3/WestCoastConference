import type { Metadata } from 'next';
import DistrictDetail from "@/app/components/ui/districtLanding";


export const metadata: Metadata = {
    title: 'About Us | Florida Conference Lay Organization',
    description: 'Learn about the Florida Conference Lay Organization, our mission, values, and the African Methodist Episcopal Church.',
};

export default function Page() {
    return <DistrictDetail/>;
}
