import { manifest as filebrowserManifest } from 'filebrowser-quantum-startos/startos/manifest'
import {
  uiHostId as multiScrobblerUiHostId,
  uiPort as multiScrobblerUiPort,
} from 'multi-scrobbler-startos/startos/utils'
import { manifest as nextcloudManifest } from 'nextcloud-startos/startos/manifest'
import { manifest as nextexplorerManifest } from 'nextexplorer-startos/startos/manifest'
import { promises as fs } from 'node:fs'
import { stagedPrefix } from './actions/importDatabase'
import { store } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Navidrome!'))

  // Import runs only while stopped, so any staged upload here is abandoned.
  for (const name of await fs.readdir(sdk.volumes.main.subpath('.'))) {
    if (name.startsWith(stagedPrefix)) {
      await fs.rm(sdk.volumes.main.subpath(name), { force: true })
    }
  }

  const {
    mediaSources,
    nextexplorerSubpath,
    filebrowserSubpath,
    nextcloudSubpath,
    scrobbleToMultiScrobbler,
    recentlyAddedByModTime,
    scannerSchedule,
    jellyfinEnabled,
    logLevel,
    sessionTimeout,
    smartPlaylistRefreshDelay,
  } = (await store.read().const(effects)) || {}

  // Resolves to null when Multi-Scrobbler is absent or stopped; the env vars
  // below are then omitted rather than pointed at a fabricated address.
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

  // Navidrome scans /music recursively as one library, so each source becomes a
  // sibling folder under it. The media-sources action requires a subpath for
  // every selected source, so a null here means store.json was hand-edited.
  if (mediaSources.includes('nextexplorer')) {
    if (!nextexplorerSubpath) {
      throw new Error(
        i18n(
          'NextExplorer is selected as a music source but has no subfolder configured. Re-run Select Music Sources.',
        ),
      )
    }
    mounts = mounts.mountDependency<typeof nextexplorerManifest>({
      dependencyId: 'nextexplorer',
      volumeId: 'data',
      subpath: nextexplorerSubpath,
      mountpoint: '/music/nextexplorer',
      readonly: true,
    })
  }

  if (mediaSources.includes('filebrowser')) {
    if (!filebrowserSubpath) {
      throw new Error(
        i18n(
          'FileBrowser Quantum is selected as a music source but has no subfolder configured. Re-run Select Music Sources.',
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
      command: sdk.useEntrypoint(),
      env: {
        // Must stay equal to the /music mountpoint the mounts above are built against.
        ND_MUSICFOLDER: '/music',
        ...(multiScrobblerAddress
          ? {
              ND_LISTENBRAINZ_ENABLED: 'true',
              // The /1/ suffix mirrors listenbrainz.org's own API base path,
              // which is what Navidrome appends its endpoints to.
              ND_LISTENBRAINZ_BASEURL: `http://${multiScrobblerAddress}/1/`,
            }
          : {}),
        ND_RECENTLYADDEDBYMODTIME: recentlyAddedByModTime ? 'true' : 'false',
        ND_JELLYFIN_ENABLED: jellyfinEnabled ? 'true' : 'false',
        ND_LOGLEVEL: logLevel || 'info',
        ...(scannerSchedule ? { ND_SCANNER_SCHEDULE: scannerSchedule } : {}),
        ...(sessionTimeout ? { ND_SESSIONTIMEOUT: sessionTimeout } : {}),
        ...(smartPlaylistRefreshDelay
          ? { ND_SMARTPLAYLISTREFRESHDELAY: smartPlaylistRefreshDelay }
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
