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
  version: '#knotsprerdts:29.3:29',
  releaseNotes: {
    en_US: `- Restore wallet no longer reports failure while a large wallet is still being restored.
- Frees the peer port that the StartOS 0.3.5 version of Bitcoin left claimed. If that version had a Tor address on the Peer interface, Bitcoin moves it to the current peer port, keeping the same .onion address, as soon as a version of Tor that allows it is installed.
- Delete Peer List, Backup wallet and Restore wallet ask for confirmation before running.
- Get Address, Sign Message, Send Coins and Send All Coins show their result in a field with a copy button, and Get Address also as a QR code. Get Balance lists each balance on its own line.
- When Generate RPC User Credentials fails, its error output is shown in a field you can copy.
- Restarting Bitcoin no longer leaves dependent services unable to connect until this service is restarted too.
- On a pruned node, blocks from the 2016 SegWit signalling period can be fetched for dependent services again.
- A service that needs Bitcoin's wallet can turn it on from its setup task.`,
    es_ES: `- Restore wallet ya no informa de un fallo mientras un monedero grande aún se está restaurando.
- Libera el puerto de pares que la versión de Bitcoin para StartOS 0.3.5 dejó reservado. Si esa versión tenía una dirección Tor en la interfaz Peer, Bitcoin la traslada al puerto de pares actual, conservando la misma dirección .onion, en cuanto se instala una versión de Tor que lo permita.
- Eliminar lista de pares, Backup wallet y Restore wallet piden confirmación antes de ejecutarse.
- Get Address, Sign Message, Send Coins y Send All Coins muestran su resultado en un campo con botón de copiar, y Get Address también como código QR. Get Balance muestra cada saldo en su propia línea.
- Cuando Generar credenciales de usuario RPC falla, su salida de error se muestra en un campo que se puede copiar.
- Reiniciar Bitcoin ya no deja a los servicios dependientes sin poder conectarse hasta que también se reinicie este servicio.
- En un nodo podado, los bloques del periodo de señalización de SegWit de 2016 vuelven a poder obtenerse para los servicios dependientes.
- Un servicio que necesita el monedero de Bitcoin puede activarlo desde su tarea de configuración.`,
    de_DE: `- Restore wallet meldet keinen Fehler mehr, während eine große Wallet noch wiederhergestellt wird.
- Gibt den Peer-Port frei, den die StartOS-0.3.5-Version von Bitcoin belegt gelassen hatte. Hatte diese Version eine Tor-Adresse an der Peer-Schnittstelle, verlegt Bitcoin sie auf den aktuellen Peer-Port und behält dieselbe .onion-Adresse, sobald eine Tor-Version installiert ist, die das erlaubt.
- „Peer-Liste löschen“, Backup wallet und Restore wallet fragen vor der Ausführung nach einer Bestätigung.
- Get Address, Sign Message, Send Coins und Send All Coins zeigen ihr Ergebnis in einem Feld mit Kopierschaltfläche, Get Address zusätzlich als QR-Code. Get Balance zeigt jeden Saldo in einer eigenen Zeile.
- Schlägt „RPC-Benutzeranmeldeinformationen generieren“ fehl, wird die Fehlerausgabe in einem kopierbaren Feld angezeigt.
- Ein Neustart von Bitcoin lässt abhängige Dienste nicht mehr ohne Verbindung zurück, bis auch dieser Dienst neu gestartet wird.
- Auf einem beschnittenen Knoten können Blöcke aus der SegWit-Signalisierungsphase von 2016 wieder für abhängige Dienste abgerufen werden.
- Ein Dienst, der die Wallet von Bitcoin braucht, kann sie über seine Einrichtungsaufgabe einschalten.`,
    pl_PL: `- Restore wallet nie zgłasza już błędu, gdy duży portfel jest wciąż przywracany.
- Zwalnia port peerów, który pozostawiła zajęty wersja Bitcoina dla StartOS 0.3.5. Jeśli ta wersja miała adres Tor w interfejsie Peer, Bitcoin przenosi go na obecny port peerów, zachowując ten sam adres .onion, gdy tylko zostanie zainstalowana wersja Tora, która na to pozwala.
- „Usuń listę peerów”, Backup wallet i Restore wallet proszą o potwierdzenie przed uruchomieniem.
- Get Address, Sign Message, Send Coins i Send All Coins pokazują wynik w polu z przyciskiem kopiowania, a Get Address także jako kod QR. Get Balance pokazuje każde saldo w osobnym wierszu.
- Gdy „Generuj dane uwierzytelniające użytkownika RPC” się nie powiedzie, komunikat błędu jest wyświetlany w polu, które można skopiować.
- Ponowne uruchomienie Bitcoina nie pozostawia już usług zależnych bez połączenia do czasu ponownego uruchomienia także tej usługi.
- W przyciętym węźle bloki z okresu sygnalizacji SegWit z 2016 roku można ponownie pobierać na potrzeby usług zależnych.
- Usługa, która potrzebuje portfela Bitcoina, może go włączyć przez swoje zadanie konfiguracji.`,
    fr_FR: `- Restore wallet ne signale plus d'échec pendant qu'un portefeuille volumineux est encore en cours de restauration.
- Libère le port des pairs que la version de Bitcoin pour StartOS 0.3.5 avait laissé réservé. Si cette version avait une adresse Tor sur l'interface Peer, Bitcoin la déplace vers le port des pairs actuel, en conservant la même adresse .onion, dès qu'une version de Tor qui le permet est installée.
- Supprimer la liste des pairs, Backup wallet et Restore wallet demandent une confirmation avant de s'exécuter.
- Get Address, Sign Message, Send Coins et Send All Coins affichent leur résultat dans un champ avec un bouton de copie, et Get Address aussi sous forme de code QR. Get Balance affiche chaque solde sur sa propre ligne.
- Lorsque Générer les informations d'identification utilisateur RPC échoue, sa sortie d'erreur s'affiche dans un champ que l'on peut copier.
- Redémarrer Bitcoin ne laisse plus les services dépendants incapables de se connecter jusqu'à ce que ce service soit lui aussi redémarré.
- Sur un nœud élagué, les blocs de la période de signalisation SegWit de 2016 peuvent à nouveau être récupérés pour les services dépendants.
- Un service qui a besoin du portefeuille de Bitcoin peut l'activer depuis sa tâche de configuration.`,
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
