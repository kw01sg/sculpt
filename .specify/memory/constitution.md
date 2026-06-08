<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0 (initial ratification)

Modified principles: N/A (initial creation from template)

Added sections:
  - Core Principles (4 principles)
  - Security & Data Integrity
  - Development Workflow
  - Governance

Removed sections: N/A

Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check section references
     principles by name; no structural changes required, existing gate pattern
     is compatible with the four principles defined here.
  ✅ .specify/templates/spec-template.md — Success Criteria section already
     accommodates performance and UX measurable outcomes (SC-00x format).
     No structural changes required.
  ✅ .specify/templates/tasks-template.md — Task categories (observability,
     testing, security) align with principles I–IV. No structural changes required.

Follow-up TODOs:
  - None. All placeholders resolved.
-->

# Sculpt Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

All code — backend (Python/FastAPI) and frontend (TypeScript/React) — MUST meet the
following standards before merging:

- **Backend**: Code MUST pass `black` formatting and `ruff` linting with zero errors.
  Pre-commit hooks enforce this automatically; bypassing hooks (`--no-verify`) is
  prohibited except in documented emergencies.
- **Frontend**: TypeScript MUST be used for all new source files. The use of `any`
  type MUST be avoided; explicit type annotations MUST be provided for all function
  signatures and component props.
- **Simplicity first**: No abstraction layer, helper, or utility MUST be introduced
  unless it is used in at least two distinct call sites. YAGNI applies — code for
  current requirements, not hypothetical future ones.
- **Async correctness**: All database operations MUST use SQLAlchemy 2.0's async API
  (`AsyncSession`, `await`). Blocking I/O in async endpoints is prohibited.
- **No dead code**: Commented-out blocks, unused imports, and stub functions MUST be
  removed before merge. Version control is the history; the codebase is the truth.

*Rationale*: Consistent code style reduces cognitive overhead and makes AI-assisted
development predictable. Async correctness is foundational to Sculpt's performance
targets and cannot be retrofitted cheaply.

### II. Testing Standards

All user-facing features MUST have tests at the appropriate level before the
feature is considered complete:

- **Backend unit tests**: Pure business logic functions MUST have unit tests
  (pytest). Test coverage for new modules MUST not fall below 80%.
- **Backend integration tests**: Every new API endpoint MUST have at least one
  integration test validating the happy path with a real database session.
- **Frontend component tests**: New page components MUST have at least one
  React Testing Library test validating the primary user interaction.
- **Test-before-implementation**: For any feature marked NON-NEGOTIABLE in the
  spec, tests MUST be written and confirmed failing before implementation begins
  (Red-Green-Refactor).
- **No flaky tests**: Tests that depend on wall-clock time, random seeds, or
  external network calls MUST be mocked. A flaky test is treated as a failing test.
- **Migration safety**: Every Alembic migration MUST include a `downgrade()` path
  and MUST be tested locally before committing.

*Rationale*: Sculpt's data (workouts, nutrition) is personal and correctness
matters. Tests provide the safety net for rapid iteration without regression.

### III. User Experience Consistency

All UI work MUST adhere to a single coherent visual and interaction system:

- **Component library**: Material-UI (MUI) v7 MUST be the sole component library.
  Custom CSS MUST only be used where MUI's `sx` prop or `styled` API cannot
  achieve the required result, and this MUST be documented inline.
- **Design token discipline**: Colors, spacing, and typography MUST reference MUI
  theme tokens (`theme.palette`, `theme.spacing`). Hard-coded hex values or pixel
  sizes in component files are prohibited.
- **Responsive design**: Every page component MUST render correctly at mobile
  (≥375 px), tablet (≥768 px), and desktop (≥1280 px) breakpoints.
- **Loading and error states**: Every component that fetches remote data MUST
  render an explicit loading indicator and an explicit error message. Silent
  failures are prohibited.
