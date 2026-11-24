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
  version: '#knotsprerdts:29.3:37',
  releaseNotes: {
    en_US:
      'Requires StartOS 0.4.2 or later. ZeroMQ notifications are now reachable only by other services on this server, no longer from your local network: the ZeroMQ Block and ZeroMQ Transaction interfaces are removed, and services that use ZeroMQ, such as LND, are unaffected. Fixes memory use growing while the service runs.',
    es_ES:
      'Requiere StartOS 0.4.2 o posterior. Las notificaciones ZeroMQ ahora solo son accesibles para otros servicios de este servidor, ya no desde su red local: se eliminan las interfaces Bloque ZeroMQ y Transacción ZeroMQ, y los servicios que usan ZeroMQ, como LND, no se ven afectados. Corrige el aumento del uso de memoria mientras el servicio está en ejecución.',
    de_DE:
      'Erfordert StartOS 0.4.2 oder neuer. ZeroMQ-Benachrichtigungen sind jetzt nur noch für andere Dienste auf diesem Server erreichbar, nicht mehr aus Ihrem lokalen Netzwerk: Die Schnittstellen ZeroMQ-Block und ZeroMQ-Transaktion wurden entfernt, und Dienste, die ZeroMQ nutzen, etwa LND, sind nicht betroffen. Behebt einen während der Laufzeit des Dienstes ansteigenden Speicherverbrauch.',
    pl_PL:
      'Wymaga StartOS 0.4.2 lub nowszego. Powiadomienia ZeroMQ są teraz dostępne tylko dla innych usług na tym serwerze, a nie z sieci lokalnej: usunięto interfejsy Blok ZeroMQ i Transakcja ZeroMQ, a usługi korzystające z ZeroMQ, takie jak LND, działają bez zmian. Naprawia wzrost zużycia pamięci podczas działania usługi.',
    fr_FR:
      "Nécessite StartOS 0.4.2 ou une version ultérieure. Les notifications ZeroMQ ne sont désormais accessibles qu'aux autres services de ce serveur, et non plus depuis votre réseau local : les interfaces Bloc ZeroMQ et Transaction ZeroMQ sont supprimées, et les services qui utilisent ZeroMQ, comme LND, ne sont pas affectés. Corrige l'augmentation de la consommation de mémoire pendant le fonctionnement du service.",
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
