#!/usr/bin/env python3
"""
afterFileEdit hook: Snapshot AI-generated file content (Cursor).

Runs immediately after the Cursor agent (or Tab) writes/edits a file.
Saves the exact AI output to a snapshot store so we can later compare it
against what the developer actually committed.

Receives JSON via stdin from Cursor.
"""

import json
import sys
import os
import hashlib
from pathlib import Path
from datetime import datetime


def project_root(event: dict) -> str:
    roots = event.get("workspace_roots") or []
    if roots:
        return roots[0]
    return os.getcwd()


def snapshot_key(file_path: str) -> str:
    h = hashlib.md5(file_path.encode()).hexdigest()[:8]
    safe = file_path.replace("/", "_").replace("\\", "_")[-60:]
    return f"{safe}__{h}"


def main():
    try:
        event = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    file_path = event.get("file_path") or event.get("path")
    if not file_path:
        sys.exit(0)

    root = project_root(event)
    abs_path = file_path if os.path.isabs(file_path) else str(Path(root) / file_path)

    try:
        content = Path(abs_path).read_text(encoding="utf-8", errors="replace")
    except (FileNotFoundError, PermissionError, IsADirectoryError):
        sys.exit(0)

    snapshot_dir = Path(root) / ".cursor" / "ai_snapshots"
    snapshot_dir.mkdir(parents=True, exist_ok=True)

    snapshot = {
        "file_path": abs_path,
        "source": "cursor",
        "hook_event_name": event.get("hook_event_name", "afterFileEdit"),
        "timestamp": datetime.utcnow().isoformat(),
        "conversation_id": event.get("conversation_id", "unknown"),
        "generation_id": event.get("generation_id", "unknown"),
        "content": content,
        "line_count": content.count("\n") + 1,
    }

    (snapshot_dir / f"{snapshot_key(abs_path)}.json").write_text(
        json.dumps(snapshot, indent=2)
    )

    sys.exit(0)


if __name__ == "__main__":
    main()
