#!/usr/bin/env python3
"""
Stop Hook: Ensures the prepare-commit-msg git hook is installed.

The actual attribution calculation happens at commit time (inside the
prepare-commit-msg hook), not here — because files are typically staged
after Claude finishes, not before.

Receives JSON via stdin from Claude Code.
"""

import json
import sys
import os
from pathlib import Path

GIT_HOOK_PATH = Path(os.environ.get("CLAUDE_PROJECT_DIR", ".")) / ".git" / "hooks" / "prepare-commit-msg"
SNAPSHOT_DIR = Path(os.environ.get("CLAUDE_PROJECT_DIR", ".")) / ".claude" / "ai_snapshots"

PREPARE_COMMIT_SCRIPT = '''\
#!/bin/bash
# Auto-injected by Claude Code AI Attribution hook
# Runs the attribution analysis at commit time, then stamps the message

SCRIPT_DIR="$(git rev-parse --show-toplevel)"
SNAPSHOT_DIR="$SCRIPT_DIR/.claude/ai_snapshots"
COMMIT_MSG_FILE="$1"
COMMIT_SOURCE="$2"

# Skip merges and squashes, but allow regular commits (including -m)
if [ "$COMMIT_SOURCE" = "merge" ] || [ "$COMMIT_SOURCE" = "squash" ]; then
    exit 0
fi

# Skip if no snapshots exist
if [ ! -d "$SNAPSHOT_DIR" ] || [ -z "$(ls -A "$SNAPSHOT_DIR" 2>/dev/null)" ]; then
    exit 0
fi

# Run the attribution analysis Python script
python3 "$SCRIPT_DIR/.claude/hooks/compute_attribution.py" "$COMMIT_MSG_FILE"
exit 0
'''


def install_git_hook():
    """Returns True if the hook was newly installed, False if already present."""
    GIT_HOOK_PATH.parent.mkdir(parents=True, exist_ok=True)

    if GIT_HOOK_PATH.exists():
        existing = GIT_HOOK_PATH.read_text()
        if "AI Attribution" in existing:
            return False
        backup = GIT_HOOK_PATH.with_suffix(".pre-ai-attr")
        backup.write_text(existing)
        script = PREPARE_COMMIT_SCRIPT.rstrip() + f"\n\n# Chain original hook\nbash {backup} \"$@\"\n"
        GIT_HOOK_PATH.write_text(script)
    else:
        GIT_HOOK_PATH.write_text(PREPARE_COMMIT_SCRIPT)

    GIT_HOOK_PATH.chmod(0o755)
    return True


def main():
    try:
        event = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    # Check if any snapshots exist — if not, nothing to do
    if not SNAPSHOT_DIR.exists() or not any(SNAPSHOT_DIR.iterdir()):
        sys.exit(0)

    newly_installed = install_git_hook()

    if newly_installed:
        output = {
            "hookSpecificOutput": {
                "hookEventName": "Stop",
                "additionalContext": (
                    "[AI Attribution] prepare-commit-msg hook installed. "
                    "Attribution stats will be calculated and stamped when you commit."
                )
            }
        }
        print(json.dumps(output))

    sys.exit(0)


if __name__ == "__main__":
    main()
