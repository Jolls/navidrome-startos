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
  // actions/scrobbling.ts
  'Scrobble to Multi-Scrobbler': 27,
  "Point Navidrome's ListenBrainz integration at the Multi-Scrobbler dependency's bridge address, so every play is scrobbled there. Requires Multi-Scrobbler to be installed.": 28,
  'Configure Scrobbling': 29,
  'Scrobble plays to Multi-Scrobbler via ListenBrainz': 30,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
