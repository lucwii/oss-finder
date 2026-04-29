---
name: File structure preference
description: User wants components, logic, and pages split into separate files — never everything in one file
type: feedback
---

Always split code into separate files: page, components, shared UI, and data/constants each in their own file.

**Why:** User explicitly rejected a single-file implementation and asked for the same structure used elsewhere in the project (components separated from pages).

**How to apply:** When building a feature, create dedicated component files under `src/components/<feature>/`, constants/types in `src/lib/<feature>.ts`, and keep the page file lean (just composes components + holds state).
