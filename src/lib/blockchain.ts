import { BrowserProvider, Contract, parseUnits, formatUnits } from 'ethers';
import {
  CONTRACT_ADDRESSES,
  TOKEN_ADDRESS,
  TRANSFER_MANAGER_ABI,
  RATE_ORACLE_ABI,
  ERC20_ABI,
  SEPOLIA_CHAIN_ID,
} from '@/config/contracts';
import type { Transaction } from '@/store/useAppStore';

function getProvider(): BrowserProvider {
  if (!window.ethereum) throw new Error('MetaMask non détecté');
  return new BrowserProvider(window.ethereum);
}

async function getSigner() {
  const provider = getProvider();
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
    throw new Error('Veuillez basculer MetaMask sur le réseau Sepolia');
  }
  return provider.getSigner();
}

export async function getXOFBalance(account: string): Promise<string> {
  const provider = getProvider();
  const xof = new Contract(CONTRACT_ADDRESSES.XOFToken, ERC20_ABI, provider);
  const raw: bigint = await xof.balanceOf(account);
  return formatUnits(raw, 18);
}

export async function getLiveRate(targetCurrency: 'EUR' | 'USD'): Promise<number> {
  const provider = getProvider();
  const oracle = new Contract(CONTRACT_ADDRESSES.RateOracle, RATE_ORACLE_ABI, provider);
  const raw: bigint = await oracle.getRate(TOKEN_ADDRESS[targetCurrency]);
  // raw = XOF_per_1_target * 1e18  (e.g. 655.957e18 for EUR)
  return Number(formatUnits(raw, 18));
}

export async function executeTransfer(
  recipient: string,
  amountXOF: string,
  targetCurrency: 'EUR' | 'USD',
): Promise<string> {
  const signer = await getSigner();
  const manager = new Contract(CONTRACT_ADDRESSES.TransferManager, TRANSFER_MANAGER_ABI, signer);
  const amountWei = parseUnits(amountXOF, 18);
  const tx = await manager.initiateTransfer(recipient, amountWei, TOKEN_ADDRESS[targetCurrency]);
  const receipt = await tx.wait();
  return receipt.hash as string;
}

export async function fetchTransferHistory(account: string): Promise<Transaction[]> {
  const provider = getProvider();
  const manager = new Contract(CONTRACT_ADDRESSES.TransferManager, TRANSFER_MANAGER_ABI, provider);

  const currentBlock = await provider.getBlockNumber();
  const fromBlock = Math.max(0, currentBlock - 50_000);

  const filter = manager.filters.TransferInitiated(account);
  const events = await manager.queryFilter(filter, fromBlock);

  const txns: Transaction[] = await Promise.all(
    events.map(async (ev) => {
      const block = await provider.getBlock(ev.blockNumber);
      const timestamp = block?.timestamp ?? Math.floor(Date.now() / 1000);
      const date = new Date(timestamp * 1000).toLocaleString('fr-FR', {
        hour: '2-digit', minute: '2-digit',
        day: '2-digit', month: '2-digit', year: 'numeric',
      });

      const log = ev as unknown as { args: { amountXOF: bigint; targetToken: string; recipient: string } };
      const amountXOF = formatUnits(log.args.amountXOF, 18);
      const targetAddr = log.args.targetToken.toLowerCase();
      const targetCurrency = targetAddr === TOKEN_ADDRESS.EUR.toLowerCase() ? 'EUR' : 'USD';

      return {
        id: ev.transactionHash,
        amount: Number(amountXOF).toFixed(2),
        recipient: log.args.recipient,
        sourceCurrency: 'XOF',
        targetCurrency,
        rate: 0,
        status: 'Confirmé',
        date,
        txHash: ev.transactionHash,
      } satisfies Transaction;
    }),
  );

  return txns.reverse();
}
