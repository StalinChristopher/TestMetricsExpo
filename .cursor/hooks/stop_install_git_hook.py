#!/usr/bin/env python3
"""
stop hook (Cursor): Ensure the prepare-commit-msg git hook is installed.

The actual attribution is computed at commit time (inside prepare-commit-msg),
because files are usually staged after the agent finishes, not before.

This installer is designed to coexist with the Claude Code attribution hook:
if a prepare-commit-msg hook already exists, we PREPEND our block right after
the shebang instead of overwriting it, so both pipelines can run.

Receives JSON via stdin from Cursor.
"""

import json
import sys
import os
from pathlib import Path


MARKER = "AI Attribution (Cursor)"

CURSOR_BLOCK = '''\
# === AI Attribution (Cursor) ===
__CURSOR_TOPLEVEL="$(git rev-parse --show-toplevel)"
__CURSOR_SNAP="$__CURSOR_TOPLEVEL/.cursor/ai_snapshots"
if [ "$2" != "merge" ] && [ "$2" != "squash" ] && [ -d "$__CURSOR_SNAP" ] && [ -n "$(ls -A "$__CURSOR_SNAP" 2>/dev/null)" ]; then
    python3 "$__CURSOR_TOPLEVEL/.cursor/hooks/compute_attribution.py" "$1"
fi
# === end AI Attribution (Cursor) ===
'''

STANDALONE_HOOK = "#!/bin/bash\n# Auto-injected by Cursor AI Attribution hook\n\n" + CURSOR_BLOCK + "\nexit 0\n"


def project_root(event: dict) -> str:
    roots = event.get("workspace_roots") or []
    if roots:
        return roots[0]
    return os.getcwd()


def install_git_hook(root: str):
    hook_path = Path(root) / ".git" / "hooks" / "prepare-commit-msg"
    hook_path.parent.mkdir(parents=True, exist_ok=True)

    if hook_path.exists():
        existing = hook_path.read_text()
        if MARKER in existing:
            return
        lines = existing.splitlines(keepends=True)
        if lines and lines[0].startswith("#!"):
            shebang, rest = lines[0], "".join(lines[1:])
        else:
            shebang, rest = "#!/bin/bash\n", existing
        hook_path.write_text(shebang + "\n" + CURSOR_BLOCK + "\n" + rest)
    else:
        hook_path.write_text(STANDALONE_HOOK)

    hook_path.chmod(0o755)


def main():
    try:
        event = json.load(sys.stdin)
    except json.JSONDecodeError:
        event = {}

    root = project_root(event)
    snapshot_dir = Path(root) / ".cursor" / "ai_snapshots"

    if not snapshot_dir.exists() or not any(snapshot_dir.iterdir()):
        sys.exit(0)

    install_git_hook(root)
    sys.exit(0)


if __name__ == "__main__":
    main()
