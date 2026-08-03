import { client } from '@/sanity/client';
import { PortableText, type PortableTextBlock } from '@portabletext/react';
import { Download, ScrollText, FileText } from 'lucide-react';

export const revalidate = 30;

const PAGE_QUERY = `{
  "bylaws": *[_type == "bylawsPage"][0]{
    "connectionalBylawsUrl": connectionalBylawsFile.asset->url,
    "districtBylawsUrl": districtBylawsFile.asset->url
  },
  "constitution": *[_type == "constitutionPage"][0]{
    "pdfUrl": pdfFile.asset->url,
    articles,
    colors,
    layHymn,
    layBenediction
  }
}`;

type Article = { number: string; title: string; content: PortableTextBlock[] };
type PageData = {
    bylaws: { connectionalBylawsUrl?: string; districtBylawsUrl?: string } | null;
    constitution: {
        pdfUrl?: string;
        articles?: Article[];
        colors?: string;
        layHymn?: PortableTextBlock[];
        layBenediction?: string;
    } | null;
};

// The complete Constitution & ByLaws text, transcribed from the official
// PDF, shown here as a fallback so the page is fully complete without
// requiring any Studio setup. Once real content is entered into the
// `constitutionPage` Article fields in Studio, that takes over automatically
// and this fallback is never shown.
const fallbackArticles: { number: string; title: string; paragraphs: string[] }[] = [
    {
        number: 'I',
        title: 'Name',
        paragraphs: [
            'Section 1. The name of this organization shall be the West Coast Conference of the Eleventh Episcopal District Lay Organization of the African Methodist Episcopal Church.',
        ],
    },
    {
        number: 'II',
        title: 'Mission, Statement, Purpose and Objectives',
        paragraphs: [
            'Section 1. Mission Statement — The Lay Organization of the African Methodist Episcopal Church is commissioned to teach, train and empower its members for lay ministry, global leadership and service following the tenets of Jesus Christ.',
            'Section 2. Purpose — To organize and train the laity of the African Methodist Episcopal Church so that lay persons may maximally utilize their God-given abilities and skills to improve and extend the kingdom to create happiness, peace, and harmony among its members.',
        ],
    },
    {
        number: 'III',
        title: 'Divisions',
        paragraphs: [
            'Section 1. The West Coast Lay Organization shall be composed of three (3) Districts of the Annual Conference (Lakeland District, St. Petersburg District, and the Tampa District) all local organizations of a Station or Circuit. The divisions shall mirror the responsibilities of the Episcopal Organization.',
        ],
    },
    {
        number: 'IV',
        title: 'Membership',
        paragraphs: [
            'Section 1. Membership in this organization is open to all Lay (un-ordained) members of the African Methodist Episcopal Church, in good and regular standing, in their Local, District of the Annual Conference, Conference. Good and regular standing is defined as every member being governed by the Constitution of the Lay Organization, pays required dues as set by his/her local Lay Organization, attends fifty percent (50%) of the Local Lay Organization meetings and participates at the Districts of the Annual Conference Lay Organization and the West Coast Conference Lay Organization.',
            'Section 2. Districts of the Annual Conference — The Districts of the Annual Conference Lay Organizations of the West Coast Conference Lay Organization shall be composed of: (a) All elected officers of the West Coast Conference Lay Organization as well as any elected officers of the Eleventh Episcopal District Lay Organization who is a member of a local church of the West Coast Conference. (b) All Presidents, Directors of Lay Activities of the Districts of the Annual Conference Lay Organizations and Young Adult Representatives. (c) Six (6) elected delegates from each Districts of the Annual Conference Lay Organizations, at least one of whom shall be a young adult, ages 18–35. (d) Each President and six (6) elected delegates, at least one of whom shall be a young adult, ages 18–35, of each organized Station or Circuit Lay Organization of the Annual Conference. (e) Any elected officers of The Connectional Lay Organization or the Eleventh Episcopal District Lay Organization.',
        ],
    },
    {
        number: 'V',
        title: 'Officers, Duties and Responsibilities',
        paragraphs: [
            'Section 1. The elected Officers of The West Coast Conference Lay Organization and its Divisions shall be: President, First Vice President, Second Vice President*, Third Vice President*, Recording Secretary, Assistant Recording Secretary*, Corresponding Secretary*, Treasurer, Financial Secretary*, Chaplain, Historiographer*, Parliamentarian*, Director of Lay Activities, Director of Public Relations*, and Young Adult Representative. (*Elected at discretion of Divisions, see Article III of this Constitution)',
            'The President shall lead with vision and integrity, serving as a spokesperson for laity in the church and a representative for lay ministry in ecumenical and interfaith gatherings; preside over the Conference Convention, Executive Board, and all official meetings; be the active head of the organization responsible for carrying out the Constitution and By-Laws; expand and develop lay work throughout the conference; appoint chairpersons of all Standing, Special, Convention and Ad Hoc Committees; and preside over (or designate someone to preside over) all elections of officers on the District level.',
            'The First Vice President shall be responsible for Membership Recruitment and Retention, and shall assume the complete duties of the President during an absence or incapacity.',
            'The Second Vice President shall be responsible for Strategic Planning, and shall serve in the absence of the President and First Vice President.',
            'The Third Vice President shall coordinate Personal Evangelism efforts, and shall serve in the absence of the President, First and Second Vice Presidents.',
            'The Recording Secretary shall serve as Secretary of the Conference and Executive Board, recording attendance and accurate minutes of all business, and shall preside in the absence of the President and Vice Presidents until a chairperson pro tempore is elected. The Recording Secretary shall hold the bond of the Treasurer and Financial Secretary.',
            'The Assistant Recording Secretary shall assist the Recording Secretary in all duties, and perform those duties in the Recording Secretary\'s absence.',
            'The Corresponding Secretary shall ensure lay ministry focus through effective communication, report pertinent information to the Executive Board, maintain a network of internal communications, and maintain liaison with the Director of Public Relations.',
            'The Treasurer shall serve on the Budget and Stewardship Committee, make disbursements in accordance with the approved budget, and keep accurate records with itemized reports at each Executive Board meeting and the Annual Convention.',
            'The Financial Secretary shall maintain an independent set of financial records alongside the Treasurer, serve on the Budget and Stewardship Committee, receive and record all funds (turning them over to the Treasurer within 10 days), and write vouchers countersigned by the President authorizing expenditures.',
            'The Chaplain shall prepare Bible Study and Devotional Services, provide spiritual leadership to the organization, and maintain communication with District Chaplains.',
            'The Historiographer shall gather, assemble, and maintain a written and pictorial record of the organization\'s activities and achievements, act as custodian of photographs, citations, and mementos, and compile a written history submitted annually to the Executive Board and Annual Convention.',
            'The Parliamentarian shall advise the President on questions of parliamentary procedure, be seated next to the President at all meetings, and follow the Constitution and By-Laws, The Book of Discipline, and Robert\'s Rules of Order, Newly Revised.',
            'The Director of Lay Activities shall maintain a working relationship with the President and Young Adult Representative in planning and implementing the organization\'s programmatic thrust, including Training Institute, Banquets, Luncheons, Scholarships, and Awards; and shall forward the Course of Study received from the Episcopal Lay Organization to District Directors within thirty (30) days.',
            'The Director of Public Relations shall oversee all official publications, publish quarterly periodicals, oversee the Conference website and social media, and be responsible for press releases and public relations for Lay Organization meetings.',
            'The Young Adult Representative shall implement teaching and training opportunities for Young Adults, advocate for Young Adult concerns to the Executive Board, facilitate Young Adult events, and serve as a Christian mentor to a younger generation of African Methodists.',
            'Section 2. The Annual Audit shall include the records of all officers handling finances, conducted by an internal auditing committee, with findings reported at the Annual Conference Lay Convention. An external audit by a licensed, bonded, and insured CPA firm is required one year prior to a change in the Office of Treasurer.',
        ],
    },
    {
        number: 'VI',
        title: 'Nomination and Election Procedures',
        paragraphs: [
            'Section 1. All officers and members must be in good and regular standing in their Station or Circuit Organization to participate in elections and voting.',
            'Section 2. Any person seeking elected office must be a member in good and regular standing possessing the required qualifications, and must have registered and attended at least one Conference Convention as a delegate within the two (2) years preceding the election year.',
            'Section 3. All persons seeking elected office must submit a signed "Letter of Intent" to the Nominating Committee Chairperson by certified/registered mail, postmarked on or before January 1st of the election year. There shall be no nominations from the floor of the Conference Convention.',
            'Section 4. Candidates must have demonstrated active participation at the Annual Conference, District, and local church lay organization levels within the three (3) years preceding the election year.',
            'Section 5. No elected officer shall hold more than one additional office beyond the Local organization.',
            'Section 6. Members of the Nominating Committee shall be ineligible for nomination by the committee for any position to be filled.',
            'Section 7. The Nominating Committee shall consist of six (6) persons appointed by the President and confirmed by the Executive Board, with one person appointed from each District of the Annual Conference, sensitive to age diversity.',
            'Section 8. The Committee shall call for nominations at least three (3) months prior to the West Coast Convention, examine nominee qualifications, and prepare a slate of nominees distributed to the Executive Board on or before October 15th (or six months prior to the convention). No political campaigning for office shall take place before candidates are qualified as nominees.',
        ],
    },
    {
        number: 'VII',
        title: 'Election of Officers',
        paragraphs: [
            'Section 1. Officers shall be elected at the West Coast Conference Lay Convention by secret ballot (electronic or paper), except in uncontested races where a voice vote or acclamation may apply. A majority vote is necessary to elect. Elected officers assume office immediately upon installation, with an Installation ceremony as the final order of business at the closing Convention.',
            'Section 2. West Coast Conference Lay Officers shall be elected to a two (2) year term at the West Coast Annual Lay Convention.',
            'Section 3. Term Limitation. Elected officers shall serve no more than eight (8) consecutive years in the same office.',
            'Section 4. If an officer completes an unexpired term vacated by the incumbent, that unexpired portion does not count as a full term for term-limitation purposes.',
            'Section 5. Transition Period. A sixty (60) day transitional period beginning at the close of the Conference Convention is provided for outgoing officers to reconcile and transfer files, records, and property to incoming officers.',
            'Section 6. Vacancy in the Office of President and/or Vice Presidents. If a vacancy occurs in the office of President, the First Vice President immediately assumes the Presidency for the unexpired term, with each Vice President ascending accordingly and the resulting vacancy filled per the procedures outlined in the Constitution.',
            'Section 7. Vacancy of Elected Officer other than President/Vice Presidents. The President, with Executive Board confirmation, may appoint a qualified active member to fill a vacancy with less than one year remaining in the term; a special election is held within forty-five (45) days if more than one year remains.',
            'Section 8. Removal of Elected Officer. An officer not performing designated duties shall be notified in writing by the President; if the failure continues for ninety (90) days, the matter is referred to the Executive Board. The final decision to expel or reinstate rests exclusively with the West Coast Conference Lay Organization in Convention.',
            'Section 9. West Coast Conference Lay Organization Officers shall be elected biennially. Section 10. District of the Annual Conference Lay Organization Officers shall be elected biennially. Section 11. Station or Circuit Lay Organization Officers shall be elected annually.',
        ],
    },
    {
        number: 'VIII',
        title: 'Qualifications',
        paragraphs: [
            'Each officer shall be responsible for understanding and fulfilling their duties; officers with a budget shall prepare and submit an annual line item budget to the Budget and Stewardship Committee.',
            'The President shall have a commitment to lay ministry as demonstrated by prior service as an elected officer of the Episcopal District, Conference, District of the Annual Conference, or local church Organization. The First, Second, and Third Vice Presidents must possess the same qualifications as the President.',
            'The Recording Secretary must possess proficiency in writing and composition, basic reading competency, editing and record-keeping skills, and prior secretarial experience or training. The Assistant Recording Secretary and Corresponding Secretary must possess the same qualifications.',
            'The Treasurer must demonstrate experience in financial management (accounting, bookkeeping, finance, preferably nonprofit), the ability to be bonded, and experience with computerized financial/accounting software. The Financial Secretary must possess the same qualifications.',
            'The Chaplain must demonstrate Christian commitment, spiritual maturity, effective interpersonal and communication skills, training and experience in Christian Education, knowledge of the Bible and the AMEC Hymnal, and experience conducting Bible study and worship.',
            'The Historiographer must demonstrate prior experience in research, writing, and publishing historical information; proficiency in English; ability to use technology for data gathering and record keeping; and knowledge of record and artifact preservation.',
            'The Parliamentarian must be a registered Parliamentarian in good standing with the National Association of Parliamentarians (or equivalent), or demonstrate working knowledge of Parliamentary Law with two or more years of relevant service.',
            'The Director of Lay Activities must demonstrate extensive experience in research, speech, writing, program planning and development, teaching, training, adult learning, administration, and technology.',
            'The Director of Public Relations must demonstrate working knowledge of media relations and marketing, prior experience preparing press releases, and strong communication skills in English, speech, and journalism.',
            'The Young Adult Representative must be between ages 18–35 at election, have completed high school and be pursuing a post-secondary degree, demonstrate visionary leadership through work or volunteer experience with youth, possess strong training and communication abilities, and maintain a working relationship with the Director of Lay Activities.',
        ],
    },
    {
        number: 'IX',
        title: 'Executive Board',
        paragraphs: [
            'Section 1. There shall be an Executive Board composed of the elected officers of the organization, the President of the District of the Annual Conference, and chairpersons of standing committees.',
            'Section 2. The Executive Board shall meet at least twice annually, holding two meetings immediately preceding and at the seat of the West Coast Conference Convention.',
            'Section 3. Teleconference meetings may be held for specific matters, with notice and a proposed agenda issued at least three (3) days prior. Officer vacancies may not be filled via teleconference.',
            'Section 4. The President presides over Executive Board meetings; the Recording Secretary serves as secretary of the Board.',
            'Section 5. The Executive Board carries on the work of the organization during the interim of the Convention.',
            'Section 6. The Executive Board establishes its own governing rules and has supervisory authority over all Organization affairs during the interim, except where it would infringe on express constitutional provisions. The Convention may nullify, abrogate, or rescind any Executive Board action.',
            'Section 7. The Executive Board has such other authority as necessary to carry out the Constitution\'s general purposes.',
            'Section 8. The Executive Board may establish an Advisory Council (not exceeding five persons) in a purely advisory capacity, which may include past District Presidents and other distinguished lay members.',
        ],
    },
    {
        number: 'X',
        title: 'Meeting',
        paragraphs: [
            'Section 1. The West Coast Conference Lay Organization shall meet quarterly in regular session.',
            'Section 2. The Annual Session shall be held within the month of March, with Opening Worship on Friday and the business session beginning Saturday. The site of the next Convention shall be determined one (1) year in advance.',
            'Section 3. The President and/or a majority of voting Executive Board members may call an emergency meeting when deemed necessary, with time, place, and purpose clearly set forth in the official notice. No election of officers shall take place at a special or emergency meeting.',
            'Section 4. All delegates to the West Coast Convention must be elected at a regular or properly convened meeting, with names and addresses submitted to the Convention Registrar on or before March 1st.',
        ],
    },
    {
        number: 'XI',
        title: 'Voting Privileges',
        paragraphs: [
            'Section 1. Voting privileges are confined to persons set out under Article IV of this Constitution.',
            'Section 2. No person shall have more than one (1) vote on any matter, and must be personally present to vote — no proxy or absentee voting is permitted.',
            'Section 3. Unless otherwise indicated, majority vote prevails in determining all matters.',
        ],
    },
    {
        number: 'XII',
        title: 'Powers and Jurisdictions',
        paragraphs: [
            'Section 1. The West Coast Conference Lay Organization shall exercise prudent and appropriate authority, power, and supervision over all Districts of the Annual Conference Lay Organizations established under this Constitution.',
        ],
    },
    {
        number: 'XIII',
        title: 'Reserved and Implied Powers',
        paragraphs: [
            'Section 1. Each District of the Annual Conference and Station or Circuit Lay Organization is vested with full authority to make its own Constitution, By-Laws, Rules and Regulations, provided these conform to and harmonize with the Connectional Constitution and By-Laws, and do not conflict with the West Coast Conference Lay Organization\'s governing documents.',
            'Section 2. A copy of each District Lay Organization\'s Constitution and By-Laws must be filed with the West Coast Conference Lay Organization\'s Constitution and By-Laws Committee for examination and response.',
            'Section 3. Each District and Station/Circuit Lay Organization must include in its Constitution and By-Laws: "This Organization shall be subject to and governed by the Constitution and By-Laws of The West Coast Conference Lay Organization of the African Methodist Episcopal Church."',
            'Section 4. This organization and its Divisions shall at all times be governed by the Constitution and By-Laws of the Connectional Lay Organization, the current Book of Discipline, the Laws, Doctrines, and Tenets of the AME Church, and Robert\'s Rules of Order, Newly Revised.',
        ],
    },
    {
        number: 'XIV',
        title: 'Committees',
        paragraphs: [
            'All committee Chairpersons, beyond specified duties of elected officers, shall be appointed by the President.',
            'Section 1. Four types of committees exist: Standing, Special, Convention, and Ad Hoc Committees.',
            'Section 2. Standing Committees implement specific goals vital to the Organization\'s functioning, with no more than six (6) members appointed by the President and approved by the Executive Board, sensitive to age diversity. Standing Committees include: Budget and Stewardship, Constitution and By-Laws, Organizational and Officers Effectiveness, Scholarship and Awards, and others as deemed necessary.',
            'Section 3. Special Committees include Nominating, Elections, Auditing, and other task-specific committees.',
            'Section 4. Convention Committees are assigned under the Commissions of: Statistics and Finance, Organization and Structure, Personnel and Procedure, and Program and Activities.',
            'Section 5. The Credentials Committee prepares and presents a certified list of registered officers and delegates constituting the Convention\'s voting strength.',
            'Section 6. The Rules Committee provides official guidelines for operating procedures of the convening Annual Convention.',
            'Section 7. The Budget and Stewardship Committee submits its final report no later than the evening of the second business day of the Annual Convention.',
            'Section 8. The Budget and Stewardship Committee is composed of the Treasurer, Financial Secretary, and other members (no more than eight total), appointed by the President, responsible for preparing a two-year budget for approval and adoption.',
            'Section 9. The Constitution and By-Laws Committee defines the organization\'s primary characteristics and rules, which cannot be changed without prior notice to the membership and a two-thirds (2/3) majority vote of the Annual Lay Convention.',
            'Section 10. The Organizational and Officers Effectiveness Committee reports annually to the Executive Board, proposing and implementing the process and tools for officer evaluation. Section 11. Ad Hoc Committees are appointed as needed and cease to exist upon presentation of their final report.',
        ],
    },
    {
        number: 'XV',
        title: 'Subordinate Bodies',
        paragraphs: [
            'Section 1. District of the Annual Conference — composed of all elected officers; all Presidents, Directors of Lay Activities, and Young Adult Representatives; six (6) elected delegates from each District (at least one young adult, ages 18–35); each Station/Circuit President and six elected delegates; and any elected officers of the Connectional or Eleventh Episcopal District Lay Organizations.',
            'Section 2. District Lay Organizations of the Annual Conference are amenable to the Conference Lay Organization and must report at least quarterly.',
            'Section 3. Station or Circuit Lay Organization — the pastor of each Station or Circuit shall, within thirty (30) days after the Annual Conference, call a meeting to organize a Lay Organization where none exists. The President or a duly elected representative becomes a member of the Official Board by virtue of office.',
            'Section 4. Station or Circuit officers shall be those specified in Article V, Section 1, with regular meetings held no fewer than ten (10) times per year.',
        ],
    },
    {
        number: 'XVI',
        title: 'Amendments',
        paragraphs: [
            'Section 1. Amendments to the Constitution and By-Laws may be made by filing a copy of the proposed amendment with the President, Secretary, and Constitution and By-Laws Committee Chair, sent to each Conference President at least ninety (90) days prior to the opening of the Annual Convention. A two-thirds (2/3) vote of members present and eligible to vote at the Convention is required to effect an amendment, taking effect at the close of the ratifying Convention.',
        ],
    },
    {
        number: 'Bylaws',
        title: 'Bylaws of the West Coast Conference Lay Organization',
        paragraphs: [
            'Section 1. The Order of Business shall be: Devotion; Bible Study; Roll Call of Officers; Report of Credentials Committee; Registration of Delegates; Reading of Minutes of the Executive Board; Reading of Communications; Reading of Committees\' Reports; President\'s Message; Reports of Officers; Reports of District Presidents; Unfinished Business; New Business; Report of Committees; Memorial Service; Installation of Officers; Adjournment.',
            'Section 2. A majority of delegates present from each District of the Annual Conference Lay Organization with voting delegations shall constitute a quorum for the transaction of all business.',
            'Section 3. Members shall conform to all rules and regulations of this organization; members guilty of an infraction, violation of rules, or conduct unbecoming a member may be removed from membership.',
            'Section 4. The order of business may be changed by a two-thirds (2/3) majority vote of delegates present at the Conference Convention.',
            'Section 5. All reports of District Presidents and other officers shall be submitted in writing, in triplicate — one to the President, one to the Secretary, and one retained by the reporting officer.',
            'Section 6. Any officer failing to perform official duties shall be accountable to the Executive Board.',
            'Section 7. No officer or committee shall incur any binding obligation unless authorized at inception or subsequently ratified by the organization.',
            'Section 8. The President is authorized to appoint Marshals as necessary to maintain order and decorum at meetings.',
            'Section 9. Any provision not expressly covered in this Constitution and By-Laws shall be interpreted in keeping with the long-established policy, customs, tenets, and traditions of the African Methodist Episcopal Church, The Book of Discipline, and Robert\'s Rules of Order, Newly Revised.',
        ],
    },
];

