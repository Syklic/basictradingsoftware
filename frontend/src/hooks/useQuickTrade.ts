import { create } from 'zustand'

export interface QuickTradeState {
  selectedAsset: string
  orderType: 'market-buy' | 'market-sell' | 'limit-buy' | 'limit-sell'
  shares: number
  limitPrice: number | null
  estimatedTotal: number
  buyingPower: number
  isOpen: boolean
}

interface QuickTradeStore extends QuickTradeState {
  setSelectedAsset: (asset: string) => void
  setOrderType: (type: QuickTradeState['orderType']) => void
  setShares: (shares: number) => void
  setLimitPrice: (price: number | null) => void
  setBuyingPower: (power: number) => void
  setIsOpen: (isOpen: boolean) => void
  reset: () => void
  calculateTotal: (currentPrice: number) => number
}

const DEFAULT_STATE: QuickTradeState = {
  selectedAsset: 'BTC',
  orderType: 'market-buy',
  shares: 1,
  limitPrice: null,
  estimatedTotal: 0,
  buyingPower: 10000,
  isOpen: false,
}

export const useQuickTradeStore = create<QuickTradeStore>()((set, get) => ({
  ...DEFAULT_STATE,

  setSelectedAsset: (asset: string) => {
    set({ selectedAsset: asset })
  },

  setOrderType: (type: QuickTradeState['orderType']) => {
    set({ orderType: type })
  },

  setShares: (shares: number) => {
    set({ shares: Math.max(0, shares) })
  },

  setLimitPrice: (price: number | null) => {
    set({ limitPrice: price })
  },

  setBuyingPower: (power: number) => {
    set({ buyingPower: power })
  },

  setIsOpen: (isOpen: boolean) => {
    set({ isOpen })
  },

  calculateTotal: (currentPrice: number): number => {
    const state = get()
    const price = state.limitPrice || currentPrice
    const total = price * state.shares
    set({ estimatedTotal: total })
    return total
  },

  reset: () => {
    set(DEFAULT_STATE)
  },
}))
