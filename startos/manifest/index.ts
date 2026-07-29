import { setupManifest } from '@start9labs/start-sdk'
import {
  filebrowserDescription,
  long,
  multiScrobblerDescription,
  nextcloudDescription,
  short,
} from './i18n'

export const manifest = setupManifest({
  id: 'navidrome',
  title: 'Navidrome',
  license: 'GPL-3.0',
  packageRepo: 'https://github.com/Jolls/navidrome-startos',
  upstreamRepo: 'https://github.com/navidrome/navidrome',
  marketingUrl: 'https://www.navidrome.org',
  donationUrl: 'https://github.com/sponsors/deluan',
  description: { short, long },
  // 'main' holds Navidrome's database and cache (mounted at /data). The music
  // library itself is not our volume — it's mounted read-only from whichever
  // dependency the user selects (see startos/main.ts, startos/dependencies.ts).
  volumes: ['main'],
  images: {
    // Confirmed on Docker Hub 2026-07-28: deluan/navidrome:0.63.2 ships amd64
    // and arm64 (see UPDATING.md for the recheck command).
    navidrome: {
      source: { dockerTag: 'deluan/navidrome:0.63.2' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    filebrowser: {
      description: filebrowserDescription,
      optional: true,
      metadata: {
        title: 'File Browser',
        icon: 'https://raw.githubusercontent.com/Start9Labs/filebrowser-startos/cdb4ff27ea743229ed057ff384be37c903c0f29c/icon.svg',
      },
    },
    nextcloud: {
      description: nextcloudDescription,
      optional: true,
      metadata: {
        title: 'Nextcloud',
        icon: 'https://raw.githubusercontent.com/Start9Labs/nextcloud-startos/80cf5c9b8bc8877df282061fb3dc187b34246656/icon.svg',
      },
    },
    'multi-scrobbler': {
      description: multiScrobblerDescription,
      optional: true,
      metadata: {
        title: 'Multi-Scrobbler',
        icon: 'https://raw.githubusercontent.com/Jolls/multi-scrobbler-startos/refs/heads/master/icon.svg',
      },
    },
  },
})
