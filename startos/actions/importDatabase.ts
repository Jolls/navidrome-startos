import { promises as fs } from 'node:fs'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  databaseFile: Value.file({
    name: i18n('Database File'),
    description: i18n(
      "Navidrome's SQLite database file, usually named navidrome.db, taken from another instance's data volume.",
    ),
    extensions: ['.db'],
    required: true,
  }),
})

export const importDatabase = sdk.Action.withInput(
  'import-database',

  async ({ effects }) => ({
    name: i18n('Import Existing Database'),
    description: i18n(
      "Replace Navidrome's database with a previously exported navidrome.db file.",
    ),
    warning: i18n(
      'This permanently replaces the current database and cannot be undone. Navidrome stores each track under the exact path it was scanned at — the imported database only matches your library if the File Browser / Nextcloud subfolder(s) configured in Select Music Sources are identical to the ones the source instance used. A mismatch will not corrupt anything, but tracks will show as missing until you re-scan.',
    ),
    allowedStatuses: 'only-stopped',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({}),

  async ({ effects, input }) => {
    const uploaded = await fs.readFile(input.databaseFile.path)
    await sdk.volumes.main.writeFile('navidrome.db', uploaded)

    // Stale WAL/SHM files from the previous database don't match the
    // imported file's contents; remove them so SQLite starts clean and
    // recreates them from the new database as needed.
    await fs.rm(sdk.volumes.main.subpath('navidrome.db-wal'), {
      force: true,
    })
    await fs.rm(sdk.volumes.main.subpath('navidrome.db-shm'), {
      force: true,
    })
  },
)
