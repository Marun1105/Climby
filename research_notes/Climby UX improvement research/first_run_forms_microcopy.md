# First-run experience, empty states, form inputs and microcopy (Climby, students 12–18, BG/EN, desktop + web)

Evidence-strength labels used throughout:
- **[Study]** = controlled experiment or peer-reviewed research
- **[Usability testing]** = large-scale or repeated qualitative usability testing (NN/g, Baymard, GOV.UK)
- **[Design system]** = guidance from a design system (no data published with it)
- **[Vendor data]** = product-analytics benchmark published by a tool vendor (large samples, but self-selected and commercially interested)
- **[Practitioner]** = blog / engineering convention, no data
- **(second-hand)** = I could not read the primary source; the claim comes from a search snippet or a secondary summary

Reading notes for the report writer:
- Almost none of this evidence was gathered on 12–17-year-olds. Only the NN/g teen study (13–17) is teen-specific. Form-validation and dropdown evidence comes from adults, mostly in e-commerce checkout.
- Pages I could not open (JavaScript-rendered or paywalled): Apple HIG onboarding, Material Design (M2 empty states, M3 global writing), Baymard's dedicated country-selector article, Shopify Polaris empty-state page (snippets only). These are listed under Gaps and nothing from them is asserted as verified.

---

## 1. Empty states: what makes a good one (first-use vs no-results vs error)

### Takeaway
Never ship a totally blank container: every empty state should say what the system's status is, what will live here, and offer one direct action to fill it. The copy and tone should change by cause: motivating/educational for first use, neutral with a way to adjust for no-results, plain and non-jokey with a way out for errors.

### Cited Findings

