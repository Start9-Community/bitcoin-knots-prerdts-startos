import { bitcoinConfFile } from '../fileModels/bitcoin.conf'
import { sdk } from '../sdk'
import {
  ensureWalletLoaded,
  getSelectedWallet,
  rootDir,
  rpcArgs,
  walletLabel,
} from '../utils'
import { i18n } from '../i18n'

export const getbalance = sdk.Action.withoutInput(
  // id
  'get-balance',

  // metadata
  async ({ effects }) => {
    const conf = (await bitcoinConfFile.read().const(effects))!

    return {
      name: i18n('Get Balance'),
      description: i18n('Get the balance of your Bitcoin wallet.'),
      warning: null,
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

    const res = await sdk.SubContainer.withTemp(
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
      'getbalance',
      async (subc) => {
        await ensureWalletLoaded(subc, { prune: !!conf.prune, wallet })

        const balancesRes = await subc.execFail([
          'bitcoin-cli',
          ...rpcArgs({ prune: !!conf.prune, wallet }),
          'getbalances',
        ])
        return JSON.parse(balancesRes.stdout as string).mine as {
          trusted: number
          untrusted_pending: number
          immature: number
        }
      },
    )

    const balance = (name: string, description: string, btc: number) => ({
      type: 'single' as const,
      name,
      description,
      value: `${btc.toFixed(8)} BTC`,
      copyable: true,
      qr: false,
      masked: false,
    })

    return {
      version: '1',
      title: i18n('Wallet ${wallet}', { wallet: walletLabel(wallet) }),
      message: null,
      result: {
        type: 'group',
        value: [
          balance(
            i18n('Trusted'),
            i18n(
              'Confirmed funds, plus unconfirmed outputs this wallet created itself, such as change.',
            ),
            res.trusted,
          ),
          balance(
            i18n('Untrusted Pending'),
            i18n('Unconfirmed funds from others, waiting in the mempool.'),
            res.untrusted_pending,
          ),
          balance(
            i18n('Immature'),
            i18n('Mining rewards that cannot be spent yet.'),
            res.immature,
          ),
        ],
      },
    }
  },
)
