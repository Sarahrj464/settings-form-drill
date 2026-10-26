# WORKFLOW.md

## Round 1: Vague Prompt
**Prompt:** "Make a settings form with validation."
**Tool:** GitHub Copilot (Agent mode)

- **Correctness:** Email and username validation worked (e.g. "abc@"
  showed an error), but the Save button did nothing: no submit
  handler or success message.
- **Accessibility:** Labels were linked, Tab navigation worked, and
  inputs had `aria-invalid` and `aria-describedby`.
- **Edge cases:** Full name accepted leading spaces without
  trimming, and a whitespace-only name showed no error.
- **Review effort:** about 5 minutes of manual testing.
- **Unrequested additions:** sidebar, Analytics, Team, photo upload,
  timezone and copied "layers" branding.
- **AI mistake I caught:** The Save button was non-functional.
- **Tests:** none.

## Round 2: Precise Prompt
**Prompt:** Specified the file path (`SettingsForm.jsx`), constraints
(React + plain CSS, no sidebar), exact validation rules, example
behavior, and a verification step (write and run Vitest tests).
**Tool:** GitHub Copilot (Agent mode)

- **Correctness:** 8/8 Vitest tests passed. [Submit showed
  "Settings saved." yes/no.]
- **Accessibility:** `aria-invalid`, `aria-describedby` and
  `aria-live="polite"` are asserted in the tests.
- **Edge cases:** A whitespace-only name fails validation, and the
  tests cover it.
- **Review effort:** about [X] minutes.
- **AI mistake I caught:** [only if you really found one, e.g.
  the tests check the `near-limit` class, not the actual red color.]

## Comparison (git diff round-1-vague round-2-precise --stat)
- Round 2 added `SettingsForm.jsx` (+201) and
  `SettingsForm.test.jsx` (+126); Round 1 had no tests.
- `App.jsx` shrank by about 270 lines, because the unrequested
  dashboard was removed.
- `package.json` changed (+9) to add Vitest.
- Round 1 had to be reviewed for bugs by hand; Round 2's tests
  caught them automatically.

## Lessons
Specific constraints removed AI guesswork. Verification steps
produced proof instead of trust.