- **Accessibility baseline**: Interactive elements (buttons, form inputs) MUST
  have accessible labels (`aria-label` or visible `<label>`). Keyboard navigation
  MUST work for all primary flows.

*Rationale*: A fragmented UI erodes user trust in a fitness tracking tool that
users return to daily. Consistency reduces onboarding friction and support burden.

### IV. Performance Requirements

The system MUST meet the following performance targets under normal single-user
load (development/staging environment):

- **API response time**: All endpoints MUST return a response in ≤500 ms at p95.
  Endpoints returning paginated list results MUST use `LIMIT`/`OFFSET` (already
  implemented) and MUST NOT perform full-table scans.
- **N+1 query prohibition**: Any endpoint loading a parent entity with child
  collections MUST use `selectinload` or equivalent eager-loading strategy.
  Lazy-loading relationships in async SQLAlchemy sessions is prohibited.
- **Frontend render budget**: Page components MUST display meaningful content
  (data or skeleton) within 1 s of navigation on a local development environment.
  Expensive computations MUST be memoized (`useMemo`, `useCallback`) if they run
  on every render.
- **Database indexing**: Foreign key columns (`user_id`, `workout_id`) MUST be
  indexed. New foreign keys introduced via migration MUST include an index in the
  same migration file.
- **Bundle discipline**: New npm dependencies MUST be evaluated for size impact.
  Dependencies >50 kB gzipped require explicit justification in the PR description.

*Rationale*: Fitness logging is a high-frequency, low-patience interaction.
Performance regressions compound over time; addressing them proactively is cheaper
than retrofitting.

## Security & Data Integrity

- JWT tokens MUST be stored only in `localStorage` and transmitted exclusively via
  the `Authorization: Bearer` header. Tokens MUST NOT be embedded in URLs.
- All user data endpoints MUST filter by the authenticated `user_id`. Cross-user
  data leakage MUST be treated as a critical bug and addressed before the next
  release.
- Passwords MUST be hashed via FastAPI Users' built-in bcrypt mechanism. Custom
  hashing is prohibited.
- Environment secrets (`SECRET_KEY`, `DATABASE_URL`, credentials) MUST reside in
  `docker-compose.env` and MUST NOT be committed to version control.
- SQL queries MUST use SQLAlchemy ORM or parameterized statements. Raw string
  interpolation into queries is prohibited.

## Development Workflow

- **Migrations first**: Database schema changes MUST be preceded by an Alembic
  migration. Modifying the production database schema directly (DDL outside of
  migrations) is prohibited.
- **Feature branches**: All work MUST occur on a branch. Direct commits to `main`
  are prohibited except for hotfixes with documented justification.
- **Small, atomic commits**: Each commit MUST represent a single logical change.
  Commits mixing unrelated refactoring with feature work MUST be split before merge.
- **PR description quality**: PRs MUST describe the change, reference the relevant
  user story or issue, and note any manual testing steps performed.
- **Docker parity**: Features MUST be validated running inside Docker Compose before
  marking them complete. "Works on my machine" without Docker validation is not
  acceptable.

## Governance

This constitution supersedes all other development practices documented elsewhere
for the Sculpt project. Where a conflict exists between this document and a README,
comment, or ticket, this constitution takes precedence.

**Amendment procedure**:
1. Propose the amendment as a PR modifying this file.
2. Increment the version number per semantic versioning rules (see below).
3. Update the Sync Impact Report comment at the top of this file.
4. Propagate any required changes to dependent templates before merging.

**Versioning policy**:
- MAJOR: A principle is removed or its non-negotiable rules are weakened.
- MINOR: A new principle or mandatory section is added.
- PATCH: Wording clarifications, typo fixes, or non-semantic refinements.

**Compliance review**: All PRs MUST verify compliance with Principles I–IV before
approval. Reviewers are responsible for flagging violations; authors are responsible
for resolving them.

**Version**: 1.0.0 | **Ratified**: 2026-03-13 | **Last Amended**: 2026-03-13
