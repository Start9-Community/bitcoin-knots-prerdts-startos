# Updating

## Bitcoin Knots

There is no further upstream version: `29.3.knots20260507` is the last non-RDTS Knots release, and this package stays pinned to it.

The pin is the `VERSION` build arg in `images.bitcoind.source.dockerBuild.buildArgs` (`startos/manifest/index.ts`), with `PATH_VERSION = '29.x'`. The `Dockerfile` downloads the release from `bitcoinknots.org/files/${PATH_VERSION}/${VERSION}/` and verifies `SHA256SUMS.asc` against a 3-of-5 quorum of the release signers in `assets/release-keys/` (`PINNED_FINGERPRINTS`). If upstream moves that path or rotates those keys, a rebuild needs both refreshed.

## btc-rpc-proxy

`images.proxy.source.dockerTag`, a Start9-built image: `ghcr.io/start9labs/btc-rpc-proxy:v<version>`.

## Python

`images.python.source.dockerTag`, the official `python:<version>-alpine` image on Docker Hub.

## i2pd

`images.i2pd.source.dockerTag`, `purplei2p/i2pd:release-<version>` on Docker Hub; releases at <https://github.com/PurpleI2P/i2pd/releases>. `startos/i2pdLogFilter.ts`'s drop list matches the pinned image's exact log wording: after a bump, check the new image's messages against it and fold reworded ones into the list and `test/i2pdLogFilter.test.ts`.
