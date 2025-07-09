"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  TrendingUp,
  Coins,
  Vote,
  ImageIcon,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Bell,
  Search,
  Activity,
  Zap,
  Shield,
} from "lucide-react"
import Link from "next/link"

// Mock data with black/green theme
const mockUser = {
  id: 1,
  username: "crypto_trader",
  role: "user",
  walletAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
}

const mockTokens = [
  { symbol: "BTC", name: "Bitcoin", balance: 0.5432, price: 45000, change: 2.5 },
  { symbol: "ETH", name: "Ethereum", balance: 12.8765, price: 3200, change: -1.2 },
  { symbol: "USDT", name: "Tether", balance: 5000, price: 1, change: 0.1 },
  { symbol: "BANK", name: "Bank Token", balance: 1000, price: 25, change: 5.8 },
  { symbol: "GOV", name: "Governance Token", balance: 500, price: 15, change: 3.2 },
]

const mockStakingPools = [
  { name: "ETH Pool", apy: 12.5, staked: 5.2, rewards: 0.65, totalStaked: 1250000 },
  { name: "BANK Pool", apy: 25.8, staked: 500, rewards: 12.9, totalStaked: 500000 },
  { name: "BTC-ETH LP", apy: 18.2, staked: 0, rewards: 0, totalStaked: 750000 },
]

const mockLoans = [
  {
    id: 1,
    collateral: "ETH",
    collateralAmount: 10,
    borrowed: "USDT",
    borrowedAmount: 20000,
    interest: 8.5,
    health: 85,
  },
]

const mockProposals = [
  {
    id: 1,
    title: "Increase NFT Rewards Pool",
    description: "Allocate 50,000 BANK tokens for NFT staking rewards",
    votes: 125000,
    totalVotes: 200000,
    status: "active",
  },
  {
    id: 2,
    title: "New Staking Pool: LINK",
    description: "Add Chainlink token staking with 15% APY",
    votes: 180000,
    totalVotes: 200000,
    status: "passed",
  },
]

export default function Dashboard() {
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0)

  useEffect(() => {
    const total = mockTokens.reduce((sum, token) => sum + token.balance * token.price, 0)
    setTotalPortfolioValue(total)
  }, [])

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Header */}
      <header className="border-b border-green-500/30 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
                  <Coins className="w-6 h-6 text-black" />
                </div>
                <h1 className="text-2xl font-bold text-green-400">DeFiVerse</h1>
              </Link>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Dashboard</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-900/50 border border-green-500/30 rounded-lg text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Welcome back,</p>
                  <p className="text-green-400 font-medium">{mockUser.username}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold">{mockUser.username[0].toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-green-500/30 hover:border-green-500/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Portfolio</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">${totalPortfolioValue.toLocaleString()}</div>
              <p className="text-xs text-green-400 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-green-500/30 hover:border-green-500/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Staking Rewards</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">$1,245</div>
              <p className="text-xs text-green-400">Avg APY: 18.5%</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-green-500/30 hover:border-green-500/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Loans</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">1</div>
              <p className="text-xs text-green-400">Health: 85%</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-green-500/30 hover:border-green-500/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">NFTs Owned</CardTitle>
              <ImageIcon className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">7</div>
              <p className="text-xs text-green-400">Floor: 2.5 ETH</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-gray-900/50 border border-green-500/30">
            <TabsTrigger value="wallet" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Wallet className="w-4 h-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="staking" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <TrendingUp className="w-4 h-4 mr-2" />
              Staking
            </TabsTrigger>
            <TabsTrigger value="lending" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <BarChart3 className="w-4 h-4 mr-2" />
              Lending
            </TabsTrigger>
            <TabsTrigger value="nfts" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <ImageIcon className="w-4 h-4 mr-2" />
              NFTs
            </TabsTrigger>
            <TabsTrigger value="governance" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Vote className="w-4 h-4 mr-2" />
              DAO
            </TabsTrigger>
            <TabsTrigger value="prices" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Zap className="w-4 h-4 mr-2" />
              Prices
            </TabsTrigger>
            <TabsTrigger value="treasury" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Shield className="w-4 h-4 mr-2" />
              Treasury
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Activity className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400">Token Balances</CardTitle>
                  <CardDescription className="text-gray-400">Your cryptocurrency holdings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTokens.map((token) => (
                    <div
                      key={token.symbol}
                      className="flex items-center justify-between p-4 rounded-lg bg-black/50 border border-green-500/20 hover:border-green-500/40 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                          <span className="text-black font-bold">{token.symbol[0]}</span>
                        </div>
                        <div>
                          <p className="text-green-400 font-medium">{token.symbol}</p>
                          <p className="text-gray-400 text-sm">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-medium">{token.balance.toFixed(4)}</p>
                        <p className="text-gray-400 text-sm">${(token.balance * token.price).toLocaleString()}</p>
                        <p
                          className={`text-sm flex items-center justify-end ${token.change >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {token.change >= 0 ? (
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                          )}
                          {Math.abs(token.change)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">Send, receive, and manage your tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold">
                    Send Tokens
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
                  >
                    Receive Tokens
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
                  >
                    Transaction History
                  </Button>
                  <div className="p-4 bg-black/50 rounded-lg border border-green-500/20">
                    <p className="text-gray-400 text-sm mb-2">Wallet Address:</p>
                    <p className="text-green-400 text-xs font-mono break-all">{mockUser.walletAddress}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Add missing imports */}
          <TabsContent value="prices">
            <div className="text-center py-8">
              <p className="text-gray-400">Price sync component will be loaded here</p>
            </div>
          </TabsContent>

          <TabsContent value="treasury">
            <div className="text-center py-8">
              <p className="text-gray-400">Treasury simulator will be loaded here</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-8">
              <p className="text-gray-400">3D analytics will be loaded here</p>
            </div>
          </TabsContent>

          {/* Keep existing tabs content */}
        </Tabs>
      </div>
    </div>
  )
}
