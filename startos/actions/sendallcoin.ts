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

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  address: Value.dynamicText(async ({ effects }) => ({
    name: i18n('Address'),
    description: i18n('The Bitcoin address you want to send the funds.'),
    required: true,
    default: null,
    patterns: [
      {
        regex: '^[a-zA-Z0-9]+$',
        description: i18n('Must be alphanumeric.'),
      },
    ],
  })),
  fee: Value.dynamicText(async ({ effects }) => ({
    name: i18n('Fee'),
    description: i18n(
      'Fee rate in sat/vB: greater than 0 and at most 1000, with up to 3 decimal places.',
    ),
    required: true,
    default: null,
    patterns: [
      {
        regex: '^(?=.*[1-9])([0-9]{1,3}(\\.[0-9]{1,3})?|1000(\\.0{1,3})?)$',
        description: i18n(
          'Must be greater than 0 and at most 1000 sat/vB, with up to 3 decimal places.',
        ),
      },
    ],
  })),
})

export const sendAllCoin = sdk.Action.withInput(
  // id
  'send-all-coin',

  // metadata
  async ({ effects }) => {
    const conf = (await bitcoinConfFile.read().const(effects))!

    return {
      name: i18n('Send All Coins'),
      description: i18n('Send all coins to a Bitcoin address.'),
      warning: i18n(
        'Sends the entire balance of wallet ${wallet} on this node. A sent transaction cannot be reversed: check the address before you submit.',
        { wallet: walletLabel(await getSelectedWallet(effects)) },
      ),
      allowedStatuses: 'only-running',
      group: i18n('Wallet'),
      visibility: !conf?.raw?.disablewallet
        ? 'enabled'
        : { disabled: i18n('Wallet is disabled') },
    }
  },

  // input spec
  inputSpec,

  // optionally pre-fill form
  async ({ effects }) => ({}),

  // execution function
  async ({ effects, input }) => {
    const { address, fee } = input

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
      'sendallcoin',
      async (subc) => {
        await ensureWalletLoaded(subc, { prune: !!conf.prune, wallet })

        const result = await subc.execFail([
          'bitcoin-cli',
          ...rpcArgs({ prune: !!conf.prune, wallet }),
          '-named',
          'sendall',
          `recipients=["${address}"]`,
          `fee_rate=${fee}`,
        ])

        const txid = JSON.parse(result.stdout as string)

        return `${txid.txid}`
      },
    )

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n('The transaction was sent. Its ID is below.'),
      result: {
        type: 'single',
        value: res,
        copyable: true,
        qr: false,
        launchable: false,
        masked: false,
      },
    }
  },
)
