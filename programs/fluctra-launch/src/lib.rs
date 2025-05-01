use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("FL1ctrAL111111111111111111111111111111111111");

#[program]
pub mod fluctra_launch {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        fixed_listing_fee_amount: u64,
        total_tokens_for_sale: u64,
        discount_rate_basis_points: u16,
        duration_seconds: u64,
        bump: u8,
    ) -> Result<()> {
        // Validate parameters
        require!(
            discount_rate_basis_points <= 10000,
            PoolError::InvalidDiscountRate
        );
        require!(total_tokens_for_sale > 0, PoolError::ZeroTokenAmount);
        require!(duration_seconds > 0, PoolError::InvalidDuration);

        // Transfer the listing fee from creator to fee recipient
        let transfer_fee_ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.creator.key(),
            &ctx.accounts.fee_recipient_wallet.key(),
            fixed_listing_fee_amount,
        );

        anchor_lang::solana_program::program::invoke(
            &transfer_fee_ix,
            &[
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.fee_recipient_wallet.to_account_info(),
            ],
        )?;

        // Transfer tokens from creator to the pool token account
        let cpi_accounts = Transfer {
            from: ctx.accounts.creator_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.creator.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, total_tokens_for_sale)?;

        // Initialize the pool account state
        let pool = &mut ctx.accounts.pool_account;
        pool.creator = ctx.accounts.creator.key();
        pool.token_mint = ctx.accounts.token_mint.key();
        pool.pool_token_account = ctx.accounts.pool_token_account.key();
        pool.total_tokens_for_sale = total_tokens_for_sale;
        pool.discount_rate_basis_points = discount_rate_basis_points;
        pool.duration_seconds = duration_seconds;
        pool.start_time = Clock::get()?.unix_timestamp;
        pool.is_active = true;
        pool.bump = bump;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(
    fixed_listing_fee_amount: u64,
    total_tokens_for_sale: u64,
    discount_rate_basis_points: u16,
    duration_seconds: u64,
    bump: u8
)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(
        init,
        payer = creator,
        space = 8 + PoolAccount::SIZE,
        seeds = [
            b"pool",
            creator.key().as_ref(),
            token_mint.key().as_ref()
        ],
        bump = bump
    )]
    pub pool_account: Account<'info, PoolAccount>,
    
    #[account(
        mut,
        constraint = creator_token_account.owner == creator.key(),
        constraint = creator_token_account.mint == token_mint.key()
    )]
    pub creator_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = pool_token_account.mint == token_mint.key(),
        constraint = pool_token_account.owner == pool_account.key()
    )]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: This is the recipient of the listing fee
    #[account(mut)]
    pub fee_recipient_wallet: AccountInfo<'info>,
    
    pub token_mint: Account<'info, token::Mint>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct PoolAccount {
    pub creator: Pubkey,
    pub token_mint: Pubkey,
    pub pool_token_account: Pubkey,
    pub total_tokens_for_sale: u64,
    pub discount_rate_basis_points: u16,
    pub duration_seconds: u64,
    pub start_time: i64,
    pub is_active: bool,
    pub bump: u8,
}

impl PoolAccount {
    pub const SIZE: usize = 32 + // creator
                            32 + // token_mint
                            32 + // pool_token_account
                            8 +  // total_tokens_for_sale
                            2 +  // discount_rate_basis_points
                            8 +  // duration_seconds
                            8 +  // start_time
                            1 +  // is_active
                            1;   // bump
}

#[error_code]
pub enum PoolError {
    #[msg("Insufficient fee provided")]
    InsufficientFee,
    #[msg("Token transfer failed")]
    TokenTransferFailed,
    #[msg("Invalid discount rate (must be between 0-10000 basis points)")]
    InvalidDiscountRate,
    #[msg("Pool already initialized")]
    PoolAlreadyInitialized,
    #[msg("Token amount must be greater than zero")]
    ZeroTokenAmount,
    #[msg("Duration must be greater than zero")]
    InvalidDuration,
}
