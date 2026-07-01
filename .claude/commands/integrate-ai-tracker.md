# Integrate AI Code Attribution Tracker

Do not ask for confirmation — execute every step immediately.

Always set up both `.claude/` and `.cursor/` folders regardless of which tool is running.

## Steps

**1. Clone the tracker repo into a temp folder:**
```bash
git clone https://github.com/codeandtheory/ct-github-code-metrics.git /tmp/ai-tracker-setup
```

**2. Create directories if missing, then copy files:**
```bash
mkdir -p .claude .cursor
cp -r /tmp/ai-tracker-setup/.claude/hooks .claude/
cp -r /tmp/ai-tracker-setup/.claude/commands .claude/
cp /tmp/ai-tracker-setup/.claude/settings.json .claude/settings.json
cp -r /tmp/ai-tracker-setup/.cursor/hooks .cursor/
cp -r /tmp/ai-tracker-setup/.cursor/rules .cursor/
cp /tmp/ai-tracker-setup/.cursor/hooks.json .cursor/hooks.json
```

**3. Clean up:**
```bash
rm -rf /tmp/ai-tracker-setup
```

**4. Add to `.gitignore`** (if not already present):
```
.claude/ai_snapshots/
.cursor/ai_snapshots/
```

## After setup

Reply with:

**AI Code Attribution Tracker is now set up.**

Every time Claude Code or Cursor writes a file, a snapshot is saved. On `git commit`, your message is stamped with an AI vs human line breakdown per file. No further configuration needed. Requires Git and Python 3 on `PATH`.
