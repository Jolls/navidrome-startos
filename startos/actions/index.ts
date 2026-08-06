import { sdk } from '../sdk'
import { importDatabase } from './importDatabase'
import { mediaSources } from './mediaSources'
import { settings } from './settings'

export const actions = sdk.Actions.of()
  .addAction(mediaSources)
  .addAction(importDatabase)
  .addAction(settings)
