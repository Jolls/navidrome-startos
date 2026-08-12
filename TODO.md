# TODO — Navidrome

Package is built out and `tsc`/`s9pk pack` are green, and is installed on the dev box
(`192.168.121.132`).

## Verified this session (2026-07-29)

- [x] Nextcloud as a music source, scoped to a subfolder: **works**. Correct subpath
      pattern is `data/<nextcloud-username>/files/<folder>` — the Nextcloud volume is
      mounted at its webroot (`/var/www/html`), not its data folder, so `data/` is
      required. (A bare `<username>/files/...` path — mirroring Nextcloud's on-disk
      layout directly — is missing that prefix and fails to mount with
      `mount exited with exit status: 32`, since StartOS's bind-mount only creates the
      mount *target*, not the source.) `data/embassy/files/My Music` confirmed working
      on the dev box; Navidrome scanned real audio files out of it successfully.
- [x] Nextcloud permissions/sharing: confirmed **no action needed on the Nextcloud
      side**. The mount is a raw filesystem bind mount of the on-disk volume — it
      bypasses Nextcloud's application layer (auth, sharing, ACLs) entirely. Files
      don't need to be shared with anyone in Nextcloud's UI.
- [x] Cross-container UID/permission concern: expected `www-data:www-data` mode `750`
      files (owner+group only) to need an explicit `idmap` on the dependency mount
      (see `main.md` § Remapping Ownership) given each StartOS container has its own
      LXC UID namespace. In practice it worked with **no `idmap`** on this box —
      Navidrome (mounted read-only, no idmap) read and scanned the files fine. Not
      fully explained (didn't dig into StartOS's LXC id-mapping scheme to confirm
      *why*), but empirically a non-issue as of this test. Worth re-confirming this
      holds on other StartOS versions/hosts before relying on it.
- [x] File Browser as a music source: **works**, confirmed on the dev box
      (2026-08-05). Subfolder is relative to its storage root directly (e.g. `Music`),
      no `data/` prefix needed there (File Browser's `data` volume mounts 1:1 at
      `/srv`).

## Blocked

- [ ] **Import Existing Database** (`Value.file` input) can't be tested yet — the
      StartOS file picker is broken on the OS side, not something to fix in this
      package. Tracked upstream:
      <https://github.com/Start9Labs/start-technologies/issues/3585>. Revisit once
      that's fixed.

## Still pending

- [x] Confirm the **Select Music Sources** save is rejected when a selected source's
      subfolder is left blank: **works**, confirmed on `navidrome-test` (2026-08-11).
      Not separately re-confirmed: the daemon's own "no subfolder configured" guard in
      `main.ts`, for the case where `store.json` somehow ends up with a source selected
      but no subpath (shouldn't happen via the action, but the guard itself is
      untested).
- [x] Confirm **Select Music Sources** rejects a subfolder that doesn't exist: **works**,
      confirmed on `navidrome-test` (2026-08-11) — a nonexistent path is caught by the
      new pre-save `SubContainer.withTemp` existence check and rejected with a clear
      error, instead of saving and leaving the daemon unable to start.
- [x] Create the admin account through Navidrome's own first-run screen; confirm login:
      **works**, confirmed on the dev box (2026-08-11) — account shows "is admin" in
      Navidrome's own UI.
- [x] Copy the **Subsonic API** interface URL into a real Subsonic-compatible client and
      confirm it connects: **works**, confirmed against a real Android Subsonic client
      (2026-08-11).
- [ ] Exercise **Import Existing Database** (blocked, see above): stop the service,
      upload a `navidrome.db` (ideally from a second real instance pointed at the
      *same* subfolder path), confirm playlists/users/history carry over and stale
      `-wal`/`-shm` files don't linger. Also confirm it's blocked while the service
      is running.
- [x] Backup, then restore: confirmed working a while back, before this session's
      `store.json` additions (`recentlyAddedByModTime`, `scannerSchedule`, `logLevel`,
      `sessionTimeout`). Since these are plain fields on the same file with `.catch()`
      defaults, restore should carry them the same way — but worth a quick re-check
      next time a backup/restore happens, rather than assuming.
- [x] Exercise the **Configure Navidrome** action end-to-end with a real
      Multi-Scrobbler install: confirmed working (2026-08-05) — scrobbling toggle
      reaches a real Multi-Scrobbler instance. Not separately re-confirmed: daemon
      behavior when Multi-Scrobbler is stopped/uninstalled while the toggle is still
      enabled (should not crash-loop; env vars should drop per service-to-service.md's
      "absent means absent" rule).
- [x] Exercise the **Sort "Recently Added" by File Modification Time** toggle: **works**
      as coded — `ND_RECENTLYADDEDBYMODTIME=true` landed and "Recently Added" reordered
      by file mtime as designed. Not a bug: the resulting sort order just wasn't
      preferred, so it's being left off by choice, not left broken.
- [x] Exercise the new **Scanner Schedule** field in **Configure Navidrome**: **works**,
      confirmed on `navidrome-test` (2026-08-11) — `*/2 * * * *` produced a scan every 2
      minutes in the Logs tab (`Scanner: Starting scan` at `:42:00` and `:44:00`). Cron's
      5-field order (minute hour day month weekday) is easy to get backwards — the
      field's description now spells out each field, and a garbage value (`banana`) is
      rejected at save time by a new cron pattern validation
      (`startos/actions/settings.ts`).
- [x] Exercise the new **Log Level** field: **works**, confirmed on `navidrome-test`
      (2026-08-11) — setting `debug` visibly increased log verbosity (per-phase scanner
      timing, DB/connection debug lines) versus the sparse `info` default.
- [x] Exercise the new **Session Timeout** field: value handling confirmed on
      `navidrome-test` (2026-08-11) — `2min` (invalid Go duration unit) originally
      crash-looped the daemon (`FATAL: 'SessionTimeout' time: unknown unit`); added a
      pattern validation (`^([0-9]+(s|m|h))+$`) plus a footnote on accepted units, both
      confirmed rejecting `2min` at save time, and `2m`/`10s` save and start cleanly.
      Idle-expiry behavior also confirmed (2026-08-11): enforcement is reactive, not a
      live countdown — a tab left idle past a `10s` timeout stayed visually logged in
      until the next interaction (click/navigate), which then correctly bounced to the
      login screen. Expected JWT-expiry behavior, not a bug.
- [x] Confirm leaving **Scanner Schedule**/**Session Timeout** blank correctly omits
      `ND_SCANNER_SCHEDULE`/`ND_SESSIONTIMEOUT` from the container's env: **works**,
      confirmed on the live `navidrome` instance (2026-08-11), which already has both
      fields blank — `cat /proc/<navidrome-pid>/environ` shows neither var present
      (checked via `ND_` grep of the real process env, not `package attach -- env`,
      which reflects the container's namespace env rather than the daemon's own
      `exec.env`).
- [x] Confirm `ND_MUSICFOLDER=/music` (now set explicitly in `main.ts` rather than
      relying on the image default) doesn't change scanning behavior versus the
      previous implicit-default build: **confirmed no-op**, verified on the live
      `navidrome` instance (2026-08-12) — `/proc/<navidrome-pid>/environ` shows
      `ND_MUSICFOLDER=/music` present, `/music/nextcloud` mounted and populated, scan
      logs show normal completions, and Navidrome's own insights telemetry reports a
      healthy library (20,309 tracks, 1,766 albums, 2,870 artists, 11 playlists).
