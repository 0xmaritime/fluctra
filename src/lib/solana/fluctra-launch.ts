import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, Connection, Keypair, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { FluctraLaunch } from './types/fluctra_launch';

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
    
    // @ts-ignore - We'll need to generate the IDL types
    this.program = new Program(FluctraLaunch, PROGRAM_ID, provider);
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
          poolAccount,
          creatorTokenAccount,
          poolTokenAccount,
          feeRecipientWallet: FEE_RECIPIENT_WALLET,
          tokenMint,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
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
      const pools = await this.program.account.poolAccount.all([
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
      const pools = await this.program.account.poolAccount.all([
        {
          memcmp: {
            offset: 8 + 32 + 32 + 32 + 8 + 2 + 8 + 8, // Skip to is_active field
            bytes: this.wallet.publicKey.toBase58(), // Filter by creator's public key
          },
        },
      ]);

      return pools;
    } catch (error) {
      console.error('Error fetching active pools:', error);
      throw error;
    }
  }
}
