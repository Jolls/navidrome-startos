import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  mediaSources: z.array(z.enum(['filebrowser', 'nextcloud'])).catch([]),
  filebrowserSubpath: z.string().nullable().catch(null),
  nextcloudSubpath: z.string().nullable().catch(null),
  scrobbleToMultiScrobbler: z.boolean().catch(false),
})

export const store = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: 'store.json',
  },
  shape,
)

export type StoreType = z.infer<typeof shape>
