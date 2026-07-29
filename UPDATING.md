# Updating the upstream version

Upstream is the `deluan/navidrome` Docker image, pinned by tag in `startos/manifest/index.ts` (`images.navidrome.source.dockerTag`).

## Determining the upstream version

- Latest tags: `curl -s "https://hub.docker.com/v2/repositories/deluan/navidrome/tags?page_size=25" | jq -r '.results[].name'`
- Confirm architectures for the tag you're bumping to (must include `amd64` and `arm64`):
  `docker manifest inspect deluan/navidrome:<tag> | jq -r '.manifests[].platform.architecture'`
- Release notes: <https://github.com/navidrome/navidrome/releases>

## Applying the bump

1. Edit `images.navidrome.source.dockerTag` in `startos/manifest/index.ts` to the new `deluan/navidrome:<tag>`. Update the confirmation-date comment above it.
2. Bump `startos/versions/current.ts` (or add a new version file if the bump needs a migration — see `versions.md`). Navidrome's version tags map directly onto our version string (`<upstream>:0`).
3. Rebuild (`start-cli s9pk pack`), install, and verify the web player still loads, logs in with the existing admin account, and the music library (mounted from the configured source(s)) still scans correctly.
