import { writable } from 'svelte/store'

interface TokenInfo {
  name: string
  symbol: string
  totalSupply: number
  userBalance: number
  marketPrice: number
}

interface DiscountFormData {
  blockchain: string
  tokenAddress: string
  tokenInfo: TokenInfo
  discountRate: string
  duration: string
  maxSaleAmount: string
  distributionStrategy: string
  verified: boolean
}

// Create typed writable store
export const discountFormData = writable<DiscountFormData>({
  blockchain: '',
  tokenAddress: '',
  tokenInfo: {
    name: '',
    symbol: '',
    totalSupply: 0,
    userBalance: 0,
    marketPrice: 0
  },
  discountRate: '25',
  duration: '5', 
  maxSaleAmount: '100000',
  distributionStrategy: 'tiered',
  verified: false
})

export type { DiscountFormData, TokenInfo }
