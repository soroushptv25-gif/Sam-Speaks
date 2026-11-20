# Research and usability evaluation kit

These are blank working instruments for the BSD 311 team. Adapt the wording with the instructor or supervisor before use. Do not invent responses, participants, timings, SUS scores, or findings.

## 1. Participant information and consent script

> We are students designing a picture-based communication prototype for an HCI course. We would like to learn about your needs and observe you completing a few tasks. Participation is voluntary. You may skip any question or stop at any time. We will not include your name in our report. With your permission, we will record task times, errors, and notes. This is a classroom prototype, not a medical or diagnostic tool. Do you understand and agree to participate?

Record only: participant code, user group, consent yes/no, date, session method, and optional accessibility accommodations. Do not place names in the report dataset.

## 2. Requirements survey draft

Target at least 15 appropriate respondents if the team selects a survey as one of its methods.

1. Which perspective best describes you: parent/caregiver, teacher, speech therapist, other relevant supporter?
2. How often do you support a child who uses pictures to communicate?
3. Which settings matter most: home, school, therapy, community, other?
4. What are the most frequent communication needs in that setting?
5. How easy or difficult is it to find a needed symbol on the current board?
6. What usually causes missed or incorrect selections?
7. How important is keeping familiar words in the same location?
8. When is a familiar real photo clearer than a generic symbol?
9. What makes adding or editing vocabulary difficult today?
10. Which setup changes are most useful: picture size, spacing, labels, categories, contexts, other?
11. What privacy concerns do you have about storing a child's photos or vocabulary?
12. What would make you trust and continue using a communication app?

Add informed-consent language, optional demographic questions only when justified, and an open comment field.

## 3. Semi-structured interview guide

Use with at least three relevant users if interviews are selected.

- Tell us about the last time a child used a picture board to express a need.
- Which words must always be immediately available?
- How does the child recognize a symbol? When does recognition fail?
- What happens when the board changes position or layout?
- Who adds vocabulary, and what makes that task easy or frustrating?
- How are Home, School, and therapy vocabulary different?
- What errors are most serious, and how should the interface recover?
- What privacy or consent concerns apply to photos and spoken messages?
- What would success look like after one week of use?

Follow up with “Can you show or describe a specific example?” without asking for identifying medical details.

## 4. Observation sheet

| Field | Notes |
| --- | --- |
| Participant code and user group | |
| Context, device, and posture | |
| Task attempted | |
| Starting point and goal | |
| Steps taken | |
| Hesitations or wrong taps | |
| Help requested | |
| Environmental distractions | |
| Successful outcome | |
| Participant quote (anonymous) | |
| Design implication | |

## 5. Draft hierarchical task analyses

### HTA A — Child communicates “I want water”

**Goal 0:** communicate a need using pictures and speech.

1. Open the appropriate board context.
2. Locate and select **I**.
3. Locate and select **want**.
4. Locate and select **water**.
5. Check the visible message strip.
6. Correct the message if needed using Undo or Clear.
7. Select **Speak**.
8. Observe feedback that the message was spoken.

**Plan 0:** do 1–5 in sequence; if the message is wrong, do 6 and repeat the affected selection; then do 7–8.

### HTA B — Adult adds a familiar Home picture

**Goal 0:** add a personalized photo tile without changing School vocabulary.

1. Enter the grown-up area.
2. Confirm the Parent perspective.
3. Start **Add a picture**.
4. Enter a short label and spoken phrase.
5. Upload a familiar photo or select a clear symbol.
6. Choose category and **Home only**.
7. Inspect the live preview.
8. Correct any error.
9. Save.
10. Open the Home child preview and verify the tile.

**Plan 0:** do 1–7 in sequence; if the preview is unclear, do 8 and repeat 4–7; then do 9–10.

## 6. Persona and scenario template

Create at least two personas from patterns in real data. Do not build them from assumptions alone.

| Persona field | Evidence-based content |
| --- | --- |
| Fictional name and role | |
| Relevant age range/context | |
| Physical characteristics affecting interaction | |
| Cognitive/psychological characteristics | |
| Behavioral/technology-use characteristics | |
| Goals | |
| Frustrations | |
| Typical environment and constraints | |
| Supporting research evidence | |

For each persona, write one short scenario with a trigger, goal, environment, actions, outcome, and design implications.

## 7. Candidate functional requirements

- The child shall build a message by selecting labeled pictures.
- The system shall provide speech, visual message output, undo, replay, and clear.
- Essential safety words shall be reachable without category navigation.
- Adults shall add, edit, hide, restore, reorder, and delete custom vocabulary without moving established core words.
- Adults shall assign a word to Home, School, or both.
- Adults shall choose a built-in symbol or local uploaded picture and preview it before saving.
- Adult editing shall require a deliberate hold followed by a four-digit PIN in the prototype flow.
- The system shall offer at least two board densities without usage-based reordering.
- The system shall preserve settings and pictures after refresh on the same device.
- The child interface shall not expose editing controls.
- The evaluation tool shall record anonymous task time, taps, undo actions, observed errors, and outcome locally and export them as CSV.

## 8. Candidate measurable usability goals

Confirm thresholds before testing, based on early research.

- At least 90% of child-board task attempts produce the intended three-word message without facilitator help.
- A first-time adult can add a context-specific picture in under two minutes with no more than one recoverable error.
- All participants can find Help, Stop, and No without opening a category.
- Changing to the large-picture layout does not prevent participants from finding the first eight core words.
- At least 80% of adult participants correctly predict whether a saved word will appear on Home, School, or both before saving.

## 9. Phase 2 usability test plan

Recruit at least five real target users who are not classmates. Where direct child testing is inappropriate or requires additional safeguarding, agree on recruitment and proxy-user methods with the instructor before testing.

### Tasks

1. Build and speak “I want water.”
2. Communicate an urgent need for help.
3. Add “My bottle” to Home with a photo.
4. Change to the large-picture layout and find Help again.
5. Add a School-only classroom word and confirm it does not appear on Home.

### Measures

| Participant code | Task | Success | Time | Errors | Help requests | Observation |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

After the tasks, administer the official System Usability Scale or another instructor-approved questionnaire, then ask: what felt easiest, what was confusing, what should change first, and was any symbol unclear without its label?

## 10. Severity and revision log

| ID | Evidence | Problem | Frequency | Impact | Severity | Proposed fix | Before figure | After figure | Retest result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | |

Choose and implement at least two fixes supported by real test evidence. Keep timestamped screenshots or version-history evidence so the before/after progression is genuine.
