Design the Home page for WCCLO (West Coast Conference Lay Organization) website inside the existing 1440px frame. The Nav component is already placed at the top. Add content sections below it in this exact order:

─── SECTION 1: HERO ───
Full-width, full-viewport-height (900px) navy panel (#0A1F44).
Layout: Two columns — Left 55%, Right 45%.

LEFT COLUMN (centered vertically, 120px left padding):
- Overline: "11TH EPISCOPAL DISTRICT | WEST COAST CONFERENCE" — Gold #C9A84C, Source Sans 3 SemiBold 12px ALL CAPS letter-spacing 0.12em
- 2px Gold underline rule below overline (48px wide), 12px margin
- H1: "As Lay Persons Working With God..." — Playfair Display Bold 72px White, line-height 1.1, max 520px width
- Subheading: "Teaching. Training. Empowering." — Source Sans 3 Light 24px White 80% opacity letter-spacing 0.06em, 24px top margin
- Body: "Serving 56 lay organizations across three districts of the West Coast Conference in the 11th Episcopal District of the African Methodist Episcopal Church." — Source Sans 3 Regular 18px White 85% opacity, max 480px width, 20px top margin
- Buttons row (40px top margin): "LEARN MORE" (Button/Gold) + 16px gap + "GET INVOLVED" (Button/Secondary white outline)

RIGHT COLUMN (centered, contains the map placeholder):
- Label above map: "WEST COAST CONFERENCE SERVICE AREA" — Gold overline style
- Large rectangular placeholder frame (440px × 520px), very dark navy (#060f22) background, 2px gold border, 8px border-radius
- Inside: Florida state outline silhouette in white 15% opacity. Inside the silhouette, 8 county shapes filled solid Gold #C9A84C (DeSoto, Hardee, Hillsborough, Highland, Manatee, Pinellas, Polk, Sarasota) — represent as abstract gold cluster on the left-center of the state shape
- Caption: "D3 Interactive Map — Developer Implementation" in white 40% opacity 11px centered below frame
- Small compass rose icon (24px, white 50% opacity) bottom-right inside frame

Bottom of hero: Angled diagonal cut shape (SVG polygon) transitioning from navy to white — creates a diagonal slice at the bottom edge going from bottom-left to top-right.

─── SECTION 2: IMPACT STATS ───
White background, 100px top and bottom padding.
4 Stat Card components side by side, 200px gap between, centered horizontally.
Stats: "56 / Local Lay Organizations" | "3 / Annual Conference Districts" | "8 / Florida Counties Served" | "1816 / Year A.M.E. Founded"

─── SECTION 3: WHO WE ARE ───
Off-white background (#F4F6FA), 100px top and bottom padding.
Two columns (120px left padding, 120px right padding, 40px gap):
Left column: Large image placeholder 560px × 400px, 8px border-radius, labeled "Congregation Photo"
Right column (vertically centered):
- Overline: "WHO WE ARE"
- H2: "Teaching, Training & Empowering the Laity"
- Body: "The West Coast Conference Lay Organization (WCCLO) serves as the teaching, training and empowering body for the laity of the West Coast Conference in the 11th Episcopal District of the African Methodist Episcopal Church. Comprised of 56 local lay organizations from churches in three Districts of the Annual Conference (Lakeland, St. Petersburg and Tampa), the WCCLO strives to provide dynamic training opportunities to its members, scholarship opportunities to our youth and fellowship opportunities to all believers in Christ."
- Button/Secondary "OUR STORY" — 32px top margin
- Small text below button: "To learn more visit eedlo.org | ameclay.org" — 13px muted, gold link color

─── SECTION 4: THREE DISTRICTS ───
Navy background (#0A1F44), 100px padding, angled top divider continuing from section 3.
Top center: Overline "ANNUAL CONFERENCE DISTRICTS" (gold)
H2 "Lakeland. St. Petersburg. Tampa." — Playfair Display Bold 52px White centered, max 800px width

Three District Cards below (horizontal row, 32px gap, white background, 8px border-radius, 4px navy top border, 32px padding):
Card 1 — Lakeland District: Title "Lakeland District", nickname "The Lively Lakeland District", President "Emily Davis", pill tags: "Polk" "Hardee" "DeSoto"
Card 2 — St. Petersburg District: Title "St. Petersburg District", nickname "The Sizzling Sweetie 16", President "Linnell Baker", pill tags: "Pinellas" "Manatee" "Sarasota"
Card 3 — Tampa District: Title "Tampa District", nickname "The Trending Tremendous Tampa District", President "Sandra Mitchell", pill tags: "Hillsborough" "Highland"
Pill tag style: #E8EDF5 background, Navy text, 9999px border-radius, 8px 14px padding, 12px Source Sans 3 SemiBold

Angled diagonal cut at bottom of section back to white.

─── SECTION 5: UPCOMING EVENTS ───
White background, 100px padding.
Center: Overline "WHAT'S HAPPENING" + H2 "Upcoming Events & Activities"
3 Event Card components in a row, 24px gap, 40px top margin
Button/Primary "VIEW FULL CALENDAR" centered below cards, 48px top margin
Below that: Bordered iframe placeholder frame (full width minus 240px, 400px tall, 1px navy border, 8px border-radius, labeled "Google Calendar Embed")

─── SECTION 6: NEWSLETTER + SOCIAL ───
Background #E8EDF5, 80px padding.
Two columns (560px each, 40px gap):
Left: H3 "Our Voice Newsletter", Body "Stay up to date with our quarterly newsletter covering history, upcoming events, and happenings in local churches.", Button/Gold "DOWNLOAD VOL. 1" (32px top margin)
Right: H3 "Get Social with the WCCLO!", Body "See what's happening and find out how you can take part in our activities on our Facebook page.", Button/Primary with Facebook icon "FOLLOW @WESTCOASTLAY" (32px top margin)

Then place the Footer/Desktop component at the very bottom.
