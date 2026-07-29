# Navidrome

## Documentation

- [Getting started](https://www.navidrome.org/docs/getting-started/) — creating your admin account and a tour of the web player.
- [Navidrome usage docs](https://www.navidrome.org/docs/usage/getting-started/) — playlists, users, scanning, and other day-to-day features.
- [Subsonic-compatible apps](https://www.navidrome.org/docs/overview/#apps) — mobile and desktop clients you can point at your server.

## What you get on StartOS

Navidrome exposes two interfaces on the service page: a **Web Interface** for the browser-based player, and a **Subsonic API** URL you paste into any Subsonic-compatible app instead.

Your music library isn't stored directly by this package — Navidrome reads it from another service you already have installed (File Browser or Nextcloud), mounted read-only. You choose which one(s) with the **Select Music Sources** action.

## Getting set up

1. Install File Browser and/or Nextcloud from the StartOS marketplace first, and upload your music files there.
2. Open Navidrome. A task will prompt you to run **Select Music Sources** — choose one or both services as the source of your library, and for each one, type the subfolder where your music lives. Only that subfolder is mounted — Navidrome does not see the rest of that service's storage.
   - **File Browser**: relative to its storage root, e.g. `Music`.
   - **Nextcloud**: relative to its *volume* root, which is Nextcloud's webroot — not its data folder. So the path must start with `data/`, then your Nextcloud username, then `files/`, e.g. `data/admin/files/Music`.
3. Start the service. Navidrome scans the mounted folder(s) and builds your library.
4. Open the **Web Interface**. On first visit, Navidrome asks you to create an admin account — pick a username and password; this is not generated for you.
5. Log in and confirm your albums and artists appear.

## Using Navidrome

### Web interface

The player where you browse your library, build playlists, and manage users and settings from the gear menu.

### Subsonic API

Copy this interface's URL into a Subsonic-compatible client (most mobile and desktop music apps that support "Subsonic" or "Navidrome" servers) along with the admin or a regular user's credentials.

### Select Music Sources

Run this again any time you want to add or change which service(s) Navidrome reads your library from, or the subfolder within them. Restart the service afterward for the change to take effect.

### Import Existing Database

If you're moving from another Navidrome instance (StartOS or otherwise), you can upload its `navidrome.db` file to replace this instance's database instead of rescanning from scratch — your library, playlists, users, and play history all carry over.

The service must be **stopped** to run this action. Before running it, make sure the File Browser/Nextcloud subfolder(s) set in **Select Music Sources** are identical to the ones the source instance used — Navidrome's database records each track by its exact scanned path, so a different subfolder means the imported database won't match what's mounted here, and tracks will show as missing until you rescan. This does not corrupt anything; it's recoverable by re-running **Select Music Sources** with the matching paths, or by rescanning.

### Configure Scrobbling

If you have Multi-Scrobbler installed, turn on the **Scrobble to Multi-Scrobbler** toggle in this action to send every play there automatically, using Navidrome's built-in ListenBrainz integration pointed at Multi-Scrobbler instead of the real listenbrainz.org. Restart the service afterward for the change to take effect. Turning it off (or uninstalling Multi-Scrobbler) stops sending scrobbles there; it does not touch any other scrobbling you've set up directly in Navidrome.

This toggle alone is not enough to make scrobbles land — you still have to do two things by hand, in the two apps' own UIs (not this action, and not automated by this package):

1. In Multi-Scrobbler, add (or check for) a source of type `endpointlz` for Navidrome, with a `data.token` value — any string you make up, it's a shared secret you're inventing, not one issued by either app.
2. In Navidrome, log in as the user you want to scrobble, go to **Settings → your user → Scrobble to ListenBrainz**, and paste the *exact same* token string from step 1.

The two tokens must match — Multi-Scrobbler accepts a submission as coming from that source only when its token matches what's configured. This is a one-time, per-user setup step.

## Limitations

Because your music is mounted read-only from another service, Navidrome cannot write tag edits, rename files, or fix file permissions on your library — manage the files themselves from File Browser or Nextcloud directly.
