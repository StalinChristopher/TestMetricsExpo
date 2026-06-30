#!/usr/bin/env python3
"""
PostToolUse Hook: Snapshot AI-generated file content.

Runs immediately after Claude writes/edits a file.
Saves the AI's exact output to a snapshot store so we can later
compare it against what the developer committed.

Receives JSON via stdin from Claude Code.
"""

import json
import sys
import os
import hashlib
from pathlib import Path
from datetime import datetime

SNAPSHOT_DIR = Path(os.environ.get("CLAUDE_PROJECT_DIR", ".")) / ".claude" / "ai_snapshots"


def get_snapshot_key(file_path: str) -> str:
    """Create a safe filename key from the file path."""
    h = hashlib.md5(file_path.encode()).hexdigest()[:8]
    safe = file_path.replace("/", "_").replace("\\", "_")[-60:]
    return f"{safe}__{h}"


def main():
    try:
        event = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    tool_name = event.get("tool_name", "")
    tool_input = event.get("tool_input", {})

    # Only care about file write/edit tools
    if tool_name not in ("Write", "Edit", "MultiEdit"):
        sys.exit(0)

    file_path = tool_input.get("file_path") or tool_input.get("path")
    if not file_path:
        sys.exit(0)

    # Resolve absolute path
    cwd = event.get("cwd", os.getcwd())
    abs_path = str(Path(cwd) / file_path) if not os.path.isabs(file_path) else file_path

    # Read the file content that Claude just wrote
    try:
        content = Path(abs_path).read_text(encoding="utf-8", errors="replace")
    except (FileNotFoundError, PermissionError):
        sys.exit(0)

    # Store snapshot
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
    key = get_snapshot_key(abs_path)
    snapshot = {
        "file_path": abs_path,
        "tool_name": tool_name,
        "timestamp": datetime.utcnow().isoformat(),
        "session_id": event.get("session_id", "unknown"),
        "content": content,
        "line_count": content.count("\n") + 1,
    }

    snapshot_file = SNAPSHOT_DIR / f"{key}.json"
    snapshot_file.write_text(json.dumps(snapshot, indent=2))

    # Return feedback to Claude (optional, informational)
    output = {
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": f"[AI Attribution] Snapshot saved for {file_path} ({snapshot['line_count']} lines)"
        }
    }
    print(json.dumps(output))
    sys.exit(0)


if __name__ == "__main__":
    main()
