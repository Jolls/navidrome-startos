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
- [ ] File Browser as a music source (only Nextcloud has been exercised so far) —
      subfolder is relative to its storage root directly (e.g. `Music`), no `data/`
      prefix needed there (File Browser's `data` volume mounts 1:1 at `/srv`).

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
- [ ] Backup, then restore, and confirm `store.json` (media-source selection *and* the
      new subpath fields) survives and the service starts cleanly (still needs its
      dependency mounted again).
- [ ] Decide on `packageRepo` (currently `https://github.com/Jolls/navidrome-startos`,
      matching this workspace's other packages) once a real remote exists, and push.
- [ ] Exercise the new **Configure Scrobbling** action end-to-end with a real
      Multi-Scrobbler install: enable the toggle, confirm `ND_LISTENBRAINZ_BASEURL`
      lands in the running container pointed at Multi-Scrobbler's bridge address (not
      `localhost`), and that a play in Navidrome shows up as a scrobble in
      Multi-Scrobbler's dashboard/logs. Also confirm the daemon restarts cleanly when
      toggling on/off and when Multi-Scrobbler itself is stopped/uninstalled while
      enabled (should not crash-loop; env vars should drop out per
      service-to-service.md's "absent means absent" rule — verify via
      `start-cli package attach navidrome -n navidrome-sub -- env | grep LISTENBRAINZ`).
