# Sam Speaks: Critique and Fix Report

BSD 311 Human Computer Interaction, Group 2. Prepared 18 November 2026.

## 1. What was done

The prototype was reviewed against the team's Phase 1 report, using two sources:

- **A design and usability review:** Nielsen's 10 heuristics, cognitive load, personas, and traceability to the Phase 1 requirements.
- **An automated design checker:** it scans the code and the live pages for contrast, text-size and styling problems.

The original prototype scored **22 out of 40 (Acceptable)**. Every problem found was then fixed. The fixed version was tested in a browser at tablet (768×1024), phone (375×812) and laptop (1280×800) sizes.

| Check | Before | After |
|---|---|---|
| Automated design checker findings (code) | 2 | 0 |
| Automated tests | 7 | 17 (all pass) |
| Horizontal scrolling on a phone | Yes (page 407 px wide on a 375 px screen) | None |
| Drink, food and toilet visible without scrolling on a tablet | No (pictures started about 1,400 px down) | Yes (all 12 pictures fit) |

## 2. Main problems found, and how each was fixed

### P0: Adding a picture moved other pictures and removed "bathroom"

**Problem.** The main board was rebuilt each time from a list, and new cards were placed *before* water, food and bathroom. Adding one picture pushed bathroom off the board and moved the others one place. This broke two Phase 1 findings:

- Pictures must stay in fixed positions so the child can use motor memory (HTA Task 1, step 2.1).
- Help, toilet, drink and food must be on the first screen (Table III).

**Fix.** Each board (Home and School) now has **12 fixed spots**:

- A new picture goes only into the spot the adult chooses.
- Hiding or deleting a picture leaves an empty spot, so nothing moves.
- A new **Main board** screen lets adults swap two spots on purpose.

This was verified in the browser: after adding a picture to spot 12, the other 11 spots were unchanged.

### P0/P1: The most important needs were below the fold on a tablet

**Problem.** A description box, duplicate "quick words", category counts and a heading took up most of the screen before the pictures.

**Fix.**

- That clutter was removed.
- The message bar now stays in place.
- The picture grid is sized to fit the screen: 4×3 on a landscape screen, 3×4 on a portrait screen.

### P1: Every tap built a sentence

**Problem.** The Phase 1 task analysis (HTA) says to show one picture at a time by default, with sentence mode turned on depending on age, because all three participants communicate one picture at a time. The app always built sentences.

**Fix.** A new setting, **How Sam talks**, has two options:

- **One picture at a time** (default): each tap speaks the word straight away.
- **Build a sentence**: the message shows small pictures (not just text), with large Undo, Clear and Speak buttons.

### P1: The add-picture form had traps

| Problem | Fix |
|---|---|
| Typing "park" made the app say "p" (the phrase field copied only the first letter) | The spoken words now follow the label until the adult edits them |
| The picture defaulted to a bottle and the group to "Needs", so a Grandma card became a bottle | No default picture and no default group. The adult must choose, and is shown a clear message if they forget |
| Only 20 drawings, with no park, grandma, juice or toys | 78 drawings with a search box. Park, grandma, juice, milk and toys were added |
| No cropping (HTA step 3.3) | Photos are cropped to a square and compressed automatically |
| After saving, the new card was out of sight in a list of 58 | The list scrolls to the new card and highlights it, with a "Practise it with Sam" button |
| No control over where the card appears | The adult can choose a main-board spot. The form explains exactly what it replaces |

### P2: The grown-up gate was easy to get past

| Problem | Fix |
|---|---|
| Pressing Enter skipped the press-and-hold | Keyboard users must also hold Enter or Space for 1.5 seconds |
| The PIN was printed in the dialog | The PIN is hidden and can be changed in Settings. The demo PIN, 2468, is in the README only |
| Tapping the logo took the child out of the board | Removed. The child board has no exit except the grown-up lock |
| No lock that keeps the child in the app | After the first visit the app opens straight on the board, with an optional full-screen mode. The Settings screen explains that a full lock is the tablet's own guided-access setting |

