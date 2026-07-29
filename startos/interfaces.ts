import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiHostId, uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multi = sdk.MultiHost.of(effects, uiHostId)
  const origin = await multi.bindPort(uiPort, {
    protocol: 'http',
    preferredExternalPort: 80,
  })

  const ui = sdk.createInterface(effects, {
    name: i18n('Web Interface'),
    id: 'ui',
    description: i18n('The Navidrome web player'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  // Same origin and port as the web UI — Navidrome serves its Subsonic-compatible
  // API alongside the player. Exported separately so users can copy a
  // dedicated URL into Subsonic-compatible mobile/desktop apps.
  const api = sdk.createInterface(effects, {
    name: i18n('Subsonic API'),
    id: 'api',
    description: i18n(
      'Subsonic-compatible API for mobile and desktop music apps',
    ),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  return [await origin.export([ui, api])]
})
