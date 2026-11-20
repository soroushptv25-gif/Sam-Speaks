# HCI design decisions

## Multiple user groups

The child-facing board removes editing and setup controls from the primary communication task. Parent, Teacher, and Therapist perspectives share one plain-language adult workspace while emphasizing each role's likely goal. The roles are explicitly described as simulated.

## Symbol recognizability

Starter vocabulary uses a cohesive set of custom SVG illustrations with bold outlines, simple silhouettes, limited detail, and direct object or action cues. Every picture has a short written label. Adults can replace a cartoon with a familiar photo when recognition depends on a personal object.

## Consistent placement

Core words have fixed order values and remain in the same sequence on Home and School boards. Layout changes alter grid density, not vocabulary ranking. Usage never triggers automatic reordering.

## Accessibility

The board uses large separated targets, strong contrast, visible focus indicators, text labels, keyboard-operable controls, status feedback, and reduced-motion support. Help, Stop, and No are in the core group rather than behind a category.

## Simple customization

Adding a picture is a short, three-step flow: name it, choose a recognizable picture, and place it on the right board. A live preview makes the result visible before saving. Hiding is reversible, and reset requires confirmation.

## Privacy and professional responsibility

Board preferences and uploaded photos are stored locally with IndexedDB and a localStorage fallback. The prototype has no account, server, analytics, payment, or external API. It avoids diagnosis, progress scores, emotion detection, reward streaks, and claims that software can replace a speech therapist.
