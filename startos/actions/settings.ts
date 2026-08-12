import { store } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  scrobbleToMultiScrobbler: Value.toggle({
    name: i18n('Scrobble to Multi-Scrobbler'),
    description: i18n(
      "Point Navidrome's ListenBrainz integration at the Multi-Scrobbler dependency's bridge address, so every play is scrobbled there. Requires Multi-Scrobbler to be installed.",
    ),
    default: false,
  }),
  recentlyAddedByModTime: Value.toggle({
    name: i18n('Sort "Recently Added" by File Modification Time'),
    description: i18n(
      'By default, Navidrome\'s "Recently Added" sorts by when a track was imported into the database. Enable this to sort by the file\'s modification time on disk instead — useful if you\'re importing an existing library and want "recently added" to reflect when the files themselves were added, not when Navidrome scanned them. Sets ND_RECENTLYADDEDBYMODTIME.',
    ),
    default: false,
  }),
  scannerSchedule: Value.text({
    name: i18n('Scanner Schedule'),
    description: i18n(
      'Standard 5-field cron expression for automatic library rescans: minute(0-59) hour(0-23) day-of-month(1-31) month(1-12) day-of-week(0-6, Sun=0), each either a number or *. E.g. "*/2 * * * *" for every 2 minutes, or "0 */6 * * *" for every 6 hours. Leave blank to disable scheduled scans. Sets ND_SCANNER_SCHEDULE.',
    ),
    default: null,
    required: false,
    placeholder: '0 */6 * * *',
    patterns: [
      {
        regex:
          '^(?:\\*|[0-9]+(?:-[0-9]+)?)(?:/[0-9]+)?(?:,(?:\\*|[0-9]+(?:-[0-9]+)?)(?:/[0-9]+)?)*(?:\\s+(?:\\*|[0-9]+(?:-[0-9]+)?)(?:/[0-9]+)?(?:,(?:\\*|[0-9]+(?:-[0-9]+)?)(?:/[0-9]+)?)*){4}$',
        description: i18n(
          'Must be 5 space-separated cron fields (minute hour day month weekday), each a number, *, or a */step, e.g. "*/2 * * * *".',
        ),
      },
    ],
  }),
  logLevel: Value.select({
    name: i18n('Log Level'),
    description: i18n(
      'Verbosity of Navidrome logs, viewable via the service Logs tab. Sets ND_LOGLEVEL.',
    ),
    default: 'info',
    values: {
      error: i18n('Error'),
      warn: i18n('Warn'),
      info: i18n('Info'),
      debug: i18n('Debug'),
      trace: i18n('Trace'),
    },
  }),
  sessionTimeout: Value.text({
    name: i18n('Session Timeout'),
    description: i18n(
      'How long an idle web UI session stays logged in. Only s (seconds), m (minutes), or h (hours) are accepted, e.g. "45m" or "2h" — other unit names (like "min") will crash Navidrome. Leave blank to use Navidrome\'s own default (48h). Sets ND_SESSIONTIMEOUT.',
    ),
    default: null,
    required: false,
    placeholder: '48h',
    patterns: [
      {
        regex: '^([0-9]+(s|m|h))+$',
        description: i18n(
          'Must be a number followed by s, m, or h (e.g. "45m", "2h", or "1h30m").',
        ),
      },
    ],
  }),
})

export const settings = sdk.Action.withInput(
  'settings',

  async ({ effects }) => ({
    name: i18n('Configure Navidrome'),
    description: i18n('Scrobbling, library, and logging settings'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const current = await store.read().const(effects)
    return {
      scrobbleToMultiScrobbler: current?.scrobbleToMultiScrobbler || false,
      recentlyAddedByModTime: current?.recentlyAddedByModTime || false,
      scannerSchedule: current?.scannerSchedule || null,
      logLevel: current?.logLevel || 'info',
      sessionTimeout: current?.sessionTimeout || null,
    }
  },

  async ({ effects, input }) => {
    await store.merge(effects, {
      scrobbleToMultiScrobbler: input.scrobbleToMultiScrobbler,
      recentlyAddedByModTime: input.recentlyAddedByModTime,
      scannerSchedule: input.scannerSchedule?.trim() || null,
      logLevel: input.logLevel,
      sessionTimeout: input.sessionTimeout?.trim() || null,
    })
  },
)
