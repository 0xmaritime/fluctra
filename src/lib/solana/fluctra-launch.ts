import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, Connection, Keypair, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import type { FluctraLaunch } from './types/fluctra_launch';
import idl from './idl/fluctra_launch.json';

// Program ID from the deployed contract
const PROGRAM_ID = new PublicKey('FL1ctrAL111111111111111111111111111111111');

// Fee recipient wallet - this should be configured based on your application's needs
const FEE_RECIPIENT_WALLET = new PublicKey('FeeR3c1p13nt111111111111111111111111111111');

// Fixed listing fee in lamports (0.1 SOL = 100,000,000 lamports)
const FIXED_LISTING_FEE = 100000000;

export class FluctraLaunchClient {
  private program: Program<FluctraLaunch>;
  private connection: Connection;
  private wallet: anchor.Wallet;

  constructor(connection: Connection, wallet: anchor.Wallet) {
    this.connection = connection;
    this.wallet = wallet;

    // Create the program interface using the IDL
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    );
    
    // Create program instance with proper typing
    this.program = new Program<FluctraLaunch>(
      idl as FluctraLaunch,
      provider
    );
  }

  async getPoolAccount(poolAddress: PublicKey): Promise<{
    creator: PublicKey;
    tokenMint: PublicKey;
    poolTokenAccount: PublicKey;
    totalTokensForSale: anchor.BN;
    tokensSold: anchor.BN;
    discountRateBasisPoints: number;
    durationSeconds: anchor.BN;
    startTime: anchor.BN;
    isActive: boolean;
    platformFeeBasisPoints: number;
    treasury: PublicKey;
    bump: number;
    buyers: PublicKey[];
  }> {
    return (this.program.account as any).poolAccount.fetch(poolAddress);
  }

  /**
   * Initialize a new discount pool
   * 
   * @param tokenMint The mint address of the token being sold
   * @param totalTokensForSale The total number of tokens to sell in the pool
   * @param discountRateBasisPoints The discount rate in basis points (100 = 1%)
   * @param durationSeconds The duration of the pool in seconds
   * @returns Transaction signature
   */
  async initializePool(
    tokenMint: PublicKey,
    totalTokensForSale: number,
    discountRateBasisPoints: number,
    durationSeconds: number
  ): Promise<string> {
    try {
      // Convert parameters to the correct format
      const totalTokensForSaleBN = new anchor.BN(totalTokensForSale);
      const durationSecondsBN = new anchor.BN(durationSeconds);
      
      // Find the PDA for the pool account
      const [poolAccount, bump] = await PublicKey.findProgramAddress(
        [
          Buffer.from('pool'),
          this.wallet.publicKey.toBuffer(),
          tokenMint.toBuffer()
        ],
        this.program.programId
      );

      // Get the creator's token account for the specified mint
      const creatorTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        this.wallet.publicKey
      );

      // Get the pool's token account for the specified mint
      const poolTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        poolAccount,
        true // allowOwnerOffCurve
      );

      // Send the transaction
      const tx = await this.program.methods
        .initializePool(
          new anchor.BN(FIXED_LISTING_FEE),
          totalTokensForSaleBN,
          discountRateBasisPoints,
          durationSecondsBN,
          bump
        )
        .accounts({
          creator: this.wallet.publicKey,
          poolAccount: poolAccount as any,
          creatorTokenAccount,
          poolTokenAccount,
          feeRecipientWallet: FEE_RECIPIENT_WALLET,
          tokenMint,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        } as any)
        .rpc();

      return tx;
    } catch (error) {
      console.error('Error initializing pool:', error);
      throw error;
    }
  }

  /**
   * Get all pools created by the current wallet
   * 
   * @returns Array of pool accounts
   */
  async getMyPools() {
    try {
      // Filter for pools where the creator is the current wallet
      const pools = await (this.program.account as any).poolAccount.all([
        {
          memcmp: {
            offset: 8, // Skip the discriminator
            bytes: this.wallet.publicKey.toBase58(),
          },
        },
      ]);

      return pools;
    } catch (error) {
      console.error('Error fetching pools:', error);
      throw error;
    }
  }

  /**
   * Get all active pools
   * 
   * @returns Array of pool accounts
   */
  async getAllActivePools() {
    try {
      // Filter for pools where is_active is true
      const pools = await (this.program.account as any).poolAccount.all([
        {
          memcmp: {
            offset: 8 + 32 + 32 + 32 + 8 + 8 + 2 + 8 + 8 + 1, // Skip to is_active field
            bytes: '1', // 1 = true
          },
        },
      ]);

      return pools;
    } catch (error) {
      console.error('Error fetching active pools:', error);
      throw error;
    }
  }

  /**
   * Purchase tokens from a pool
   * 
   * @param poolAddress The pool address
   * @param tokenAmount The amount of tokens to purchase
   * @returns Transaction signature
   */
  async purchaseTokens(poolAddress: PublicKey, tokenAmount: number): Promise<string> {
    try {
      const pool = await this.getPoolAccount(poolAddress);
      
      // Get buyer token account
      const buyerTokenAccount = await getAssociatedTokenAddress(
        pool.tokenMint,
        this.wallet.publicKey
      );

      // Get buyer info PDA
      const [buyerInfo, _] = await PublicKey.findProgramAddress(
        [
          Buffer.from('buyer'),
          this.wallet.publicKey.toBuffer(),
          poolAddress.toBuffer()
        ],
        this.program.programId
      );

      const tx = await this.program.methods
        .purchaseTokens(new anchor.BN(tokenAmount))
        .accounts({
          poolAccount: poolAddress as any,
          poolTokenAccount: pool.poolTokenAccount,
          buyer: this.wallet.publicKey,
          buyerInfo: buyerInfo as any,
          buyerTokenAccount,
          creator: pool.creator,
          treasury: pool.treasury,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc();

      return tx;
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      throw error;
    }
  }

  /**
   * Close a pool (mark as inactive)
   * 
   * @param poolAddress The pool address
   * @returns Transaction signature
   */
  async closePool(poolAddress: PublicKey): Promise<string> {
    try {
      const pool = await this.getPoolAccount(poolAddress);
      
      const tx = await this.program.methods
        .closePool()
        .accounts({
          poolAccount: poolAddress,
          creator: this.wallet.publicKey,
        })
        .rpc();

      return tx;
    } catch (error) {
      console.error('Error closing pool:', error);
      throw error;
    }
  }

  /**
   * Withdraw remaining tokens from a pool
   * 
   * @param poolAddress The pool address
   * @returns Transaction signature
   */
  async withdrawRemainingTokens(poolAddress: PublicKey): Promise<string> {
    try {
      const pool = await this.getPoolAccount(poolAddress);
      
      // Get creator token account
      const creatorTokenAccount = await getAssociatedTokenAddress(
        pool.tokenMint,
        this.wallet.publicKey
      );

      const tx = await this.program.methods
        .withdrawRemainingTokens()
        .accounts({
          poolAccount: poolAddress,
          creator: this.wallet.publicKey,
          poolTokenAccount: pool.poolTokenAccount,
          creatorTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      return tx;
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
      throw error;
    }
  }
}