## 3. Phase 1 features that were missing and are now added

| Phase 1 source | Feature added |
|---|---|
| P2: quick choice of 2–4 drinks (Table IV) | **Choice sets**: show Sam only 2–4 pictures for one moment, such as "Which drink?" (water, juice, milk) or "How do you feel?" (happy, sad, angry, tired). The main board is not changed. |
| Persona Emily: emotions activity in therapy | Same as above; the therapist no longer has to hide words on the real board |
| P1: teaching a new picture over a week (Table V) | **Practice mode**: one big picture at a time that says its word, with next and back arrows |
| Table III: printable cards for families not ready for tablets | **Print picture cards** from a main board, a group or a choice set |
| Table III: sharing a board should be one step | **Send Sam's board** opens the phone's share menu (WhatsApp, Messages, email). The PIN is never included. **Open a board someone sent** imports it, after a confirmation |
| Section II-F: text in several languages | **Arabic** words and Arabic voice on the child board, shown right to left. Adults can add Arabic words to their own cards |
| P2: group the same type together (juice, then types) | Juice and milk sit next to water in Needs. Choice sets give a quick drinks screen |

## 4. Accessibility and visual fixes

- **Contrast:** all secondary text now meets WCAG AA (at least 4.5:1). Before, about 75 labels in the adult area were at 3.8:1.
- **Text size:** no text is smaller than 13 px. Before, some text was 8–10 px.
- **Dialogs:** focus moves into the dialog, Tab stays inside it, Escape closes it, and focus returns to where it was. Confirmations put focus on the safe "Cancel" button.
- **Screen readers:**
  - The grid no longer re-announces every picture.
  - Pictures are not read twice.
  - The adult menu marks the current page.
  - The icon-only menu at narrow widths still has spoken names.
- **Touch targets:** message buttons grew from 67×62 px to at least 84×72 px.
- **Picture feedback:** the selection highlight lasts 0.9 s instead of 0.35 s.
- **Copy:**
  - The marketing slogan was replaced with "Pictures that speak for Sam."
  - Developer text ("home board · 12 pictures shown") and the counts on the category buttons were removed.
  - Small uppercase labels above headings were removed.
  - The coloured left stripe on the note card was removed.
- **Deleting:** browser pop-ups for delete were replaced by the app's own confirmation dialog.

## 5. Design decisions the team should mention in the report

1. **Replay button removed.** "Say again" (one-picture mode) and Speak (sentence mode) repeat the message, so a separate Replay button was one more button for the child with no new function. Phase 1 Table VI lists Replay, so explain this change.
2. **Role switcher moved.** "Viewing as Parent/Teacher/Therapist" confused the parent persona. It is now a single "Added by" field in the add-picture form.
3. **Category names for children.** "Core" became "Little words" and "Actions" became "Doing", and the "All" view became "My board".

## 6. Not verified, and next steps

- **Arabic wording:** the Arabic words were written for the prototype. A native speaker (ideally the family or a therapist) should check them before testing.
- **Real devices:** voice quality on a real tablet, and printing on paper, were not tested.
- **Course documents:** `HCI_DECISIONS.md` and `COURSE_ALIGNMENT.md` still describe the original version and should be updated.
- **Phase 2 data:** the research kit still contains no participants or results. Real data must come from the Phase 2 usability sessions.

## 7. How to run

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Run the tests with `npm run test`. Build with `npm run build`. The demo grown-up PIN is `2468`.

## 8. Files changed

- **New files:** `ChildBoard.tsx`, `AdultArea.tsx`, `components.tsx`, `i18n.ts`, `speech.ts`, `photo.ts`
- **Rewritten:** `App.tsx`, `board.ts`, `data.ts`, `types.ts`, `styles.css`, `board.test.ts`
- **Updated:** `SymbolArt.tsx` (5 new drawings), `evaluation.ts` (sharing), `message.ts`, `README.md`
