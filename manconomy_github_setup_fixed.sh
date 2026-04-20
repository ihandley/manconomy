#!/usr/bin/env bash
set -euo pipefail

# Manconomy GitHub issue bootstrap script
#
# What it does:
# - creates milestones
# - creates labels
# - creates issues
# - assigns issues to milestones
#
# Requirements:
# - curl
# - python3
#
# Usage:
#   export GITHUB_TOKEN="your_token_here"
#   ./manconomy_github_setup.sh
#
# Optional overrides:
#   export GITHUB_OWNER="ihandley"
#   export GITHUB_REPO="manconomy"
#   ./manconomy_github_setup.sh

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  if command -v security >/dev/null 2>&1; then
    GITHUB_TOKEN="$(security find-generic-password -a "$USER" -s "github-manconomy-token" -w 2>/dev/null || true)"
  fi
fi

: "${GITHUB_TOKEN:?Set GITHUB_TOKEN first, or save it in Keychain under service github-manconomy-token}"

GITHUB_OWNER="${GITHUB_OWNER:-ihandley}"
GITHUB_REPO="${GITHUB_REPO:-manconomy}"
GITHUB_API="https://api.github.com"

log() {
  printf '\n[%s] %s\n' "$(date '+%H:%M:%S')" "$*"
}

api() {
  local method="$1"
  local path="$2"
  local data="${3:-}"

  if [[ -n "$data" ]]; then
    curl -fsS -X "$method" \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      "$GITHUB_API$path" \
      -d "$data"
  else
    curl -fsS -X "$method" \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      "$GITHUB_API$path"
  fi
}

json_escape() {
  python3 -c 'import json, sys; print(json.dumps(sys.argv[1]))' "$1"
}

urlencode() {
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' "$1"
}

label_exists() {
  local name="$1"
  local encoded
  encoded="$(urlencode "$name")"

  if api GET "/repos/$GITHUB_OWNER/$GITHUB_REPO/labels/$encoded" >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

create_label() {
  local name="$1"
  local color="$2"
  local description="$3"

  if label_exists "$name"; then
    log "Label already exists: $name"
    return 0
  fi

  log "Creating label: $name"
  api POST "/repos/$GITHUB_OWNER/$GITHUB_REPO/labels" "$(cat <<JSON
{
  "name": $(json_escape "$name"),
  "color": $(json_escape "$color"),
  "description": $(json_escape "$description")
}
JSON
)" >/dev/null
}

get_milestone_number() {
  local title="$1"
  local response
  response="$(api GET "/repos/$GITHUB_OWNER/$GITHUB_REPO/milestones?state=all&per_page=100")"
  python3 -c '
import json, sys
wanted = sys.argv[1]
items = json.loads(sys.stdin.read())
for item in items:
    if item.get("title") == wanted:
        print(item.get("number"))
        break
' "$title" <<< "$response"
}

create_milestone() {
  local title="$1"
  local description="$2"
  local number
  number="$(get_milestone_number "$title")"

  if [[ -n "$number" ]]; then
    log "Milestone already exists: $title (#$number)"
    return 0
  fi

  log "Creating milestone: $title"
  api POST "/repos/$GITHUB_OWNER/$GITHUB_REPO/milestones" "$(cat <<JSON
{
  "title": $(json_escape "$title"),
  "description": $(json_escape "$description")
}
JSON
)" >/dev/null
}

issue_exists() {
  local title="$1"
  local response
  response="$(api GET "/repos/$GITHUB_OWNER/$GITHUB_REPO/issues?state=all&per_page=100")"
  python3 -c '
import json, sys
wanted = sys.argv[1]
items = json.loads(sys.stdin.read())
for item in items:
    if item.get("title") == wanted:
        print("yes")
        break
' "$title" <<< "$response"
}

