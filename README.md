# Sam Speaks — BSD 311 HCI Prototype

Sam Speaks is a medium-to-high-fidelity interactive prototype for **BSD 311 Human Computer Interaction, Topic 5: Picture-Based Communication App for Non-Verbal Children**. It uses a fictional child profile named Sam and separates the child's simple communication surface from the adult personalization tools.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local address printed by Vite. To create a production build:

```bash
npm run test
npm run build
npm run preview
```

## What works

- Home and School main boards with **12 fixed spots each**. Adding, hiding or deleting a picture never moves another one (Phase 1 HTA 2.1). Help, drink, food and toilet are on the first screen, one tap away.
- The main board fits on one screen on a tablet or phone, with no scrolling
- **One picture at a time** by default (each tap speaks), with an optional **Build a sentence** mode that has picture chips, Undo, Clear and Speak (Phase 1 HTA sub-goals 2 and 4)
- Picture groups (Little words, Needs, Doing, Feelings, People, Places, School), including body and sensory needs, refusal, feelings, and things that are not visible, such as music and toys
- **Choice sets**: show Sam just 2 to 4 pictures for one moment, such as "Which drink?" (water, juice, milk) or a feelings check, without changing the main board
- **Practice mode**: one big picture at a time that says its word (Phase 1, P1's teaching routine)
- English or **Arabic** words and voice on Sam's board. The Arabic was written for the prototype, so have a native speaker check it.
- Add a picture in 3 steps: take a photo, choose a photo, or pick one of 78 drawings, with automatic square cropping. Then name it (the spoken words follow the label until edited), choose a group and board, and optionally place it in a chosen main-board spot.
- **Main board editor**: tap two spots to swap them, or choose what goes in a spot
- **Share & print**: send the board in one step through the device's share menu (the PIN is never included), open a board someone sent, and print picture cards
- The grown-up area opens with a 1.5-second press-and-hold (pointer, Enter or Space) and then a 4-number PIN. The demo PIN is `2468` and can be changed in Settings. The PIN is not shown on screen.
- After the first visit, the app opens straight on Sam's board. It can optionally go full screen.
- Large-picture and more-words layouts, adjustable spacing, optional labels, stronger contrast, and less motion
- Saves on the device with IndexedDB (localStorage as a fallback), with a confirmed demo reset
- A **Usability study** screen for Phase 2 testing:
  - Measurable targets for all six usability goals: effectiveness, efficiency, learnability, memorability, satisfaction and accessibility. Results fill in as tasks are recorded.
  - Eight built-in test tasks, each with its own target. The recorder logs anonymous time, taps, undo and error counts and the outcome, and marks whether the target was met. It handles first and return visits (the return visit measures memorability).
  - A consent check: a task cannot start until consent is ticked. A child participant needs both parental consent and the child's own agreement.
  - The standard 10-item SUS questionnaire, scored automatically against the target of 68.
  - A five-question post-test interview form.
  - CSV export for tasks, SUS answers and interview notes.
- Keyboard and screen-reader support: focus is trapped in dialogs, Escape closes them, every control has a name, and all text meets WCAG AA contrast

## What is simulated

- Role switching is a classroom demonstration, not authentication or access control.
- The press-and-hold plus demo PIN gate demonstrates role separation but is not production authentication.
- Speech uses the browser's built-in voices, so voice quality and availability vary by device.
- Data is local to one browser and one fictional profile; there is no synchronization or multi-user backend.
- The study recorder uses anonymous participant codes only and does not replace consent, SUS, interview notes, severity ranking, or real analysis.
- This is not a medical device, diagnostic tool, progress assessment, or replacement for a speech therapist.

## BSD 311 project support files

- `DEMO_GUIDE.md` — a timed 15-minute presentation and live-demo sequence
- `HCI_DECISIONS.md` — design rationale linked to user characteristics and usability principles
- `COURSE_ALIGNMENT.md` — a requirement-by-requirement map to the correct project description
- `RESEARCH_AND_EVALUATION_KIT.md` — blank, ready-to-run study instruments and data sheets
- `docs/low-fidelity-wireframes.svg` — an early-design artifact for showing design progression
- `ATTRIBUTIONS.md` — source and licence credits for the interface icon set

The included research and evaluation materials contain **no invented participants or results**. The team must collect and analyze real data before using it in the report, following the course rules.
