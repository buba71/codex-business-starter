# Project Rules

- Use english
- Analyze the existing code before making any modifications.
- When required business information is missing from both the task and project context, report the ambiguity before implementing.
- Limit changes to the requested scope.
- Do not add dependencies without justification.
- Run relevant checks after making a modification, including functional checks when applicable.
- Summarize the changes made and report any limitations.

## Dependencies

- Do not install or upgrade dependencies without checking the target version first.
- Prefer stable and actively supported versions.
- Verify compatibility with the existing stack before changing a dependency.
- Do not assume that the model's knowledge of the latest version is current.
- Report the selected version and the reason for choosing it before installation.

## Backend validation

From `backend/`, run the relevant project checks before considering backend changes complete.
