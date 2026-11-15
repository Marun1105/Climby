# Accessibility, Navigation and Settings Design for Climby (students 12–18, BG/EN, desktop + browser + phone)

Evidence-strength tags used throughout: **[STD]** normative standard or law; **[W3C-NOTE]** non-normative W3C guidance; **[PEER]** peer-reviewed study; **[META]** meta-analysis or systematic review; **[LARGE-UX]** large usability study; **[DS]** design-system or platform guidance; **[PRACT]** practitioner opinion; **[CHARITY]** advocacy-body style guide (expert consensus, not experimental).

Verification tags: **(fetched)** = I read the primary page this session; **(search summary)** = seen only through search-result summaries of the source, not the full text; **(second-hand)** = reported by another source; **(recalled)** = from my background knowledge of a well-known document that I could not open this session. Anything tagged other than (fetched) should be checked before being quoted as a number in a final report.

---

## 1. WCAG 2.2 requirements most often failed, and the European Accessibility Act

### Takeaway
Low-contrast text is by far the most commonly detected failure on the web (79.1% of home pages), and the WCAG 2.2 additions most likely to bite an app like Climby are Target Size 24x24 px (2.5.8), Focus Not Obscured (2.4.11, a real risk with a Settings overlay and sticky bars), Dragging Movements (2.5.7), Accessible Authentication (3.3.8) and Redundant Entry (3.3.7). The European Accessibility Act does not list "education" as a covered service; a consumer study app is caught mainly through the "e-commerce services" category (selling a subscription online to consumers), with a services exemption for microenterprises. This is a legal question I could not settle from primary text this session.

### Cited Findings

