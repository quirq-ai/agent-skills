# quirq infra (qq): the facts

The fact sheet for the narrator, the storyboard and the diagram designer of the ~2.5 minute
explainer. Checked on **2026-10-05, 05:45 UTC** against anonymous clones of the 13 live
quirq-ai infra repos (each repo's `main` at the SHA in the table below), `git ls-remote`, the
product repos at `/home/claude/xo-space` and `/home/claude/innernet`, and the earlier sources
(v0.md, v0-launch.md, v1.md, v2.md, ci-cd-vision.md, org/naming.md, the one-pager doc, the deck
and the infra map). When those sources and this file disagree, this file follows the repos.
The GitHub API and Actions pages return 403 through the proxy, so nothing here comes from the
API. A claim marked **UNVERIFIED** is one I could not check; leave it out of the film or say it
loosely.

Path shorthand: `IC` = infra-config, `cfg/` = `infra-config/config/`.

## Numbers at a glance

| Fact | Value | Source |
| --- | --- | --- |
| Infra repos | 13, all public, all Apache-2.0 | each repo's `LICENSE`; v0-launch.md §1 |
| Product repos served | 2: xo-space (Python) and innernet (Next.js) | `cfg/repos.toml:13-47` |
| Builders in config | 6: presubmit, post-submit, canary-deploy for each product | `cfg/pipelines.toml:40-105` |
| Required checks (blocking) | 2: `xo-space-presubmit`, `innernet-presubmit` | `cfg/pipelines.toml:48,88` |
| v0 work items | 51 | v0.md "Count"; v0-launch.md §6 |
| Required approvals on `main` | **0** (one global value) | `gate/settings/github.toml:15` |
| Merge method | squash, every repo | `cfg/gate.toml:14`; `gate/settings/github.toml:14` |
| Admission bar for a blocking builder | p50 under 15 min, finishes under 40 | one-pager; `cfg/gate.toml [admission]` |
| Daily canary | 06:17 UTC (`17 6 * * *`) | `release/.github/workflows/canary.yml:13`; `cfg/channels.toml:25` |
| Canary watchdog | 09:43 and 13:43 UTC | `release/.github/workflows/canary-watchdog.yml:7-8` |
| lkgr recomputed | every 10 min (`7-59/10 * * * *`) | `release/.github/workflows/lkgr.yml:12` |
| Gardener tree status | every 5 min (`2-59/5 * * * *`) | `gardener/.github/workflows/tree-status.yml:34` |
| Perf run | every 30 min (`17,47 * * * *`) | `perf/.github/workflows/perf.yml:24` |
| Daily `qq sync` test on both repos | 06:17 UTC | `depot/.github/workflows/e2e-sync.yml:14` |
| Toolchain roller | weekly, Monday 06:23 UTC | `rollers/.github/workflows/roll-toolchains.yml:23` |
| Scorecard | every 6 h at :23 | `test-pipelines/.github/workflows/scorecard.yml:7` |
| Auto-revert cap | 10 reverts created per rolling 24 h, all repos together | `cfg/auto_revert.toml:17,19` |
| Build-break reverts that may auto-land | at most 4 a day, culprit under 6 h old | `cfg/auto_revert.toml:31-32` |
| Test-failure reverts that may auto-land | 0 (always proposed) | `cfg/auto_revert.toml:36` |
| Repos allowed to auto-land reverts | none (`auto_land_repos = []`) | `cfg/auto_revert.toml:27` |
| Toolchains | CPython 3.14.8; Node.js 24.21.0 + pnpm 11.28.2 | `toolchains/promoted.toml` |
| Toolchain platforms | 1: linux-x86_64 | `toolchains/tools/qqtc.py:49` |
| innernet's Next.js | `^16.3.8` | `innernet/package.json:22` |
| Pinned qq version (both products) | 0.1.0 | `innernet/infra/repo.toml [qq]`; `xo-space/infra/repo.toml:7` |
| lkgr moves so far | 3 per product repo (17:49, 20:47, 23:38 UTC on 4 Oct) | release `release-state` branch, head `f89a9449fc512c05a0b91a11551d9ade0dfc7aa1` |
| Canary releases so far | **0** (first scheduled run: today, 06:17 UTC) | same branch: only `pointers/<repo>/lkgr.json`, no canary pointer |
| Perf records so far | innernet build size 17, innernet search 6, xo-space server start 7 | perf `perf-data` branch, head `28628f3c33d2b5d1373e7b378eb55ea97827983b` |
| Example perf numbers | xo-space server start ~2.0 s; innernet search median ~18 ms (30 samples); innernet build total 18.6 MB | latest records on `perf-data` |
| Dev promotion rule | human owner, after 24 h soak and 3 green canaries | `cfg/channels.toml:42-44` |
| Stable promotion rule | suraj (policy-owner), 72 h soak, rollout 10/50/100 % | `cfg/channels.toml:55-59` |
| Alpha | 10 to 15 internal users, four weeks, pilot of 3 to 5 first | `vision/quirq-infra/alpha-app/src/App.tsx:136,243,265` (local file, not in a repo) |

## What qq is

quirq infra, "qq" for short, is the build-and-ship system for every quirq-ai repo, modelled on
how Chromium's infrastructure works but running on GitHub. A product repo writes one file by
hand, its manifest `infra/repo.toml`, which pins the exact toolchains (by digest) and lists what
to build. Everything else is generated or run from 13 small public infra repos, each with one
job. One of them, `infra-config`, holds every policy as reviewed TOML: which repos exist, which
checks must pass, how many reverts agents may make, who may promote a release. The rest apply
that policy: they check each change before it lands, watch `main` after it lands, keep a "last
known good" pointer, and ship a daily canary. Agents do most of the routine work; a human owns
policy and every promotion beyond canary. Core tools never name a language: only `recipes`
(build adapters) and `toolchains` know about Python or Node.

## The path of a change, end to end

Stations for the diagram, in order. "Live" means running on 2026-10-05; "merged" means the code
is in the repo but has not been seen working end to end.

| # | Station | What happens | Status |
| --- | --- | --- | --- |
| 1 | Set up | `git clone https://github.com/quirq-ai/depot ~/depot`, put `~/depot/bin` on PATH. Inside a product repo `qq` installs and runs the version the manifest pins | **Live** (depot README:21-29) |
| 2 | Get toolchains | `qq sync` downloads each pinned toolchain from public ghcr, checks its digest, links it under `.qq/` | **Live on Linux x86_64**: depot's `e2e-sync` runs it daily for both repos with no credentials (depot README:160). Fails on Macs |
| 3 | Build and test locally | `qq build`, `qq test` run the targets through `recipes`; JUnit lands in `.qq/out` | **Merged**; CI does not use this path yet |
| 4 | Presubmit | Opening a PR runs `qq-<repo>-presubmit.yml`, generated by infra-config: a drift check (workflow not hand-edited), then fetch, build, test, then the result sink stores every JUnit result in test-pipelines | **Live** on both repos. Builders use interim steps (`setup-node`, `pnpm@10`, `pnpm typecheck` for innernet), not recipes or the promoted toolchains (`innernet/.github/workflows/qq-innernet-presubmit.yml:21-45`) |
| 5 | Verdict | `qq try` returns a run ID at once and delivers the verdict later; `qq status` gives it now (exit 0 pass, 1 refused, 3 pending). The gate decides from config which checks are required | **Merged**; live verdicts depend on the rulesets (station 6) |
| 6 | Merge queue | `qq land` queues the PR once the gate passes; GitHub's merge queue re-tests the exact merge result (`merge_group`) and squash-merges | **Partly verified.** gate README:102 says suraj ran `scripts/apply.sh` at gate 6610664, "which applied the repo rulesets" (qq-main has a `merge_queue` rule, `gate/src/qqgate/backends/github.py:162`). Whether the queue is enforcing on xo-space and innernet, and a red PR being refused, is **UNVERIFIED** (API 403; no red-PR demo found) |
| 7 | Post-submit | `qq-<repo>-postsubmit.yml` runs on every push to `main`, never cancelled | **Live** on both repos |
| 8 | Gardener (tree health) | Every 5 min: publishes tree status (open/closed) per repo; if main goes red it groups failures, bisects to the culprit and prepares a clean revert within the caps | Tree status **live** (gardener `tree-status` branch, head `6733e4c7940f6f25f3ca369d4d2357629c7d6764`: "innernet open, xo-space open"). Reverts **proposed only, and not yet opened**: no gardener GitHub App, so it reports what it would do |
| 9 | lkgr | Every 10 min, release moves `lkgr` to the newest main commit whose post-submit builders are all green | **Live** in release's own record (`release-state` branch). No git ref is written in the product repos yet (no release executor identity; `"mirrored": false` in `pointers/innernet/lkgr.json`) |
| 10 | Canary | Daily at 06:17 UTC: take lkgr, build, run the full tests, re-run property tests as a fuzz smoke, deploy on the Actions runner, probe, then move `channels/canary`. A failing stage holds the commit and keeps the previous canary; a quiet day is a recorded no-op | **Merged, never run.** First scheduled run is 2026-10-05 06:17 UTC; at 05:45 UTC no canary record exists |
| 11 | Dev | Weekly, from canary, after a human owner approves (24 h soak, 3 green canaries) | **Proposed (v1).** Declared in `cfg/channels.toml`; release refuses any channel that needs approval, soak or health signals |
| 12 | Stable | From dev, approved by suraj, staged 10/50/100 % | **Proposed (v2, priority P4)** |
| 13 | Install from a channel | `qqinstall resolve --repo xo-space --channel canary` gives the commit and digest; test installs check out exactly that | **Merged**; exits 3 until the first canary ships |

Alongside the path:

- **rollers (dependency rolls).** Dependabot config and the `qq-roll-land.yml` check are live in
  both product repos. The first Dependabot roll has merged: innernet #43, "roll: bump typescript
  from 5.9.3 to 7.0.2" (`8f383a3d6c28f1e4495ff177efe70dca43d17604`), merged by a person.
  Toolchain roll PRs come from the rollers App "quirqer"; none needed yet. Auto-land is off.
- **perf.** Records innernet build size and one benchmark per product repo for each new main
  commit, on the `perf-data` branch. **Live**, a record only, never a gate, no alerts in v0.
- **test-pipelines.** Every builder's JUnit goes into a write-once store; a scorecard runs every
  6 h. Retry-then-compare-with-base exists in code but is **off** in product builders.

## The 13 infra repos

Label = on-screen job, 10 words or fewer. SHA = `main` on 2026-10-05.

| Repo | On-screen label | Talks to (edges) | v0 status | `main` SHA |
| --- | --- | --- | --- | --- |
| infra-config | Every policy, as reviewed config files | → gate, gardener, release, installer, rollers (policy, each at its own pinned commit); → product repos (generated `qq-*.yml` by PR) | Live: validates, generates, delivers | `310e3264f5de3cd9822b3a4712ae0a372b97dac3` |
| depot | The `qq` command developers type | → sync (manifest), recipes (build/test), gate (verdict for land/status) | Live (`qq sync` daily); land/try merged | `741967cc7fba1e486a65856b05c4abb2b1486b8b` |
| sync | The manifest format and its only reader | → depot, recipes, gate, rollers, perf | Merged, used by depot and rollers | `d97e2f747cfa7dd04fac3cd8e9973eb7eab091dd` |
| recipes | How to build each kind of project | ← depot; → release, perf; → remote-build (not yet called) | Merged; not yet used by CI builders | `db6ce0a19ea0adb6bc71cd553524064bdd18d5b0` |
| toolchains | Pinned Python and Node, built and verified | → rollers → product manifests (`promoted.toml` digests) | Live: 2 toolchains on public ghcr | `44f8f959458eab59baf46cbae5866a36657f7eeb` |
| remote-build | Where build steps run, and their cache | ← recipes (action shape) | Merged; not yet called by qq | `62b2f04865ffbba5dafd0ab23ce4c1ae253de33e` |
| test-pipelines | Stores every test result; judges failures | ← product CI, perf; → gardener; ← gardener (failure records) | Live sink and scorecard; retry-compare off | `a642399644ee4a463168773cacd5eabd48ac5a16` |
| gate | Decides what must pass before landing | ← infra-config; → product repos (required checks, rulesets) | Repo rulesets applied per README; org rules off | `c3721365186a35c4b2b5acdc0635e281e754ac13` |
| gardener | Keeps main green: tree status, culprits, reverts | ← test-pipelines; → release (what "green" means) | Tree status live; reverts proposed, not opened | `bf7d24d0fd81ec02c51051e63f46971455b596f2` |
| rollers | Keeps dependencies and toolchains up to date | ← toolchains, infra-config; → product repos (roll PRs) | Live Dependabot + land check; auto-land off | `4285aa4dd3211eda2df28d2bd4bebb2267a01f0d` |
| release | Last known good, daily canary, rollback | ← gardener, infra-config; → installer (`channels.json`), depot (`qq channel rollback`) | lkgr live; canary first run today | `83ef917771375ae0d1ed51829c9e762a57e01e7e` |
| installer | Lets installs follow a channel, not main | ← release, infra-config | Merged; resolves nothing until first canary | `d39f30201c32d41052f61d2e592bc0fd7f295440` |
| perf | Records speed and size of every commit | ← sync, recipes; → test-pipelines | Live records every 30 min | `d1d9765ea65df2b7d4824fd3845fdf371907857c` |

Edge sources: one-pager "How the repos fit together", the deck's `flows` slide, and the pins
files (`gate/pins.toml`, `gardener/pins.toml`, `release/pins.toml`, `installer/pins.toml`,
`rollers/infra-config.commit`). Diagram tip: policy flows **down** from infra-config, results
flow **back up** through test-pipelines, and every link is a pinned commit, never copied code.
Each tool reads infra-config at a different pinned commit (gate `12c1f4f`, gardener `bf3ad29`,
release and installer `a698da4`), so a policy change reaches a tool only when its pin is bumped.

Chromium counterparts (for a one-word caption): infra-config = infra/config + lucicfg, depot =
depot_tools, sync = gclient/DEPS, recipes = recipes, toolchains = CIPD/3pp, remote-build =
goma/RBE, test-pipelines = ResultDB + LUCI Analysis, gate = LUCI CV / commit queue, gardener =
sheriffs + LUCI Bisection, rollers = AutoRoll, release = V8 lkgr finder + promote.py, installer
= Omaha/chrome updater, perf = perf dashboard + Pinpoint (v0-launch.md §1; deck `repos` slide).

## Developer-facing commands that exist

All in `quirq-ai/depot` (`bin/qq`, `src/qqdepot/`), listed in depot README unless noted.

| Command | What it does | Where |
| --- | --- | --- |
| `git clone https://github.com/quirq-ai/depot ~/depot` then `export PATH="$HOME/depot/bin:$PATH"` | Install (needs git, Python 3.11.4+) | depot README:23-29 |
| `qq --version` | Shows (and on first use installs) the pinned qq | depot README:29 |
| `qq fetch https://github.com/quirq-ai/xo-space` | Clone a repo, then `qq sync` in it | depot README:78 |
| `qq sync` | Fetch every pin, check its digest, link it | depot README:79 |
| `qq build [TARGET ...]` / `qq test [TARGET ...]` | Build / build and test through recipes | depot README:103-104 |
| `qq upload [--title T] [--draft]` | Push the branch, open or update its PR | depot README:115 |
| `qq try [CHANGE] [--notify CMD]` | Upload, print a run ID, exit; verdict pushed later | depot README:116 |
| `qq land [CHANGE] [--notify CMD]` | Land once the gate passes (merge queue); returns at once | depot README:117 |
| `qq status [CHANGE]` | Verdict now: exit 0 pass, 1 refused, 3 pending | depot README:118 |
| `qq channel rollback ...` | Point a channel back at its previous value | release README:89 (plugin from release, needs qqrelease installed in qq's environment) |
| `qqinstall resolve --repo xo-space --channel canary` | Commit and digest a channel names | installer README:26 |
| `qqcfg validate [--todos]` | Check all policy; list empty owners and open TODOs | infra-config README; one-pager |

The alpha "install one-liner" is a longer pasteable subshell (checks git and Python, clones or
fast-forwards `~/depot`, runs `qq --version`, hints at PATH and `gh auth login`):
`vision/quirq-infra/alpha-app/src/commands/setup.sh`. Its companion `get-repo.sh` runs
`qq fetch` into `~/quirq/<repo>` (or `qq sync` if already cloned). Both live in a local folder,
not a repo. There is **no** `curl | sh` installer and no `qq run`, `qq roll`, `qq failure` or
`qq postmortem` command (those are v1 items).

## Known v0 limits the film must state honestly

1. **Macs can't finish `qq sync` yet.** Toolchains are built for linux-x86_64 only
   (`toolchains/tools/qqtc.py:49`), so on macOS sync stops with "no pin for platform
   macos-arm64" (`sync/src/qqsync/pins.py:83`; alpha app step 4). Mac users install Node 24 +
   pnpm or Python 3.14 themselves.
2. **The canary has never run.** First scheduled run: 06:17 UTC on 2026-10-05. At 05:45 UTC
   the `release-state` branch holds only lkgr pointers (3 moves per repo) and no canary record.
   Even when it runs, it moves the pointer in release's own record; no `channels/canary` git ref
   is written in the product repos until a release executor GitHub App exists.
3. **Gardener reverts are only proposed, and not even opened yet.** `auto_land_repos = []`
   (`cfg/auto_revert.toml:27`), test-failure reverts are never auto-landed (`:36`), and without
   the gardener's own GitHub App it only reports what it would do (research infra-map
   gardener page; alpha app t13).
4. **Retry-then-compare-with-base is not live.** Product builders call the sink with rerun off
   (one-pager; infra-config status in research infra-map).
5. **`qq land` can't queue PRs on xo-space.** `allow_auto_merge = false` for xo-space, by
   suraj's choice: its PRs land by his "Merge when ready" (`gate/settings/github.toml:116`);
   `qq land` uses `gh pr merge --auto` (`depot/src/qqdepot/backends/github.py:129`). The alpha
   page tells users to click "Merge when ready" instead (alpha app `App.tsx:184`).
6. **CI doesn't run through qq's own parts yet.** Generated builders install tools with
   `setup-node`/`setup-python` and run interim commands; innernet CI uses pnpm 10 while qq uses
   pnpm 11.28.2, and innernet's "test" is a typecheck (it has no tests).
7. **No human approval is required on PRs.** `required_approvals = 0` for every repo; owner
   review of tests and `infra/` (V0-GAT-03) is not built.
8. **Nothing lands by itself.** Reverts proposed, Dependabot and toolchain auto-merge off; a
   person merges every roll.
9. **Thin signals.** perf takes one measurement per commit on shared runners, no baseline, no
   alerts; health uses CI signals only (PostHog is v1).
10. **Open values.** Three `TODO(suraj, v0)` remain: the canary hour (`cfg/channels.toml:25`),
    whether the cap of 10 counts reverts created or only auto-landed (`cfg/auto_revert.toml:18`),
    and the monthly compute ceiling, still 0 (`cfg/org.toml:62`).
11. **GitHub only, GitHub Free.** Org-wide rulesets are all off because quirq-ai is on GitHub
    Free (gate README:102). Launchpad (quirq's own cloud) is a v2 idea.
12. **Enforcement not yet demonstrated.** No red-PR-refused demo found; merge-queue enforcement on
    the product repos is UNVERIFIED (see station 6).

## Decisions worth one line in the film

- **Public repos only** (D2): it also gives GitHub's merge queue without Enterprise
  (v0-launch.md §1; `qqcfg.py` invariant).
- **Agents land the routine, humans own the rules.** Agents may land clean reverts, dependency
  rolls and docs alone, and promote to canary; policy changes and stable promotion need suraj
  (`cfg/gate.toml` change classes; deck `policies` slide). In v0, a person still merges reverts
  and rolls.
- **Canary → dev → stable.** Canary daily by agents, dev weekly with a human owner, stable
  biweekly by suraj (`cfg/channels.toml`). Only canary is switched on in v0.
- **Rules config cannot loosen** (hard-coded in `tools/qqcfg.py`): stable needs the policy
  owner, canary is agents-only, at most 10 auto-reverts a day, no secrets for builders that run
  PR code, public repos only (one-pager).
- **Write one manifest, get the rest generated**; adding a repo in a known language is two
  config PRs and a settings run, no tool code changes (deck `add-repo` slide).
- **Alpha:** 10 to 15 internal users land their innernet or xo-space work through qq for four
  weeks, pilot of 3 to 5 first; decided 5 October that the canary is part of the alpha
  (alpha app). Whether invites have gone out is UNVERIFIED.
- **Squash merges everywhere** (suraj, 2026-10-04, `cfg/gate.toml:14`).
- **suraj is now the named owner** of org config and every infra repo's policy and trust paths
  (infra-config #30; CODEOWNERS PRs in all 13 repos, 2026-10-04 ~22:40 UTC).

## Naming

A repo's **name says its area, its description says its job, and an org property says which bot
owns it** (naming.md, adopted 2026-10-04). Products use their brand name (xo-space, innernet);
new infra repos will be `infra-<thing>`, but the 13 keep their names for v0; `qq` is the CLI and
the prefix for generated files (`qq-innernet-presubmit.yml`, `.qq/`); bots are `quirq-<repo>`
(rollers keeps "quirqer").

## What changed since the earlier sources

- **Settings run done.** The one-pager (2026-10-04 21:15 UTC) and deck said the gate settings
  run was "not yet confirmed". gate README:102 now says suraj ran `apply.sh` at 6610664 and the
  repo rulesets are applied (org rulesets off, GitHub Free). Live enforcement still UNVERIFIED.
- **Owners named.** The one-pager said every owners list was empty and 11 repos had empty
  CODEOWNERS. Now `cfg/org.toml` names `@sharmasuraj0123` throughout and all 13 repos have
  CODEOWNERS on policy and trust paths. V0-GAT-03 (author can't approve tests) is still not built.
- **Redeliveries merged.** xo-space #220 (`14b21a41668bc8124b4cf5cf9cd59fb44dc7d419`) and
  innernet #44 (`b849f8d`) merged; the first Dependabot roll (innernet #43) merged.
- **lkgr kept moving:** third advance for both repos at 23:38 UTC on 4 Oct.
- **toolchains packages public:** rollers' research page says an anonymous pull works
  (checked 5 Oct); promotion-gate becomes a required check at the next settings apply.
- Research map source checked at quirq-ai/research `87d67ef2670227085308c2d92dd2e7f392745769`
  (`infra/output/app/infra-map/src/pages/*.json`); its per-repo SHAs match the mains above.

## Update, 2026-10-05 07:20 UTC (after the first canary)

Checked against release `release-state` at `d08a2fd01799d362da2d956e5122053f75cf8e23`
("canary report 2026-10-05"):

- **The first canary ran and shipped both products.** `reports/2026-10-05.md`: "2 shipped,
  0 held, 0 no-op". innernet `8f383a3d6c28` (06:59:17 UTC) and xo-space `14b21a41668b`
  (06:59:21 UTC); all stages ok (build, verify, fuzz-smoke with 1000 examples, deploy-probe).
  Run: release Actions run 37274774607. `pointers/<repo>/channels/canary.json` exist, still
  `"mirrored": false` (no git ref written in the product repos).
- Reported by the coordinator review, **not checked here** (Actions pages are 403): the run was
  started by hand at 06:54 UTC because GitHub did not fire the 06:17 schedule; lkgr's 10-minute
  schedule is being throttled by GitHub and a daily backstop covers it; the installer now
  resolves the canary channel (exit 0 against release-state d08a2fd); the merge queue is set up on
  main. The film therefore says "scheduled" for both schedules and does not claim who started
  the run.
- Supersedes above: "Canary releases so far 0" and limit 2 ("The canary has never run").
- The narrated film is 2:58 (voice recorded 2026-10-05; three lines re-taken after this update:
  04, 17, 18).

## Notes from the coordinator spot-check, 2026-10-05 08:33 UTC

- The gardener has not proposed a revert yet; the film shows how it is designed to work.
- Scene 16's CI row ("doesn't run through qq yet") is on screen for only about 1.3 s. Lengthen it
  if the film is re-cut.
- The narration describes qq as designed. Today the first canary was started by hand and recorded
  in release-state; the products' own canary refs move once the release App exists.
- The final renders are 3:01.8 (phone 720p, 14 MB; 1080p web, 138 MB).
