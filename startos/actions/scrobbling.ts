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
})

export const scrobbling = sdk.Action.withInput(
  'scrobbling',

  async ({ effects }) => ({
    name: i18n('Configure Scrobbling'),
    description: i18n('Scrobble plays to Multi-Scrobbler via ListenBrainz'),
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
    }
  },

  async ({ effects, input }) => {
    await store.merge(effects, {
      scrobbleToMultiScrobbler: input.scrobbleToMultiScrobbler,
    })
  },
)