**Core rules (NN/g)**
- Three guidelines for empty states: (1) communicate system status, (2) provide learning cues, (3) provide direct pathways to the action that populates the area. Summary rule: "Do not default to totally empty states." **[Usability testing / expert guidance]** — [NN/g, Kaplan 2021](https://www.nngroup.com/articles/empty-state-interface-design/)
- "Totally empty states cause confusion about how and whether the system is working": users cannot tell loading from failure from genuinely-nothing. **[Usability testing / expert guidance]** — [NN/g, Kaplan 2021](https://www.nngroup.com/articles/empty-state-interface-design/)
- Showing an empty message ("No records") during loading and then replacing it with content seconds later is called "particularly harmful". The empty state must only appear once loading has actually finished; use a progress indicator until then. — [NN/g, Kaplan 2021](https://www.nngroup.com/articles/empty-state-interface-design/)
- Empty states are a place for in-context help ("pull revelations") that appears only when the user reaches that element, as an alternative to forced tutorials. Example: "Star your favorites to list them here" teaches the feature in one line. — [NN/g, Kaplan 2021](https://www.nngroup.com/articles/empty-state-interface-design/)
- Saying what to do without a way to do it is a half-measure ("Send a request to view details" with no link). Put the button or link in the empty state itself. — [NN/g, Kaplan 2021](https://www.nngroup.com/articles/empty-state-interface-design/)
- Offering sample/demo data as a second pathway (Loggly: add a source, or load demo data to explore safely) is a cited good pattern. — [NN/g, Kaplan 2021](https://www.nngroup.com/articles/empty-state-interface-design/)
- A filtered/no-results state should name the filter that caused it: "There are no records to display for the selected date range." — [NN/g, Kaplan 2021](https://www.nngroup.com/articles/empty-state-interface-design/)

**Tone by type (Atlassian, Carbon)**
- Tone should follow the cause: first-time/blank slate = "inspirational, motivating, or educational"; all tasks finished = celebratory; general no-results = neutral but still suggesting next steps. **[Design system]** — [Atlassian Design System](https://atlassian.design/components/empty-state/usage)
- Carbon distinguishes three types: first use / no data; user action (search with no results, completed process); error management (data exists but can't be shown). **[Design system]** — [IBM Carbon](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- First use: "Be specific about what will be available in the space when data is there"; "Keep words to a minimum"; "Don't cover multiple options in one empty state." **[Design system]** — [IBM Carbon](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- User-action (no results): explain why the message appears and give follow-up steps such as changing search terms or filters; skip the extra text if no next step is needed. **[Design system]** — [IBM Carbon](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- Error empty states: "Use direct, plain language", "Don't lead the user into a dead end", and "Be respectful of the user and don't joke or use flippant language." **[Design system]** — [IBM Carbon](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- For primary features Carbon suggests richer first-use alternatives than a basic empty state: inline documentation limited to one feature, optional onboarding, or starter content so users "learn the system by tinkering". **[Design system]** — [IBM Carbon](https://carbondesignsystem.com/patterns/empty-states-pattern/)

**Anatomy and copy (Atlassian, Polaris)**
- Only the header is required; it concisely describes the state, in sentence case. Description is optional, explains why the state appears and what to do next, and should be as brief as possible because people scan. **[Design system]** — [Atlassian Design System](https://atlassian.design/components/empty-state/usage)
- One relevant call to action; avoid multiple primary buttons; CTA labels are short and start with an imperative verb ("Try", "Remove", "Create"). **[Design system]** — [Atlassian Design System](https://atlassian.design/components/empty-state/usage)
- Avoid sending people elsewhere to read more; if unavoidable use a tertiary link. **[Design system]** — [Atlassian Design System](https://atlassian.design/components/empty-state/usage)
- Illustration: "Choose an image that has a neutral or humorous tone (never negative)"; omit it if the space is small or other visuals compete; visual metaphors may not translate across cultures and languages. **[Design system]** — [Atlassian Design System](https://atlassian.design/components/empty-state/usage)
- Polaris (second-hand, search snippets only): use one primary call-to-action button; empty states should orient users by explaining the benefit and utility of the feature; a heading like "No products" alone leaves people guessing, so name the cause and the next step; secondary actions are for "Learn more"-type options. **[Design system] (second-hand)** — [Shopify Polaris](https://polaris.shopify.com/components/empty-state)

### Inferences
- A workable Climby template per type:
  - First use (no homework/tasks yet): one-line headline naming what will appear, one short benefit sentence, one primary button ("Add your first homework"). Optional second link: "Show me an example" (starter content).
  - No results (search/filter): name the query or filter, offer "Clear filters" as the single action. Neutral tone, no illustration needed.
  - All done (everything completed): the one place where celebration and light humour are endorsed by a design system (Atlassian) — a natural fit for a teen study app.
  - Error/offline: plain statement of what happened, a retry button, no jokes (Carbon; consistent with NN/g error guidance in section 4).
- Because Climby has a guided tour, first-use empty states can carry part of the tour's teaching load (NN/g frames them as the contextual alternative to tutorials). See section 6.
- Distinguish "still loading" from "empty" in code: render a skeleton/spinner until the request resolves, and the empty state only afterwards. On a desktop app with a local cache this flicker is easy to introduce accidentally.

### Gaps
- I could not open Material Design's empty-state guidance (m2.material.io returned no body text) or Apple HIG's equivalent; nothing from them is cited. From memory, Material 2 recommended a non-interactive image plus tagline and listed starter content, educational content and "best match" as alternatives to an empty state, but this is unverified here.
- I found no quantitative study measuring the effect of empty-state design on activation or retention. All guidance above is expert/design-system consensus.
- Polaris guidance is from search snippets; the page itself redirected.

---

## 2. Country and city inputs: dropdown vs autocomplete vs free text; pre-selection

### Takeaway
A plain 200-item country dropdown is the worst-supported option: Baymard recommends a type-ahead autocomplete that tolerates typos, synonyms and local names, and GOV.UK calls the select "a last resort". City should be free text (or autocomplete against a known list) rather than a dropdown; pre-selecting the country from locale is reasonable for a setting-like field but should remain visibly editable.

### Cited Findings

**Dropdowns**
- Dropdowns are generally a poor choice for "fewer than 5 or more than 10 options"; more than 20 uncategorised options can feel overwhelming, and country dropdowns have over 200. (Baymard notes these numbers are general guidance, from e-commerce checkout testing.) **[Usability testing]** — [Baymard, 2018, updated Jan 2025](https://baymard.com/blog/drop-down-usability)
- Observed problems with long dropdowns: no overview, hard to scan, and scroll hijacking — depending on cursor position the list or the page scrolls unpredictably, and in some browsers a focused dropdown keeps changing value on scroll, leaving users with wrong data. **[Usability testing]** — [Baymard](https://baymard.com/blog/drop-down-usability)
- 78% of benchmarked e-commerce sites still use a country dropdown in checkout. **[Benchmark]** — [Baymard](https://baymard.com/blog/drop-down-usability)
- For small option sets, 55% of test users opened an optional dropdown just to see what was in it and closed it without selecting — an argument for radio buttons when there are under 5 options (relevant to Climby fields such as grade band or role). **[Usability testing]** — [Baymard](https://baymard.com/blog/drop-down-usability)
- GOV.UK: the select component "should only be used as a last resort in public-facing services." "User research has shown that some users struggle with selects": they were unable to close the select, tried to type into it, confused focused items with selected items, tried to pinch-zoom the options on small devices, and did not understand they could scroll to see more items. **[Usability testing, government]** — [GOV.UK Design System, Select](https://design-system.service.gov.uk/components/select/)
- NN/g's teen study lists dropdown menus (with small click targets and rollover effects) among things teens struggle with on touch devices. **[Usability testing, ages 13–17]** — [NN/g, Teenager's UX 2019](https://www.nngroup.com/articles/usability-of-websites-for-teenagers/)

**Autocomplete**
- For country, when input must be validated, autocomplete is "a well-performing alternative": it lets users type, suggests matches, was observed to greatly speed up country selection, and should handle typos, synonyms, common names and abbreviations. **[Usability testing]** — [Baymard](https://baymard.com/blog/drop-down-usability)
- GOV.UK built a country picker as an autocomplete after four rounds of usability testing. It maps synonyms (UK, GB, "Great" → United Kingdom), endonyms ("Deutschland" → Germany) and common typos to a canonical list. Users often typed a broader or different name than the service wanted (e.g. England or Great Britain). **[Usability testing, government]** — [GOV.UK Design Notes, Horsford 2017](https://designnotes.blog.gov.uk/2017/04/20/were-building-an-autocomplete/)
- Caveat: the GOV.UK country-and-territory autocomplete package is deprecated and no longer maintained; the Design System team plans to recommend an alternative. Other departments (HMRC, DWP, DfE) continue to use accessible-autocomplete variants. (second-hand, search snippets) — [alphagov country autocomplete](https://alphagov.github.io/govuk-country-and-territory-autocomplete); [HMRC address pattern](https://design.tax.service.gov.uk/hmrc-design-patterns/addresses)

**Free text**
- When there are many options and the input does not need validating, an open text field is best. **[Usability testing]** — [Baymard](https://baymard.com/blog/drop-down-usability)
- GOV.UK: use the `autocomplete` attribute on each address field so browsers can fill it; this is needed to meet WCAG 2.2 success criterion 1.3.5 (Identify input purpose). **[Design system / accessibility standard]** — [GOV.UK Design System, Addresses](https://design-system.service.gov.uk/patterns/addresses/)

**Pre-selection**
- GOV.UK: for settings, "you can make an option pre-selected by default when users first see it"; for questions, "you should not pre-select any of the options in case it influences users' answers." **[Design system]** — [GOV.UK Design System, Select](https://design-system.service.gov.uk/components/select/)
- Baymard recommends auto-detecting values where possible (state from address lookup, card type from number) so users can skip the field; when only one option remains, show it as plain text or preselect it. **[Usability testing]** — [Baymard](https://baymard.com/blog/drop-down-usability)

### Inferences
- Country for Climby: use a searchable combobox (type-ahead) rather than a native `<select>`. Seed it with Bulgarian and English names plus obvious synonyms so "България", "Bulgaria", "BG", "Balgaria" and Latin-keyboard transliterations all resolve. Matching must work in both Cyrillic and Latin regardless of the UI language, because a teenager's keyboard layout often will not match the interface language. (Extension of the GOV.UK endonym/synonym finding; not directly tested in a source.)
- Pre-select the country from OS/browser locale or IP: country in a study app behaves like a setting (GOV.UK's "settings" case), not an opinion question, and most users will be in Bulgaria. Show the pre-selection as an obviously editable field, not locked text, since locale is wrong for expats, VPN users and shared family computers.
- City: free text with autocomplete suggestions from a list of Bulgarian settlements when country = Bulgaria, falling back to plain free text for other countries. A dropdown is unsuitable (hundreds of options); pure free text creates dirty data ("Sofia", "София", "sofiq"). Always allow an entry not in the list.
- Ask whether city is needed at all at sign-up. If it only drives school lookup or leaderboards, ask it later, at the moment it becomes useful.
- For the youngest users (12–13), collecting location is also a data-minimisation question under GDPR; this is a legal point outside the UX sources reviewed here.

### Gaps
- Baymard's dedicated country-selector article (details on autocomplete sequencing, keyboard behaviour, and its stance on IP geo-targeting) returned no body text, so its specific recommendations are not cited. From memory it recommends an autocomplete with IP-based pre-selection, but that is unverified here.
- No source found with mobile-specific data on country selectors. GOV.UK's observation about pinch-zooming select options is the closest.
- No research found on city inputs specifically, on bilingual (Cyrillic/Latin) autocomplete matching, or on teenagers entering location data.
- No NN/g article specifically on country fields was retrieved.

---

## 3. Username fields: live availability checking, suggestions, debounce, error wording

### Takeaway
The one piece of real evidence (Wroblewski/Etre) supports checking username availability inline, while typing but after a short pause, because users otherwise "pogo-stick" through repeated failed submissions. Debounce values (about 300–500 ms), pending states and suggestion lists are engineering convention rather than researched findings.

### Cited Findings
- Choosing a username caused "pogosticking": users repeatedly submitted guesses that were already taken. This is the stated reason for validating username inline rather than on submit. **[Study, n=22, adults 21–49]** — [Wroblewski, A List Apart 2009](https://alistapart.com/article/inline-validation-in-web-forms/)
- In that study username and password fields used validation while typing with a short delay, because they have strict rules; other fields validated on blur. Participants saw validation messages on username/password 80–100% of the time versus 30–50% on the earlier, simpler fields — i.e. these are the fields where feedback is actually needed. **[Study, n=22]** — [Wroblewski, A List Apart 2009](https://alistapart.com/article/inline-validation-in-web-forms/)
- Validation without a delay made participants type one character at a time and wait for the message to update, lengthening completion times. **[Study, n=22]** — [Wroblewski, A List Apart 2009](https://alistapart.com/article/inline-validation-in-web-forms/)
- NN/g: for complex fields, instant inline validation that appears as the value is typed helps users, and success should be indicated for such fields; but "success indicators shouldn't distract users from filling out forms." **[Expert guidance]** — [NN/g, Krause 2019, reviewed 2024](https://www.nngroup.com/articles/errors-forms-design-guidelines/)
- Debounce convention: wait roughly 300–500 ms after the user stops typing before firing the availability request; examples in the wild use 300 ms (htmx pattern), 400 ms and 500 ms. **[Practitioner] (second-hand, search snippets)** — [htmx active validation pattern](https://four.htmx.org/patterns/active-validation.md); [Frontend Patterns, async validation](https://frontendpatternsdev.vercel.app/async-validation)
- Engineering practices commonly recommended alongside: show a distinct "checking…" state; ignore or cancel stale responses so an older reply cannot overwrite a newer one; block or defer submit while a check is pending; treat the server as the final authority and map a conflict at insert time to a friendly "just taken" message; announce status via `aria-live="polite"`; when a name is taken, offer alternatives that have already been checked as available. **[Practitioner] (second-hand, search snippets)** — [DEV Community, async username check](https://dev.to/137foundry/why-the-async-username-check-is-the-worst-part-of-most-signup-forms-3294); [Frontend Patterns](https://frontendpatternsdev.vercel.app/async-validation)
- Error wording: avoid words that call the user's action wrong such as "invalid", "illegal" or "incorrect"; name the exact problem and offer a fix; offer a short list of likely fixes the user can select. **[Expert guidance]** — [NN/g, Error-Message Guidelines 2023](https://www.nngroup.com/articles/error-message-guidelines/)

### Inferences
- Recommended behaviour for Climby's username field:
  1. Run format rules (length, allowed characters) locally and instantly, but only show a format error after a pause or on blur.
  2. Run the availability check about 400 ms after the last keystroke, only once the value passes the format rules.
  3. Show three states with text, not colour alone: "Checking…", "Available", "Taken — try: mira_k, mira.k7".
  4. Make suggestions one-click, and derive them from what the student typed rather than from their real name (privacy for minors — my inference, not from a source).
  5. Re-check on submit and handle the race gracefully.
- Wording example following NN/g: "That username is taken. Try one of these:" rather than "Invalid username" or "Error: username exists".
- NN/g's "selectable fixes" guideline is the closest research-adjacent support for username suggestions.

### Gaps
- No controlled study found on username suggestion lists, on optimal debounce duration, or on teenagers choosing usernames. The 300–500 ms figure is convention.
- No Baymard or GOV.UK guidance specifically on username availability was found (GOV.UK services generally avoid usernames).
- The practitioner sources here were read only as search snippets.
- Security trade-off (live availability checks enable username enumeration; needs rate limiting) was not covered by any source retrieved.

---

## 4. Inline validation timing, error wording, success indicators

### Takeaway
Validate when the user leaves a field, never before or during first entry; but once an error is showing, re-check on every keystroke so it disappears the instant the input becomes valid. Use persistent positive confirmation, with a word as well as a tick, and write errors that say what happened and how to fix it without blaming the user.

### Cited Findings

**Timing**
- Wroblewski/Etre study: 22 participants aged 21–49, six versions of a registration form in random order, with eye tracking. Best inline-validation version versus validate-on-submit control: success rate +22%, errors −22%, satisfaction +31%, completion time −42%, eye fixations −47%. **[Study; small sample, design was disputed in the article's comments]** — [Wroblewski, A List Apart 2009](https://alistapart.com/article/inline-validation-in-web-forms/)
- Validating after the field (on blur) was 7–10 seconds faster than validating while typing or "before and while". "Before and while" produced the highest error rates and lowest satisfaction: "It's frustrating that you don't get the chance to put anything in [the field] before it's flashing red at you." **[Study, n=22]** — [Wroblewski, A List Apart 2009](https://alistapart.com/article/inline-validation-in-web-forms/)
- Baymard: 31% of benchmarked sites have no inline validation at all (the article also gives 32% in another place — internally inconsistent). **[Benchmark]** — [Baymard, Scott, Jan 2024](https://baymard.com/blog/inline-form-validation)
- Baymard: "participants were often frustrated by overzealous inline validation"; typing was disrupted as they stopped to read an error shown prematurely (example: "Please Enter Your Full Phone Number" shown as soon as typing began). Check validity when the user leaves the field, or for fixed-length inputs once the expected length is reached. **[Usability testing]** — [Baymard 2024](https://baymard.com/blog/inline-form-validation)
- Baymard: once an error is displayed, "the error message must live update on a keystroke level" and clear "the moment users enter a valid input"; re-checking only on blur is not enough. Mismatch errors (confirm email/password) were especially confusing when they stayed visible after the first field was fixed. **[Usability testing]** — [Baymard 2024](https://baymard.com/blog/inline-form-validation)
- NN/g: "avoid showing an error until the user has finished with the field and moved to the next field"; "Presenting errors too early is a hostile pattern"; do not treat simply leaving a field empty as an error. **[Expert guidance]** — [NN/g, Krause 2019](https://www.nngroup.com/articles/errors-forms-design-guidelines/); [NN/g, Error-Message Guidelines 2023](https://www.nngroup.com/articles/error-message-guidelines/)

**Success indicators**
- Baymard: positive inline validation reassured users, "added a sense of accomplishment and progression", and reduces the need to re-check the form before submitting; recommended "for all fields". **[Usability testing]** — [Baymard 2024](https://baymard.com/blog/inline-form-validation)
- Wroblewski: a bare green tick was ambiguous on some fields — "Are you telling me I entered a valid name or my name correctly?" Persistent success messages worked better than fading ones, which were missed and made some users think a valid field had become invalid. Adding a word (e.g. "done") clarifies. Messages inside the field gave no real benefit over messages beside it. **[Study, n=22]** — [Wroblewski, A List Apart 2009](https://alistapart.com/article/inline-validation-in-web-forms/)
- Sources differ in scope: Baymard recommends positive validation on all fields; NN/g recommends it for complex fields and warns against distraction. — [Baymard 2024](https://baymard.com/blog/inline-form-validation); [NN/g, Krause 2019](https://www.nngroup.com/articles/errors-forms-design-guidelines/)

**Presentation**
- Keep the message next to the field; a summary at the top must not be the only indication. Do not report errors in tooltips or behind icons. **[Expert guidance]** — [NN/g, Krause 2019](https://www.nngroup.com/articles/errors-forms-design-guidelines/)
- "Never use exclusively color or animation to indicate errors"; pair colour with an icon to the left of the message. A subtle animation on the icon is acceptable, but "don't animate text". **[Expert guidance]** — [NN/g, Error-Message Guidelines 2023](https://www.nngroup.com/articles/error-message-guidelines/); [NN/g, Krause 2019](https://www.nngroup.com/articles/errors-forms-design-guidelines/)
- Preserve what the user typed so they edit rather than restart. **[Expert guidance]** — [NN/g, Error-Message Guidelines 2023](https://www.nngroup.com/articles/error-message-guidelines/)
- Treat the same error occurring 3 or more times in one attempt as a design problem and give extra help at that point. "When users make errors, it's not their fault." **[Expert guidance]** — [NN/g, Krause 2019](https://www.nngroup.com/articles/errors-forms-design-guidelines/)

**Wording**
- Messages should be "explicit, human-readable, polite, precise, and give constructive advice." **[Expert guidance]** — [NN/g, Krause 2019](https://www.nngroup.com/articles/errors-forms-design-guidelines/)
- Avoid "invalid", "illegal", "incorrect"; hide error codes except for diagnostics; name the specific problem rather than "An error occurred", but "beware of excessive technical precision". **[Expert guidance]** — [NN/g, Error-Message Guidelines 2023](https://www.nngroup.com/articles/error-message-guidelines/)
- "Avoid humor since it can become stale if users encounter the error frequently." Exception: rare, low-stakes total failures can be softened with novelty. **[Expert guidance]** — [NN/g, Error-Message Guidelines 2023](https://www.nngroup.com/articles/error-message-guidelines/)

### Inferences
- The combined rule ("reward early, punish late"): first visit to a field — validate on blur; field already in error — validate on every keystroke and clear immediately; valid — show a persistent tick. This reconciles Wroblewski, Baymard and NN/g.
- With only four sign-up fields, positive ticks on every field cost little and match Baymard; add a short word on the username and password fields where a bare tick is ambiguous ("Available", "Strong enough").
- In Climby's one-question-at-a-time onboarding there is no "next field" to blur into, so validation effectively happens on pressing Continue. Keep the error on the same screen, directly under the input, keep the typed value, and clear it live as they correct.
- The no-humour rule for errors matters more for teens than for adults: a joke in a message they hit three times reads as the product laughing at them (inference combining NN/g error guidance with the teen findings in section 5).

### Gaps
- The foundational study is from 2009, n=22, adults, and its design was criticised; later support is qualitative (Baymard, NN/g). I found no large controlled replication and nothing on teenagers.
- Baymard's separate article on adaptive (cause-specific) error messages was not retrieved.
- GOV.UK's error-message and validation guidance was not retrieved; from memory GOV.UK validates on submit only and discourages validation while typing, which would be a dissenting position — unverified here.

---

## 5. Microcopy and tone for teenagers; writing in two languages

### Takeaway
The teen-specific evidence says: write short and plain (about a 6th-grade reading level), never sound childish or use the word "kids", and do not try to sound cool. General tone research adds that casual, conversational, moderately enthusiastic copy is rated friendlier and usually more trustworthy, but playfulness can cost credibility in serious moments. I found no research specific to Bulgarian-language or bilingual microcopy.

### Cited Findings

**Teens (13–17)**
- NN/g's teen research covers 100 users aged 13–17 over three rounds (38, 46, 16) in the US, UK and Australia, across 210 websites and 30 apps, using usability testing, field studies in homes and schools, interviews and focus groups. **[Usability testing]** — [NN/g, Kendrick & Nielsen 2019](https://www.nngroup.com/articles/usability-of-websites-for-teenagers/)
- Teens perform worse than adults because of weaker reading skills, less sophisticated research strategies and "dramatically lower levels of patience". **[Usability testing]** — [NN/g 2019](https://www.nngroup.com/articles/usability-of-websites-for-teenagers/)
- Write "at a 6th-grade reading level (or lower)" for broad audiences; short sentences, short paragraphs, bullets for key points and steps. **[Usability testing]** — [NN/g 2019](https://www.nngroup.com/articles/usability-of-websites-for-teenagers/)
- Avoid "anything that sounds condescending or babyish"; "the word 'kid' is a teen repellent". **[Usability testing]** — [NN/g 2019](https://www.nngroup.com/articles/usability-of-websites-for-teenagers/)
- Teens dislike tiny text as much as adults: "most teens move too quickly and are too easily distracted to attend to small text." **[Usability testing]** — [NN/g 2019](https://www.nngroup.com/articles/usability-of-websites-for-teenagers/)
- Dislikes: cluttered screens, dense text, boring content, pointless multimedia and flashy graphics, slow or buggy features, pop-ups, and social features that force sharing or make profiles public by default. **[Usability testing]** — [NN/g 2019](https://www.nngroup.com/articles/usability-of-websites-for-teenagers/)
- What worked: quizzes, feedback and question forms, voting, games, sharing features, and tools for creating or editing content; stories and examples from peers, because teens relate to content made by other teens. Multimedia can "engage or enrage" depending on usefulness. **[Usability testing]** — [NN/g 2019](https://www.nngroup.com/articles/usability-of-websites-for-teenagers/)
- The article does not report task-success numbers and does not discuss humour.

**Young adults (18–25), adjacent evidence for the top of Climby's range**
- "Young adults are sensitive to tone"; they "will feel insulted if they suspect the site is talking down to them" and "will notice if the site is trying too hard to appear cool." Study: 91 participants aged 18–25 in 7 countries, plus a survey. **[Usability testing]** — [NN/g, Moran 2016](https://www.nngroup.com/articles/young-adults-ux/)
- Even strong readers "don't enjoy reading large amounts of text online" and prefer scannable content; they "often click first, and ask questions later." **[Usability testing]** — [NN/g, Moran 2016](https://www.nngroup.com/articles/young-adults-ux/)
- Non-native speakers "have difficulty understanding puns and colloquialisms." **[Usability testing]** — [NN/g, Moran 2016](https://www.nngroup.com/articles/young-adults-ux/)

**Tone in general (adults)**
- NN/g tone experiment: paired copy samples differing only in tone; online survey of 100 US adults plus qualitative testing. Casual and humorous versions were rated friendlier (by 0.3–0.7 on a 5-point scale) and in three of four pairs equally or more trustworthy; in the insurance pair the playful version was friendlier but 0.3 points less trustworthy ("The friendliness kind of takes away some of the credibility"). **[Study, n=100, adults, US]** — [NN/g, Moran 2016, reviewed 2024](https://www.nngroup.com/articles/tone-voice-users/)
- Trustworthiness explained about 52% of the variation in desirability; friendliness added only about 8%. Casual, conversational and moderately enthusiastic tones performed best overall. **[Study, n=100]** — [NN/g, Moran 2016](https://www.nngroup.com/articles/tone-voice-users/)

**Two languages**
- Atlassian warns that illustration metaphors "may not translate across cultures and languages". **[Design system]** — [Atlassian Design System](https://atlassian.design/components/empty-state/usage)
- Puns and colloquialisms are hard for non-native readers (above). — [NN/g, Moran 2016](https://www.nngroup.com/articles/young-adults-ux/)

### Inferences
- Voice for Climby: plain, direct, lightly warm; second person; short sentences. Friendly but not jokey in anything involving accounts, errors, grades or parents, where credibility matters more than friendliness (tone study).
- Do not write in slang or meme language. The "trying too hard to appear cool" finding is from 18–25-year-olds, but it is consistent with the teen finding on condescension, and slang dates quickly and translates badly.
- Never use "kids"/"деца" for the audience; use "students"/"ученици" or address them directly. A 12-year-old and a 17-year-old share the same UI, so pitch copy at the older end: younger teens tolerate being addressed as older, older teens do not tolerate the reverse (inference from the "kid is a teen repellent" finding).
- Parent- and teacher-facing screens can share the plain style but should not share the playful touches; trust drives desirability far more than friendliness.
- Bilingual practice (my reasoning, not sourced — treat as practitioner opinion):
  - Write each language natively rather than translating English jokes or idioms; the sourced point is only that puns and colloquialisms fail across languages.
  - Decide the Bulgarian form of address once (informal "ти" is the natural register for 12–18-year-olds; parents and teachers may expect "Вие") and apply it consistently.
  - Bulgarian has grammatical gender in past-tense and adjective forms ("готов/готова"); prefer wording that avoids gendered forms rather than guessing.
  - Allow room for longer strings in buttons and labels, and avoid building sentences by concatenating fragments, because word order and agreement differ.
  - Many Bulgarian students see English UI daily and may pick English; make language switchable at any time from the welcome screen onward, and never infer it irrevocably from locale.
  - Reading-level formulas such as Flesch–Kincaid are calibrated for English; for Bulgarian, check copy with real students instead.

### Gaps
- No research found on Bulgarian-language UX writing, on teenagers reading UI in a second language, or on formal/informal address in Bulgarian apps.
- Material Design's global-writing guidance could not be opened; no design-system localisation guidance is cited beyond Atlassian's remark on illustrations.
- NN/g's teen article does not cover humour; the only sourced humour evidence is from adults (tone study) and from error-message guidance.
- NN/g's teen study covers 13–17 in English-speaking countries; nothing for 12-year-olds specifically (NN/g treats under-12s in separate children's research, which was not retrieved) or for Bulgarian or EU teens.
- The teen report's full findings sit in a paid NN/g report; only the public article was read.

---

## 6. Product tours and coach marks: effectiveness, length, alternatives

### Takeaway
The best available evidence says up-front tours do not improve task performance and can make an app feel harder; they are frequently skipped and poorly remembered. If Climby keeps its tour, it should be very short (vendor data shows completion falling sharply beyond about 3–4 steps), user-initiated or replayable, and progressively replaced by contextual hints at the moment of need, empty states that teach, and a short checklist.

### Cited Findings

**Effectiveness**
- NN/g quantitative test: 70 participants, between-subjects, four iPhone apps; half read the deck-of-cards tutorial and half skipped it. Task success 91% (tutorial) vs 94% (skipped), not significant (p=0.443). Completion time 93.5 s vs 85.2 s, not significant. Perceived ease (1–7 scale) 4.92 vs 5.49, significant (p=0.047): people who read the tutorial rated the tasks as harder. **[Study, n=70, adults]** — [NN/g, Kendrick 2020](https://www.nngroup.com/articles/mobile-tutorials/)
- Conclusion of that study: tutorials did not improve success or speed even for the tasks they explained, and appeared to make simple apps seem more complicated; invest in a usable interface first and prefer contextual help. Limitation: four simple apps, static card-deck tutorials. — [NN/g, Kendrick 2020](https://www.nngroup.com/articles/mobile-tutorials/)
- NN/g: tutorials are "dramatically overused"; "in our studies, they frequently don't perform well with real users"; "users frequently skip them"; they "don't tend to be memorable"; users "want to start using the product right away" (paradox of the active user). No numbers are given in this article. **[Usability testing / expert guidance]** — [NN/g, Laubheimer 2023](https://www.nngroup.com/articles/onboarding-tutorials/)
- Exception: walkthroughs "were useful for onboarding new users to a novel interaction paradigm like AR". — [NN/g, Laubheimer 2023](https://www.nngroup.com/articles/onboarding-tutorials/)
- Coach marks: "users tend to dismiss them quickly and do not read thoroughly"; "Bombarding users with frequent hint screens causes them to dismiss hints more quickly" and makes the app look complicated; some test users mistook an overlay for real interface and tried to tap it. **[Usability testing]** — [NN/g, Harley 2014](https://www.nngroup.com/articles/mobile-instructional-overlay/)
- Teens specifically have lower patience than adults and dislike pop-ups and waiting. **[Usability testing, 13–17]** — [NN/g 2019](https://www.nngroup.com/articles/usability-of-websites-for-teenagers/)

**Length (vendor analytics; denominators differ between sources, so numbers are not comparable across them)**
- Chameleon 2024: average tour completion 33.5%; tours longer than four steps fall below average; five-step tours 21.6%. Chameleon 2019: four-step tour 46%; an earlier report had three-step tours at 66%. **[Vendor data] (second-hand, search snippets)** — [Chameleon Benchmark Report 2024](https://www.chameleon.io/benchmark-report-24); [Chameleon 2019 report](https://www.chameleon.io/assets/chameleon-product-tour-benchmarks-report-2019.pdf)
- Produktly 2026 (88 SaaS companies): median completion 73% for 1–2 steps, 38% for 3–5, 25% for 6–8, 8% for 9+. Auto-started tours 23% median completion versus 69% for user-initiated tours. **[Vendor data] (second-hand, search snippets)** — [Produktly benchmarks 2026](https://produktly.com/research/saas-onboarding-benchmarks-2026)
- Intercom's help documentation gives a 34% median for five-step tours, higher than Chameleon's figure for the same length. **[Vendor data] (second-hand)** — [Intercom help](https://www.intercom.com/help/en/articles/3027087-see-how-your-product-tours-are-performing)
- Caveat: completion of a tour is not evidence of learning or retention; these are B2B SaaS products used by adults.

**Alternatives and how to do contextual help**
- Prefer "pull revelations": help "triggered by some signal that the user would benefit from that information at that moment" (Figma shows a tip only when the user does a related activity). **[Expert guidance]** — [NN/g, Laubheimer 2023](https://www.nngroup.com/articles/onboarding-tutorials/)
- Five guidelines: make help easy to dismiss and to recall later; use progressive disclosure (short tip plus "Learn how"); avoid memorisation by showing help alongside each step; skip the obvious (do not explain a gear icon); understand the user's journey — "the most important guideline". **[Expert guidance]** — [NN/g, Laubheimer 2023](https://www.nngroup.com/articles/onboarding-tutorials/)
- Interactive tutorials where the user performs the task, reachable again from a sidebar, are the cited good form of tutorial (ArcGIS). — [NN/g, Laubheimer 2023](https://www.nngroup.com/articles/onboarding-tutorials/)
- Coach marks: "focus on a single interaction"; present hints "one-by-one, at the right moment"; keep text ultra-short; make hints visually distinct from real controls. **[Usability testing]** — [NN/g, Harley 2014](https://www.nngroup.com/articles/mobile-instructional-overlay/)
- Empty states as teaching surfaces, and starter/demo content for learning by tinkering. — [NN/g, Kaplan 2021](https://www.nngroup.com/articles/empty-state-interface-design/); [IBM Carbon](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- Onboarding checklists: Userpilot 2024, 188 companies, average checklist completion 19.2%, median 10.1%. **[Vendor data] (second-hand, search snippet)** — [Userpilot benchmark 2024](https://userpilot.com/blog/?p=197841)

### Inferences
- For Climby's existing guided tour:
  - Cut to at most 3–4 steps, each about a non-obvious interaction; drop steps that label self-explanatory controls.
  - Prefer "do it" steps over "read it" steps: have the student add one real (or sample) homework item so the first session ends with something of theirs on screen. This is the "aha moment first" approach, and is consistent with NN/g's interactive-tutorial example and the active-user paradox.
  - Make the tour replayable from Help/Settings so skipping is safe (NN/g "easy to recall").
  - Do not stack it directly after the onboarding questions: sign-up, then questions, then a tour is three gates before any value, for an audience NN/g describes as markedly less patient than adults.
- Move the remaining teaching into: first-use empty states; one-at-a-time contextual hints triggered the first time a student reaches a feature; and an optional short "getting started" checklist. Low checklist completion in vendor data suggests keeping it to a few items and never blocking on it.
- The Produktly gap between user-initiated (69%) and auto-started (23%) tours suggests offering the tour ("Want a 30-second tour?") rather than launching it, though that is one vendor's correlational data.
- Because the NN/g experiment tested static card decks on simple apps, it argues most strongly against a passive slideshow tour; it does not directly test interactive coach-mark tours.

### Gaps
- No controlled study found on interactive (anchored, step-through) product tours versus none, on checklists versus tours, or on the "aha moment first" approach; the support for these is vendor data and practitioner opinion.
- No tour or onboarding research on teenagers or on education apps specifically.
- Apple HIG's onboarding page could not be opened. From memory it advises brief, optional onboarding, teaching through interaction, and deferring sign-in and permission requests until needed — unverified here.
- All vendor benchmark figures were read from search snippets, not the full reports; definitions of "completion" differ.

---

## 7. Progress indicators in multi-step flows; endowed progress and goal gradient

### Takeaway
A progress indicator is not automatically helpful: the largest evidence base (a meta-analysis of 32 web-survey experiments) found that a constant-rate indicator did not meaningfully reduce drop-off, that indicators which move fast early reduce it, and that indicators which move slowly early increase it. For a short, skippable flow like Climby's, show progress only if it reads as "nearly done", and start it above zero, which the endowed-progress research supports.

### Cited Findings
- Villar, Callegaro & Yang (2013, Social Science Computer Review) meta-analysed 32 randomised experiments comparing drop-off with and without a progress indicator. Constant-speed indicators did not meaningfully lower drop-off; fast-to-slow indicators reduced drop-off; slow-to-fast indicators increased it. Constant indicators raised drop-off in studies offering a small incentive. **[Study: meta-analysis of experiments] (second-hand — abstract-level summary via search; full text not read, effect sizes not confirmed)** — [Google Research publication page](https://research.google/pubs/where-am-i-a-meta-analysis-of-experiments-on-the-effects-of-progress-indicators-for-web-surveys/); [City University repository copy](https://openaccess.city.ac.uk/id/eprint/14427/)
- An informal blog critique questions that meta-analysis's moderator analysis and coding; it is not a peer-reviewed rebuttal. **[Practitioner] (second-hand)** — [NeoAcademic 2013](https://neoacademic.com/2013/11/07/does-gamifying-survey-progress-improve-completion-rate/)
- Endowed progress effect (Nunes & Drèze 2006, Journal of Consumer Research 32(4), 504–512): 300 car-wash loyalty cards; a 10-stamp card with 2 stamps pre-filled was completed by 34% of customers versus 19% for an empty 8-stamp card, although both needed 8 purchases. Framing a task as already under way increased persistence. **[Study: field experiment] (second-hand — figures taken from secondary summaries, not the journal article)** — [Coglode summary](https://www.coglode.com/nuggets/endowed-progress-effect)
- NN/g (about waiting indicators, not form steps): "Instead of showing a percentage number, consider showing the number of steps"; describing the current step in text (e.g. "Updating address 3 of 50") is recommended. **[Expert guidance]** — [NN/g, Sherwin 2014](https://www.nngroup.com/articles/progress-indicators/)
- Baymard notes that positive inline validation "added a sense of accomplishment and progression" within forms — a lightweight progress cue without a progress bar. **[Usability testing]** — [Baymard 2024](https://baymard.com/blog/inline-form-validation)
- Vendor claims that pre-filled checklist progress lifts completion mostly trace back to the Nunes & Drèze study rather than to new data; one widely repeated figure ("82% more likely") could not be traced to a primary source. **(second-hand, unverified)** — [Userpilot benchmark page](https://userpilot.com/blog/?p=197841)

### Inferences
- Implications for Climby's one-question-at-a-time onboarding:
  - If the flow is short (about 3–5 questions), a step count ("2 of 4") or segmented bar is honest and immediately reads as "short", which is the condition under which indicators help. If it is long, a truthful linear bar shows slow early progress, the pattern the meta-analysis associates with more drop-off — the better fix is to shorten the flow, not to hide or distort the bar.
  - Start with progress already earned: count account creation as step 1 done ("Account created ✓ — 3 quick questions left"). This applies endowed progress honestly, because the step really was completed.
  - Put the quickest, easiest questions first so real progress is fast early (an honest way to get the fast-to-slow shape).
  - Do not fake non-linear progress bars. The evidence comes from surveys where the deception was the manipulation; for teens, who are sensitive to being manipulated or talked down to, and in a product that parents and teachers must trust, the credibility cost outweighs it (inference).
- Dots versus "step 2 of 5" versus bar: I found no head-to-head study. Reasoned guidance: dots carry no labels and are weakest for accessibility and for knowing how much is left; an explicit count is clearest for short flows and translates trivially ("Стъпка 2 от 4"); a continuous bar suits longer or variable-length flows. If branching makes the number of steps variable, prefer a bar or "almost done" wording over a count that changes.
- The same endowed-progress logic applies to a getting-started checklist: show it with the first item (account created) already ticked.
- Because onboarding is skippable, the progress indicator also tells the student how small the cost of not skipping is; pair "Skip" with the remaining count.

### Gaps
- No study found comparing dots, numeric step labels and bars directly, and none on teenagers or app onboarding; the strongest evidence is from adult web surveys, where motivation differs from signing up for an app one chose.
- Goal-gradient effect (Kivetz, Urminsky & Zheng 2006: effort accelerates as people approach a reward, shown with a café loyalty programme) was surfaced only as a mention in search results; I did not retrieve a source for its details, so no figures are cited.
- The primary texts of both Villar et al. and Nunes & Drèze were not read; numbers are from abstracts and secondary summaries.
- No NN/g, GOV.UK or Baymard article specifically on step indicators in multi-step forms was retrieved. From memory, GOV.UK advises against progress indicators by default for one-question-per-page flows, which would be a relevant dissenting view — unverified here.
