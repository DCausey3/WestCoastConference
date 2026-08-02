import { client } from '@/sanity/client';
import { PortableText, type PortableTextBlock } from '@portabletext/react';

export const revalidate = 30;

const HISTORY_QUERY = `*[_type == "historyPage"][0]`;

type Milestone = { year: string; description: string };
type HistoryPageData = {
    ameHistory?: PortableTextBlock[];
    layOrgHistory?: PortableTextBlock[];
    conferenceHistory?: PortableTextBlock[];
    milestones?: Milestone[];
} | null;

// Pre-split fallback paragraphs — used only until real Portable Text content
// exists in Studio. Once an editor fills in `layOrgHistory` there, this is
// never shown again.
const fallbackLayOrgParagraphs = [
    `From its inception in the AME Church in 1912, the Lay Organization has had to forge its way through the seas of resistance and discouragement. Buffered by sheer determination, it was in 1945, at the seat of the South Florida Annual Conference, that the Eleventh Episcopal District Lay Organization had its beginning.`,
    `During the 1944 General Conference convened in Philadelphia, Pennsylvania, Delegate E. M. Blocker, a steward of Greater Bethel A.M.E. Church in Miami, Florida, attended the Laymen's Connectional meeting. It was this meeting that infused him with ideas and principles regarding the laity, and he was inspired to organize the Lay League in the Eleventh Episcopal District. Under Brother Blocker's leadership the Laymen met and organized the Miami District Laymen League at Greater Bethel A.M.E. Church.`,
    `Other laymen were encouraged to participate, and the Lay movement began to gain momentum as Brother Blocker was invited to hold organizational meetings throughout the South Florida area. News of the organizational meetings led by Brother Blocker and laymen of the North Miami and West Palm Beach districts reached Bishop H.Y. Tookes, the Presiding Bishop of the Eleventh Episcopal District, who directed that Laymen not be allowed to hold meetings in churches. Still, the Lay movement continued to grow.`,
    `In the East Florida Conference, Brother J. L. Williams, Sr. of St. Paul AME Church, Jacksonville, called together laymen who organized the Laymen Alliance Incorporation of the AME Church. In 1945, during the South Florida Annual Conference in Cocoa, Florida, Bishop Tookes appointed Dr. A. J. White of St. Paul AME Church in Tampa as state Lay president and Brother E.M. Blocker as president of the South Florida Conference — though laymen, wanting an elected rather than appointed president, pressed the matter with the General Church.`,
    `In 1948, newly assigned Bishop John Andrew Gregg called a special meeting to elect a president of the laity. On November 2, 1948, the Laymen's League met at St. Mark AME Church in Orlando, where Professor E. M. Blocker became the first elected Lay president of the Eleventh Episcopal District.`,
    `The Eleventh Episcopal District enjoys a rich history of involvement, activism, and leadership, holding a seat at the table of the AME Church across the Connection. Constituents serve on connectional committees, lead special causes, and present training during biennial sessions — carrying forward a legacy of teaching, training, and empowering the laity for the cause of Christ.`,
];

const fallbackMilestones: Milestone[] = [
    { year: '1948–1953', description: 'E. M. Blocker — first elected Lay President' },
    { year: '1953', description: 'Felix White elected second Episcopal President' },
    { year: '1971–1984', description: 'Selmo Bradley serves as third president' },
    { year: '1984–1992', description: 'James L. Williams, Jr. serves as fourth president' },
    { year: '1992–2000', description: 'Jesse L. Burns serves as fifth president' },
    { year: '2000–2008', description: 'Marian Bacon White — first woman elected to lead the Episcopal Lay Organization' },
    { year: '2008–2016', description: 'Charlie Nichols serves as seventh president; re-establishes the training retreat' },
    { year: '2016–Present', description: 'Patricia H. Wright — second woman elected, eighth president overall' },
];

const portableTextComponents = {
    block: {
        normal: ({ children }: any) => (
            <p className="text-gray-700 mb-6" style={{ fontSize: '1.125rem', lineHeight: '1.85' }}>{children}</p>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-[#0A1F44] mt-10 mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600 }}>{children}</h3>
        ),
    },
    marks: {
        strong: ({ children }: any) => <strong className="text-[#0A1F44]">{children}</strong>,
    },
};

export default async function History() {
    const history: HistoryPageData = await client.fetch(HISTORY_QUERY, {}, { next: { revalidate: 30 } });
    const milestones = history?.milestones?.length ? history.milestones : fallbackMilestones;

    return (
        <div className="bg-white">
            {/* Page Header */}
            <section className="bg-[#0A1F44] px-6 py-16">
                <div className="max-w-7xl mx-auto text-center">
                    <div
                        className="text-[#C9A84C] mb-4"
                        style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '12px', letterSpacing: '0.15em' }}
                    >
                        11TH EPISCOPAL DISTRICT · AME CHURCH
                    </div>
                    <h1 className="text-white mb-4" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '3rem',
                        fontWeight: 700
                    }}>
                        A Brief History of the Lay Organization
                    </h1>
                    <p className="text-white/70" style={{ fontSize: '14px' }}>
                        Courtesy of the Connectional Lay Organization Historiographer, Dr. Dorothy Henderson
                    </p>
                </div>
            </section>

            {/* Narrative */}
            <section className="px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-[#0A1F44] mb-6" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '2rem',
                        fontWeight: 600
                    }}>
                        The Lay Organization
                    </h2>

                    {history?.layOrgHistory?.length ? (
                        <PortableText value={history.layOrgHistory} components={portableTextComponents} />
                    ) : (
                        fallbackLayOrgParagraphs.map((paragraph, idx) => (
                            <p key={idx} className="text-gray-700 mb-6" style={{ fontSize: '1.125rem', lineHeight: '1.85' }}>
                                {paragraph}
                            </p>
                        ))
                    )}
                </div>
            </section>

            {/* Presidential Timeline — pulled out of the prose so it reads as
                a scannable visual list instead of another paragraph */}
            <section className="px-6 py-16 bg-[#F4F6FA]">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <div
                            className="text-[#C9A84C] mb-3"
                            style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em' }}
                        >
                            A LEGACY OF LEADERSHIP
                        </div>
                        <h2 className="text-[#0A1F44]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700 }}>
                            Eleventh Episcopal District Lay Presidents
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {milestones.map((milestone, idx) => (
                            <div key={idx} className="flex gap-6 items-start">
                                <div
                                    className="text-[#C9A84C] shrink-0 text-right"
                                    style={{ fontSize: '1.05rem', fontWeight: 700, minWidth: '130px', fontFamily: "'Playfair Display', serif" }}
                                >
                                    {milestone.year}
                                </div>
                                <div className="w-2 h-2 rounded-full bg-[#C9A84C] shrink-0 mt-2" />
                                <p className="text-gray-700 flex-1" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                                    {milestone.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing note / connectional distinction */}
            <section className="px-6 py-16">
                <div className="max-w-3xl mx-auto text-center bg-white border-2 border-[#C9A84C]/30 rounded-lg p-8">
                    <p className="text-[#0A1F44]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontStyle: 'italic', lineHeight: '1.7' }}>
                        Of the eleven presidents of the Connectional Lay Organization, three have come from the
                        Eleventh Episcopal District — Dr. R. R. Williams of Tampa (1924), J. L. Williams of
                        Jacksonville (1993), and Jesse L. Burns of Bradenton (2005).
                    </p>
                </div>
            </section>
        </div>
    );
}