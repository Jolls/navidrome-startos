import { store } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  mediaSources: Value.multiselect({
    name: i18n('Music Sources'),
    values: {
      filebrowser: i18n('File Browser'),
      nextcloud: i18n('Nextcloud'),
    },
    default: [],
    minLength: 1,
  }),
  filebrowserSubpath: Value.text({
    name: i18n('File Browser Subfolder'),
    description: i18n(
      "Path within File Browser's storage to scan for music, relative to its root (e.g. \"Music\"). Required when File Browser is selected above.",
    ),
    required: false,
    default: null,
    placeholder: 'Music',
  }),
  nextcloudSubpath: Value.text({
    name: i18n('Nextcloud Subfolder'),
    description: i18n(
      'Path to scan for music, relative to the Nextcloud volume root — which is Nextcloud\'s webroot, so this must start with "data/" followed by your username and "files/" (e.g. "data/admin/files/Music"). Required when Nextcloud is selected above.',
    ),
    required: false,
    default: null,
    placeholder: 'data/admin/files/Music',
  }),
})

export const mediaSources = sdk.Action.withInput(
  'media-sources',

  async ({ effects }) => ({
    name: i18n('Select Music Sources'),
    description: i18n('Service(s) Navidrome uses to access your music library'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const current = await store.read().const(effects)
    return {
      mediaSources: current?.mediaSources || [],
      filebrowserSubpath: current?.filebrowserSubpath || null,
      nextcloudSubpath: current?.nextcloudSubpath || null,
    }
  },

  async ({ effects, input }) => {
    if (
      input.mediaSources.includes('filebrowser') &&
      !input.filebrowserSubpath?.trim()
    ) {
      throw new Error(
        i18n(
          'A File Browser subfolder is required when File Browser is selected as a music source.',
        ),
      )
    }
    if (
      input.mediaSources.includes('nextcloud') &&
      !input.nextcloudSubpath?.trim()
    ) {
      throw new Error(
        i18n(
          'A Nextcloud subfolder is required when Nextcloud is selected as a music source.',
        ),
      )
    }
    await store.merge(effects, {
      mediaSources: input.mediaSources,
      filebrowserSubpath: input.filebrowserSubpath?.trim() || null,
      nextcloudSubpath: input.nextcloudSubpath?.trim() || null,
    })
  },
)
