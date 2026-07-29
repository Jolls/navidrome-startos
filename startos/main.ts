import { manifest as filebrowserManifest } from 'filebrowser-startos/startos/manifest'
import {
  uiHostId as multiScrobblerUiHostId,
  uiPort as multiScrobblerUiPort,
} from 'multi-scrobbler-startos/startos/utils'
import { manifest as nextcloudManifest } from 'nextcloud-startos/startos/manifest'
import { store } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Navidrome!'))

  const {
    mediaSources,
    filebrowserSubpath,
    nextcloudSubpath,
    scrobbleToMultiScrobbler,
  } = (await store.read().const(effects)) || {}

  // "localhost" inside Navidrome's container refers to its own container, not
  // Multi-Scrobbler's — resolve the bridge address that actually reaches it.
  // Absent means absent (dependency not installed/running): leave the env
  // vars out entirely rather than fabricating an address (service-to-service.md).
  const multiScrobblerAddress = scrobbleToMultiScrobbler
    ? await sdk.host
        .getBridgeAddress(effects, {
          hostId: multiScrobblerUiHostId,
          packageId: 'multi-scrobbler',
          internalPort: multiScrobblerUiPort,
          ssl: false,
        })
        .const()
    : null

  if (!mediaSources?.length) {
    throw new Error(i18n('No music source selected'))
  }

  let mounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/data',
    readonly: false,
  })

  // Each selected source is mounted, scoped to its configured subfolder, as
  // its own subfolder under /music. Navidrome scans /music (ND_MUSICFOLDER,
  // the image default) recursively as a single library, so multiple sources
  // simply appear as sibling folders — no need for Navidrome's separate
  // multi-library feature. The media-sources action requires a subpath for
  // every selected source, so these are never null here.
  if (mediaSources.includes('filebrowser')) {
    if (!filebrowserSubpath) {
      throw new Error(
        i18n(
          'File Browser is selected as a music source but has no subfolder configured. Re-run Select Music Sources.',
        ),
      )
    }
    mounts = mounts.mountDependency<typeof filebrowserManifest>({
      dependencyId: 'filebrowser',
      volumeId: 'data',
      subpath: filebrowserSubpath,
      mountpoint: '/music/filebrowser',
      readonly: true,
    })
  }

  if (mediaSources.includes('nextcloud')) {
    if (!nextcloudSubpath) {
      throw new Error(
        i18n(
          'Nextcloud is selected as a music source but has no subfolder configured. Re-run Select Music Sources.',
        ),
      )
    }
    mounts = mounts.mountDependency<typeof nextcloudManifest>({
      dependencyId: 'nextcloud',
      volumeId: 'nextcloud',
      subpath: nextcloudSubpath,
      mountpoint: '/music/nextcloud',
      readonly: true,
    })
  }

  return sdk.Daemons.of(effects).addDaemon('navidrome', {
    subcontainer: sdk.SubContainer.of(
      effects,
      { imageId: 'navidrome' },
      mounts,
      'navidrome-sub',
    ),
    exec: {
      // The image's ENTRYPOINT is the navidrome binary itself — no bundled
      // init system, so runAsInit is not needed.
      command: sdk.useEntrypoint(),
      env: {
        ...(multiScrobblerAddress
          ? {
              ND_LISTENBRAINZ_ENABLED: 'true',
              // Multi-Scrobbler exposes a ListenBrainz-compatible submission
              // endpoint under this path, matching the real listenbrainz.org
              // API's own base path (confirmed against Navidrome's
              // ListenBrainz.BaseURL default, https://api.listenbrainz.org/1/).
              ND_LISTENBRAINZ_BASEURL: `http://${multiScrobblerAddress}/1/`,
            }
          : {}),
      },
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })
})
