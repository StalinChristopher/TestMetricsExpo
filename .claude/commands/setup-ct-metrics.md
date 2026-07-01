---
description: Set up both AI Attribution Hooks and Template Code Metrics in this repo. Installs commit-time AI vs human tracking (Claude + Cursor) and scaffolds the GitHub Actions workflow that reports template-vs-custom percentages to the shared Grafana dashboard.
---

# Set up CT Code Metrics in this repository

You are setting up **two complementary tools** in one pass:

1. **AI Attribution Hooks** — snapshots AI output at edit time; stamps every `git commit` with an AI vs human line breakdown per file. Works for both Claude Code and Cursor.
2. **Template Code Metrics** — a GitHub Action that runs on every push to `main`, computes what percentage of the repo is original template vs custom work, and POSTs the result to a shared DevLake/Grafana dashboard.

Reference: https://github.com/codeandtheory/ct-github-code-metrics

Do not ask for confirmation — execute every step immediately unless a step explicitly says to ask the user.

---

## Phase 1 — AI Attribution Hooks

### Step 1 — Clone the source repo into a temp folder

```bash
git clone https://github.com/codeandtheory/ct-github-code-metrics.git /tmp/ct-metrics-setup
```

### Step 2 — Create directories and copy hook files

```bash
mkdir -p .claude/hooks .cursor/hooks
cp -r /tmp/ct-metrics-setup/.claude/hooks/. .claude/hooks/
cp -r /tmp/ct-metrics-setup/.cursor/hooks/. .cursor/hooks/
```

### Step 3 — Merge hook configuration

**`.claude/settings.json`** — if the file does not exist, copy it directly:
```bash
cp /tmp/ct-metrics-setup/.claude/settings.json .claude/settings.json
```
If `.claude/settings.json` already exists, open both files and merge the `hooks` array from the source into the existing file without overwriting any keys the project already has.

**`.cursor/hooks.json`** — same logic: copy if absent, merge the `hooks` array if present:
```bash
cp /tmp/ct-metrics-setup/.cursor/hooks.json .cursor/hooks.json
```

### Step 4 — Update `.gitignore`

Append these two lines to `.gitignore` if they are not already present:

```
.claude/ai_snapshots/
.cursor/ai_snapshots/
```

### Step 5 — Clean up temp folder

```bash
rm -rf /tmp/ct-metrics-setup
```

---

## Phase 2 — Template Code Metrics

### Step 6 — Detect project type and pick `extra_excludes`

Inspect the repo to determine its primary language/framework. Run `ls` at the repo root and look at file extensions in `src/` (or equivalent). Match to one of these:

- **React Native / Expo**: presence of `app.json` + `app.config.ts` or `metro.config.js` or `ios/Podfile`
- **Native iOS**: `*.xcodeproj`, `*.xcworkspace`, `Podfile`, no React Native indicators
- **Native Android**: `build.gradle` or `build.gradle.kts` at root, no React Native indicators
- **Python**: `pyproject.toml`, `setup.py`, `requirements.txt`, or `*.py` in `src/`
- **Go**: `go.mod`
- **Rust**: `Cargo.toml`
- **Java/Kotlin (non-Android)**: `pom.xml` or `build.gradle` outside `android/`
- **Node/JS/TS (non-RN)**: `package.json` without RN dependencies
- **Other / unknown**: skip `extra_excludes` and let the user fill in later

Map the detected type to `extra_excludes`:

| Type | `extra_excludes` |
|---|---|
| React Native | `[":!**/*.xcconfig.local", ":!ios/.bundle/**"]` |
| Native iOS | `[":!Carthage/**", ":!**/*.xcuserstate", ":!fastlane/report.xml", ":!fastlane/test_output/**"]` |
| Native Android | `[":!**/build/**", ":!**/captures/**", ":!**/proguard/**", ":!local.properties"]` |
| Python | `[":!**/migrations/**", ":!staticfiles/**", ":!**/__generated__/**", ":!**/*.pyi"]` |
| Go | `[":!**/*.pb.go", ":!**/*_generated.go", ":!**/zz_generated_*.go", ":!**/mock_*.go"]` |
| Rust / Java / Node / Other | `[]` |

If you can't determine the type, ask the user once: "What kind of project is this — React Native, native iOS, native Android, Python, Go, Rust, Java, Node/TS, or other?"

### Step 7 — Pick a baseline commit

Ask the user one focused question:

> "What baseline commit should template-metrics use? Options: (a) **root commit** — the very first commit of this repo; (b) **a tagged release** like v1.0.0; (c) **a specific SHA** you'll paste."

For option (a), compute it with `git rev-list --max-parents=0 HEAD`.
For option (b), resolve the tag with `git rev-list -n 1 <tag>`.
For option (c), use the user's pasted SHA verbatim.

Validate the SHA exists in this repo's history with `git cat-file -e <sha>`. If it errors, tell the user the SHA isn't in this repo's history and ask again.

### Step 8 — Offer semantic scoring (opt-in)

Ask the user one focused yes/no question:

> "Enable Claude-judged **semantic** scoring alongside the deterministic git-diff score?
> - Adds a second `template_pct_semantic` value that ignores Prettier reformats, renames, comment edits, and similar cosmetic changes.
> - Costs ~1¢ per commit using `claude-haiku-4-5-20251001`.
> - Requires an `ANTHROPIC_API_KEY` GitHub Actions secret.
> - You can enable this later by adding the input + secret yourself."

Remember the user's answer as `SEMANTIC_ENABLED` (true/false).

### Step 9 — Create `.template-provenance.json`

Write to repo root:

```json
{
  "schema_version": 1,
  "baseline_commit": "<the SHA from step 7>",
  "extra_excludes": <the array from step 6>
}
```

