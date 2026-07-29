import { sdk } from '../sdk'
import { importDatabase } from './importDatabase'
import { mediaSources } from './mediaSources'
import { scrobbling } from './scrobbling'

export const actions = sdk.Actions.of()
  .addAction(mediaSources)
  .addAction(importDatabase)
  .addAction(scrobbling)
