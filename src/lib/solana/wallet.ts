import { Connection, clusterApiUrl, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import type { WalletContextState } from '@solana/wallet-adapter-react';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';

// Use devnet for development
const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);

export const connection = new Connection(endpoint, 'confirmed');

// Create a wallet adapter that implements Anchor's Wallet interface
export function createAnchorWallet(walletState: WalletContextState): Wallet {
  return {
    publicKey: walletState.publicKey || PublicKey.default,
    async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
      if (!walletState.signTransaction) {
        throw new Error('Wallet does not support signing transactions');
      }
      return walletState.signTransaction(tx) as Promise<T>;
    },
    async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
      if (!walletState.signAllTransactions) {
        throw new Error('Wallet does not support signing multiple transactions');
      }
      return walletState.signAllTransactions(txs) as Promise<T[]>;
    },
    payer: Keypair.generate() // Generate a dummy keypair for Anchor
  };
}

// Export wallet context type
export type { WalletContextState };
