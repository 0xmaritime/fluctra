use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;
use anchor_lang::solana_program::clock;

declare_id!("FL1ctrAL111111111111111111111111111111111111");

#[program]
pub mod fluctra_launch {
    use super::*;
    use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

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

    pub fn purchase_tokens(
        ctx: Context<PurchaseTokens>,
        token_amount: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool_account;
        let clock = Clock::get()?;
        
        // Validate pool state
        require!(pool.is_active, PoolError::PoolInactive);
        require!(clock.unix_timestamp < pool.start_time + pool.duration_seconds as i64, PoolError::PoolEnded);
        require!(pool.tokens_sold + token_amount <= pool.total_tokens_for_sale, PoolError::ExceedsMaxTokens);

        // Calculate payment amount (simplified - would use oracle in production)
        let token_price: u64 = 1_000_000; // 1 token = 0.001 SOL (example)
        let discounted_price: u64 = token_price * (10000 - pool.discount_rate_basis_points as u64) / 10000;
        let payment_amount: u64 = discounted_price * token_amount / LAMPORTS_PER_SOL;
        let platform_fee: u64 = payment_amount * pool.platform_fee_basis_points as u64 / 10000;
        let total_payment = payment_amount + platform_fee;

        // Verify sufficient payment
        require!(ctx.accounts.buyer.lamports() >= total_payment, PoolError::InsufficientPayment);

        // Transfer tokens to buyer
        let seeds = &[
            b"pool",
            pool.creator.as_ref(),
            pool.token_mint.as_ref(),
            &[pool.bump]
        ];
        let signer = &[&seeds[..]];

        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.pool_token_account.to_account_info(),
                to: ctx.accounts.buyer_token_account.to_account_info(),
                authority: pool.to_account_info(),
            },
            signer,
        );
        token::transfer(transfer_ctx, token_amount)?;

        // Transfer payment to creator and treasury
        **ctx.accounts.creator.try_borrow_mut_lamports()? += payment_amount;
        **ctx.accounts.treasury.try_borrow_mut_lamports()? += platform_fee;
        **ctx.accounts.buyer.try_borrow_mut_lamports()? -= total_payment;

        // Update pool state
        pool.tokens_sold += token_amount;
        if !pool.buyers.contains(&ctx.accounts.buyer.key()) {
            pool.buyers.push(ctx.accounts.buyer.key());
        }

        // Create/update buyer info account
        let buyer_info = &mut ctx.accounts.buyer_info;
        buyer_info.buyer = ctx.accounts.buyer.key();
        buyer_info.pool = pool.key();
        buyer_info.tokens_purchased += token_amount;
        buyer_info.total_payment += total_payment;

        Ok(())
    }

    pub fn close_pool(
        ctx: Context<ClosePool>
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool_account;
        
        // Only creator can close pool
        require!(ctx.accounts.creator.key() == pool.creator, PoolError::Unauthorized);
        
        // Mark pool as inactive
        pool.is_active = false;
        
        Ok(())
    }

    pub fn withdraw_remaining_tokens(
        ctx: Context<WithdrawTokens>
    ) -> Result<()> {
        let pool = &ctx.accounts.pool_account;
        let clock = Clock::get()?;
        
        // Only creator can withdraw
        require!(ctx.accounts.creator.key() == pool.creator, PoolError::Unauthorized);
        
        // Pool must be inactive or expired
        require!(
            !pool.is_active || clock.unix_timestamp > pool.start_time + pool.duration_seconds as i64,
            PoolError::PoolStillActive
        );
        
        // Calculate remaining tokens
        let remaining_tokens = pool.total_tokens_for_sale - pool.tokens_sold;
        require!(remaining_tokens > 0, PoolError::NoTokensToWithdraw);
        
        // Transfer remaining tokens back to creator
        let seeds = &[
            b"pool",
            pool.creator.as_ref(),
            pool.token_mint.as_ref(),
            &[pool.bump]
        ];
        let signer = &[&seeds[..]];

        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.pool_token_account.to_account_info(),
                to: ctx.accounts.creator_token_account.to_account_info(),
                authority: pool.to_account_info(),
            },
            signer,
        );
        token::transfer(transfer_ctx, remaining_tokens)?;

        Ok(())
    }
}

#[derive(Accounts, Bumps)]
pub struct ClosePool<'info> {
    #[account(mut)]
    pub pool_account: Account<'info, PoolAccount>,
    pub creator: Signer<'info>,
}

#[derive(Accounts, Bumps)]
pub struct WithdrawTokens<'info> {
    #[account(mut)]
    pub pool_account: Account<'info, PoolAccount>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(
        mut,
        constraint = pool_token_account.mint == pool_account.token_mint,
        constraint = pool_token_account.owner == pool_account.key()
    )]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = creator_token_account.owner == creator.key(),
        constraint = creator_token_account.mint == pool_account.token_mint
    )]
    pub creator_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(token_amount: u64)]
pub struct PurchaseTokens<'info> {
    #[account(mut)]
    pub pool_account: Account<'info, PoolAccount>,

    #[account(
        mut,
        constraint = pool_token_account.mint == pool_account.token_mint,
        constraint = pool_token_account.owner == pool_account.key()
    )]
    pub pool_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        init_if_needed: bool = true,
        payer = buyer,
        space = 8 + BuyerInfo::SIZE,
        seeds = [
            b"buyer",
            buyer.key().as_ref(),
            pool_account.key().as_ref()
        ],
        bump
    )]
    pub buyer_info: Account<'info, BuyerInfo>,

    #[account(
        mut,
        constraint = buyer_token_account.owner == buyer.key(),
        constraint = buyer_token_account.mint == pool_account.token_mint
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub creator: SystemAccount<'info>,

    #[account(mut, constraint = treasury.key() == pool_account.treasury)]
    pub treasury: SystemAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
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
        bump
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
    pub tokens_sold: u64,
    pub discount_rate_basis_points: u16,
    pub duration_seconds: u64,
    pub start_time: i64,
    pub is_active: bool,
    pub platform_fee_basis_points: u16,
    pub treasury: Pubkey,
    pub bump: u8,
    pub buyers: Vec<Pubkey>,
}

#[account]
pub struct BuyerInfo {
    pub buyer: Pubkey,
    pub pool: Pubkey,
    pub tokens_purchased: u64,
    pub total_payment: u64,
    pub bump: u8,
}

impl PoolAccount {
    pub const SIZE: usize = 32 + // creator
                            32 + // token_mint
                            32 + // pool_token_account
                            8 +  // total_tokens_for_sale
                            8 +  // tokens_sold
                            2 +  // discount_rate_basis_points
                            8 +  // duration_seconds
                            8 +  // start_time
                            1 +  // is_active
                            2 +  // platform_fee_basis_points
                            32 + // treasury
                            1 +  // bump
                            4 +  // buyers vector length
                            (32 * 10); // space for 10 buyers initially
}

impl BuyerInfo {
    pub const SIZE: usize = 32 + // buyer
                            32 + // pool
                            8 +  // tokens_purchased
                            8 +  // total_payment
                            1;   // bump
}

#[error_code]
pub enum PoolError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Pool is still active")]
    PoolStillActive,
    #[msg("No tokens available for withdrawal")]
    NoTokensToWithdraw,
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
    #[msg("Pool is not active")]
    PoolInactive,
    #[msg("Pool has ended")]
    PoolEnded,
    #[msg("Exceeds maximum token amount")]
    ExceedsMaxTokens,
    #[msg("Insufficient payment")]
    InsufficientPayment,
    #[msg("Invalid treasury account")]
    InvalidTreasury,
}
