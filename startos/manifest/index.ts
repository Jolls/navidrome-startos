import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'navidrome',
  title: 'Navidrome',
  license: 'GPL-3.0',
  packageRepo: 'https://github.com/Start9Labs/navidrome-startos',
  upstreamRepo: 'https://github.com/navidrome/navidrome',
  marketingUrl: 'https://www.navidrome.org',
  donationUrl: 'https://github.com/sponsors/deluan',
  description: { short, long },
  volumes: ['main'],
  images: {
    navidrome: {
      // Confirmed amd64 + arm64 present 2026-10-07.
      source: {
        dockerBuild: { buildArgs: { IMAGE: 'deluan/navidrome:0.64.2' } },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
