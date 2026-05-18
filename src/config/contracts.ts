import deployedAddresses from './deployed-addresses.json';

export const SEPOLIA_CHAIN_ID = 11155111;

export const CONTRACT_ADDRESSES = {
  XOFToken:        deployedAddresses.contracts.XOFToken,
  EURToken:        deployedAddresses.contracts.EURToken,
  USDToken:        deployedAddresses.contracts.USDToken,
  RateOracle:      deployedAddresses.contracts.RateOracle,
  TransferManager: deployedAddresses.contracts.TransferManager,
} as const;

export const TOKEN_ADDRESS: Record<'EUR' | 'USD', string> = {
  EUR: CONTRACT_ADDRESSES.EURToken,
  USD: CONTRACT_ADDRESSES.USDToken,
};

export const TRANSFER_MANAGER_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'recipient',    type: 'address' },
      { internalType: 'uint256', name: 'amountXOF',    type: 'uint256' },
      { internalType: 'address', name: 'targetToken_', type: 'address' },
    ],
    name: 'initiateTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true,  internalType: 'address', name: 'sender',     type: 'address' },
      { indexed: true,  internalType: 'address', name: 'recipient',  type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amountXOF',  type: 'uint256' },
      { indexed: true,  internalType: 'address', name: 'targetToken',type: 'address' },
    ],
    name: 'TransferInitiated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true,  internalType: 'address', name: 'recipient',   type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amountTarget', type: 'uint256' },
      { indexed: true,  internalType: 'address', name: 'targetToken',  type: 'address' },
    ],
    name: 'TransferCompleted',
    type: 'event',
  },
] as const;

export const RATE_ORACLE_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'targetToken', type: 'address' }],
    name: 'getRate',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const ERC20_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
