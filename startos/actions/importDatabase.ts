import { types as T } from '@start9labs/start-sdk'
import { promises as fs } from 'node:fs'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

// Staged beside the live database so the header check runs before anything is
// replaced, and the final rename stays on one filesystem.
const stagedName = 'navidrome.db.import'

export const inputSpec = async ({ effects }: { effects: T.Effects }) =>
  InputSpec.of({
    databaseFile: Value.file({
      name: i18n('Database File'),
      description: i18n(
        "Navidrome's SQLite database file, usually named navidrome.db, taken from another instance's data volume.",
      ),
      uploadId: await sdk.prepareUpload(effects, {
        volume: 'main',
        path: stagedName,
        mode: 0o644,
      }),
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
      'This permanently replaces the current database and cannot be undone. Navidrome stores each track under the exact path it was scanned at — the imported database only matches your library if the NextExplorer / FileBrowser Quantum / Nextcloud subfolder(s) configured in Select Music Sources are identical to the ones the source instance used. A mismatch will not corrupt anything, but tracks will show as missing until you re-scan.',
    ),
    allowedStatuses: 'only-stopped',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({}),

  async ({ effects, input }) => {
    const staged = sdk.volumes.main.subpath(input.databaseFile.path)

    // The `.db` extension filter only constrains the form. Overwriting the
    // database with something that isn't one is not recoverable from here, so
    // check SQLite's own header before committing to it.
    const header = Buffer.alloc(16)
    const handle = await fs.open(staged, 'r')
    try {
      await handle.read(header, 0, 16, 0)
    } finally {
      await handle.close()
    }
    if (!header.equals(Buffer.from('SQLite format 3\0'))) {
      await fs.rm(staged, { force: true })
      throw new Error(i18n('That file is not a SQLite database.'))
    }

    await fs.rename(staged, sdk.volumes.main.subpath('navidrome.db'))

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
