import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  mediaSources: z.array(z.enum(['filebrowser', 'nextcloud'])).catch([]),
  filebrowserSubpath: z.string().nullable().catch(null),
  nextcloudSubpath: z.string().nullable().catch(null),
  scrobbleToMultiScrobbler: z.boolean().catch(false),
  recentlyAddedByModTime: z.boolean().catch(false),
  scannerSchedule: z.string().nullable().catch(null),
  logLevel: z
    .enum(['error', 'warn', 'info', 'debug', 'trace'])
    .catch('info'),
  sessionTimeout: z.string().nullable().catch(null),
})

export const store = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: 'store.json',
  },
  shape,
)

export type StoreType = z.infer<typeof shape>
