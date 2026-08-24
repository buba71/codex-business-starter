# Codex V0 Workflow

1. **Understand the task**
   Clarify the requested outcome, constraints, and expected deliverables.

2. **Check project context**
   Inspect the repository instructions, relevant documentation, current Git state, and available tooling.

3. **Define scope**
   Identify the files, components, and behavior that are in scope, along with explicit exclusions.

4. **Analyze existing code**
   Understand the current architecture, conventions, and implementation before making changes.
   Check whether the current stack already provides a suitable framework/tool/convention.
   If a new structural dependency could materially reduce complexity, surface it as an architectural decision before implementation. Do not introduce it without explicit approval.

5. **Plan if necessary**
   Break down tasks that involve multiple steps or meaningful design decisions.

6. **Implement**
   Make the smallest change that satisfies the agreed scope and follows the project conventions.

7. **Run relevant checks**
   Execute the checks and tests appropriate to the changed code and project instructions.

8. **Verify behavior**
   Confirm the requested behavior through the most relevant available mechanism, such as a command, test, or browser request.

9. **Review diff**
   Inspect the complete diff for correctness, unintended changes, and scope compliance.

10. **Codex self-review**
    Look specifically for functional errors, unnecessary complexity, missing tests, unnecessary dependencies, and instruction violations.

11. **Human review**
    Present the result and relevant limitations for human validation and approval.

12. **Commit**
    Create a focused commit only when explicitly requested or otherwise approved.

13. **Explicit push**
    Push to the intended remote and branch only after explicit authorization.

The workflow should remain proportional to the complexity of the task and will evolve with experience.
