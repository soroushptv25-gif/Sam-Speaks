# Research and usability evaluation kit

These are blank working instruments for the BSD 311 team. Adapt the wording with the instructor or supervisor before use. Do not invent responses, participants, timings, SUS scores, or findings.

## 1. Consent forms

Every participant needs a signed form **before** any task starts. The app's **Usability study** screen will not start a task until the facilitator ticks the matching consent boxes: one for an adult, or two for a child (parental consent and the child's own agreement).

### 1a. Adult consent form (parents, teachers, speech therapists)

> We are students at Canadian University Dubai designing Sam Speaks, a picture-based communication prototype, for the course BSD 311 Human Computer Interaction. We would like you to try a few tasks, answer a 10-question questionnaire (SUS), and answer five short interview questions. It takes about 20 minutes. Taking part is voluntary, and you may skip any question or stop at any time without giving a reason. We record task times, taps, errors and short notes under a code such as P01. Your name will not appear in our report or data. This is a classroom prototype, not a medical or diagnostic tool.
>
> I agree to take part: ☐ Yes ☐ No  Participant code: ____  Signature: ________  Date: ____

### 1b. Parental consent form (for any child participant, aged 4–12)

> We would like to invite your child to try Sam Speaks, a picture board prototype, for about 10 minutes, with you present. Your child will be asked to tap pictures, such as "water" or "help". We will record only task times and taps under a code. We will not take photos or video of your child, and we will not record their name, diagnosis or medical details. Your child can stop at any time, and we will stop straight away if they seem unhappy. You can withdraw your child's data until the report is submitted.
>
> I give permission for my child to take part: ☐ Yes ☐ No  Child's code: ____  Parent or guardian signature: ________  Date: ____

### 1c. Child agreement script (read aloud, with the parent present)

> "We made a game with pictures that talk. Would you like to try it? You can stop whenever you want. Just tell us, or push it away."

Continue only if the child agrees (a yes, a nod, or the yes card). Stop if the child says no, looks upset, or turns away.

Record only: participant code, user group, consent yes/no, date and session. Do not place names in the report dataset.

## 2. Short parent survey

Send this online survey to parents of children aged 4–12 who use or might use picture communication. Aim for at least 15 replies. It takes about 5 minutes. Start the survey with the consent paragraph from 1a. Teachers and therapists may also answer it, and question 1 separates their replies.

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

### 3a. Interview guide for a special education teacher or speech therapist

Interview at least one professional. They see many children, so they can describe patterns that a single family cannot.

- Which picture systems (for example, PECS or a communication book) do your students use now, and what works well?
- How many pictures can a 4-year-old and a 10-year-old manage on one screen?
- How do you teach a new picture? How long does it usually take before a child uses it on their own?
- Do children rely on where a picture is? What happens when its position changes?
- Do you prefer real photos or drawings, and does it depend on the child?
- How do you run feelings or choice activities in class or therapy?
- How do the school, the family and the therapist share vocabulary today?
- What would stop you from recommending an app like this to a family?
- Please look at the prototype. What would you change first?

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

Create at least two personas from patterns in real data. Do not build them from assumptions alone. For Adam, Sarah and Emily, fill in the last row with the participant it comes from (P1, P2, P3, or the teacher/therapist interview) for every goal and frustration. A trait that no participant mentioned should be removed or marked as an assumption.

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

## 8. Measurable usability goals

Each goal has a number to meet, as the instructor asked. The app's **Usability study** screen checks every recorded task against these targets and shows whether each goal is met.

| Goal | Target | How it is measured |
| --- | --- | --- |
| Effectiveness | At least 80% of child-board task attempts succeed without help | Task recorder: outcome |
| Efficiency | Ask for help in 1 tap and under 10 seconds; say a feeling in 2 taps | Task recorder: time and taps |
| Learnability | A first-time caregiver adds a photo card in under 2 minutes without help | Task recorder: first visit |
| Memorability | One week later, the same caregiver adds a card in under 1 minute without help | Task recorder: return visit |
| Satisfaction | Mean SUS score of 68 or higher (above the SUS average) | SUS questionnaire after the tasks |
| Accessibility | Every participant finds Help with big pictures on, without help, in under 1 minute; 0 WCAG 2.2 AA contrast failures | Task recorder and automated contrast check |

## 9. Phase 2 usability test plan

Recruit at least five real target users who are not classmates. Include at least one special education teacher or speech therapist as well as parents. Test a child only with signed parental consent, the child's own agreement and a parent present. Where direct child testing is not possible, agree a proxy method with the instructor.

### Session order (about 20 minutes per adult)

1. Consent form signed (section 1). Tick the consent box in the app.
2. Tasks, recorded in the app (**Usability study → Run one task**).
3. SUS questionnaire (**Usability study → System Usability Scale**, or on paper).
4. Post-test interview (**Usability study → Post-test interview**).
5. One week later: return visit for the memorability task.

### Tasks (built into the app, each with its own target)

| Task | Starts on | Goal | Target |
| --- | --- | --- | --- |
| Ask for water | Sam's board | Effectiveness | Done without help in 1 tap |
| Ask for help | Sam's board | Efficiency | 1 tap, under 10 s |
| Say how you feel | Sam's board | Efficiency | 2 taps (group, then picture) |
| Choose a drink from a choice set | Sam's board | Effectiveness | 1 tap |
| Fix a wrong picture (sentence mode) | Sam's board | Effectiveness | Done without help, using Undo |
| Add a photo card (first time) | Grown-up area | Learnability | Under 2 minutes, without help |
| Add a photo card (return visit) | Grown-up area | Memorability | Under 1 minute, without help |
| Switch to big pictures and find Help | Grown-up area | Accessibility | Under 1 minute, without help |

### SUS

Use the standard 10-item System Usability Scale. Adults answer each item from 1 (strongly disagree) to 5 (strongly agree). The app scores it with the standard formula: odd items score minus 1, even items 5 minus score, and the sum is multiplied by 2.5. SUS is for adults; do not give it to children.

### Post-test interview (five questions)

1. What felt easiest?
2. What was confusing, and where?
3. Was any picture unclear without its word?
4. What should we change first?
5. Would you use this with your child or student? Why or why not?

### Exporting the data

Each part exports its own CSV file: tasks (including a `target_met` column), SUS answers and scores, and interview notes. Use these files for the analysis in the report.

## 10. Severity and revision log

| ID | Evidence | Problem | Frequency | Impact | Severity | Proposed fix | Before figure | After figure | Retest result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | |

Choose and implement at least two fixes supported by real test evidence. Keep timestamped screenshots or version-history evidence so the before/after progression is genuine.
