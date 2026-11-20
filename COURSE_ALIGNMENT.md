# BSD 311 course alignment

This file maps the prototype package to the **BSD 311 Human Computer Interaction — Fall 2026** project description. It is a planning checklist, not a substitute for the team's report or real user research.

## Topic fit

- **Selected topic:** Appendix A, Topic 5 — Picture-Based Communication App for Non-Verbal Children
- **Problem addressed:** traditional and commercial digital picture boards can be difficult or expensive to personalize
- **Target users represented:** non-verbal children, parents, teachers, and speech therapists
- **Design focus covered:** multi-user design, recognizable symbols, low-complexity customization, and child-friendly interaction

## Phase 1 evidence still required from the team

| Course requirement | Support in this package | Real team work still required |
| --- | --- | --- |
| Problem and existing systems | Product scope in README and HCI rationale | Compare 2–3 real systems using cited evidence |
| User analysis | Design implications in `HCI_DECISIONS.md` | Research physical, cognitive, behavioral, language, and context characteristics |
| Two research techniques | Blank instruments in `RESEARCH_AND_EVALUATION_KIT.md` | Run two techniques; survey needs 15+ respondents, interviews need 3+ users if selected |
| Two HTAs | Draft task structures in the research kit | Validate and revise them using real findings |
| Two personas and scenarios | Persona template in the research kit | Create evidence-based personas from collected data |
| Functional requirements | Prototype features and traceability below | Finalize and prioritize from research evidence |
| Measurable usability goals | Candidate goals in the research kit | Approve thresholds before testing |
| Low-fidelity design | `docs/low-fidelity-wireframes.svg` | Annotate design rationale and include readable numbered figures |
| Phase 2 plan | Vite prototype and evaluation kit | State final participant recruitment and test schedule |

## Phase 2 prototype coverage

| Key requirement | Implemented evidence |
| --- | --- |
| End-to-end child communication | Tap picture → build message → undo/clear → Speak/replay |
| Home and School contexts | Separate boards with stable core word order |
| Adult personalization | Add/edit/hide/restore, category/context selection, familiar photo upload |
| Several adult perspectives | Simulated Parent, Teacher, and Therapist views with role-specific guidance |
| Adaptable interface | Large-picture and more-words layouts, spacing control, label control |
| Feedback and error prevention | Selection feedback, validation, upload errors, reversible hiding, confirmed reset |
| Accessibility | Large targets, visible labels, contrast, keyboard access, status feedback, reduced motion |
| Local privacy | IndexedDB persistence, localStorage fallback, no account or analytics |
| Live demonstration | Five tested flows documented in `DEMO_GUIDE.md` |

## Phase 2 evidence still required from the team

- Test with at least five real users from the target group; classmates do not count.
- Obtain consent, allow withdrawal at any time, and keep identities anonymous.
- Record task success, time on task, errors, post-test questionnaire results such as SUS, and interview comments.
- Rank usability problems by severity.
- Fix at least two problems identified by participants and document genuine before/after screens.
- Complete the IEEE final report (maximum 12 pages excluding specified front/back matter) with at least eight mostly scholarly references.
- Insert the working prototype link in the report and Moodle submission and verify instructor access.
- Complete the Moodle cover and member contribution pages.

## Academic integrity boundary

The course description says participant data must be real and generative-AI text cannot be submitted as the team's own writing. Use this prototype and its planning materials as development support. The team must conduct the studies, interpret its own evidence, write the report in its own words, and follow any additional instructions given by the instructor.
