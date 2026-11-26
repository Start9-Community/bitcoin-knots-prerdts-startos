import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { rm } from 'fs/promises'
import { clearOnionTarget } from 'tor-startos/startos/utils/target'
import { bitcoinConfFile } from '../fileModels/bitcoin.conf'
import { sdk } from '../sdk'
import { peerHostId, peerPortInternal } from '../utils'

/**
 * Reset all mempool settings to undefined so the new flavor's upstream
 * defaults take effect.
 */
/** Bitcoin Core's onion relay, which this flavor doesn't bind. */
const coreOnion = {
  packageId: 'bitcoind',
  hostId: peerHostId,
  internalPort: peerPortInternal,
}

const mempoolReset = {
  // Shared mempool settings
  persistmempool: undefined,
  maxmempool: undefined,
  mempoolexpiry: undefined,
  mempoolfullrbf: undefined,
  permitbaremultisig: undefined,
  datacarrier: undefined,
  datacarriersize: undefined,
  // Knots-specific mempool settings
  permitbaredatacarrier: undefined,
  rejectparasites: undefined,
  rejecttokens: undefined,
  mempoolreplacement: undefined,
  mempooltruc: undefined,
  permitbareanchor: undefined,
  permitephemeral: undefined,
  minrelaytxfee: undefined,
  bytespersigop: undefined,
  bytespersigopstrict: undefined,
  maxtxlegacysigops: undefined,
  limitancestorcount: undefined,
  limitancestorsize: undefined,
  limitdescendantcount: undefined,
  limitdescendantsize: undefined,
  permitbarepubkey: undefined,
  maxscriptsize: undefined,
  datacarriercost: undefined,
  acceptnonstddatacarrier: undefined,
  dustrelayfee: undefined,
  acceptunknownwitness: undefined,
  minrelaycoinblocks: undefined,
  minrelaymaturity: undefined,
}

export const current = VersionInfo.of({
  version: '#knotsprerdts:29.3:38',
  releaseNotes: {
    en_US:
      'Switching from Bitcoin Core also removes the .onion forwarding it set up in Tor.',
    es_ES:
      'Al cambiar desde Bitcoin Core también se elimina el reenvío .onion que configuró en Tor.',
    de_DE:
      'Beim Wechsel von Bitcoin Core wird auch die .onion-Weiterleitung entfernt, die es in Tor eingerichtet hat.',
    pl_PL:
      'Przejście z Bitcoin Core usuwa też przekierowanie .onion, które skonfigurował w Tor.',
    fr_FR:
      "Le passage depuis Bitcoin Core supprime aussi la redirection .onion qu'il avait configurée dans Tor.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
    other: {
      // Core ↔ #knotsprerdts, keyed by Core major series.
      ['^28']: {
        up: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
          await clearOnionTarget(sdk, effects, coreOnion)
        },
        down: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
        },
      },
      ['^29']: {
        up: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
          await clearOnionTarget(sdk, effects, coreOnion)
        },
        down: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
        },
      },
      ['^30']: {
        up: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
          await clearOnionTarget(sdk, effects, coreOnion)
          await rm('/media/startos/volumes/main/indexes/coinstatsindex', {
            recursive: true,
            force: true,
          }).catch(console.error)
        },
        down: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
        },
      },
      ['^31']: {
        up: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
          await clearOnionTarget(sdk, effects, coreOnion)
          await rm('/media/startos/volumes/main/fee_estimates.dat', {
            force: true,
          }).catch(console.error)
          await rm('/media/startos/volumes/main/indexes/coinstatsindex', {
            recursive: true,
            force: true,
          }).catch(console.error)
        },
        down: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
        },
      },
      // Refused: Core 32 data on Knots 29.3 is a cross-major downgrade; the failed update rolls back to Core.
      ['^32']: {
        up: async () => {
          throw new Error(
            'Bitcoin Knots (pre-RDTS) cannot replace Bitcoin Core 32.x: it runs Knots 29.3, and moving a Core 32 data directory back to 29.3 is a downgrade across major versions. Keep Bitcoin Core, or uninstall it (which deletes the blockchain data) and install Bitcoin Knots (pre-RDTS) fresh.',
          )
        },
      },
      // #knots through :7 ran Knots 29.3.knots20260210 or earlier; :8 is the first RDTS build.
      ['<=#knots:29.3:7']: {
        up: async () => {},
      },
    },
  },
})
  .satisfies('29.4:15')
  .satisfies('28.4:28')
