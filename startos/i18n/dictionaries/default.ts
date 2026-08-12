export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Navidrome!': 0,
  'No music source selected': 1,
  // main.ts, interfaces.ts
  'Web Interface': 2,
  'The web interface is ready': 3,
  'The web interface is not ready': 4,
  // interfaces.ts
  'The Navidrome web player': 5,
  'Subsonic API': 6,
  'Subsonic-compatible API for mobile and desktop music apps': 7,
  // actions/mediaSources.ts, init/taskSelectMediaSources.ts
  'Music Sources': 8,
  'File Browser': 9,
  Nextcloud: 10,
  'Select Music Sources': 11,
  'Service(s) Navidrome uses to access your music library': 12,
  'Select where your music library is stored': 13,
  // actions/mediaSources.ts
  'File Browser Subfolder': 14,
  'Path within File Browser\'s storage to scan for music, relative to its root (e.g. "Music"). Required when File Browser is selected above.': 15,
  'Nextcloud Subfolder': 16,
  'Path to scan for music, relative to the Nextcloud volume root — which is Nextcloud\'s webroot, so this must start with "data/" followed by your username and "files/" (e.g. "data/admin/files/Music"). Required when Nextcloud is selected above.': 17,
  'A File Browser subfolder is required when File Browser is selected as a music source.': 18,
  'A Nextcloud subfolder is required when Nextcloud is selected as a music source.': 19,
  // main.ts
  'File Browser is selected as a music source but has no subfolder configured. Re-run Select Music Sources.': 20,
  'Nextcloud is selected as a music source but has no subfolder configured. Re-run Select Music Sources.': 21,
  // actions/importDatabase.ts
  'Database File': 22,
  "Navidrome's SQLite database file, usually named navidrome.db, taken from another instance's data volume.": 23,
  'Import Existing Database': 24,
  "Replace Navidrome's database with a previously exported navidrome.db file.": 25,
  'This permanently replaces the current database and cannot be undone. Navidrome stores each track under the exact path it was scanned at — the imported database only matches your library if the File Browser / Nextcloud subfolder(s) configured in Select Music Sources are identical to the ones the source instance used. A mismatch will not corrupt anything, but tracks will show as missing until you re-scan.': 26,
  // actions/settings.ts
  'Scrobble to Multi-Scrobbler': 27,
  "Point Navidrome's ListenBrainz integration at the Multi-Scrobbler dependency's bridge address, so every play is scrobbled there. Requires Multi-Scrobbler to be installed.": 28,
  'Configure Navidrome': 29,
  'Scrobbling, library, and logging settings': 30,
  'Sort "Recently Added" by File Modification Time': 31,
  'By default, Navidrome\'s "Recently Added" sorts by when a track was imported into the database. Enable this to sort by the file\'s modification time on disk instead — useful if you\'re importing an existing library and want "recently added" to reflect when the files themselves were added, not when Navidrome scanned them. Sets ND_RECENTLYADDEDBYMODTIME.': 32,
  'Scanner Schedule': 33,
  'Standard 5-field cron expression for automatic library rescans: minute(0-59) hour(0-23) day-of-month(1-31) month(1-12) day-of-week(0-6, Sun=0), each either a number or *. E.g. "*/2 * * * *" for every 2 minutes, or "0 */6 * * *" for every 6 hours. Leave blank to disable scheduled scans. Sets ND_SCANNER_SCHEDULE.': 34,
  'Log Level': 35,
  'Verbosity of Navidrome logs, viewable via the service Logs tab. Sets ND_LOGLEVEL.': 36,
  Error: 37,
  Warn: 38,
  Info: 39,
  Debug: 40,
  Trace: 41,
  'Session Timeout': 42,
  'How long an idle web UI session stays logged in. Only s (seconds), m (minutes), or h (hours) are accepted, e.g. "45m" or "2h" — other unit names (like "min") will crash Navidrome. Leave blank to use Navidrome\'s own default (48h). Sets ND_SESSIONTIMEOUT.': 43,
  // actions/mediaSources.ts
  'Could not find "${subpath}" in ${label}. Check the path and that it\'s installed, then try again.': 44,
  // actions/settings.ts
  'Must be a number followed by s, m, or h (e.g. "45m", "2h", or "1h30m").': 45,
  'Must be 5 space-separated cron fields (minute hour day month weekday), each a number, *, or a */step, e.g. "*/2 * * * *".': 46,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
