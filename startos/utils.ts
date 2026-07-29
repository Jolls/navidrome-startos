// Navidrome's web/API port — fixed by the upstream image (ND_PORT default), not user-configurable.
export const uiPort = 4533

// The host id the 'ui'/'api' interfaces are bound under (see interfaces.ts). Exported
// so dependent packages can resolve our bridge address without hardcoding it.
export const uiHostId = 'ui'
