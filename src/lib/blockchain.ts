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

export async function getTokenBalance(tokenAddress: string, account: string): Promise<string> {
  const provider = getProvider();
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
    throw new Error(`Switch MetaMask to Sepolia: detected chainId ${network.chainId}`);
  }

  const token = new Contract(tokenAddress, ERC20_ABI, provider);
  const raw: bigint = await token.balanceOf(account);
  const decimals: number = await token.decimals();

  console.log('getTokenBalance', {
    tokenAddress,
    account,
    raw: raw.toString(),
    decimals,
    network: network.chainId,
  });

  return formatUnits(raw, decimals);
}

export async function getXOFBalance(account: string): Promise<string> {
  return getTokenBalance(CONTRACT_ADDRESSES.XOFToken, account);
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

  const [sentEvents, receivedEvents] = await Promise.all([
    manager.queryFilter(manager.filters.TransferInitiated(account), fromBlock),
    manager.queryFilter(manager.filters.TransferCompleted(account), fromBlock),
  ]);

  const blockCache = new Map<number, number>();
  async function getTimestamp(blockNumber: number): Promise<number> {
    if (blockCache.has(blockNumber)) return blockCache.get(blockNumber)!;
    const block = await provider.getBlock(blockNumber);
    const ts = block?.timestamp ?? Math.floor(Date.now() / 1000);
    blockCache.set(blockNumber, ts);
    return ts;
  }

  function toDate(ts: number) {
    return new Date(ts * 1000).toLocaleString('fr-FR', {
      hour: '2-digit', minute: '2-digit',
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }

  const sent: Transaction[] = await Promise.all(
    sentEvents.map(async (ev) => {
      const ts = await getTimestamp(ev.blockNumber);
      const log = ev as unknown as { args: { amountXOF: bigint; targetToken: string; recipient: string } };
      const targetAddr = log.args.targetToken.toLowerCase();
      const targetCurrency = targetAddr === TOKEN_ADDRESS.EUR.toLowerCase() ? 'EUR' : 'USD';
      return {
        id: ev.transactionHash,
        amount: Number(formatUnits(log.args.amountXOF, 18)).toFixed(2),
        recipient: log.args.recipient,
        sourceCurrency: 'XOF' as const,
        targetCurrency,
        rate: 0,
        status: 'Envoyé',
        date: toDate(ts),
        txHash: ev.transactionHash,
      };
    }),
  );

  const received: Transaction[] = await Promise.all(
    receivedEvents.map(async (ev) => {
      const ts = await getTimestamp(ev.blockNumber);
      const log = ev as unknown as { args: { amountTarget: bigint; targetToken: string; recipient: string } };
      const targetAddr = log.args.targetToken.toLowerCase();
      const currency = targetAddr === TOKEN_ADDRESS.EUR.toLowerCase() ? 'EUR' : 'USD';
      return {
        id: `recv-${ev.transactionHash}`,
        amount: Number(formatUnits(log.args.amountTarget, 18)).toFixed(4),
        recipient: account,
        sourceCurrency: currency as 'EUR' | 'USD',
        targetCurrency: currency as 'EUR' | 'USD',
        rate: 0,
        status: 'Reçu',
        date: toDate(ts),
        txHash: ev.transactionHash,
      };
    }),
  );

  return [...sent, ...received].sort((a, b) => b.date.localeCompare(a.date));
}