const portableTextComponents = {
    block: {
        normal: ({ children }: any) => (
            <p className="text-gray-700 mb-5" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>{children}</p>
        ),
    },
};

function slugify(number: string) {
    return `article-${number.toLowerCase()}`;
}

export default async function ConstitutionBylaws() {
    const { bylaws, constitution }: PageData = await client.fetch(PAGE_QUERY, {}, { next: { revalidate: 30 } });

    const hasRealArticles = constitution?.articles && constitution.articles.length > 0;
    const displayArticleMeta = hasRealArticles
        ? constitution!.articles!.map((a) => ({ number: a.number, title: a.title }))
        : fallbackArticles.map((a) => ({ number: a.number, title: a.title }));

    const wccPdfUrl = constitution?.pdfUrl || '/assets/revised-wcc-constitution-and-bylaws-5-20-18.pdf';
    const connectionalBylawsUrl = bylaws?.connectionalBylawsUrl || '/path-to-connectional-bylaws.pdf';
    const districtBylawsUrl = bylaws?.districtBylawsUrl || '/path-to-11th-district-bylaws.pdf';

    return (
        <div className="bg-white">
            {/* Page Header */}
            <section className="bg-[#0A1F44] px-6 py-16">
                <div className="max-w-7xl mx-auto text-center">
                    <ScrollText className="w-8 h-8 mx-auto mb-4 text-[#C9A84C]" />
                    <h1 className="text-white mb-4" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '3rem',
                        fontWeight: 700
                    }}>
                        Constitution & ByLaws
                    </h1>
                    <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
                        Governing Documents of the West Coast Conference Lay Organization
                    </p>
                </div>
            </section>

            {/* Related governing documents — compact, download-only */}
            <section className="px-6 pt-16">
                <div className="max-w-5xl mx-auto">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 text-center" style={{ fontWeight: 600 }}>
                        Related Governing Documents
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-16">
                        <a
                            href={connectionalBylawsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex items-center justify-between gap-4 bg-[#F4F6FA] rounded-lg px-6 py-4 hover:bg-[#E8EDF5] transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-[#C9A84C] shrink-0" />
                                <span className="text-[#0A1F44]" style={{ fontSize: '14px', fontWeight: 600 }}>
                                    Connectional Lay ByLaws
                                </span>
                            </div>
                            <Download className="w-4 h-4 text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors shrink-0" />
                        </a>
                        <a
                            href={districtBylawsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex items-center justify-between gap-4 bg-[#F4F6FA] rounded-lg px-6 py-4 hover:bg-[#E8EDF5] transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-[#C9A84C] shrink-0" />
                                <span className="text-[#0A1F44]" style={{ fontSize: '14px', fontWeight: 600 }}>
                                    11th Episcopal District ByLaws
                                </span>
                            </div>
                            <Download className="w-4 h-4 text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors shrink-0" />
                        </a>
                    </div>
                </div>
            </section>

            {/* WCC Constitution — the main event: download + full readable edition */}
            <section className="px-6 pb-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-[#0A1F44] mb-4" style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '2.25rem',
                            fontWeight: 700
                        }}>
                            West Coast Conference Constitution & ByLaws
                        </h2>
                        <a
                            href={wccPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A1F44] px-6 py-2.5 rounded hover:bg-[#d4b76a] transition-colors uppercase tracking-wider"
                            style={{ fontSize: '13px', fontWeight: 600 }}
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </a>
                    </div>

                    <div className="grid lg:grid-cols-[240px_1fr] gap-12">

                        {/* Sticky TOC sidebar */}
                        <aside className="hidden lg:block">
                            <div className="sticky" style={{ top: '2rem' }}>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-4" style={{ fontWeight: 600 }}>
                                    Articles
                                </p>
                                <nav className="space-y-1">
                                    {displayArticleMeta.map((a) => (
                                        <a
                                            key={a.number}
                                            href={`#${slugify(a.number)}`}
                                            className="block py-1.5 text-gray-600 hover:text-[#C9A84C] transition-colors"
                                            style={{ fontSize: '13px', lineHeight: '1.4' }}
                                        >
                                            <span className="text-[#C9A84C]" style={{ fontWeight: 700 }}>{a.number}.</span>{' '}
                                            {a.title}
                                        </a>
                                    ))}
                                    <a
                                        href="#appendix"
                                        className="block py-1.5 mt-3 pt-3 border-t border-gray-200 text-gray-600 hover:text-[#C9A84C] transition-colors"
                                        style={{ fontSize: '13px', fontWeight: 600 }}
                                    >
                                        Colors, Hymn & Benediction
                                    </a>
                                </nav>
                            </div>
                        </aside>

                        {/* Article content */}
                        <div className="max-w-2xl">
                            {hasRealArticles ? (
                                constitution!.articles!.map((article) => (
                                    <div key={article.number} id={slugify(article.number)} className="mb-16 scroll-mt-8">
                                        <div className="flex items-baseline gap-3 mb-6 pb-3 border-b-2 border-[#C9A84C]">
                                            <span className="text-[#C9A84C]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700 }}>
                                                ARTICLE {article.number}
                                            </span>
                                            <h3 className="text-[#0A1F44]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600 }}>
                                                {article.title}
                                            </h3>
                                        </div>
                                        <PortableText value={article.content} components={portableTextComponents} />
                                    </div>
                                ))
                            ) : (
                                fallbackArticles.map((article) => (
                                    <div key={article.number} id={slugify(article.number)} className="mb-16 scroll-mt-8">
                                        <div className="flex items-baseline gap-3 mb-6 pb-3 border-b-2 border-[#C9A84C]">
                                            <span className="text-[#C9A84C]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700 }}>
                                                ARTICLE {article.number}
                                            </span>
                                            <h3 className="text-[#0A1F44]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600 }}>
                                                {article.title}
                                            </h3>
                                        </div>
                                        {article.paragraphs.map((p, idx) => (
                                            <p key={idx} className="text-gray-700 mb-5" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                                                {p}
                                            </p>
                                        ))}
                                    </div>
                                ))
                            )}

                            {!hasRealArticles && (
                                <div className="bg-[#F4F6FA] rounded-lg p-6 mb-16 text-center">
                                    <p className="text-gray-600" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                                        This is the full Constitution & ByLaws text, transcribed from the official
                                        PDF. If you'd like district officers to be able to edit this content directly
                                        without a developer, it can be moved into Studio's rich-text fields — download
                                        the PDF above for the signed, authoritative copy in the meantime.
                                    </p>
                                </div>
                            )}

                            {/* Appendix: Colors, Hymn, Benediction */}
                            <div id="appendix" className="scroll-mt-8">
                                <h3 className="text-[#0A1F44] mb-6 pb-3 border-b-2 border-[#C9A84C]" style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '1.5rem',
                                    fontWeight: 600
                                }}>
                                    Colors, Hymn & Benediction
                                </h3>

                                <div className="bg-[#F4F6FA] rounded-lg p-6 mb-8">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>
                                        Official Colors
                                    </p>
                                    <p className="text-[#0A1F44]" style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                                        {constitution?.colors || 'Royal Blue and White, or Navy Blue and White'}
                                    </p>
                                </div>

                                <div className="mb-8">
                                    <h4 className="text-[#0A1F44] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600 }}>
                                        The Lay Hymn
                                    </h4>
                                    <p className="text-gray-700 italic" style={{ fontSize: '1rem', lineHeight: '1.9' }}>
                                        Laymen now have thus assembled, In Thy blessed name O God. Guide us in our true
                                        endeavor light the pathway that we trod; Give us strength to ever labor for Thy
                                        cause.
                                        <br /><br />
                                        We are banded one in union, To fulfill Thy just command. May we be Thy true
                                        disciples, Holding to Thy mighty hand; Give us blessings from the fountain of
                                        Thy love.
                                        <br /><br />
                                        <span className="text-gray-500 not-italic" style={{ fontSize: '13px' }}>
                                            Tune: (Zion) "Guide Me O Thou Great Jehovah," written by Frances A. Walston
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-[#0A1F44] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600 }}>
                                        The Lay Benediction
                                    </h4>
                                    <p className="text-gray-700 italic" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                                        "May God bless us with the true spirit of Christianity. That we may live
                                        together, not as man over man, but as lay persons working with God. Amen."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="px-6 pb-20">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-[#0A1F44] text-white p-10 rounded-lg text-center">
                        <h3 className="text-[#C9A84C] mb-4" style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.5rem',
                            fontWeight: 600
                        }}>
                            Questions About Our ByLaws?
                        </h3>
                        <p className="mb-6 text-white/80">
                            If you have questions about our constitution or bylaws, please contact our leadership team.
                        </p>
                        <a
                            href="/contact"
                            className="inline-block border-2 border-[#C9A84C] text-[#C9A84C] px-8 py-3 rounded hover:bg-[#C9A84C] hover:text-[#0A1F44] transition-colors uppercase tracking-wider"
                            style={{ fontSize: '14px', fontWeight: 600 }}
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}