create_issue() {
  local title="$1"
  local body="$2"
  local labels_csv="$3"
  local milestone_title="$4"
  local milestone_number=""

  if [[ "$(issue_exists "$title")" == "yes" ]]; then
    log "Issue already exists: $title"
    return 0
  fi

  if [[ -n "$milestone_title" ]]; then
    milestone_number="$(get_milestone_number "$milestone_title")"
  fi

  log "Creating issue: $title"
  python3 - <<'PY' \
    "$title" "$body" "$labels_csv" "$milestone_number" \
    > /tmp/manconomy_issue_payload.json
import json, sys

title = sys.argv[1]
body = sys.argv[2]
labels_csv = sys.argv[3]
milestone = sys.argv[4]

payload = {
    "title": title,
    "body": body,
    "labels": [x.strip() for x in labels_csv.split(",") if x.strip()],
}
if milestone:
    payload["milestone"] = int(milestone)

print(json.dumps(payload))
PY

  api POST "/repos/$GITHUB_OWNER/$GITHUB_REPO/issues" "$(cat /tmp/manconomy_issue_payload.json)" >/dev/null
}

log "Bootstrapping GitHub planning objects for $GITHUB_OWNER/$GITHUB_REPO"

# Labels
create_label "frontend" "1D76DB" "Client app and UI work"
create_label "backend" "5319E7" "API, server logic, and data access"
create_label "supabase" "0E8A16" "Supabase schema, RLS, functions, and storage"
create_label "infra" "FBCA04" "Tooling, CI, config, and deployment"
create_label "ai" "C2E0C6" "AI generation, prompts, and model integration"
create_label "auth" "BFDADC" "Authentication and access control"
create_label "mvp" "D4C5F9" "Required for first shippable version"
create_label "post-mvp" "F9D0C4" "Can wait until after the first release"
create_label "high-priority" "B60205" "Important foundational work"

# Milestones
create_milestone "Phase 1 – Setup & Infrastructure" "Repo structure, app bootstrap, Supabase setup, environment handling, and CI."
create_milestone "Phase 2 – Auth & Onboarding" "Authentication, verification, onboarding, neighborhoods, and invite flow."
create_milestone "Phase 3 – Listings" "Photo upload, AI listing draft, listing creation, feed, and detail screens."
create_milestone "Phase 4 – Trades & Credits" "Trade flow, messaging, dual confirmation, ledger, and wallet."
create_milestone "Phase 5 – Trust & Safety" "Ratings, reporting, blocking, moderation, and trust systems."
create_milestone "Phase 6 – Beta & Polish" "Notifications, search, realtime, analytics, and beta release prep."

# Issues
create_issue \
  "Setup repo structure" \
  "Create app/, supabase/, packages/, and workspace config." \
  "infra,mvp" \
  "Phase 1 – Setup & Infrastructure"

create_issue \
  "Bootstrap Expo app" \
  "Initialize Expo + TypeScript app and verify it runs locally." \
  "frontend,mvp" \
  "Phase 1 – Setup & Infrastructure"

create_issue \
  "Initialize Supabase project" \
  "Set up Supabase CLI, config.toml, and local development workflow." \
  "backend,supabase,mvp" \
  "Phase 1 – Setup & Infrastructure"

create_issue \
  "Create initial DB migration" \
  "Create the base schema for users, neighborhoods, listings, trades, messages, notifications, and credits_ledger." \
  "backend,supabase,mvp" \
  "Phase 1 – Setup & Infrastructure"

create_issue \
  "Configure environment variables" \
  "Add .env.example and environment handling for app and backend services." \
  "infra,mvp" \
  "Phase 1 – Setup & Infrastructure"

create_issue \
  "Setup CI pipeline" \
  "Add GitHub Actions for linting, typechecking, and basic test execution." \
  "infra,mvp" \
  "Phase 1 – Setup & Infrastructure"

create_issue \
  "Implement auth flow" \
  "Add signup, login, logout, and session restore using Supabase auth." \
  "auth,backend,mvp" \
  "Phase 2 – Auth & Onboarding"

create_issue \
  "Add phone verification gate" \
  "Block access to core marketplace functionality until the user has completed phone verification." \
  "auth,mvp" \
  "Phase 2 – Auth & Onboarding"

create_issue \
  "Create onboarding flow" \
  "Collect neighborhood and basic profile information during first-run onboarding." \
  "frontend,mvp" \
  "Phase 2 – Auth & Onboarding"

create_issue \
  "Create user profile record" \
  "Create the user profile row and required defaults at signup or first session." \
  "backend,supabase,mvp" \
  "Phase 2 – Auth & Onboarding"

