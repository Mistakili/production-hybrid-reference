# Lesson 02: AppDelegate Overwritten After `cap sync`

**Source:** Shipping [Veminder](https://github.com/Mistakili)  
**Module:** AppDelegate / Capacitor native bridge  
**Recipe:** [`recipes/appdelegate/`](../../recipes/appdelegate/)

---

## Problem

Custom `AppDelegate.swift` edits (push token forwarding, deep link handling) disappear or partially revert after running `npx cap sync` or updating `@capacitor/ios`.

## Symptoms

- Push notifications stop working immediately after `cap sync`
- `git diff ios/` shows unexpected `AppDelegate.swift` changes
- Re-adding fixes works until next sync
- Team members lose fixes when pulling and syncing

## Hours lost

**~6 hours** — including one incident where a TestFlight build shipped without the fix.

## Root cause

`npx cap sync` copies the Capacitor iOS template and can overwrite native files that aren't managed through a persistent workflow. Manual edits to `AppDelegate.swift` are not automatically preserved across Capacitor version bumps.

## Investigation

1. Ran `npx cap sync` and diffed `ios/App/App/AppDelegate.swift` before/after
2. Checked Capacitor migration guides for iOS 6+ SPM changes
3. Found team's fix existed only in one developer's working tree, not documented

## Fix

1. **Canonical source in repo** — Keep production `AppDelegate.swift` in `recipes/appdelegate/` and `templates/AppDelegate.swift`
2. **Post-sync restore script** — `scripts/restore-appdelegate.sh` copies canonical file after sync
3. **Diff check in CI** — Fail if `AppDelegate.swift` missing required Capacitor notification posts
4. **Document in README** — "After every `cap sync`, run restore script"

See [`recipes/appdelegate/README.md`](../../recipes/appdelegate/README.md) for full workflow.

## Why documentation wasn't enough

- Capacitor "Updating" docs mention checking native changes but don't emphasize AppDelegate fragility
- Easy to assume `cap sync` is non-destructive like `npm install`

## Lessons learned

- Treat `ios/` manual edits like **patches**, not one-time setup
- Keep a repo-owned canonical copy outside `ios/` that survives sync
- Never assume CI builds the same `AppDelegate` your machine has

## Future prevention

- [ ] `scripts/restore-appdelegate.sh` in package.json `postcap:sync` hook
- [ ] Production lesson linked from `apps/mobile/README.md`
- [ ] PR template reminder: "Did you run cap sync? Restore AppDelegate?"