**How common the failures are**
- 94.8% of the top 1,000,000 home pages had automatically detectable WCAG 2 A/AA failures; low-contrast text was found on 79.1% of pages (average 29.6 instances per page); then missing alt text 55.5%, missing form labels 48.2%, empty links 45.4%, empty buttons 29.6%. Six categories account for about 96% of detected errors. Automated tests undercount real failures. **[LARGE-UX, automated audit] (search summary)** — [WebAIM Million 2025](https://webaim.org/projects/million/2025)

**New WCAG 2.2 criteria (normative text, fetched)** — all from [W3C, What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) **[STD]**
- **2.4.11 Focus Not Obscured (Minimum), AA**: "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content." Action: check sticky headers, the focus-timer widget, toasts and the Settings overlay never fully cover the focused control; use `scroll-padding` and make sure focus cannot land behind the overlay.
- **2.4.12 Focus Not Obscured (Enhanced), AAA**: no part of the focused component hidden.
- **2.4.13 Focus Appearance, AAA**: focus indicator at least as large as "a 2 CSS pixel thick perimeter of the unfocused component" and "a contrast ratio of at least 3:1 between the same pixels in the focused and unfocused states". AAA, but a sensible design target for custom focus rings in a dark theme.
- **2.5.7 Dragging Movements, AA**: "All functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging, unless dragging is essential". Action: any drag-to-reorder task list, slider for text size or timer length needs tap/click alternatives (buttons, steppers, "move up/down").
- **2.5.8 Target Size (Minimum), AA**: "The size of the target for pointer inputs is at least 24 by 24 CSS pixels", with exceptions for spacing (a 24 px circle centred on each undersized target must not intersect another target), an equivalent control on the same page, inline targets in a sentence, user-agent controls, and essential presentation. Action: audit icon-only sidebar buttons, close "x" on the overlay, theme swatches, voice-picker chips.
- **3.2.6 Consistent Help, A**: help mechanisms repeated across pages must "occur in the same relative order to other page content".
- **3.3.7 Redundant Entry, A**: information already entered in the same process must be "auto-populated, or available for the user to select" (exceptions: essential, security, no longer valid). Action: joining a class or family should not ask again for name/email/class code already given.
- **3.3.8 Accessible Authentication (Minimum), AA**: "A cognitive function test (such as remembering a password or solving a puzzle) is not required for any step in an authentication process" unless there is an alternative method, a mechanism to assist, object recognition, or personal content. Action: never block paste or password managers; allow copy-paste of one-time codes; offer magic link / OAuth / passkey; no puzzle CAPTCHA without an alternative.
- **3.3.9 Accessible Authentication (Enhanced), AAA**: same without the object-recognition and personal-content exceptions.

**Pre-2.2 criteria that dark-themed apps commonly fail** **[STD] (recalled; thresholds are from the WCAG text, pages not re-opened this session)**
- 1.4.3 Contrast (Minimum), AA: 4.5:1 for normal text, 3:1 for large text — [Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Typical dark-theme failures: grey secondary text, placeholder text, disabled-looking labels, coloured text on tinted cards.
- 1.4.11 Non-text Contrast, AA: 3:1 for UI component boundaries and states and meaningful graphics — [Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html). Typical failures: input borders, toggle "off" state, focus ring, timer progress ring against a dark surface.
- 2.4.7 Focus Visible, AA — [Understanding 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html). Typical failure: `outline: none` with no replacement.
- 1.4.12 Text Spacing, AA: no loss of content when users set line height 1.5x, paragraph spacing 2x, letter spacing 0.12em, word spacing 0.16em — [Understanding 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html). Directly relevant to Climby's font, text-size and "easy-reading layout" settings: fixed-height containers will clip.
- 1.4.4 Resize Text (200%) and 1.4.10 Reflow (320 CSS px wide without two-dimensional scrolling), AA — [Understanding 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). Relevant to the two-column Settings overlay, which must collapse to one column.
- 2.2.2 Pause, Stop, Hide (A) and 2.2.1 Timing Adjustable (A) — [Understanding 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). Relevant to any auto-moving content and to a focus timer if it ever locks or ends a task.

**European Accessibility Act (Directive (EU) 2019/882)**
- The European Commission lists the covered products and services as: computers and operating systems; ATMs, ticketing and check-in machines; smartphones; TV equipment related to digital television; telephony services and related equipment; access to audio-visual media services; services related to air, bus, rail and waterborne passenger transport; banking services; e-books; e-commerce. Education is not on the list. Member States had to transpose by June 2022. **[STD, official summary] (fetched)** — [European Commission, European Accessibility Act](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en)
- Requirements applied from 28 June 2025 to services provided to consumers after that date; some services already in use have a transition to 28 June 2030. **(search summary of law-firm and compliance articles)** — [Greenberg Traurig](https://www.gtlaw.com/ar/insights/2025/7/european-accessibility-act-compliance-what-businesses-in-the-eu-market-need-to-know); [Taylor Wessing](https://www.taylorwessing.com/en/interface/2025/accessibility/the-european-accessibility-act-a-win-win-piece-of-regulation)
- "E-commerce service" is summarised by a secondary source as a service "provided at a distance, through websites and mobile device-based services, by electronic means, at the individual request of a consumer, with a view to concluding a consumer contract"; several secondary sources say this covers online sale of any product or service. **(second-hand; not checked against the official text)** — [e-include.eu](https://e-include.eu/web-accessibility/european-accessibility-act/)
- Article 4(5): "microenterprises providing services shall be exempt from complying with the accessibility requirements referred to in paragraph 3 of this Article and any obligations relating to the compliance with those requirements." Size test reported by a secondary source: fewer than 10 persons and annual turnover or balance-sheet total not exceeding EUR 2 million. **(search summary quoting the directive; size test second-hand)** — [Directive text, legislation.gov.uk copy](https://www.legislation.gov.uk/eudr/2019/882/body/adopted/data.pdf); [EUR-Lex](https://eur-lex.europa.eu/eli/dir/2019/882/oj/eng)
- Bulgaria transposed the directive through amendments to the Persons with Disabilities Act (Закон за хората с увреждания), with private-sector provisions following in 2024; a secondary source also reports the Commission referred Bulgaria to the Court of Justice for late transposition (date not established). **(second-hand)** — [disabilityworld.org, Bulgaria](https://www.disabilityworld.org/regulations/bg/)

### Inferences
- Climby is probably in EAA scope only to the extent it sells to consumers online (sign-up, plan purchase, account management), not because it is "education". Whether the whole app or only the purchase flow counts as the "e-commerce service" is interpreted differently by commentators; treat WCAG 2.1/2.2 AA across the whole product as the safe design target, and get legal advice on scope and on the microenterprise exemption (which depends on headcount and turnover, and may be lost as the company grows).
- Regardless of the EAA, schools are public-sector bodies under the separate Web Accessibility Directive (EU) 2016/2102, so a school adopting Climby for a class may ask for conformance evidence (EN 301 549 / WCAG AA). This is my inference from background knowledge, not checked this session.
- The highest-yield audit for Climby, in order: (1) contrast of secondary text and control borders in every theme, including the user-selectable themes; (2) visible focus ring in every theme; (3) target size of icon-only controls; (4) focus trapping and focus-not-obscured in the Settings overlay; (5) text-spacing/resize resilience with every font and text-size combination; (6) login without memory tests.
- User-selectable themes multiply the contrast risk: each theme needs its own contrast check, since a palette that passes in dark can fail in light.

### Gaps
- I could not open the EUR-Lex text of Directive 2019/882 (page returned empty), so Articles 2, 3, 4(5), 14 (disproportionate burden) and 32 (transition) are not quoted from the primary source. The harmonised standard (EN 301 549; which version references WCAG 2.2) was not verified.
- No article-level text of the Bulgarian transposition was retrieved; whether the service-side microenterprise exemption is reproduced in Bulgarian law is unconfirmed, as are the enforcement body and penalties.
- No audit data specific to education apps or to desktop apps built with web technology was found; WebAIM figures are for home pages.

---

## 2. Dyslexia: what the research supports (and Cyrillic)

### Takeaway
The evidence supports plain, familiar sans-serif fonts, larger text, somewhat wider letter spacing, shorter lines and no italics; it does not support special "dyslexia fonts" (OpenDyslexic, Dyslexie), which repeatedly show no benefit in controlled studies. Offering such a font as an option is harmless, but it should not be presented as the fix; the settings that matter are size, spacing and line length. For Cyrillic there is only early, small-sample Russian research and nothing for Bulgarian.

### Cited Findings

**Fonts**
- Rello & Baeza-Yates (ASSETS 2013), the first eye-tracking study of fonts with dyslexic readers: OpenDyslexic "did not lead to better or worse readability" than standard fonts; participants significantly preferred Verdana and Helvetica over OpenDyslexic; recommended fonts on performance plus preference were Helvetica, Courier, Arial, Verdana and CMU; italics had a strong negative effect. **[PEER] (search summary)** — [Good Fonts for Dyslexia (PDF)](https://typeset.io/pdf/good-fonts-for-dyslexia-2debffz8dl.pdf)
- Follow-up (ACM TACCESS 2016), 97 Spanish speakers (48 with dyslexia): sans-serif beat serif for participants with dyslexia, monospaced (Courier) gave shorter fixations, OpenDyslexic did not outperform Arial, Helvetica or Verdana on any measure. **[PEER] (search summary of a secondary write-up)** — [BYU editing research summary](https://editingresearch.byu.edu/2020/05/28/which-fonts-are-best-for-dyslexia/)
- Wery & Diliberto (2017, Annals of Dyslexia): single-subject alternating-treatment design comparing OpenDyslexic with Arial and Times New Roman on letter naming, word reading and nonsense-word reading; no improvement in rate or accuracy; no student preferred it. Small sample. **[PEER] (search summary)** — [PMC5629233](https://pmc.ncbi.nlm.nih.gov/articles/PMC5629233)
- Kuster et al. (2018): "Dyslexie font does not benefit reading in children with or without dyslexia"; two experiments, the first with 170 children with dyslexia; no gain over Arial or Times New Roman at word or text level. **[PEER] (search summary)** — [Springer, Annals of Dyslexia](https://link.springer.com/10.1007/s11881-020-00194-x) (this link is a later review citing it; the Kuster paper itself was not opened)

**Size, spacing, line length**
- Rello et al. (2013, "Size Matters (Spacing not)"): font size had a significant effect on readability and understandability, line spacing did not; recommends 18-point for web text for readers with dyslexia. **[PEER] (search summary)** — [slides/secondary summary](https://de.slideshare.net/luzrello/rellokanvindebaezaw4a2012)
- Rello, Kanvinde & Baeza-Yates (W4A 2012) tested font and background grey scales, eight colour pairs, four sizes (14, 18, 22, 26 pt Arial) and four character spacings; third-party summaries say it recommends cream/off-white backgrounds, slightly wider character spacing, avoiding pure black on white, and large type. The two Rello papers appear to differ on the recommended size (18 pt vs 22–26 pt). **[PEER] (second-hand; exact wording unconfirmed)** — [paper copy](https://moodle2.units.it/pluginfile.php/33208/mod_resource/content/1/rello1.pdf)
- Zorzi et al. (2012, PNAS): extra-large letter spacing (about +18% of body size on 14 pt Times New Roman) improved reading in children with dyslexia; later criticised because sentence length was not matched, and shorter lines themselves help. Partly replicated by Hakvoort et al. (2017) with matched sentence length: extra-large spacing reduced errors. The spacing effect is described as "controversial" in a later review. **[PEER] (second-hand via Galliussi et al.)** — [PMC7188700](https://pmc.ncbi.nlm.nih.gov/articles/PMC7188700)
- Schneps et al. (2013, PLoS ONE), high-school students with dyslexia, eye tracking: reading on a small device with short lines improved speed by 27%, cut fixations by 11% and more than halved regressive saccades, with no comprehension cost; a companion study of 103 high-school students concluded it was the short lines, not the device, that produced the benefit. This is the most age-relevant finding for Climby. **[PEER] (search summary)** — [PMC3776763](https://pmc.ncbi.nlm.nih.gov/articles/PMC3776763); [Harvard DASH record](https://dash.harvard.edu/handle/1/11855772)

**British Dyslexia Association Style Guide (2023)** **[CHARITY]**
- The guide exists as "Dyslexia Style Guide 2023"; a third-party article confirms it suggests sans-serif fonts at size 12 or larger. **(search summary)** — [JALT article citing the BDA guide](https://jalt-publications.org/articles/29622-transforming-text-student-success-guide-creating-dyslexic-friendly-classroom)
- The following specifics are **(recalled, NOT verified this session; the BDA PDF returned HTTP 403 and the web page 404)**: sans-serif fonts such as Arial, Verdana, Tahoma, Century Gothic, Trebuchet, Calibri, Open Sans; 12–14 pt (about 16–19 px); inter-character spacing around 35% of average letter width; word spacing at least 3.5 times letter spacing; line spacing about 1.5; avoid italics, underlining and all-capitals, use bold for emphasis; left-aligned, not justified; lines of about 60–70 characters; single-colour, non-white backgrounds such as cream or a soft pastel; adequate contrast; short sentences and paragraphs, headings and lists. — [BDA Style Guide 2023 (PDF, blocked to my fetch)](https://cdn.bdadyslexia.org.uk/uploads/documents/Advice/style-guide/BDA-Style-Guide-2023.pdf)
- Dyslexia Scotland: clear, rounded fonts with space between letters; people with visual stress tend to prefer lower-contrast pairings such as navy on pale yellow or cream rather than black on white. **[CHARITY] (search summary)** — [Dyslexia Scotland formats guide](https://dyslexiascotland.org.uk/wp-content/uploads/2025/09/formats.pdf)

**Cyrillic**
- LexiaD (Alexeeva et al., 2020) is described as the first research-based dyslexia font for Cyrillic (Russian), designed to reduce visual similarity between letters. Against PT Sans and PT Serif, children had some advantage in letter feature extraction with LexiaD, but lexical access was faster in PT Sans / PT Serif. **[PEER, workshop paper, small sample] (search summary)** — [ACL Anthology 2020.lincr-1.2](https://aclanthology.org/2020.lincr-1.2/)
- A 2022 eye-tracking follow-up with adolescents compared LexiaD and Arial: Arial was faster at first in both groups; LexiaD caught up or overtook by the end; higher-level processing did not differ; authors say a study with an explicit exposure period is needed. **[PEER, preliminary] (search summary)** — [St Petersburg University record](https://pureportal.spbu.ru/en/publications/the-effect-of-a-dyslexiaspecific-cyrillic-font-lexiad-on-reading-speed(37f39045-0f94-4b9c-b87d-f2fd32c8e0ed)/export.html)

**Text-to-speech** — see section 7 (TTS improves comprehension for students with reading disabilities, d about 0.35; added benefit of highlighting is not established).

### Inferences
- Evidence-backed defaults for Climby's reading surfaces: familiar sans-serif with full Bulgarian Cyrillic support, body text at 16–18 px or larger with user scaling, no italics for emphasis, left-aligned, and a line-length cap. The "wider easy-reading layout" setting should be checked against the evidence: for dyslexic teens the supported direction is *shorter* lines (Schneps), so "wider" should mean more spacing and margin, not longer lines of text. A cap of roughly 60–70 characters per line is the BDA figure (recalled) and is consistent with Schneps.
- OpenDyslexic: keep it only as an opt-in preference, never as the default "dyslexia mode". The honest label is "some people prefer this font", not "easier to read". Note the font-coverage issue: check that any such font actually has Bulgarian Cyrillic glyphs, otherwise the browser silently falls back.
- Cream/off-white backgrounds and coloured overlays are widely recommended by charities but the experimental support I found is second-hand and thin; offering a warm, low-glare light theme is cheap and plausible, but should be framed as preference. The dark-by-default theme conflicts with the BDA-style advice (light, non-white background with dark text) — another reason to make the light option easy to find (see section 4).
- Mirror-letter confusion advice (b/d/p/q) is Latin-specific and does not transfer directly to Cyrillic, which has its own similar-shape sets; I found no Bulgarian study, so any Cyrillic "dyslexia font" claim is unsupported for Bulgarian.

### Gaps
- No Bulgarian-language dyslexia typography research was found. Russian findings are small and preliminary.
- BDA numeric recommendations could not be verified against the primary PDF this session.
- I did not find controlled evidence for or against tinted backgrounds for dyslexia; the primary Rello colour-pair results were seen only second-hand.
- No study was found on dark mode specifically for dyslexic readers.

---

## 3. ADHD and attention: evidence versus folklore

### Takeaway
There is very little experimental evidence about interface design for ADHD; most "ADHD-friendly UI" advice is expert consensus (W3C COGA) or practitioner opinion. The best-supported points are indirect: notifications measurably increase inattention in ordinary students, pre-set systematic breaks have small efficiency and mood benefits over self-chosen breaks in one university study (with a contradicting preprint), and body doubling is supported by self-report only.

### Cited Findings

**Overall state of evidence**
- A 2025 systematic review of reviews (26 reviews, 34,442 participants, mostly children and adolescents) found digital interventions for ADHD "show potential benefits" but effectiveness "remains inconclusive due to low evidence quality". These reviews concern treatment tools (games, cognitive training, VR, apps), not interface design. **[META] (search summary)** — [Frontiers in Public Health 2025](https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2025.1483923/pdf)
- No systematic review of interface design or notification design for adolescents with ADHD turned up in my searches.

**Notifications**
- Kushlev, Proulx & Dunn (CHI 2016), 221 University of British Columbia students, within-subject one-week conditions: keeping notification alerts on produced higher self-reported inattention and hyperactivity than keeping them off. The authors stress this is about ADHD-like symptoms in the general population, "not saying smartphones cause ADHD itself". **[PEER] (search summary)** — [Kushlev CHI16 (PDF)](https://www.interruptions.net/literature/Kushlev-CHI16.pdf); [UVA news summary](https://archive.news.virginia.edu/content/study-smartphone-alerts-increase-inattention-and-hyperactivity/)
- A later review by Kushlev & Leitao reports that mere presence of a phone "does not directly impair people's ability to sustain attention, but it does impair cognitive capacity, such as working memory". I did not find replication data, and the mere-presence effect should be treated as contested. **[PEER review] (search summary)** — [arXiv 2005.09100](https://arxiv.org/pdf/2005.09100.pdf)

**Timers and breaks**
- Biwer et al. (2023, British Journal of Educational Psychology), 87 Dutch university students, one study session: systematic breaks (6 minutes after every 24 minutes) versus self-regulated breaks. Self-regulating students took longer sessions and longer breaks; systematic breaks "had mood benefits and appeared to have efficiency benefits (i.e., similar task completion in shorter time)"; students reported more concentration and motivation and lower perceived difficulty. Single day, university students, not ADHD. **[PEER] (search summary)** — [PubMed 36859717](https://pubmed.ncbi.nlm.nih.gov/36859717/)
- A 2025 preprint (not peer-reviewed) comparing Pomodoro, Flowtime and self-regulated breaks found Pomodoro led to faster fatigue increase and faster motivation decline, with no difference in task completion. Conflicts with Biwer on motivation. **[preprint] (search summary)** — [Preprints.org 202503.0845](https://www.preprints.org/manuscript/202503.0845)

**Body doubling**
- Eagle & Ringland (ACM TACCESS 2024): online survey of 220 people, 193 neurodivergent (mostly ADHD or autism); 75% use body doubling; used for starting tasks and feeling less isolated, not only finishing. Self-report only. **[PEER, survey] (search summary; I could not open the ACM record, link is to a review of it)** — [review page](https://a11y-paradise.onrender.com/reviews/69cadb89affa4d2e79b788ae)
- A 2025 VR paper compared working alone, with a human body double and with an AI body double (12 participants with ADHD in the summative study). **[preprint/PEER, very small]** — [arXiv 2509.12153](https://arxiv.org/pdf/2509.12153)
- A secondary source reports a 2025 lab study of 26 adults where a silent body double produced no significant difference on a reading test versus working alone, although about 62% preferred it; authors and venue unconfirmed. Company-run survey data (FLOWN, 117 adults) claiming doubled focus is not peer-reviewed and should not be used. **(second-hand)** — [neurodiversity.org summary](https://neurodiversity.org/?p=11449)

**W3C cognitive accessibility guidance** — [Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/) **[W3C-NOTE] (fetched, first part only)**. It is a Working Group Note (29 April 2021), non-normative, and not required for WCAG conformance. Relevant patterns:
- Objective 5 "Help Users Focus": Limit Interruptions (4.6.1); Make Short Critical Paths (4.6.2); Avoid Too Much Content (4.6.3); Provide Information So a User Can Complete and Prepare for a Task (4.6.4).
- Objective 7: Provide Reminders (4.8.7), with user control over frequency and type.
- Objective 8: Let Users Control When the Content Moves or Changes (4.9.1); Support Simplification (4.9.3); Support a Personalized and Familiar Interface (4.9.4).
- Objective 4: Let Users Go Back (4.5.2); Avoid Data Loss and "Timeouts" (4.5.9); Use Clear Visible Labels (4.5.6).
- Objective 6: Provide a Login that Does Not Rely on Memory or Other Cognitive Skills (4.7.1); Allow the User a Simple, Single Step, Login (4.7.2).

**Teen-specific attention findings** (not ADHD-specific) — see section 5: teens have "dramatically lower" patience, are easily distracted, dislike clutter and long text. **[LARGE-UX]** — [NN/g teenagers](https://www.nngroup.com/articles/usability-of-websites-for-teenagers/)

### Inferences
- Reasonably supported design moves for Climby: notifications off or minimal by default and user-controlled (Kushlev; COGA 4.6.1, 4.8.7); a focus timer with pre-set work/break blocks as the default, but adjustable lengths (Biwer supports structure; the preprint and individual variation argue against forcing 25/5); a distraction-reduced "focus view" that hides the sidebar and secondary content while the timer runs (COGA 4.6.3, expert consensus only); one clear next action per screen and short task chunks (COGA 4.6.2; NN/g teens).
- Honest labelling of evidence: "body doubling" (study-with-me presence) is popular and well-liked in self-report but has no demonstrated performance benefit; it can be offered as an optional motivational feature, not claimed to improve focus.
- Unsupported or unproven folklore I could not source to evidence: that specific colours calm or focus ADHD users; that "bionic reading" style bolding helps; that gamified streaks improve sustained study (not searched in depth); that special fonts help attention; that 25 minutes is an optimal block length (Biwer tested 24/6 and 12/3-style systematic breaks against self-regulation, not an optimum).
- Because the timer is a time-based feature, it should never destroy work or lock the user out when it ends (WCAG 2.2.1 and COGA 4.5.9), and any ticking or pulsing animation should be stoppable (WCAG 2.2.2; section 8).

### Gaps
- No peer-reviewed evidence was found on interface design choices (layout density, colour, motion) tested with adolescents with ADHD.
- No study of Pomodoro-style timers in 12–18 year-olds or in people with ADHD was found.
- The remaining three quarters of the COGA document (detailed pattern text, user stories) was not read.
- Evidence on streaks, rewards and gamification for attention was not researched here.

---

## 4. Dark mode: readability, eye strain, and offering both

### Takeaway
For people with normal vision, dark text on a light background gives measurably better acuity and proofreading performance, especially with small text; dark mode's advantages are preference, some low-vision conditions and possibly night-time comfort. The research-based recommendation is to offer both and follow the operating-system setting, which sits awkwardly with Climby's dark-by-default choice.

### Cited Findings
All from NN/g's literature review unless noted. NN/g states it has not run its own dark-mode research. **[PRACT review of PEER studies] (fetched)** — [NN/g, Dark Mode vs. Light Mode: Which Is Better?](https://www.nngroup.com/articles/dark-mode/)
- Piepenbrock et al. (2013, Ergonomics): younger (18–33) and older (60–85) adults did better on visual-acuity and proofreading tasks in light mode; no significant polarity effect on fatigue measures. **[PEER]**
- Piepenbrock, Mayr & Buchner (2013, Human Factors): the light-mode advantage grows as font size shrinks; participants did not perceive a readability difference even though performance differed. **[PEER]**
- Dobres, Chahine & Reimer (2017, Applied Ergonomics): for glanceable reading, no significant polarity effect in daytime lighting; at night light mode still outperformed dark, and small text in dark mode at night was hardest. **[PEER]**
- Aleman, Wang & Schaeffel (2018, Scientific Reports): 7 participants; an hour of light-mode reading thinned the choroid (a change associated with myopia), dark mode thickened it. Very small sample; long-term effect speculative. **[PEER, very small]**
- Low vision: Legge et al. (1985) found each of 7 participants with cloudy ocular media (for example cataracts) read faster in dark mode; older CRT-based work, possibly biased by flicker. **[PEER, old]**
- Mechanism: brighter display, smaller pupil, sharper retinal image. Piepenbrock's 2014 work found smaller pupils and better proofreading with positive polarity; Mathôt & Ivanov (2019) qualified that smaller pupils help only for very small stimuli near the acuity threshold. **[PEER] (search summary)** — [PeerJ 8220](https://peerj.com/articles/8220)
- NN/g recommendations: "in users with normal vision, light mode leads to better performance most of the time"; let users switch to dark mode; apply it consistently across all screens; use the OS dark-mode APIs so system settings carry over; people rarely change defaults, so the option must be easy to find.
- Android platform guidance: "Don't override settings provided by the system, as they can be personal accessibility needs" and "avoid overriding system themes unless extending with greater customization". **[DS] (fetched)** — [Android settings pattern](https://developer.android.com/design/ui/mobile/guides/patterns/settings)

### Inferences
- Recommended default for Climby: theme = "Match system" (via `prefers-color-scheme`), with explicit Light and Dark choices, rather than dark for everyone. If the brand wants dark as the fallback, still honour an explicit system light preference. Because defaults are rarely changed, a dark-only default leaves many readers on the lower-performing polarity for small text.
- Homework involves sustained reading of smaller text, which is exactly where the light-mode advantage is largest; in dark themes compensate with larger body text and strong (but not glaring) contrast.
- "Dark mode reduces eye strain" is not supported by the studies NN/g reviewed (no significant fatigue difference in Piepenbrock); it is a preference and context claim.
- Put the light/dark switch somewhere reachable in one step (not only deep in the long Settings overlay), and offer it during onboarding.

### Gaps
- No study of dark versus light mode in adolescents, in dyslexic readers, or for Cyrillic text was found.
- Halation/astigmatism claims about light-on-dark text were not researched.
- Material Design and Apple HIG dark-theme pages were not opened this session.

---

## 5. Navigation: sidebar vs tabs vs hamburger, labels, and wayfinding for teens

### Takeaway
Visible navigation beats hidden navigation on every measured metric, most strongly on desktop; Climby's always-visible left sidebar is the right pattern for desktop, and on phones the few destinations should stay visible (for example a bottom bar) rather than collapse into a hamburger. Icons need permanent text labels.

### Cited Findings

**Hidden versus visible navigation** — NN/g quantitative study, 179 participants, 6 live sites, phones and desktops. **[LARGE-UX] (fetched)** — [NN/g, Hamburger Menus and Hidden Navigation Hurt UX Metrics](https://www.nngroup.com/articles/hamburger-menus/)
- Navigation was used in 27% of cases when hidden on desktop, versus 48% visible and 50% combination. On mobile: 57% hidden versus 86% combination.
- Content discoverability dropped by more than 20% with hidden navigation on both mobile and desktop.
- Task time: hidden navigation at least 39% slower on desktop; 15% slower on mobile.
- Perceived difficulty (1–7): hidden 2.6, combination 2.3, visible 2.1 (hidden rated 21% harder than visible).
- Recommendations: "Do not use hidden navigation (such as hamburger icons) in desktop user interfaces"; show top-level options across the top or down the left side. On mobile, "If your site has 4 or fewer top-level navigation links, display them as visible links"; with more, hide some and add in-page links.
- Note: NN/g's video summary says discoverability is "cut almost in half"; the article says "more than 20%". Use the article's figures. — [NN/g video](https://www.nngroup.com/videos/hamburger-menus/)

**Icons and labels** **[PRACT, research-based] (fetched)** — [NN/g, Icon Usability](https://www.nngroup.com/articles/icon-usability/)
- Only a few icons (home, print, search) are widely recognised; "most icons continue to be ambiguous to users".
- "Icon labels should be visible at all times"; hover-only labels fail on touch devices. "Always include a visible text label."
- Five-second rule: if it takes more than five seconds to think of an icon for something, an icon probably cannot communicate it.
- W3C COGA: "Use Icons that Help the User" (4.2.7), "Use Clear Visible Labels" (4.5.6), "Use a Familiar Hierarchy and Design" (4.2.2), "Make the Site Hierarchy Easy to Understand and Navigate" (4.3.2). **[W3C-NOTE] (fetched)** — [COGA](https://www.w3.org/TR/coga-usable/)

**Where Settings goes** **[DS] (fetched)** — [Android settings pattern](https://developer.android.com/design/ui/mobile/guides/patterns/settings)
- "Typically settings aren't classified as a top-level navigation destination"; in side navigation "include Settings after all other items (except Help & Feedback). Don't use synonyms such as 'Options' or 'Preferences.'" Be cautious about using a Profile icon as the entry to settings.

**Teenagers** — NN/g, 100 users aged 13–17 across three rounds (38 + 46 + 16), US/UK/Australia, 210 websites and 30 apps, spanning about 15 years. **[LARGE-UX, qualitative] (fetched)** — [NN/g, Teenager's UX: Designing for Teens](https://www.nngroup.com/articles/usability-of-websites-for-teenagers/)
- Teens perform worse than adults for three reasons: weaker reading skills, less sophisticated research strategies, and much lower patience. (No numeric success rates in the current article.)
- Teens did best on sites that follow design standards and need little reading; worst on large, dense sites with poor navigation; school, government and nonprofit sites were the worst performers.
- Write at about a 6th-grade reading level, short sentences, bullets, small chunks. Teens dislike tiny text.
- Avoid condescending or babyish tone; the word "kids" repels teens.
- On phones, complex gestures, dropdowns, drag-and-drop, small buttons and rollover effects are hard; teens blame the product.
- Slow performance is a deal-breaker; many teens use older devices and slow connections.
- Do not force sharing or make profiles public by default; teens value privacy. A "Copy link" option helps.
- Refuted stereotypes: that teens are tech-savvy, that mobile skills transfer to all devices, that they want flashy graphics, that they want everything social.

### Inferences
- Keep the sidebar visible and labelled on desktop; if it can collapse to an icon rail, keep labels visible by default and remember the user's choice. On phones, map the same few destinations, in the same order with the same names and icons, to a visible bottom bar (the "4 or fewer, show them" rule) instead of a hamburger. Consistency of names, order and icons across desktop and phone is supported by WCAG 3.2.3/3.2.4 (Consistent Navigation/Identification, AA; recalled, not re-opened) and COGA 4.2.2.
- Number of top-level items: NN/g's concrete threshold is about mobile links (4 or fewer visible). I found no evidence-based maximum for desktop sidebars; "5–7 items" is convention, not a research finding.
- Settings should be the last sidebar item, called "Settings" / "Настройки", not hidden behind an avatar only.
- Wayfinding for teens: always-highlighted current destination, a clear title on every screen, a visible Back/Close on the Settings overlay, and no reliance on hover or drag (also WCAG 2.5.7).
- Use the teen-appropriate tone in both languages; in Bulgarian avoid diminutive, childish phrasing just as "kids" is avoided in English (my extrapolation from the NN/g finding).

### Gaps
- The NN/g hidden-navigation data is from 2015–16 websites, not apps; no newer equivalent was found. No study compared bottom tabs with sidebars directly, and none tested teens specifically on navigation patterns.
- Apple HIG and Material 3 navigation pages (sidebar, navigation rail, tab bar item counts) were not opened this session.
- NN/g's full teen report (124–130 guidelines) is paywalled; only the summary article was read.

---

## 6. Settings design: organising long settings, defaults, explanations, destructive actions

### Takeaway
Platform guidance says to keep account management and app info out of the settings list, group settings under headings, move to sub-screens (list-detail on wide screens) once there are 15 or more, add search for deep hierarchies, show current values, and choose low-risk "polite" defaults. Destructive actions such as deleting an account need a specific, consequence-stating confirmation with outcome-labelled buttons and, because it is rare and severe, a deliberate extra step.

### Cited Findings

**Android / Material settings pattern** **[DS] (fetched)** — [Android Developers, Settings](https://developer.android.com/design/ui/mobile/guides/patterns/settings)
- What belongs: "Do include infrequently accessed preferences"; "Don't include frequently accessed actions. These should be contextual to the feature they most affect"; "Avoid account management"; avoid app info such as version or licence in settings; "Avoid replicating preferences available at the device settings level."
- Defaults: the initial value should "Represent the default most users would choose", "Be neutral and pose little risk to the user", "Only interrupt when important".
- System settings: "Respect system settings. Your app may not need its own settings"; "Don't override settings provided by the system, as they can be personal accessibility needs."
- Context: "Place frequent contextual preferences close to the feature it affects. For example, Closed Captioning settings can be placed on a video player."
- Overview: let users "quickly see the most important and frequently used settings and their values"; "If necessary, create a separate screen in your app for destinations such as account, app info, help, and feedback."
- Grouping: "Group settings in smaller relevant groups. Use visual or intrinsic containment and headings between groups"; "For 15 or more settings, group related settings under a subscreen"; "the label of the setting that opens a group must match the subscreen title."
- Search: "For complex or deep settings hierarchies, add search functionality so users can find the correct preference."
- Wide screens: use the list-detail layout (overview list plus detail pane); "Don't allow single pane settings items to stretch to full width, instead set a max-width".
- Dependencies: put a dependent setting below its parent "with a brief explanation of why the dependent setting is unavailable".
- Writing: labels brief, most important word first; avoid negatives like "Don't"/"Never"; impersonal labels ("Notifications" not "Notify me"); avoid generic verbs (Set, Change, Edit, Manage); do not repeat the section title; no jargon; "Convey how and why an unfamiliar setting exists." Supporting text should show the current status; "If the label is sufficient on its own, don't add secondary text"; longer explanations go on a second screen.
- Controls: switch for on/off; radio buttons for one-of-many in a dialog or child screen; slider for ranges.

**W3C COGA** **[W3C-NOTE] (fetched)** — [COGA](https://www.w3.org/TR/coga-usable/): "Provide Search" (4.3.6); "Make it Easy to Find the Most Important Tasks and Features" (4.3.1); "Support a Personalized and Familiar Interface" (4.9.4); "Support Simplification" (4.9.3); "Let Users Go Back" (4.5.2).

**Defaults matter**: people rarely change defaults, so options must be easy to find to be useful. **[PRACT] (fetched)** — [NN/g dark mode article](https://www.nngroup.com/articles/dark-mode/)

**Destructive actions** **[PRACT, research-based] (fetched)** — [NN/g, Confirmation Dialogs Can Prevent User Errors (If Not Overused)](https://www.nngroup.com/articles/confirmation-dialog/)
- "Use a confirmation dialog before committing to actions with serious consequences"; "Do not use confirmation dialogs for routine actions" (overuse trains people to click through).
- "Be specific and inform users about the consequence of their action"; a bare "Are you sure?" is useless without identifying details.
- "Instead of Yes/No answers, provide response options that summarize what will happen for each possible response" (for example "Delete file" / "Keep file"); "Avoid giving confirmation dialogs a default Yes answer."
- "For particularly dangerous operations, require a nonstandard action from the user to confirm" (such as typing a word), reserved "for the most dangerous and rare actions".
- "Do go to great lengths to provide undo."
- Practitioner sources add: focus Cancel by default; prefer undo or soft-delete windows where the action can be made reversible. **[PRACT] (search summary)** — [Primer confirmation dialog guidelines](https://primer.style/product/components/confirmation-dialog/guidelines)

### Inferences
- Climby's long two-column Settings overlay maps well onto the list-detail pattern: left column = category list (Appearance, Reading and voice, Focus timer, Notifications, Language, Family, Class, Account), right column = one category at a time, collapsing to list then sub-screen on phones (also needed for WCAG 1.4.10 Reflow). With well over 15 settings, one long scrolling page is against the guidance.
- Separate "Account", "Family" and "Class" (identity and relationships, with consequences for other people) from preference settings; Android guidance says to avoid account management inside settings or give it its own screen.
- Add settings search once categories exceed a screen; make it match synonyms in both languages (for example "font", "шрифт", "dyslexia", "text size").
- Surface the most-used reading settings in context: text size, font, read-aloud voice and speed belong next to the content being read (as with captions on a video player), with the full set in Settings.
- Each accessibility setting should have a one-line plain explanation and, ideally, a live preview; avoid over-claiming ("easier to read for dyslexia") where evidence is absent (section 2).
- Apply instantly, no "Save" button for preferences, with easy reversal; provide "Reset appearance to defaults". (My inference from COGA "Let Users Go Back"; not a quoted rule.)
- Delete account: place it at the bottom of Account, visually separated; dialog states exactly what is deleted (homework history, family and class links, subscription) and whether it can be undone; buttons "Delete my account" / "Keep my account" with Keep focused; require typing a word or re-authenticating; ideally a grace period with undo. For under-age users linked to a family, consider what the parent sees. Deletion must still be reasonably easy; GDPR erasure obligations were not researched here.

### Gaps
- Apple HIG "Settings" guidance and Material 3 pages were not opened; I have no quoted Apple text.
- No NN/g article specifically on organising long settings pages was found this session; no large usability study on settings search was found.
- No source on GDPR-compliant account-deletion flows, parental-consent ages in Bulgaria, or deletion patterns for minors was retrieved.

---

## 7. Read-aloud / text-to-speech controls

### Takeaway
Text-to-speech has a small-to-moderate positive effect on reading comprehension for students with reading disabilities (meta-analytic d about 0.35), and the benefit appears to come from the audio itself; synchronised highlighting and speed variations have not been shown to add comprehension benefit, though they did no harm. Evidence specific to 12–18 year-olds is thin.

### Cited Findings
- Wood, Moxley, Tighe & Wagner (2018, Journal of Learning Disabilities): meta-analysis of 22 group-design studies (1995–2014) of text-to-speech and related read-aloud tools for students with reading disabilities; average weighted effect on comprehension d = .35, 95% CI [.14, .56]. Proposed mechanism: removing the decoding burden frees attention for meaning. Excluded single-subject designs. **[META] (search summary)** — [PMC5494021](https://pmc.ncbi.nlm.nih.gov/articles/PMC5494021)
- Keelor et al. (2020, Assistive Technology Outcomes and Benefits): children with reading difficulties read expository passages with no TTS, TTS without highlighting, TTS with highlighting, and fast TTS with highlighting; comprehension was significantly higher with TTS than without, and "there was no difference in the presentational features". **[PEER, small] (search summary)** — [ATIA PDF](https://www.atia.org/wp-content/uploads/2020/06/ATOB-V14-A2-Keelor_etal.pdf)
- Keelor et al. (2023, Annals of Dyslexia), ages 8–12: TTS improved comprehension versus no TTS; students with dyslexia only derived significantly more benefit; authors say further studies are needed on highlighting and other presentational features. **[PEER] (search summary)** — [PubMed 37119436](https://pubmed.ncbi.nlm.nih.gov/37119436/)
- A 2024 meta-analysis is reported to cite Wood et al. as one of several positive findings. **(search summary; not read)** — [Humanities and Social Sciences Communications](https://link.springer.com/10.1057/s41599-024-04159-y)
- A study titled "Effects of text-to-speech software use on the reading proficiency of high school struggling readers" (Assistive Technology, 2017) exists as a citation lead; findings not retrieved. **(unverified lead)** — [vendor research summary](https://www.everway.com/research-insights/text-to-speech-tts-supports-reading-access-in-education/)
- W3C COGA lists "Enable APIs and Extensions" (4.9.2) so users' own assistive tools keep working. **[W3C-NOTE] (fetched)** — [COGA](https://www.w3.org/TR/coga-usable/)

### Inferences
- Recommended control set (design judgement, consistent with the evidence that audio is the active ingredient): a visible Play/Pause on each answer; Stop; skip back/forward by sentence; speed control with a sensible range (for example about 0.75x–1.5x) and remembered preference; voice choice per language with a preview; automatic language detection so Bulgarian text is never read by an English voice; keyboard shortcuts; never auto-play.
- Highlighting: offer sentence (and optionally word) highlighting as an option because it helps users keep their place and re-find text, but do not claim it improves comprehension. It must respect contrast in every theme and should be switchable off (some users find moving highlights distracting; relevant to the attention audience).
- Make sure Climby's own read-aloud does not conflict with screen readers: use real text, do not hijack focus, and announce state changes (playing/paused) accessibly.
- Voice quality in Bulgarian is likely the practical bottleneck; browser/OS speech-synthesis voices for Bulgarian vary by platform (my assumption; not researched).

### Gaps
- No controlled study of TTS with synchronised highlighting in adolescents (12–18) was found; the Keelor studies are with younger children.
- No evidence was found on optimal speech rate for comprehension in teens, or on TTS quality/benefit in Bulgarian.
- The Wood meta-analysis full text was not read; moderators beyond study design are not reported here.

---

## 8. Motion and animation

### Takeaway
Keep interface animation short (about 100–400 ms), functional, and fully suppressible via the system "reduce motion" setting; anything that moves on its own for more than a few seconds needs a pause control. Animation helps when it shows where something came from or went; it hurts when it is decorative, long or repeated.

### Cited Findings
- WCAG 2.3.3 Animation from Interactions (AAA): "Motion animation triggered by interaction can be disabled, unless the animation is essential". Benefits people with vestibular disorders: "reactions include distraction, dizziness, headaches and nausea". Motion animation is the "addition of steps between conditions to create the illusion of movement"; colour, blur and opacity changes do not count unless they change perceived size, shape or position. Sufficient techniques: C39 (CSS `prefers-reduced-motion`) and SCR40 (the same query in JavaScript). The page gives no prevalence statistics. **[STD] (fetched)** — [Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- WCAG 2.2.2 Pause, Stop, Hide (A): moving, blinking or auto-updating content that starts automatically and lasts more than five seconds alongside other content needs a way to pause, stop or hide it. **[STD] (recalled)** — [Understanding 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- NN/g durations: simple feedback (checkbox, toggle) "roughly 100 ms"; substantial changes such as a modal entering, "200–300 ms"; "the duration of most animations should be in the range of 100–500 ms"; 400 ms is "a very slow animation, to be used only for big movements across large screens"; "At 500ms, animations start to feel like a real drag". Entering elements can take slightly longer than exiting ones (for example 300 ms in, 200–250 ms out). **[PRACT, research-based] (fetched)** — [NN/g, Executing UX Animations: Duration and Motion Characteristics](https://www.nngroup.com/articles/animation-duration/)
- NN/g easing: avoid linear motion; default to ease-out; the more often an animation is seen, the shorter and subtler it should be; large movements should be smooth for users with vestibular disorders or epilepsy.
- Material Design figures (200–300 ms on mobile, longer on larger screens) were seen only second-hand. **(second-hand)** — [Material 1 duration and easing](https://m1.material.io/motion/duration-easing.html)
- COGA: "Let Users Control When the Content Moves or Changes" (4.9.1); "Limit Interruptions" (4.6.1). **[W3C-NOTE] (fetched)** — [COGA](https://www.w3.org/TR/coga-usable/)

### Inferences
- Implement `prefers-reduced-motion: reduce` globally: replace slides, scales and parallax with instant changes or short opacity fades (fades are not "motion animation" under 2.3.3). Also add an in-app "Reduce motion" switch for users on shared or school computers who cannot change the OS setting; default it to the system value.
- Settings overlay: about 200–300 ms ease-out to open, slightly faster to close; no animation under reduced motion.
- Focus timer: a smoothly animating ring or ticking seconds is continuous motion in peripheral vision — a distraction risk for the attention audience and subject to 2.2.2. Offer a calm mode (minutes only, or hidden time) and avoid pulsing. Celebration animations (confetti, streaks) should be brief, non-looping and off under reduced motion.
- Animation is justified where it explains a state change (an item moving to "done", the overlay arising from the Settings button); remove purely decorative looping motion.
- WCAG 2.3.1 (no more than three flashes per second, A) applies to any celebratory effects (recalled, not opened).

### Gaps
- No experimental study on animation and comprehension or distraction in teens or ADHD users was found; duration figures are practitioner guidance.
- Current Material 3 and Apple HIG motion pages were not opened.

---

## 9. Localisation: Bulgarian (Cyrillic) and English

### Takeaway
Design every label to survive large length changes (short strings can double or triple), choose fonts that support Bulgarian Cyrillic properly and mark content with the right `lang`, and present the language switch as language names in their own language rather than flags. Bulgarian-specific letterforms are a real, font-dependent issue that needs testing.

### Cited Findings
- W3C text-expansion table (IBM figures, English to European languages): up to 10 characters, 200–300%; 11–20, 180–200%; 21–30, 160–180%; 31–50, 140–160%; 51–70, 151–170%; over 70, 130%. "Allow text to reflow and avoid small fixed-width containers or tight squeezes"; separate presentation from content; think twice before abbreviating to fit. **[W3C article] (fetched)** — [W3C, Text size in translation](https://www.w3.org/International/articles/article-text-size)
- Language switchers: list each language in its own language with the correct `lang` attribute; flags represent countries, not languages, and should be used only when a country is meant. **[PRACT] (search summary)** — [specification.website, language switcher](https://www.specification.website/spec/i18n/language-switcher/); [Smartling](https://www.smartling.com/resources/101/language-selector-best-practices/)
- Bulgarian Cyrillic letterforms: Bulgarian lowercase forms follow handwritten/cursive-derived shapes that differ visibly from the Russian-style forms most fonts ship by default. **[PRACT, type-design] (search summary)** — [Krista Radoeva, Cyrillic Script Variations and the Importance of Localisation](https://localfonts.eu/?p=133); [Initiative Bulgarian Cyrillic](https://cyrillic.bgweb.bg/en/)
- Implementation: fonts expose Bulgarian forms through the OpenType `locl` feature for the Bulgarian language system, or sometimes through a stylistic set; application support varies (Figma reportedly defaults to Russian forms even when Bulgarian alternates exist); one web font showed errors in Bulgarian forms tied to another feature (`calt`). **[PRACT] (search summary)** — [preusstype locl notes](https://preusstype.com/techdata/otf_locl.php); [TypeDrawers thread](https://typedrawers.com/discussion/4934/the-bulgarian-form-of-cyrillic-in-youtube-sans-incorrectly-reproduces-some-glyphs)
- Familiarity matters: an Ubuntu font bug report was filed because Bulgarian-form letters "look unfamiliar" to some users in the bg locale, showing that preference for Bulgarian versus international forms is not uniform. **[anecdotal] (search summary)** — [Launchpad bug 708578](https://bugs.launchpad.net/ubuntu-font-family/+bug/708578)
- Android settings writing rules that affect translation: brief labels, most important word first, labels may wrap to multiple lines. **[DS] (fetched)** — [Android settings pattern](https://developer.android.com/design/ui/mobile/guides/patterns/settings)

### Inferences
- The W3C table is for English into European languages generally; Bulgarian UI strings are typically longer than English, so design the sidebar, buttons and the Settings category list for labels roughly twice the English length, allow wrapping, and never truncate with an ellipsis as the only option. If Bulgarian is the source language, test the reverse too.
- Set `lang="bg"` / `lang="en"` on the document and on any mixed-language fragments (WCAG 3.1.1 and 3.1.2, recalled); this drives correct TTS voice selection, hyphenation, screen-reader pronunciation and, where the font supports it, Bulgarian `locl` glyphs. Browsers generally apply `locl` based on the declared language, but this was not verified in sources; test in the actual Electron/Chromium and mobile browsers.
- Every selectable font in the Appearance settings must be checked for full Bulgarian Cyrillic coverage in all weights; otherwise fallback fonts will mix letterforms mid-word. This applies especially to OpenDyslexic and decorative fonts.
- Whether to use Bulgarian-form or international Cyrillic glyphs is a product decision worth testing with Bulgarian teens; there is advocacy for Bulgarian forms but no readability evidence either way.
- Language switch: put it in Settings (with search synonyms) and also on the sign-in/onboarding screen where a user who cannot read the current language can find it; label as "Български" and "English"; default from the system/browser language; do not use flags.
- Cyrillic text at the same pixel size has fewer ascenders/descenders and denser word shapes than Latin; consider slightly more generous line height and size for Bulgarian. This is typographic opinion without a study behind it.

### Gaps
- No Bulgarian-specific expansion ratios, readability studies of Bulgarian versus international Cyrillic forms, or studies on bilingual interface switching by teens were found.
- No official W3C statement on flags for languages was verified (one commenter attributes this position to W3C).
- Browser handling of `locl` under `lang="bg"` was not confirmed from documentation.
