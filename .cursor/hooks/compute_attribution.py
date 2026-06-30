#!/usr/bin/env python3
"""
Called by the prepare-commit-msg git hook at commit time (Cursor).
Diffs staged files against Cursor AI snapshots and appends an attribution
summary to the commit message.

Usage: python3 compute_attribution.py <commit-msg-file>
"""

import json
import sys
import difflib
import hashlib
import subprocess
from pathlib import Path
from datetime import datetime

PROJECT_DIR = subprocess.run(
    ["git", "rev-parse", "--show-toplevel"],
    capture_output=True, text=True
).stdout.strip() or "."

SNAPSHOT_DIR = Path(PROJECT_DIR) / ".cursor" / "ai_snapshots"


def count_changed_lines(old: str, new: str):
    old_lines = old.splitlines(keepends=True)
    new_lines = new.splitlines(keepends=True)

    ai_lines = 0
    human_lines = 0

    matcher = difflib.SequenceMatcher(None, old_lines, new_lines)
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "equal":
            ai_lines += (i2 - i1)
        elif tag in ("replace", "insert"):
            human_lines += (j2 - j1)

    total = ai_lines + human_lines
    return ai_lines, human_lines, total


def load_snapshot(abs_path: str):
    h = hashlib.md5(abs_path.encode()).hexdigest()[:8]
    safe = abs_path.replace("/", "_").replace("\\", "_")[-60:]
    snap_file = SNAPSHOT_DIR / f"{safe}__{h}.json"
    if snap_file.exists():
        return json.loads(snap_file.read_text())
    return None


def get_staged_files():
    result = subprocess.run(
        ["git", "diff", "--cached", "--name-only"],
        cwd=PROJECT_DIR, capture_output=True, text=True
    )
    if result.returncode != 0:
        return []
    return [f.strip() for f in result.stdout.splitlines() if f.strip()]


def main():
    if len(sys.argv) < 2:
        sys.exit(0)

    commit_msg_file = sys.argv[1]
    staged_files = get_staged_files()
    if not staged_files:
        sys.exit(0)

    total_ai = 0
    total_human = 0
    file_stats = []

    for rel_path in staged_files:
        abs_path = str(Path(PROJECT_DIR) / rel_path)
        snapshot = load_snapshot(abs_path)

        try:
            current_content = Path(abs_path).read_text(encoding="utf-8", errors="replace")
        except (FileNotFoundError, PermissionError, IsADirectoryError):
            continue

        if snapshot:
            ai, human, total = count_changed_lines(snapshot["content"], current_content)
            pct_ai = round((ai / total * 100) if total else 0)
            file_stats.append({
                "path": rel_path,
                "ai_pct": pct_ai,
                "human_pct": 100 - pct_ai,
                "ai_lines": ai,
                "human_lines": human,
            })
            total_ai += ai
            total_human += human

    if not file_stats:
        sys.exit(0)

    has_ai_files = any(f["ai_pct"] > 0 for f in file_stats)
    if not has_ai_files:
        sys.exit(0)

    grand_total = total_ai + total_human
    overall_ai_pct = round((total_ai / grand_total * 100) if grand_total else 0)
    overall_human_pct = 100 - overall_ai_pct

    summary_lines = [
        "",
        "─────────────────────────────────────────",
        "🤖 AI Attribution Summary (Cursor)",
        "─────────────────────────────────────────",
        f"  Overall  →  AI: {overall_ai_pct}%  |  Human: {overall_human_pct}%",
        f"  Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}",
        "",
        "  Per-file breakdown:",
    ]
    for f in file_stats:
        bar_ai = "█" * (f["ai_pct"] // 10)
        bar_human = "░" * (10 - f["ai_pct"] // 10)
        summary_lines.append(f"    {f['path']}")
        summary_lines.append(
            f"      [{bar_ai}{bar_human}]  AI {f['ai_pct']}% ({f['ai_lines']} lines)"
            f"  /  Human {f['human_pct']}% ({f['human_lines']} lines)"
        )
    summary_lines.append("─────────────────────────────────────────")

    with open(commit_msg_file, "a") as fh:
        fh.write("\n".join(summary_lines) + "\n")

    sys.exit(0)


if __name__ == "__main__":
    main()
