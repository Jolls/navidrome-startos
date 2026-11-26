# Navidrome

## Documentation

- [Getting started](https://www.navidrome.org/docs/getting-started/) — creating your admin account and a tour of the web player.
- [Navidrome usage docs](https://www.navidrome.org/docs/usage/) — playlists, users, scanning, and other day-to-day features.
- [Subsonic-compatible apps](https://www.navidrome.org/docs/overview/#apps) — mobile and desktop clients you can point at your server.

## What you get on StartOS

Navidrome exposes two interfaces on the service page: a **Web Interface** for the browser-based player, and a **Subsonic API** URL you paste into any Subsonic-compatible app instead.

Your music library isn't stored directly by this package — Navidrome reads it from another service you already have installed (NextExplorer, FileBrowser Quantum or Nextcloud), mounted read-only. You choose which one(s) with the **Select Music Sources** action.

## Getting set up

1. Install NextExplorer (recommended), FileBrowser Quantum and/or Nextcloud from the StartOS marketplace first, and upload your music files there.
2. Open Navidrome. A task will prompt you to run **Select Music Sources** — choose one or more services as the source of your library, and for each one, type the subfolder where your music lives. Only that subfolder is mounted — Navidrome does not see the rest of that service's storage.
   - **NextExplorer**: start with one of its locations, e.g. `Files/Music`.
   - **FileBrowser Quantum**: relative to its storage root, e.g. `Music`.
   - **Nextcloud**: the path starts at Nextcloud's webroot, not its data folder — so it must begin with `data/`, then your Nextcloud username, then `files/`, e.g. `data/admin/files/Music`.
3. Start the service. Navidrome scans the mounted folder(s) and builds your library.
4. Open the **Web Interface**. On first visit, Navidrome asks you to create an admin account — pick a username and password; this is not generated for you.
5. Log in and confirm your albums and artists appear.

## Using Navidrome

### Web interface

The player where you browse your library, build playlists, and manage users and settings from the gear menu.

### Subsonic API

Copy this interface's URL into a Subsonic-compatible client (most mobile and desktop music apps that support "Subsonic" or "Navidrome" servers) along with the admin or a regular user's credentials.

### Select Music Sources

Run this again any time you want to add or change which service(s) Navidrome reads your library from, or the subfolder within them. Navidrome restarts on its own to pick up the change.

### Import Existing Database

If you're moving from another Navidrome instance (StartOS or otherwise), you can upload its `navidrome.db` file to replace this instance's database instead of rescanning from scratch — your library, playlists, users, and play history all carry over.

The service must be **stopped** to run this action. Before running it, make sure the NextExplorer/FileBrowser Quantum/Nextcloud subfolder(s) set in **Select Music Sources** are identical to the ones the source instance used — Navidrome's database records each track by its exact scanned path, so a different subfolder means the imported database won't match what's mounted here, and tracks will show as missing until you rescan. This does not corrupt anything; it's recoverable by re-running **Select Music Sources** with the matching paths, or by rescanning.

### Configure Navidrome

This action bundles settings that don't have an equivalent in Navidrome's own admin UI:

- **Scrobble to Multi-Scrobbler**: if you have Multi-Scrobbler installed, turn this on to send every play there automatically, using Navidrome's built-in ListenBrainz integration pointed at Multi-Scrobbler instead of the real listenbrainz.org. Turning it off (or uninstalling Multi-Scrobbler) stops sending scrobbles there; it does not touch any other scrobbling you've set up directly in Navidrome.
- **Sort "Recently Added" by File Modification Time**: by default, Navidrome's "Recently Added" view sorts by when a track was imported into the database. Turn this on to sort by the file's modification time on disk instead — handy if you're importing an existing library and want "recently added" to reflect when the files themselves were added, not when Navidrome scanned them.
- **Scanner Schedule**: a cron expression (e.g. `0 */6 * * *` for every 6 hours) to have Navidrome rescan your library automatically on a schedule. Leave blank to rely on Navidrome's file-watcher instead (it already rescans shortly after files change).
- **Jellyfin API (experimental)**: lets Jellyfin-compatible music clients (e.g. Finamp, Feishin, Jellify) connect. Off by default; when on, a **Jellyfin API** interface appears on the service page — use its URL (it ends in `/jellyfin`) with your normal Navidrome username and password. Upstream still labels this experimental, and LAN auto-discovery is not available. **Symfonium's Jellyfin sync doesn't currently work here** — it reports "0 tracks." Use Symfonium's own Subsonic API support (the **Subsonic API** interface above) instead for now.
- **Log Level**: how verbose Navidrome's logs are, viewable from this service's Logs tab. Turn up to `debug` or `trace` when troubleshooting; leave at `info` otherwise.
- **Session Timeout**: how long you can stay idle in the web UI before being logged out, e.g. `24h` or `45m`. Leave blank to use Navidrome's own default (48 hours).
- **Smart Playlist Refresh Delay**: how long a smart playlist keeps the same tracks before Navidrome rebuilds it, e.g. `24h`. Navidrome's default is just 5 seconds, so a smart playlist sorted by `random` reshuffles almost every time an app like Symfonium syncs it, making the app download new songs and discard the old ones over and over. Set this to `24h` for a playlist that changes once a day. It applies to every smart playlist. Leave blank to keep Navidrome's default.

Saving restarts Navidrome automatically, so the change takes effect within a few seconds.

The scrobbling toggle alone is not enough to make scrobbles land — you still have to do two things by hand, in the two apps' own UIs (not this action, and not automated by this package):

1. In Multi-Scrobbler, add (or check for) a source of type `endpointlz` for Navidrome, with a `data.token` value — any string you make up, it's a shared secret you're inventing, not one issued by either app.
2. In Navidrome, log in as the user you want to scrobble, go to **Settings → your user → Scrobble to ListenBrainz**, and paste the _exact same_ token string from step 1.

The two tokens must match — Multi-Scrobbler accepts a submission as coming from that source only when its token matches what's configured. This is a one-time, per-user setup step.

Multi-Scrobbler's admin login doesn't affect this: Navidrome sends to an address the login doesn't cover. On Multi-Scrobbler versions before 0.21.1, scrobbling doesn't work while a Web UI password is set; update Multi-Scrobbler, or clear the password there with **Clear Web UI Password**.

## Limitations

Because your music is mounted read-only from another service, Navidrome cannot write tag edits, rename files, or fix file permissions on your library — manage the files themselves from NextExplorer, FileBrowser Quantum or Nextcloud directly.
