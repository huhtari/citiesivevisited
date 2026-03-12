<!--
  SYNC IMPACT REPORT
  ==================
  Version change: (none) → 1.0.0 (initial constitution — MAJOR: first adoption)

  Added sections:
  - Core Principles (4 principles):
      I.  Code Quality
      II. Testing Standards
      III. User Experience Consistency
      IV. Performance Requirements
  - Quality Gates
  - Development Workflow
  - Governance

  Removed sections: N/A (initial creation)

  Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes required; Constitution Check
    section is generic and will resolve against this constitution automatically.
  - .specify/templates/spec-template.md ✅ no changes required; existing mandatory
    sections (user stories, acceptance criteria, success criteria) align with
    principles I, II, and III.
  - .specify/templates/tasks-template.md ✅ no changes required; task phases and
    test-first ordering align with Principle II.
  - .specify/templates/agent-file-template.md ✅ no changes required.

  Deferred TODOs: None.
-->

# Cities Visited Constitution

## Core Principles

### I. Code Quality

Every line of code merged to the main branch MUST meet the following standards:

- **Readability**: Code MUST be self-documenting; complex logic MUST include
  inline comments explaining intent, not mechanics.
- **Simplicity**: Solutions MUST use the minimum complexity required for the
  task. YAGNI (You Aren't Gonna Need It) applies — no speculative abstractions.
- **Consistency**: Code MUST follow the project's established style guide and
  linting rules without exception. Linting MUST pass in CI before merge.
- **No dead code**: Unused variables, functions, imports, and files MUST be
  removed before merge. Commented-out code blocks are not permitted.
- **Review gate**: All changes MUST pass peer code review. Reviews MUST verify
  correctness, clarity, and adherence to this constitution — not just style.

**Rationale**: Unreadable or inconsistent code degrades team velocity over time.
Quality enforced at merge time costs far less than quality retrofitted later.

### II. Testing Standards

Testing is non-negotiable. All production code MUST be covered by automated
tests before the implementing PR is merged.

- **Test-first**: Tests MUST be written and confirmed to fail before the
  corresponding implementation is written (Red-Green-Refactor).
- **Coverage floors**: Unit test coverage MUST remain ≥ 80% for all new code.
  Dropping below this threshold is a merge blocker.
- **Test types required**:
  - *Unit tests*: MUST cover all business logic in isolation.
  - *Integration tests*: MUST cover all interactions between system components
    and external dependencies (database, APIs).
  - *End-to-end tests*: MUST cover each P1 user story's critical happy path.
- **Test independence**: Each test MUST be runnable in isolation and MUST NOT
  rely on execution order or shared mutable state.
- **Mocks policy**: External systems (network, filesystem, third-party APIs) MAY
  be mocked in unit tests. Integration tests MUST use real or containerised
  dependencies — never mocks for integration-level assertions.

**Rationale**: Tests are the primary safety net for refactoring and deployment.
A test suite that doesn't fail on broken code provides false confidence.

### III. User Experience Consistency

All user-facing surfaces (UI, API responses, CLI output, error messages) MUST
maintain a consistent and predictable experience.

- **Design system adherence**: UI components MUST use the established design
  system tokens (colours, typography, spacing). One-off deviations MUST be
  approved and documented before implementation.
- **Error messages**: All user-visible errors MUST be actionable — they MUST
  describe what went wrong and what the user can do about it. Technical stack
  traces MUST NOT be exposed to end users.
- **API contract stability**: Published API contracts MUST NOT change in a
  breaking way without a versioning increment and a documented migration path.
- **Accessible by default**: New UI MUST meet WCAG 2.1 AA accessibility
  standards. Accessibility is a first-class requirement, not a post-launch
  concern.
- **Loading and empty states**: Every dynamic UI view MUST define and implement
  its loading, empty, and error states before the feature is considered done.

**Rationale**: Inconsistency erodes user trust. A predictable, well-communicated
interface reduces support burden and increases adoption.

### IV. Performance Requirements

The application MUST remain responsive and efficient under expected load.

- **Response time**: API endpoints MUST respond within 200 ms at the 95th
  percentile under normal load. Endpoints exceeding this MUST be flagged and
  have a documented optimisation plan before shipping.
- **Page/screen load**: UI screens MUST reach interactive state within 2 seconds
  on a median connection. Core content MUST be visible before JavaScript
  hydration completes where applicable.
- **Regression gate**: Performance benchmarks MUST be run in CI. A PR that
  introduces a ≥ 20% regression in any tracked metric MUST NOT merge without
  explicit sign-off and a remediation issue filed.
- **Database queries**: N+1 query patterns are prohibited. All queries accessing
  more than one row MUST be reviewed for index usage before merge.
- **Observability**: All performance-critical paths MUST emit structured timing
  metrics. No performance issue should require a code deploy to diagnose.

**Rationale**: Performance is a feature. Users abandon slow applications.
Catching regressions at PR time is orders of magnitude cheaper than fixing them
in production.

## Quality Gates

The following gates apply to every feature before it is considered shippable:

| Gate | Owner | Condition |
|------|-------|-----------|
| Lint passes | CI | Zero lint errors/warnings |
| Unit coverage ≥ 80% | CI | Measured per-PR on new code |
| Integration tests green | CI | All integration tests pass |
| Performance benchmark | CI | No ≥ 20% regression on tracked metrics |
| Code review approved | Peer | At least one reviewer sign-off |
| Accessibility check | Author | WCAG 2.1 AA verified for UI changes |
| Constitution Check | Author | Explicit checklist in PR description |

Any gate failure is a hard merge blocker. Exceptions MUST be documented in the
Complexity Tracking table of the relevant `plan.md` with explicit justification.

## Development Workflow

- **Branch policy**: All work MUST happen on feature branches. Direct commits to
  `main` are prohibited. Branch names MUST follow the `###-feature-name` format.
- **PR size**: Pull requests SHOULD target fewer than 400 lines changed. Larger
  PRs MUST include a justification comment.
- **Commit messages**: Commits MUST use conventional commit format
  (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`).
- **CI is authoritative**: If CI is red, the branch is not mergeable — no
  exceptions, no "it works on my machine" overrides.
- **Definition of Done**: A task is done when: code is merged to `main`,
  all quality gates pass, and the relevant spec's acceptance criteria are met.

## Governance

This constitution is the highest-authority governance document for the Cities
Visited project. All other practices, conventions, and guidelines MUST be
consistent with it. In case of conflict, this document takes precedence.

**Amendment procedure**:

1. Open a PR with the proposed change to `.specify/memory/constitution.md`.
2. Include in the PR description: motivation, impact on existing code, and
   migration plan if backward-incompatible.
3. Require sign-off from at least two contributors before merge.
4. Update `CONSTITUTION_VERSION` per semantic versioning rules:
   - MAJOR: Backward-incompatible principle removal or redefinition.
   - MINOR: New principle or section added.
   - PATCH: Clarification, wording, or typographic fix.
5. Propagate any changes to dependent templates per the Sync Impact Report.

**Compliance review**: At the start of every sprint, one team member MUST
review at least one recent merged PR against this constitution and report
findings in the team standup.

**Version**: 1.0.0 | **Ratified**: 2026-03-12 | **Last Amended**: 2026-03-12
