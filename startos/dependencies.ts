import { T } from '@start9labs/start-sdk'
import { store } from './fileModels/store.json'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const { mediaSources = [], scrobbleToMultiScrobbler } =
    (await store.read().const(effects)) || {}

  const deps: T.CurrentDependenciesResult<any> = {}

  if (mediaSources.includes('filebrowser')) {
    deps['filebrowser'] = {
      kind: 'exists',
      versionRange: '>=2.63.18:3',
    }
  }

  if (mediaSources.includes('nextcloud')) {
    deps['nextcloud'] = {
      kind: 'exists',
      versionRange: '>=33.0.6:1',
    }
  }

  if (scrobbleToMultiScrobbler) {
    deps['multi-scrobbler'] = {
      kind: 'running',
      // Matches the version currently installed alongside this package during
      // development; bump if multi-scrobbler-startos ships a breaking change.
      versionRange: '>=0.14.2:0',
      healthChecks: ['multi-scrobbler'],
    }
  }

  return deps
})
