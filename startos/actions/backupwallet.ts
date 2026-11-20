import { bitcoinConfFile } from '../fileModels/bitcoin.conf'
import { sdk } from '../sdk'
import {
  ensureWalletLoaded,
  getSelectedWallet,
  isPathSafeWalletName,
  rootDir,
  rpcArgs,
  walletLabel,
} from '../utils'
import { i18n } from '../i18n'

export const backupwallet = sdk.Action.withoutInput(
  // id
  'backup-wallet',

  // metadata
  async ({ effects }) => {
    const conf = (await bitcoinConfFile.read().const(effects))!
    const wallet = await getSelectedWallet(effects)

    return {
      name: i18n('Backup wallet'),
      description: i18n(
        'Writes a copy of wallet ${wallet} to the file ${file} at the top of the main data volume, which StartOS backups include. Restore wallet reads it back from there.',
        {
          wallet: walletLabel(wallet),
          file: isPathSafeWalletName(wallet) ? `${wallet}.dat` : 'default.dat',
        },
      ),
      warning: i18n(
        'Replaces any earlier backup of wallet ${wallet} with a copy of the wallet as it is now.',
        { wallet: walletLabel(wallet) },
      ),
      allowedStatuses: 'only-running',
      group: i18n('Wallet'),
      visibility: !conf?.raw?.disablewallet
        ? 'enabled'
        : { disabled: i18n('Wallet is disabled') },
    }
  },

  // execution function
  async ({ effects }) => {
    const mountpoint = '/scripts'

    const conf = (await bitcoinConfFile.read().const(effects))!
    const wallet = await getSelectedWallet()

    // The default wallet '' has no path-safe name; back it up as default.dat
    const backupFile = isPathSafeWalletName(wallet)
      ? `${rootDir}/${wallet}.dat`
      : `${rootDir}/default.dat`

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'bitcoind' },
      sdk.Mounts.of()
        .mountVolume({
          volumeId: 'main',
          subpath: null,
          mountpoint: rootDir,
          readonly: false,
        })
        .mountAssets({ subpath: null, mountpoint }),
      'Backup wallet',
      async (subc) => {
        await ensureWalletLoaded(subc, { prune: !!conf.prune, wallet })

        return await subc.execFail([
          'bitcoin-cli',
          ...rpcArgs({ prune: !!conf.prune, wallet }),
          'backupwallet',
          backupFile,
        ])
      },
    )

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n('Wallet ${wallet} has been backed up to ${file}', {
        wallet: walletLabel(wallet),
        file: backupFile,
      }),
      result: null,
    }
  },
)
