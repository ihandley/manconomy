.PHONY: \
	build \
	clean \
	dev \
	fix \
	format \
	help \
	install \
	checkpoint \
	lint \
	lint-fix \
	session-handoff \
	start \
	supabase-reset \
	supabase-start \
	supabase-status \
	supabase-stop \
	test \
	typecheck

# Lookup a secret from macOS Keychain
# Usage:
#   $(call keychain,SUPABASE_URL_PRD)
keychain = $(shell security find-generic-password -a "$$USER" -s "$(1)" -w 2>/dev/null)

help:
	@echo "Available commands:"
	@echo "  make build              Build the workspace"
	@echo "  make clean              Remove local build/cache artifacts"
	@echo "  make dev                Start Supabase and the web app dev server"
	@echo "  make fix                Run lint/prettier auto-fixes"
	@echo "  make format             Format files with Prettier"
	@echo "  make install            Install dependencies"
	@echo "  make issue-checkpoint N=8 Start or checkpoint an issue session"
	@echo "  make lint               Run lint checks"
	@echo "  make lint-fix           Run lint auto-fixes"
	@echo "  make session-handoff N=8 Compatibility alias for issue-checkpoint"
	@echo "  make start              Start the built web app"
	@echo "  make supabase-start     Start local Supabase"
	@echo "  make supabase-stop      Stop local Supabase"
	@echo "  make supabase-reset     Reset local Supabase DB"
	@echo "  make supabase-status    Show local Supabase status"
	@echo "  make test               Run tests"
	@echo "  make typecheck          Run workspace typecheck"

build:
	pnpm build

clean:
	rm -rf apps/web/.next
	rm -rf apps/mobile/.expo
	rm -rf node_modules/.cache
	rm -rf apps/web/playwright-report
	rm -rf apps/web/test-results

dev:
	@echo "Starting Supabase..."
	supabase start >/dev/null 2>&1 || true
	@echo "Manconomy DEV — http://localhost:3000"
	pnpm --filter web dev

fix: lint-fix format

format:
	pnpm format

install:
	pnpm install

checkpoint:
	$(eval N := $(word 2,$(MAKECMDGOALS)))
	@test -n "$(N)" || (echo "Usage: make checkpoint <issue-number>" && exit 1)
	./scripts/issue-checkpoint.sh $(N)

%:
	@:

lint:
	pnpm lint

lint-fix:
	pnpm lint --fix

session-handoff: issue-checkpoint

start:
	pnpm --filter web start

supabase-start:
	pnpm supabase:start

supabase-stop:
	pnpm supabase:stop

supabase-reset:
	pnpm supabase:reset

supabase-status:
	pnpm supabase:status

test:
	pnpm test

typecheck:
	pnpm typecheck
