<p align="center">
  <img src="icon.png" alt="Navidrome Logo" width="21%" />
</p>

# Navidrome on StartOS

> **Upstream docs:** <https://www.navidrome.org/docs/>
>
> Everything not listed in this document should behave the same as upstream
> Navidrome. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

Navidrome is a self-hosted music streaming server with a web player and a
Subsonic-compatible API, so any Subsonic-compatible mobile or desktop app can
connect to it. See <https://github.com/navidrome/navidrome>.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

- **Image source**: upstream `deluan/navidrome` image, unmodified.
- **Architectures**: x86_64, aarch64.
- **Entrypoint**: default (`sdk.useEntrypoint()`). The image's entrypoint is
  the Navidrome binary itself — no bundled init system, so no `runAsInit`
  override is needed.

## Volume and Data Layout

- `main` (volume) → `/data`: Navidrome's SQLite database, cache, and
  generated config file (`ND_DATAFOLDER`/`ND_CONFIGFILE`). Also holds
  `store.json`, this package's own record of which music source(s) are
  selected.
- `/music`: **not** a StartOS-owned volume. Navidrome's music library
  (`ND_MUSICFOLDER`) is populated entirely by mounting other services' data
  read-only — see [Dependencies](#dependencies). Each selected source is
  mounted **scoped to a user-configured subfolder** (not the whole
  dependency volume) as its own subfolder (`/music/filebrowser`,
  `/music/nextcloud`); Navidrome scans `/music` recursively as a single
  library, so multiple sources simply appear as sibling folders. The
  subfolder path is set per-source via the **Select Music Sources** action
  and stored in `store.json` (`filebrowserSubpath`, `nextcloudSubpath`); it
  is required whenever that source is selected — see
  `startos/actions/mediaSources.ts` and `startos/main.ts`.
  - File Browser's `data` volume is mounted 1:1 at `/srv` in its own
    container, so a File Browser subpath is relative to that service's
    storage root directly (e.g. `Music`).
  - Nextcloud's `nextcloud` volume is mounted at `/var/www/html` — its
    **webroot**, not its data folder (`nextcloud-startos/startos/utils.ts`:
    `nextcloudMount`) — and `data/` is a subdirectory of that webroot
    (`ND_CONFIGFILE`-analogous `datadirectory` in Nextcloud's own
    `config.php`). So a Nextcloud subpath must start with `data/`, then the
    Nextcloud username, then `files/` (e.g. `data/admin/files/Music`). A bare
    `<username>/files/...` path (mirroring Nextcloud's on-disk data layout
    directly) is missing the `data/` prefix and fails to mount — StartOS's
    bind-mount only creates the mount target, not the source, so a
    nonexistent source subpath fails with `mount exited with exit status: 32`
    rather than mounting an empty directory.

## Installation and First-Run Flow

- Navidrome's own first-run signup screen is used unchanged: the first time
  you open the web interface, you create the admin account yourself (username
  + password). This package does not generate or store any admin credential.
- Before the service can start, a **critical setup task** ("Select where your
  music library is stored") requires choosing at least one music source
  (File Browser and/or Nextcloud) via the **Select Music Sources** action. The
  daemon refuses to start (throws an error surfaced in the service log) until
  a source is selected, since `/music` would otherwise be empty.

## Configuration Management

| StartOS-Managed                                     | Upstream-Managed                                                                                              |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Which dependency service(s) are mounted at `/music/*`, and `ND_MUSICFOLDER` pointing at that mount | Everything else — scan settings, transcoding, users, themes, Subsonic clients, playlists, library management |
| Whether scrobbles are sent to Multi-Scrobbler (`ND_LISTENBRAINZ_*`) | — |
| Whether "Recently Added" sorts by file mtime (`ND_RECENTLYADDEDBYMODTIME`) | — |
| Scanner cron schedule (`ND_SCANNER_SCHEDULE`), log level (`ND_LOGLEVEL`), session timeout (`ND_SESSIONTIMEOUT`) | — |

`startos/main.ts` sets `ND_MUSICFOLDER=/music` explicitly, matching both
`mounts`' mountpoint above and the image's own built-in default (confirmed
via `docker image inspect deluan/navidrome`) — kept explicit so the two stay
coupled rather than relying on an implicit match. Beyond that and the
image's other own defaults (`ND_DATAFOLDER=/data`,
`ND_CONFIGFILE=/data/navidrome.toml`, `ND_PORT=4533`), this package sets
`ND_LISTENBRAINZ_ENABLED` and `ND_LISTENBRAINZ_BASEURL` **only** when the
**Configure Navidrome** action has enabled scrobbling to Multi-Scrobbler —
see [Dependencies](#dependencies). `ND_RECENTLYADDEDBYMODTIME` is always
set, reflecting that same action's toggle (image default is `false`).

## Network Access and Interfaces

Both interfaces are bound to the same origin/port — Navidrome serves its
Subsonic API alongside the web player on one port.

| Interface     | Port | Protocol | Purpose                                           |
| ------------- | ---- | -------- | -------------------------------------------------- |
| Web Interface | 4533 | HTTP     | Browser access to the Navidrome player            |
| Subsonic API  | 4533 | HTTP     | URL to paste into Subsonic-compatible client apps |

## Actions (StartOS UI)

### Select Music Sources

- **Purpose**: choose which installed service(s) (File Browser, Nextcloud) Navidrome mounts read-only at `/music`, and which subfolder of each to scope the mount to.
- **Visibility**: always visible.
- **Availability**: any service status.
- **Inputs**: multi-select (at least one source required) plus a free-text subfolder path per source, relative to that dependency's volume root. The handler rejects the save if a selected source's subfolder is blank.
- **Outputs**: none (updates `store.json`; takes effect on next daemon start/restart).

### Import Existing Database

- **Purpose**: replace `/data/navidrome.db` with an uploaded database file (e.g. from another Navidrome instance), skipping a full library rescan and carrying over playlists, users, and play history.
- **Visibility**: always visible.
- **Availability**: `only-stopped` — avoids writing the SQLite file out from under a running daemon.
- **Inputs**: file upload (`.db` extension).
- **Behavior**: writes the uploaded file to `main` volume's `navidrome.db`, then removes any stale `navidrome.db-wal`/`navidrome.db-shm` so SQLite doesn't replay a WAL log against a database it doesn't match.
- **Caveat surfaced via the action's `warning`**: Navidrome stores each track by the exact path it was scanned at. The imported database only lines up with this instance's library if the File Browser/Nextcloud subfolder(s) configured in **Select Music Sources** are identical to what the source instance used. A mismatch isn't destructive — tracks just show as missing until rescanned.

### Configure Navidrome

- **Purpose**: scrobbling, library-display, and logging settings that map to Navidrome env vars, bundled into one action. Deliberately limited to settings with **no equivalent in Navidrome's own admin UI** — everything else (themes, per-user prefs, transcoding, playlists, etc.) stays upstream-managed; see [Configuration Management](#configuration-management).
- **Visibility**: always visible.
- **Availability**: any service status.
- **Inputs**:
  - "Scrobble to Multi-Scrobbler" (toggle, default off): enable scrobbling every play to the optional Multi-Scrobbler dependency, by pointing Navidrome's built-in ListenBrainz integration at Multi-Scrobbler's ListenBrainz-compatible submission endpoint instead of the real listenbrainz.org.
  - 'Sort "Recently Added" by File Modification Time' (toggle, default off): sets `ND_RECENTLYADDEDBYMODTIME`. Switches "Recently Added" from sorting by database-import time to sorting by each file's on-disk modification time — useful when importing an existing library.
  - "Scanner Schedule" (text, optional, blank by default): a cron expression for automatic library rescans (e.g. `0 */6 * * *`). Sets `ND_SCANNER_SCHEDULE`; blank omits the env var, leaving Navidrome's own default (scheduled scans disabled — the file-watcher still triggers scans on change).
  - "Log Level" (select: error/warn/info/debug/trace, default `info`): sets `ND_LOGLEVEL`, always explicitly.
  - "Session Timeout" (text, optional, blank by default): idle web-UI session length, e.g. `24h` or `45m`. Sets `ND_SESSIONTIMEOUT`; blank omits the env var, leaving Navidrome's own default (`48h`).
- **Behavior**: when scrobbling is enabled, `startos/main.ts` resolves Multi-Scrobbler's bridge address (imported from `multi-scrobbler-startos`'s `uiHostId`/`uiPort`) and sets `ND_LISTENBRAINZ_ENABLED=true` and `ND_LISTENBRAINZ_BASEURL=http://<bridge-address>/1/` on the daemon. If Multi-Scrobbler isn't installed or isn't running, the bridge address resolves to `null` and **both env vars are omitted** — Navidrome falls back to its own defaults (real ListenBrainz, or disabled if you've turned that off yourself) rather than being pointed at a dead address. `ND_RECENTLYADDEDBYMODTIME` and `ND_LOGLEVEL` are always set explicitly from their inputs; `ND_SCANNER_SCHEDULE` and `ND_SESSIONTIMEOUT` are only set when their text field is non-blank. Changing any setting restarts the daemon.
- **Outputs**: none (updates `store.json`; takes effect on next daemon start/restart).

## Backups and Restore

- **Included**: the `main` volume — database, cache, generated config, and `store.json` (so the media-source selection survives a restore).
- **Not included**: the music library itself, since it isn't our data — it belongs to whichever dependency service is mounted. Restore that service's own backup separately.
- **Restore behavior**: standard volume restore; no custom `restoreInit` logic beyond the SDK default.

## Health Checks

- **Web Interface**: `checkPortListening` on the web/API port. Reports ready once Navidrome binds its port; no HTTP-level check.

## Dependencies

All three are optional:

- **File Browser** (`filebrowser`) — `kind: exists`. Mounts its `data` volume read-only at `/music/filebrowser`. Selected as a music source via **Select Music Sources**.
- **Nextcloud** (`nextcloud`) — `kind: exists`. Mounts its `nextcloud` volume read-only at `/music/nextcloud`. Selected as a music source via **Select Music Sources**.
- **Multi-Scrobbler** (`multi-scrobbler`) — `kind: running`, `healthChecks: ['multi-scrobbler']`. Enabled as a scrobble destination via **Configure Navidrome**; this dependency is only declared while that toggle is on.

At least one of File Browser/Nextcloud must be selected via the **Select Music Sources** action before the daemon will start.

## Limitations and Differences

1. There is no way to point Navidrome at a music library outside of File Browser or Nextcloud — StartOS packages cannot mount an arbitrary host path.
2. Because `/music` is mounted read-only, Navidrome cannot write embedded tags, rename files, or fix permissions on your library — matching upstream's own read-only-mount recommendation.
3. Navidrome's built-in multi-library feature (separate libraries with per-user access) is not configured by this package; both mounted sources land in the single default library as sibling folders. You can still add additional libraries yourself from Navidrome's own Settings → Libraries UI if you want per-source access control.

## What Is Unchanged from Upstream

- The web player, Subsonic API, transcoding, playlists, smart playlists, users/permissions (beyond the initial admin signup), themes, and all scan behavior work exactly as documented upstream.
- Admin account creation uses Navidrome's own first-run screen, not a StartOS-generated credential.

## Contributing

See [AGENTS.md](AGENTS.md).

---

## Quick Reference for AI Consumers

```yaml
package_id: navidrome
architectures: [x86_64, aarch64]
volumes:
  main: /data
ports:
  ui: 4533
  api: 4533
dependencies: [filebrowser, nextcloud, multi-scrobbler]
startos_managed_env_vars: [ND_MUSICFOLDER, ND_LISTENBRAINZ_ENABLED, ND_LISTENBRAINZ_BASEURL, ND_RECENTLYADDEDBYMODTIME, ND_LOGLEVEL, ND_SCANNER_SCHEDULE, ND_SESSIONTIMEOUT]
actions:
  - media-sources
  - import-database
  - settings
```