create_issue \
  "Add invite code system" \
  "Support optional invite-only access control for early rollout." \
  "backend,mvp" \
  "Phase 2 – Auth & Onboarding"

create_issue \
  "Implement photo upload" \
  "Upload listing images to Supabase Storage and return durable file references." \
  "frontend,supabase,mvp" \
  "Phase 3 – Listings"

create_issue \
  "Create AI listing draft function" \
  "Build an edge function that uses OpenAI to generate a suggested title, description, condition, and credit value from uploaded photos." \
  "ai,backend,mvp" \
  "Phase 3 – Listings"

create_issue \
  "Create listing API" \
  "Persist a listing from the AI draft or user-edited form and publish it to the feed." \
  "backend,mvp" \
  "Phase 3 – Listings"

create_issue \
  "Build feed screen" \
  "Display local listings for the user’s neighborhood in a browseable feed." \
  "frontend,mvp" \
  "Phase 3 – Listings"

create_issue \
  "Build listing detail screen" \
  "Show listing images, description, condition, credits, seller info, and trade action." \
  "frontend,mvp" \
  "Phase 3 – Listings"

create_issue \
  "Implement trade request" \
  "Create a trade request flow that validates listing state and buyer balance." \
  "backend,mvp" \
  "Phase 4 – Trades & Credits"

create_issue \
  "Implement trade accept/decline" \
  "Allow the seller to accept or reject a trade request and transition trade state." \
  "backend,mvp" \
  "Phase 4 – Trades & Credits"

create_issue \
  "Implement messaging system" \
  "Add a basic chat channel for trade coordination between buyer and seller." \
  "backend,frontend,mvp" \
  "Phase 4 – Trades & Credits"

create_issue \
  "Implement dual confirmation" \
  "Require buyer and seller confirmation before finalizing a trade." \
  "backend,mvp" \
  "Phase 4 – Trades & Credits"

create_issue \
  "Implement credit ledger" \
  "Create an immutable double-entry ledger and enforce server-authoritative credit movement." \
  "backend,supabase,high-priority,mvp" \
  "Phase 4 – Trades & Credits"

create_issue \
  "Build wallet screen" \
  "Display balance, spendable amount, and transaction history derived from the ledger." \
  "frontend,mvp" \
  "Phase 4 – Trades & Credits"

create_issue \
  "Implement ratings system" \
  "Allow users to rate each other after completed trades." \
  "backend,mvp" \
  "Phase 5 – Trust & Safety"

create_issue \
  "Add reporting/blocking" \
  "Allow users to report listings or users and block future interaction." \
  "backend,mvp" \
  "Phase 5 – Trust & Safety"

create_issue \
  "Implement AI seal logic" \
  "Mark listings as AI-verified or trusted based on business rules." \
  "ai,backend,post-mvp" \
  "Phase 5 – Trust & Safety"

create_issue \
  "Add moderation tools" \
  "Create basic admin moderation capability for reviewing flagged content." \
  "backend,post-mvp" \
  "Phase 5 – Trust & Safety"

create_issue \
  "Add push notifications" \
  "Notify users about messages, trade status changes, and important marketplace events." \
  "frontend,post-mvp" \
  "Phase 6 – Beta & Polish"

create_issue \
  "Implement search/filter" \
  "Add basic listing search and filtering in the feed." \
  "frontend,post-mvp" \
  "Phase 6 – Beta & Polish"

create_issue \
  "Add realtime updates" \
  "Add realtime trade status and messaging updates using Supabase Realtime." \
  "backend,supabase,post-mvp" \
  "Phase 6 – Beta & Polish"

create_issue \
  "Add analytics tracking" \
  "Integrate product analytics for onboarding, listing creation, and trade completion flows." \
  "infra,post-mvp" \
  "Phase 6 – Beta & Polish"

create_issue \
  "Prepare beta release" \
  "Set up internal testing or TestFlight distribution and validate the release checklist." \
  "infra,post-mvp" \
  "Phase 6 – Beta & Polish"

log "Done. Labels, milestones, and issues are ready in $GITHUB_OWNER/$GITHUB_REPO."