If `.template-provenance.json` already exists, ask the user before overwriting. Show them the diff.

### Step 10 — Create `.github/workflows/template-metrics.yml`

Write to that exact path (create directories if missing):

```yaml
name: Template Metrics

on:
  push:
    branches: [main]
  pull_request:
    types: [closed]
  workflow_dispatch:

jobs:
  measure:
    if: github.event_name != 'pull_request' || github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Download metrics script
        run: |
          curl -fsSL \
            -H "Authorization: token ${{ secrets.CT_METRICS_TOKEN }}" \
            https://raw.githubusercontent.com/codeandtheory/ct-github-code-metrics/main/core/scripts/template-metrics.mjs \
            -o template-metrics.mjs

      - name: Compute template-vs-custom metrics
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          node template-metrics.mjs > metrics.json
          echo "=== Template Code Metrics ==="
          jq '{template_pct: .percentages.template_pct, custom_pct: .percentages.custom_pct, total_loc: .counts.current_total_loc}' metrics.json

      - name: Upload metrics artifact
        uses: actions/upload-artifact@v4
        with:
          name: template-metrics-${{ github.sha }}
          path: metrics.json
          if-no-files-found: error

      - name: POST to DevLake
        env:
          DEVLAKE_WEBHOOK_URL: ${{ secrets.DEVLAKE_WEBHOOK_URL }}
          DEVLAKE_BASIC_AUTH: ${{ secrets.DEVLAKE_BASIC_AUTH }}
        run: |
          NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
          REPO_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}"
          jq -n \
            --arg id "$GITHUB_SHA" \
            --arg sha "$GITHUB_SHA" \
            --arg ref "${GITHUB_REF_NAME:-main}" \
            --arg repo "$REPO_URL" \
            --arg now "$NOW" \
            --slurpfile m metrics.json \
            '{
              id: $id,
              name: ("template-metrics " + ($m[0].percentages.template_pct|tostring) + "% template / " + ($m[0].percentages.custom_pct|tostring) + "% custom"),
              displayTitle: ($m[0] | tojson),
              environment: "PRODUCTION",
              startedDate: $now,
              finishedDate: $now,
              result: "SUCCESS",
              deploymentCommits: [{
                repoUrl: $repo,
                commitSha: $sha,
                refName: $ref,
                startedDate: $now,
                finishedDate: $now,
                result: "SUCCESS"
              }]
            }' > devlake-payload.json
          curl -fsSL -X POST "$DEVLAKE_WEBHOOK_URL" \
            -u "$DEVLAKE_BASIC_AUTH" \
            -H 'Content-Type: application/json' \
            --data-binary @devlake-payload.json
          echo "Posted to DevLake successfully."
```

Note: `ANTHROPIC_API_KEY` is always declared in the env block — when the secret is unset (semantic disabled), the env var is empty and the script skips semantic scoring automatically.

If the file already exists, ask the user before overwriting.

### Step 11 — Print the combined checklist

Output exactly this to the user:

```
✓ AI Attribution Hooks installed.
  Claude Code and Cursor will snapshot AI output on every file edit.
  Your git commits will be stamped with an AI vs human line breakdown automatically.
  Requires Git and Python 3 on PATH. Hooks never block commits (all failures exit silently).

✓ Template Code Metrics scaffolded.

Still to do:
  [ ] Set GitHub Actions secret DEVLAKE_WEBHOOK_URL
      Get the value from your admin (the webhook URL of the shared DevLake instance).

  [ ] Set GitHub Actions secret DEVLAKE_BASIC_AUTH
      Format: user:pass — typically devlake:<your-team's-password>

  [ ] (Only if you enabled semantic scoring)
      Set GitHub Actions secret ANTHROPIC_API_KEY
      An Anthropic API key with billing enabled.

  [ ] Commit the new files and push:
        git add .template-provenance.json .github/workflows/template-metrics.yml
        git commit -m "chore: add ct-code-metrics tracking"
        git push

Quick gh-cli secret setup (run from this repo):
  gh secret set DEVLAKE_WEBHOOK_URL --body "<paste-from-admin>"
  gh secret set DEVLAKE_BASIC_AUTH  --body "<paste-from-admin>"
  gh secret set ANTHROPIC_API_KEY   --body "<paste-your-key>"   # only if semantic enabled

After the first workflow run, this repo will appear in the shared Grafana dashboard.

Reference: https://github.com/codeandtheory/ct-github-code-metrics
```

### Step 12 — (Optional) Smoke-test locally

Offer to run a smoke test:

> "Want me to download the metric script and run it locally so we can see what the current template_pct will be?"

If yes:
- `gh api repos/codeandtheory/ct-github-code-metrics/contents/core/scripts/template-metrics.mjs --jq '.content' | base64 -d > /tmp/template-metrics.mjs`
- `node /tmp/template-metrics.mjs | jq '.percentages, .counts'`
- Show the user the output and a one-line interpretation: "This repo is currently X% template / Y% custom (Z LOC tracked)."

If no, just stop.

---

## Hard rules

- **Do not commit anything.** Create files, print the checklist, let the user review and commit.
- **Do not set secrets via `gh secret set` yourself.** Print the commands; values come from the admin.
- **Always validate the baseline SHA** before writing it into provenance — a bad SHA causes silent 100%-template numbers later.
- **Never modify files outside the repo root** beyond the scaffolded files. Don't touch existing code, configs, package.json, etc.
- **Never run `git add`, `git commit`, or `git push`** as part of this setup.
- If something fails (e.g. user cancels, no git repo present, etc.) stop cleanly and tell the user what's missing — don't leave half-written files.
