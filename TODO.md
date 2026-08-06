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

- [ ] Confirm the **Select Music Sources** save is rejected when a selected source's
      subfolder is left blank, and confirm the daemon throws its "no subfolder
      configured" error if `store.json` somehow ends up with a source selected but no
      subpath (shouldn't happen via the action, but the guard in `main.ts` is untested).
- [ ] Create the admin account through Navidrome's own first-run screen; confirm login.
- [ ] Copy the **Subsonic API** interface URL into a real Subsonic-compatible client and
      confirm it connects.
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
- [ ] Exercise the **Sort "Recently Added" by File Modification Time** toggle in the
      same action: enable it, restart, confirm `ND_RECENTLYADDEDBYMODTIME=true` lands
      in the running container (`start-cli package attach navidrome -n navidrome-sub
      -- env | grep RECENTLYADDED`) and that Navidrome's "Recently Added" view actually
      reorders by file mtime instead of import time.
- [ ] Exercise the new **Scanner Schedule**, **Log Level**, and **Session Timeout**
      fields in **Configure Navidrome**: set a cron expression, confirm
      `ND_SCANNER_SCHEDULE` lands in the container and a scheduled scan actually fires;
      set Log Level to `debug`, confirm log verbosity visibly changes in the Logs tab;
      set a short Session Timeout (e.g. `2m`), confirm the web UI session actually
      expires around that mark. Also confirm leaving Scanner Schedule/Session Timeout
      blank correctly omits `ND_SCANNER_SCHEDULE`/`ND_SESSIONTIMEOUT` from the
      container's env (`start-cli package attach navidrome -n navidrome-sub -- env |
      grep -E 'SCANNER_SCHEDULE|SESSIONTIMEOUT'`) rather than sending an empty string.
- [ ] Confirm `ND_MUSICFOLDER=/music` (now set explicitly in `main.ts` rather than
      relying on the image default) doesn't change scanning behavior versus the
      previous implicit-default build — should be a no-op verification.
