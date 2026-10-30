import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { rm } from 'fs/promises'
import { bitcoinConfFile } from '../fileModels/bitcoin.conf'

/**
 * Reset all mempool settings to undefined so the new flavor's upstream
 * defaults take effect.
 */
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
  version: '#knotsprerdts:29.3:32',
  releaseNotes: {
    en_US:
      'A new Background Validation health check shows progress while Bitcoin validates the blocks beneath a UTXO snapshot. The Sync Complete notification arrives once that finishes.',
    es_ES:
      'Una nueva comprobación de salud, Validación en segundo plano, muestra el progreso mientras Bitcoin valida los bloques anteriores a una instantánea UTXO. La notificación Sincronización completa llega cuando termina.',
    de_DE:
      'Eine neue Statusprüfung, Hintergrundvalidierung, zeigt den Fortschritt, während Bitcoin die Blöcke unterhalb eines UTXO-Snapshots validiert. Die Benachrichtigung „Synchronisierung abgeschlossen“ erscheint, sobald dies beendet ist.',
    pl_PL:
      'Nowa kontrola stanu, Walidacja w tle, pokazuje postęp, gdy Bitcoin weryfikuje bloki poniżej migawki UTXO. Powiadomienie Synchronizacja zakończona pojawia się po jej ukończeniu.',
    fr_FR:
      'Une nouvelle vérification de santé, Validation en arrière-plan, affiche la progression pendant que Bitcoin valide les blocs antérieurs à un instantané UTXO. La notification Synchronisation terminée arrive une fois celle-ci achevée.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
    other: {
      // Core ↔ #knotsprerdts, keyed by Core major series.
      ['^28']: {
        up: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
        },
        down: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
        },
      },
      ['^29']: {
        up: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
        },
        down: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
        },
      },
      ['^30']: {
        up: async ({ effects }) => {
          await bitcoinConfFile.merge(effects, mempoolReset)
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
      // #knots through :7 ran Knots 29.3.knots20260210 or earlier; :8 is the first RDTS build.
      ['<=#knots:29.3:7']: {
        up: async () => {},
      },
    },
  },
})
  .satisfies('29.4:15')
  .satisfies('28.4:28')
