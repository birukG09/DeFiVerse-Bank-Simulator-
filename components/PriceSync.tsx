"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from "lucide-react"

interface TokenPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  volume_24h: number
  last_updated: string
}

interface PriceHistory {
  timestamp: number
  price: number
}

export function PriceSync() {
  const [prices, setPrices] = useState<TokenPrice[]>([])
  const [priceHistory, setPriceHistory] = useState<Record<string, PriceHistory[]>>({})
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate CoinGecko API integration
  const fetchPrices = async () => {
    setIsLoading(true)
    try {
      // Simulate API call with mock data that changes over time
      const mockPrices: TokenPrice[] = [
        {
          id: "bitcoin",
          symbol: "BTC",
          name: "Bitcoin",
          current_price: 45000 + Math.random() * 2000 - 1000,
          price_change_percentage_24h: (Math.random() - 0.5) * 10,
          market_cap: 850000000000,
          volume_24h: 25000000000,
          last_updated: new Date().toISOString(),
        },
        {
          id: "ethereum",
          symbol: "ETH",
          name: "Ethereum",
          current_price: 3200 + Math.random() * 400 - 200,
          price_change_percentage_24h: (Math.random() - 0.5) * 8,
          market_cap: 380000000000,
          volume_24h: 15000000000,
          last_updated: new Date().toISOString(),
        },
        {
          id: "tether",
          symbol: "USDT",
          name: "Tether",
          current_price: 1 + (Math.random() - 0.5) * 0.01,
          price_change_percentage_24h: (Math.random() - 0.5) * 0.5,
          market_cap: 85000000000,
          volume_24h: 45000000000,
          last_updated: new Date().toISOString(),
        },
        {
          id: "defiverse-bank",
          symbol: "BANK",
          name: "DeFiVerse Bank Token",
          current_price: 25 + Math.random() * 5 - 2.5,
          price_change_percentage_24h: (Math.random() - 0.5) * 15,
          market_cap: 2500000000,
          volume_24h: 125000000,
          last_updated: new Date().toISOString(),
        },
        {
          id: "defiverse-gov",
          symbol: "GOV",
          name: "DeFiVerse Governance",
          current_price: 15 + Math.random() * 3 - 1.5,
          price_change_percentage_24h: (Math.random() - 0.5) * 12,
          market_cap: 750000000,
          volume_24h: 50000000,
          last_updated: new Date().toISOString(),
        },
      ]

      setPrices(mockPrices)
      setLastUpdate(new Date())
      setIsConnected(true)

      // Update price history
      const newHistory = { ...priceHistory }
      mockPrices.forEach((token) => {
        if (!newHistory[token.symbol]) {
          newHistory[token.symbol] = []
        }
        newHistory[token.symbol].push({
          timestamp: Date.now(),
          price: token.current_price,
        })
        // Keep only last 100 data points
        if (newHistory[token.symbol].length > 100) {
          newHistory[token.symbol] = newHistory[token.symbol].slice(-100)
        }
      })
      setPriceHistory(newHistory)
    } catch (error) {
      console.error("Failed to fetch prices:", error)
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchPrices()

    // Set up interval for live updates (every 30 seconds)
    const interval = setInterval(fetchPrices, 30000)

    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === "USDT") {
      return `$${price.toFixed(4)}`
    }
    return price >= 1000 ? `$${price.toLocaleString()}` : `$${price.toFixed(2)}`
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-gray-900/50 border-green-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-400 flex items-center">
              {isConnected ? (
                <Wifi className="w-5 h-5 mr-2 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 mr-2 text-red-400" />
              )}
              Live Price Feed
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={`${isConnected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {isConnected ? "CONNECTED" : "DISCONNECTED"}
              </Badge>
              <button
                onClick={fetchPrices}
                disabled={isLoading}
                className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-green-400 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
          {lastUpdate && <p className="text-sm text-gray-400">Last updated: {lastUpdate.toLocaleTimeString()}</p>}
        </CardHeader>
      </Card>

      {/* Price Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prices.map((token) => (
          <Card
            key={token.id}
            className="bg-gray-900/50 border-green-500/30 hover:border-green-500/50 transition-all card-hover"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">{token.symbol[0]}</span>
                  </div>
                  <div>
                    <CardTitle className="text-green-400 text-lg">{token.symbol}</CardTitle>
                    <p className="text-gray-400 text-sm">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-400">
                    {formatPrice(token.current_price, token.symbol)}
                  </div>
                  <div
                    className={`text-sm flex items-center justify-end ${
                      token.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {token.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {formatChange(token.price_change_percentage_24h)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Market Cap</span>
                <span className="text-green-400">${(token.market_cap / 1e9).toFixed(2)}B</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">24h Volume</span>
                <span className="text-green-400">${(token.volume_24h / 1e9).toFixed(2)}B</span>
              </div>
              <div className="h-16 bg-black/50 rounded-lg flex items-center justify-center border border-green-500/20">
                {priceHistory[token.symbol] && priceHistory[token.symbol].length > 1 ? (
                  <div className="w-full h-full relative">
                    <svg className="w-full h-full" viewBox="0 0 100 40">
                      <polyline
                        fill="none"
                        stroke="#00ff00"
                        strokeWidth="1"
                        points={priceHistory[token.symbol]
                          .slice(-20)
                          .map((point, index, array) => {
                            const x = (index / (array.length - 1)) * 100
                            const minPrice = Math.min(...array.map((p) => p.price))
                            const maxPrice = Math.max(...array.map((p) => p.price))
                            const y = 35 - ((point.price - minPrice) / (maxPrice - minPrice)) * 30
                            return `${x},${y}`
                          })
                          .join(" ")}
                      />
                    </svg>
                  </div>
                ) : (
                  <span className="text-gray-500 text-xs">Loading chart...</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Integration Info */}
      <Card className="bg-gray-900/50 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Price Feed Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-black/50 rounded-lg border border-green-500/20">
              <h4 className="text-green-400 font-semibold mb-2">CoinGecko API</h4>
              <p className="text-gray-400 text-sm mb-2">Primary price feed source</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Endpoint:</span>
                  <span className="text-green-400">api.coingecko.com/api/v3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Update Frequency:</span>
                  <span className="text-green-400">30 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rate Limit:</span>
                  <span className="text-green-400">100 calls/minute</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-black/50 rounded-lg border border-green-500/20">
              <h4 className="text-green-400 font-semibold mb-2">CoinMarketCap API</h4>
              <p className="text-gray-400 text-sm mb-2">Backup price feed source</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Endpoint:</span>
                  <span className="text-green-400">pro-api.coinmarketcap.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Update Frequency:</span>
                  <span className="text-green-400">60 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rate Limit:</span>
                  <span className="text-green-400">333 calls/day</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
