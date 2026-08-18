# Editorial content guideline

Tool content must explain the implemented tool, not fill a template.

- Prefer tool-specific substance over a target word count. Describe the decision, workflow or limitation a user actually needs.
- Do not require universal headings. Choose a structure that suits the tool.
- Add FAQs only when they answer a real question not already resolved by the interface or main explanation.
- Use concrete, realistic examples instead of generic `Input` and `Output` placeholders.
- Document relevant limitations, edge cases, rounding behavior, standards or security boundaries.
- Minimize wording repeated across a family. Shared interface behavior does not need to be restated on every page.
- State that processing is local or private only when metadata and runtime behavior support that claim.
- Verify all claims against the current runtime before publication.

## Similarity reporting and enforcement

`tests/content-quality.test.js` builds a five-word-shingle similarity report for every pair of published tool pages. Set `CONTENT_SIMILARITY_REPORT=1` while running the tests to print the highest-scoring pairs. The post-remediation guardrail rejects a pair above 0.12 and separately rejects an exact sentence of 6+ words or paragraph of 20+ words repeated across tool pages.

A flagged pair requires editorial review; similarity is a signal, not an automatic instruction to add filler or mechanically rephrase accurate technical language. If required standards language creates a legitimate match, add only the exact sorted `tool-a/tool-b` pair to `exceptions`. Repeated-text exceptions must contain the normalized sentence or paragraph verbatim. Every exception must be narrowly scoped, explained in the test change and reviewed rather than weakening the global threshold.

## Seed output

Family seed scripts produce draft scaffolds, not publication-ready editorial copy. They skip every existing generated file by default. Use `--force` only when deliberately replacing existing files, and review the resulting content before changing a tool to `published`.
