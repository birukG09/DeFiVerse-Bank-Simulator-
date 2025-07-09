"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, TrendingUp, Flame, Plus, AlertTriangle, BarChart3, PieChart, Activity } from "lucide-react"

interface TokenSupply {
  symbol: string
  name: string
  totalSupply: number
  circulatingSupply: number
  maxSupply: number
  inflationRate: number
  burnRate: number
  mintingRate: number
}

interface TreasuryAction {
  id: string
  type: "mint" | "burn"
  token: string
  amount: number
  timestamp: Date
  reason: string
  impact: {
    supplyChange: number
    inflationChange: number
    priceImpact: number
  }
}

export function TreasurySimulator() {
  const [tokens, setTokens] = useState<TokenSupply[]>([
    {
      symbol: "BANK",
      name: "DeFiVerse Bank Token",
      totalSupply: 100000000,
      circulatingSupply: 75000000,
      maxSupply: 1000000000,
      inflationRate: 5.2,
      burnRate: 1.8,
      mintingRate: 3.4,
    },
    {
      symbol: "GOV",
      name: "Governance Token",
      totalSupply: 50000000,
      circulatingSupply: 35000000,
      maxSupply: 100000000,
      inflationRate: 3.1,
      burnRate: 0.5,
      mintingRate: 2.6,
    },
    {
      symbol: "YIELD",
      name: "Yield Token",
      totalSupply: 25000000,
      circulatingSupply: 20000000,
      maxSupply: 50000000,
      inflationRate: 8.7,
      burnRate: 2.3,
      mintingRate: 6.4,
    },
  ])

  const [actions, setActions] = useState<TreasuryAction[]>([])
  const [selectedToken, setSelectedToken] = useState("BANK")
  const [actionAmount, setActionAmount] = useState("")
  const [actionReason, setActionReason] = useState("")
  const [isSimulating, setIsSimulating] = useState(false)

  // Simulate market impact of treasury actions
  const simulateAction = (type: "mint" | "burn", tokenSymbol: string, amount: number, reason: string) => {
    setIsSimulating(true)

    setTimeout(() => {
      const token = tokens.find((t) => t.symbol === tokenSymbol)
      if (!token) return

      const supplyChange = type === "mint" ? amount : -amount
      const supplyChangePercent = (supplyChange / token.totalSupply) * 100
      const priceImpact = type === "mint" ? -supplyChangePercent * 0.8 : supplyChangePercent * 1.2
      const inflationChange = type === "mint" ? supplyChangePercent * 0.1 : -supplyChangePercent * 0.1

      // Create action record
      const newAction: TreasuryAction = {
        id: Date.now().toString(),
        type,
        token: tokenSymbol,
        amount,
        timestamp: new Date(),
        reason,
        impact: {
          supplyChange: supplyChangePercent,
          inflationChange,
          priceImpact,
        },
      }

      setActions((prev) => [newAction, ...prev.slice(0, 49)]) // Keep last 50 actions

      // Update token supply
      setTokens((prev) =>
        prev.map((t) => {
          if (t.symbol === tokenSymbol) {
            const newTotalSupply = Math.max(0, t.totalSupply + supplyChange)
            const newCirculatingSupply = Math.max(0, t.circulatingSupply + supplyChange)
            const newInflationRate = Math.max(0, t.inflationRate + inflationChange)

            return {
              ...t,
              totalSupply: newTotalSupply,
              circulatingSupply: newCirculatingSupply,
              inflationRate: newInflationRate,
              mintingRate: type === "mint" ? t.mintingRate + 0.1 : t.mintingRate,
              burnRate: type === "burn" ? t.burnRate + 0.1 : t.burnRate,
            }
          }
          return t
        }),
      )

      setIsSimulating(false)
      setActionAmount("")
      setActionReason("")
    }, 1500)
  }

  const handleMint = () => {
    const amount = Number.parseFloat(actionAmount)
    if (amount > 0 && actionReason.trim()) {
      simulateAction("mint", selectedToken, amount, actionReason)
    }
  }

  const handleBurn = () => {
    const amount = Number.parseFloat(actionAmount)
    if (amount > 0 && actionReason.trim()) {
      simulateAction("burn", selectedToken, amount, actionReason)
    }
  }

  const getSupplyUtilization = (token: TokenSupply) => {
    return (token.totalSupply / token.maxSupply) * 100
  }

  const getCirculationRatio = (token: TokenSupply) => {
    return (token.circulatingSupply / token.totalSupply) * 100
  }

  return (
    <div className="space-y-6">
      {/* Treasury Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tokens.map((token) => (
          <Card
            key={token.symbol}
            className={`bg-gray-900/50 border-green-500/30 hover:border-green-500/50 transition-all cursor-pointer ${
              selectedToken === token.symbol ? "ring-2 ring-green-500/50" : ""
            }`}
            onClick={() => setSelectedToken(token.symbol)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                    <Coins className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <CardTitle className="text-green-400">{token.symbol}</CardTitle>
                    <p className="text-gray-400 text-sm">{token.name}</p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {token.inflationRate.toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Supply</span>
                  <span className="text-green-400">{token.totalSupply.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Circulating</span>
                  <span className="text-green-400">{token.circulatingSupply.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Max Supply</span>
                  <span className="text-green-400">{token.maxSupply.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Supply Utilization</span>
                  <span className="text-green-400">{getSupplyUtilization(token).toFixed(1)}%</span>
                </div>
                <Progress value={getSupplyUtilization(token)} className="h-2 bg-gray-800" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Circulation Ratio</span>
                  <span className="text-green-400">{getCirculationRatio(token).toFixed(1)}%</span>
                </div>
                <Progress value={getCirculationRatio(token)} className="h-2 bg-gray-800" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Plus className="w-3 h-3 text-green-400" />
                  <span className="text-gray-400">Mint:</span>
                  <span className="text-green-400">{token.mintingRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="w-3 h-3 text-red-400" />
                  <span className="text-gray-400">Burn:</span>
                  <span className="text-red-400">{token.burnRate.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Treasury Controls */}
      <Tabs defaultValue="controls" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-green-500/30">
          <TabsTrigger value="controls" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
            <Activity className="w-4 h-4 mr-2" />
            Controls
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
            <PieChart className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="controls" className="space-y-6">
          <Card className="bg-gray-900/50 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">Treasury Operations</CardTitle>
              <p className="text-gray-400 text-sm">
                Simulate central bank functions - mint new tokens or burn existing supply
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Select Token</label>
                    <select
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                      className="w-full p-3 bg-black/50 border border-green-500/30 rounded-lg text-green-400 focus:outline-none focus:border-green-500/50"
                    >
                      {tokens.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol} - {token.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Amount</label>
                    <input
                      type="number"
                      value={actionAmount}
                      onChange={(e) => setActionAmount(e.target.value)}
                      placeholder="Enter amount..."
                      className="w-full p-3 bg-black/50 border border-green-500/30 rounded-lg text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Reason</label>
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder="Explain the reason for this action..."
                      className="w-full p-3 bg-black/50 border border-green-500/30 rounded-lg text-green-400 placeholder-gray-500 h-20 resize-none focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-black/50 rounded-lg border border-green-500/20">
                    <h4 className="text-green-400 font-semibold mb-3">Impact Simulation</h4>
                    {actionAmount && Number.parseFloat(actionAmount) > 0 && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Supply Change:</span>
                          <span className="text-green-400">
                            {(
                              (Number.parseFloat(actionAmount) /
                                tokens.find((t) => t.symbol === selectedToken)!.totalSupply) *
                              100
                            ).toFixed(2)}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Est. Price Impact:</span>
                          <span className="text-green-400">
                            {(
                              (Number.parseFloat(actionAmount) /
                                tokens.find((t) => t.symbol === selectedToken)!.totalSupply) *
                              100 *
                              -0.8
                            ).toFixed(2)}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Inflation Change:</span>
                          <span className="text-green-400">
                            +
                            {(
                              (Number.parseFloat(actionAmount) /
                                tokens.find((t) => t.symbol === selectedToken)!.totalSupply) *
                              100 *
                              0.1
                            ).toFixed(2)}
                            %
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleMint}
                      disabled={!actionAmount || !actionReason.trim() || isSimulating}
                      className="bg-green-500 hover:bg-green-600 text-black font-semibold"
                    >
                      {isSimulating ? <div className="spinner mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      Mint Tokens
                    </Button>
                    <Button
                      onClick={handleBurn}
                      disabled={!actionAmount || !actionReason.trim() || isSimulating}
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      {isSimulating ? <div className="spinner mr-2" /> : <Flame className="w-4 h-4 mr-2" />}
                      Burn Tokens
                    </Button>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-400 font-semibold">Treasury Operations Warning</h4>
                    <p className="text-yellow-300 text-sm mt-1">
                      These operations directly affect token supply and can have significant market impact. Use with
                      caution and ensure proper governance approval.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Supply Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-black/50 rounded-lg flex items-center justify-center border border-green-500/20">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-green-500/50 mx-auto mb-2" />
                    <p className="text-gray-400">Supply Analytics Chart</p>
                    <p className="text-gray-500 text-sm">Real-time supply tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Inflation Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-black/50 rounded-lg flex items-center justify-center border border-green-500/20">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-green-500/50 mx-auto mb-2" />
                    <p className="text-gray-400">Inflation Rate Chart</p>
                    <p className="text-gray-500 text-sm">Historical inflation data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-gray-900/50 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">Treasury Action History</CardTitle>
              <p className="text-gray-400 text-sm">Recent minting and burning operations</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {actions.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">No treasury actions yet</p>
                    <p className="text-gray-500 text-sm">Start by minting or burning tokens</p>
                  </div>
                ) : (
                  actions.map((action) => (
                    <div
                      key={action.id}
                      className="p-4 bg-black/50 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              action.type === "mint" ? "bg-green-500/20" : "bg-red-500/20"
                            }`}
                          >
                            {action.type === "mint" ? (
                              <Plus className="w-4 h-4 text-green-400" />
                            ) : (
                              <Flame className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-400 font-semibold">
                                {action.type === "mint" ? "MINTED" : "BURNED"}
                              </span>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                {action.token}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm">{action.amount.toLocaleString()} tokens</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">{action.timestamp.toLocaleTimeString()}</p>
                          <p className="text-gray-500 text-xs">{action.timestamp.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{action.reason}</p>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-gray-400">Supply Impact:</span>
                          <div className="text-green-400 font-semibold">
                            {action.impact.supplyChange > 0 ? "+" : ""}
                            {action.impact.supplyChange.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Price Impact:</span>
                          <div
                            className={`font-semibold ${
                              action.impact.priceImpact >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {action.impact.priceImpact > 0 ? "+" : ""}
                            {action.impact.priceImpact.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Inflation:</span>
                          <div className="text-green-400 font-semibold">
                            {action.impact.inflationChange > 0 ? "+" : ""}
                            {action.impact.inflationChange.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
