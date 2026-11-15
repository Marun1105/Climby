# UX research for Climby — sign-up, onboarding, teenagers (15 Nov 2026)

Asked for in `Fixes`: review UX advice from experienced people, summarise what
is useful, compare it with the app, and name further improvements.

**What this is and is not.** I cannot watch videos, so this is built from
written sources: Nielsen Norman Group (the longest-running usability research
group; their articles are the written form of what most UX videos repeat),
Google's web.dev guidance, published password research, and accounts of
Duolingo's onboarding experiments. Where I only had a summary of a source and
not the source itself, it says so. Links are at the end.

---

## 1. What the sources say

### Sign-up forms

- **Ask for as little as possible.** Collect the rest later, when the person
  can see why it helps them. *(web.dev; CXL's review of form studies.)*
- **Don't require a username unless you need one**, and if you do, keep the
  rules loose and let people change it. *(web.dev.)*
- **Say the password rule before they type**, show problems as they type
  rather than after pressing the button, and explain exactly why a password
  was refused. *(web.dev; a UserTesting practitioner article.)*
- **Length beats symbols.** Follow NIST: a minimum length, no forced mix of
  character types, allow pasting, and refuse passwords known from breaches.
  *(web.dev.)*
- **A meter with words works better than a bar alone.** In a study of 2,931
  people and 14 meters, meters changed what people chose; a later study found
  that a meter with specific feedback led to stronger passwords that were no
  harder to remember. *(Ur et al., 2012 and 2017.)*
- **Never make people type an address twice** — send a code instead. *(web.dev.)*
- **Use the right `autocomplete` and input types** so password managers and
  phone keyboards help. *(web.dev.)*

### Onboarding

- **The best onboarding is the one you can skip.** NN/g tested tutorials with
  70 people and four apps: those who *skipped* the tutorial rated the tasks
  easier (5.49 against 4.92 out of 7) and did no worse. *(NN/g, "Mobile
  Tutorials".)*
- **Three kinds of onboarding, in order of usefulness:** asking a few
  questions that change what the person then sees; brief instructions; and
  feature promotion, which people skip. *(NN/g, "Mobile-App Onboarding".)*
- **When you ask for information, be brief and say why.** *(Same.)*
- **Teach in place, not up front.** Show a feature when it becomes useful;
  use empty screens to say what goes there and how to start. *(NN/g; several
  practitioner guides.)*
- **Let people try before they sign up.** Duolingo moved its sign-up screen to
  after the first lesson and reported about 20% more daily users; a dismissible
  prompt first, and a firm one later, worked better than a firm one alone.
  *(First Round Review's interview with Duolingo's growth lead — reported, not
  verified against Duolingo's own data.)*

### Teenagers (13–17)

- **They give up quickly.** NN/g's research with 100 teenagers found they
  "often make mistakes and give up quickly" — put down to weaker reading,
  simpler search habits and less patience — and that they are goal-driven and
  "expect websites and apps to be easy to use". *(NN/g report summary; I read
  the summary page, not the 312-page report.)*
- From summaries of NN/g's earlier teen study, to be treated as second-hand:
  they are **not** the expert users adults assume, they prefer pressing to
  scrolling, they dislike small text and precise controls, and they notice at
  once when a site talks down to them.

---

## 2. How Climby compares

| Advice | Climby before today | Now |
|---|---|---|
| Few fields at sign-up | Six fields plus a three-way role choice; the card ran off the screen | Four fields; role and the rest asked after sign-in |
| Don't require a username | Optional, with a separate name field | **Required** — you asked for it, and Friends and sign-in both use it. The opposite of the advice; see 3.1 |
| Say the password rule first | Nothing until typing started | One line under the field before typing |
| Meter with words | A bar that got denser, with a word | Red / yellow / green, each with its own words |
| Length over symbols | 8 minimum, no forced symbols — already right | Unchanged |
| Refuse breached passwords | No | No — see 3.2 |
| Send a code, don't retype | Already a code by email | Unchanged |
| Autocomplete and input types | Already correct | Unchanged |
| Skippable onboarding | Two questions before sign-up, then a quiz form, then a tour | One flow after sign-in; every question skippable; Escape skips all |
| Say why you ask | The quiz said why for the grade only | Each question has one line of why |
| Questions that change what you see | Role and grade did | Same — role decides the screens, grade decides how ClimbAI explains |
| Try before signing up | Yes — the ✕ in the corner, easy to miss | Yes — a named link, "Look around without an account" |
| Teach in place | A tour of the interface after onboarding | Unchanged — see 3.4 |
| Short text, big targets for teens | Sign-up had a paragraph of security wording | Moved to sign-in only; sign-up has one line by a lock |

---

## 3. Further improvements worth making

In the order I would do them. None is done yet.

### 3.1 Suggest a username instead of demanding one

A required username is the field most likely to stop a sign-up: it has rules
(3–20 letters, numbers, dots), it can be taken, and the error arrives only
after pressing the button. Two cheap fixes: **check it while typing** ("taken"
or a tick), and **offer one** built from the email's first part. This keeps
the field you asked for and removes most of its cost.

### 3.2 Refuse passwords everyone knows

`12345678` and `password` meet the 8-character rule and show yellow. The
standard fix is to check against a list of breached passwords. A small local
list of the few thousand most common ones needs no outside service and no
network call — better for a children's app than sending anything anywhere.

### 3.3 Let a guest reach one real answer before asking for an account

Guests can already look around and ask ClimbAI. What is missing is Duolingo's
second half: after the first answer, one quiet line — "Make an account to keep
this" — instead of waiting for the person to find sign-up themselves. A
dismissible prompt first; nothing firmer.

### 3.4 Shorten the tour, and move the rest into the screens

NN/g's finding is blunt: people who skip tutorials do no worse. Climby's tour
walks the whole interface after onboarding — a new student has now passed a
welcome, a form, a code, five questions and a tour before asking anything.
Suggested: cut the tour to the two things that are not obvious (photograph a
page; the chat circle), and let each empty screen explain itself, which the
Homework screen already does well.

### 3.5 One screen, one action — check every screen for it

Teenagers give up quickly and prefer pressing to reading. The home screen
passes this test (three large cards). Worth checking the same way: Settings
(long, two columns), Focus before a session starts (a paragraph of
explanation), and Friends set-up.

### 3.6 Measure where people stop

All of the above is advice from elsewhere. Climby keeps no trackers — rightly
— but the server already knows, without identifying anyone, how many accounts
were made, verified, signed in, and asked a first question. A weekly count of
those four numbers on `/healthz` would show which step actually loses people,
with nothing new collected.

### 3.7 Speed as a feature

"Expect it to be easy" includes fast. The single largest wait in the app is
the answer itself — up to 40 seconds on a photographed page. Streaming the
answer (in the November review, section 2) would do more for how the app feels
to a 14-year-old than any screen redesign.

---

## Sources

- [web.dev — Sign-up form best practices](https://web.dev/articles/sign-up-form-best-practices)
- [NN/g — Mobile-App Onboarding: An Analysis of Components and Techniques](https://www.nngroup.com/articles/mobile-app-onboarding/)
- [NN/g — Mobile Tutorials: Wasted Effort or Efficiency Boost?](https://www.nngroup.com/articles/mobile-tutorials/)
- [NN/g — Onboarding Tutorials vs. Contextual Help](https://www.nngroup.com/articles/onboarding-tutorials/)
- [NN/g — UX Design for Teenagers (Ages 13–17), report summary](https://www.nngroup.com/reports/teenagers-on-the-web/)
- [CXL — Form Design Principles: 13 Empirically Backed Best Practices](https://cxl.com/blog/form-design-best-practices/)
- [Ur et al., 2012 — How Does Your Password Measure Up? (USENIX Security)](https://www.usenix.org/conference/usenixsecurity12/technical-sessions/presentation/ur)
- [Ur et al., 2017 — Design and Evaluation of a Data-Driven Password Meter (CHI)](https://inspire.cs.duke.edu/publications/chi17/chi17-paper.pdf)
- [UserTesting — 7 Password Creation & Recovery Frustrations](https://www.usertesting.com/blog/7-password-creation-recovery-frustrations-every-designer-should-know-about)
- [First Round Review — The Tenets of A/B Testing from Duolingo's Master Growth Hacker](https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker)
