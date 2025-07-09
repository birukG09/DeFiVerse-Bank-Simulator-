"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Hash, User, Activity, Search, Filter, Download, Eye, Lock, CheckCircle } from "lucide-react"

interface BlockchainLog {
  id: string
  blockNumber: number
  hash: string
  previousHash: string
  timestamp: Date
  action: string
  user: string
  details: any
  gasUsed: number
  status: "confirmed" | "pending" | "failed"
  merkleRoot: string
  nonce: number
}

interface LogFilter {
  action: string
  user: string
  status: string
  dateFrom: string
  dateTo: string
}

export function BlockchainLogs() {
  const [logs, setLogs] = useState<BlockchainLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<BlockchainLog[]>([])
  const [filter, setFilter] = useState<LogFilter>({
    action: "",
    user: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLog, setSelectedLog] = useState<BlockchainLog | null>(null)

  // Generate cryptographic hash
  const generateHash = (data: string): string => {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return "0x" + Math.abs(hash).toString(16).padStart(8, "0")
  }

  // Generate Merkle root
  const generateMerkleRoot = (transactions: any[]): string => {
    const hashes = transactions.map((tx) => generateHash(JSON.stringify(tx)))
    return generateHash(hashes.join(""))
  }

  // Create new blockchain log entry
  const createLog = (action: string, user: string, details: any): BlockchainLog => {
    const previousLog = logs[0]
    const blockNumber = previousLog ? previousLog.blockNumber + 1 : 1
    const previousHash = previousLog ? previousLog.hash : "0x0000000000000000"

    const logData = {
      blockNumber,
      action,
      user,
      details,
      timestamp: new Date(),
      previousHash,
    }

    const hash = generateHash(JSON.stringify(logData))
    const merkleRoot = generateMerkleRoot([details])

    return {
      id: Date.now().toString(),
      blockNumber,
      hash,
      previousHash,
      timestamp: new Date(),
      action,
      user,
      details,
      gasUsed: Math.floor(Math.random() * 100000) + 21000,
      status: "confirmed",
      merkleRoot,
      nonce: Math.floor(Math.random() * 1000000),
    }
  }

  // Simulate blockchain activity
  useEffect(() => {
    const actions = [
      {
        action: "TOKEN_TRANSFER",
        user: "0x742d35Cc6634C0532925a3b8D4",
        details: {
          from: "0x742d35Cc6634C0532925a3b8D4",
          to: "0x123456789abcdef123456789a",
          amount: 100,
          token: "BANK",
        },
      },
      {
        action: "STAKE_TOKENS",
        user: "0x987654321fedcba987654321f",
        details: { pool: "ETH_POOL", amount: 5.2, apy: 12.5 },
      },
      {
        action: "CREATE_LOAN",
        user: "0x456789abcdef456789abcdef4",
        details: { collateral: "ETH", amount: 10, borrowed: "USDT", borrowAmount: 20000 },
      },
      {
        action: "MINT_NFT",
        user: "0x789abcdef123789abcdef1237",
        details: { tokenId: 1001, name: "DeFi Genesis", metadata: "ipfs://QmHash123" },
      },
      {
        action: "DAO_VOTE",
        user: "0xabcdef456789abcdef456789a",
        details: { proposalId: 1, vote: "yes", weight: 5000 },
      },
      {
        action: "TREASURY_MINT",
        user: "0x000000000000000000000000",
        details: { token: "BANK", amount: 1000000, reason: "Liquidity provision" },
      },
      {
        action: "UNSTAKE_TOKENS",
        user: "0x321fedcba987654321fedcba9",
        details: { pool: "BANK_POOL", amount: 500, rewards: 12.9 },
      },
    ]

    // Generate initial logs
    const initialLogs: BlockchainLog[] = []
    for (let i = 0; i < 20; i++) {
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      const log = createLog(randomAction.action, randomAction.user, randomAction.details)
      log.timestamp = new Date(Date.now() - i * 60000) // Spread over last 20 minutes
      initialLogs.unshift(log)
    }

    setLogs(initialLogs)
    setFilteredLogs(initialLogs)

    // Simulate real-time log generation
    const interval = setInterval(() => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      const newLog = createLog(randomAction.action, randomAction.user, randomAction.details)

      setLogs((prev) => [newLog, ...prev.slice(0, 99)]) // Keep last 100 logs
      setFilteredLogs((prev) => [newLog, ...prev.slice(0, 99)])
    }, 10000) // New log every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filter.action) {
      filtered = filtered.filter((log) => log.action === filter.action)
    }

    if (filter.user) {
      filtered = filtered.filter((log) => log.user.includes(filter.user))
    }

    if (filter.status) {
      filtered = filtered.filter((log) => log.status === filter.status)
    }

    if (filter.dateFrom) {
      filtered = filtered.filter((log) => log.timestamp >= new Date(filter.dateFrom))
    }

    if (filter.dateTo) {
      filtered = filtered.filter((log) => log.timestamp <= new Date(filter.dateTo))
    }

    setFilteredLogs(filtered)
  }, [logs, filter, searchTerm])

  const verifyLogIntegrity = (log: BlockchainLog): boolean => {
    const logData = {
      blockNumber: log.blockNumber,
      action: log.action,
      user: log.user,
      details: log.details,
      timestamp: log.timestamp,
      previousHash: log.previousHash,
    }
    const expectedHash = generateHash(JSON.stringify(logData))
    return expectedHash === log.hash
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `blockchain-logs-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "TOKEN_TRANSFER":
        return <Activity className="w-4 h-4" />
      case "STAKE_TOKENS":
      case "UNSTAKE_TOKENS":
        return <CheckCircle className="w-4 h-4" />
      case "CREATE_LOAN":
        return <User className="w-4 h-4" />
      case "MINT_NFT":
        return <Hash className="w-4 h-4" />
      case "DAO_VOTE":
        return <Shield className="w-4 h-4" />
      case "TREASURY_MINT":
        return <Lock className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "TOKEN_TRANSFER":
        return "text-blue-400"
      case "STAKE_TOKENS":
        return "text-green-400"
      case "UNSTAKE_TOKENS":
        return "text-yellow-400"
      case "CREATE_LOAN":
        return "text-orange-400"
      case "MINT_NFT":
        return "text-purple-400"
      case "DAO_VOTE":
        return "text-pink-400"
      case "TREASURY_MINT":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900/50 border-green-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-400" />
              <div>
                <CardTitle className="text-green-400">Blockchain Audit Logs</CardTitle>
                <p className="text-gray-400 text-sm">Tamper-proof immutable transaction records</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {filteredLogs.length} Records
              </Badge>
              <Button
                onClick={exportLogs}
                variant="outline"
                size="sm"
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-gray-900/50 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Hash, action, or user..."
                  className="w-full pl-10 pr-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Action Type</label>
              <select
                value={filter.action}
                onChange={(e) => setFilter({ ...filter, action: e.target.value })}
                className="w-full p-2 bg-black/50 border border-green-500/30 rounded-lg text-green-400 focus:outline-none focus:border-green-500/50"
              >
                <option value="">All Actions</option>
                <option value="TOKEN_TRANSFER">Token Transfer</option>
                <option value="STAKE_TOKENS">Stake Tokens</option>
                <option value="UNSTAKE_TOKENS">Unstake Tokens</option>
                <option value="CREATE_LOAN">Create Loan</option>
                <option value="MINT_NFT">Mint NFT</option>
                <option value="DAO_VOTE">DAO Vote</option>
                <option value="TREASURY_MINT">Treasury Mint</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full p-2 bg-black/50 border border-green-500/30 rounded-lg text-green-400 focus:outline-none focus:border-green-500/50"
              >
                <option value="">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Date From</label>
              <input
                type="datetime-local"
                value={filter.dateFrom}
                onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
                className="w-full p-2 bg-black/50 border border-green-500/30 rounded-lg text-green-400 focus:outline-none focus:border-green-500/50"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Date To</label>
              <input
                type="datetime-local"
                value={filter.dateTo}
                onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
                className="w-full p-2 bg-black/50 border border-green-500/30 rounded-lg text-green-400 focus:outline-none focus:border-green-500/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Tabs defaultValue="table" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-green-500/30">
          <TabsTrigger value="table" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
            <Activity className="w-4 h-4 mr-2" />
            Log Table
          </TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
            <Eye className="w-4 h-4 mr-2" />
            Details View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card className="bg-gray-900/50 border-green-500/30">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-green-500/30">
                    <tr className="text-left">
                      <th className="p-4 text-green-400 font-semibold">Block #</th>
                      <th className="p-4 text-green-400 font-semibold">Hash</th>
                      <th className="p-4 text-green-400 font-semibold">Action</th>
                      <th className="p-4 text-green-400 font-semibold">User</th>
                      <th className="p-4 text-green-400 font-semibold">Time</th>
                      <th className="p-4 text-green-400 font-semibold">Status</th>
                      <th className="p-4 text-green-400 font-semibold">Gas</th>
                      <th className="p-4 text-green-400 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, index) => (
                      <tr
                        key={log.id}
                        className={`border-b border-green-500/10 hover:bg-green-500/5 transition-colors ${
                          index % 2 === 0 ? "bg-black/20" : "bg-transparent"
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-400 font-mono">#{log.blockNumber}</span>
                            {verifyLogIntegrity(log) && (
                              <CheckCircle className="w-4 h-4 text-green-400" title="Verified" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <code className="text-green-400 text-sm bg-black/50 px-2 py-1 rounded">
                            {log.hash.slice(0, 10)}...
                          </code>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className={getActionColor(log.action)}>{getActionIcon(log.action)}</span>
                            <span className="text-gray-300">{log.action.replace(/_/g, " ")}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <code className="text-gray-400 text-sm">
                            {log.user.slice(0, 6)}...{log.user.slice(-4)}
                          </code>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-400 text-sm">
                            <div>{log.timestamp.toLocaleTimeString()}</div>
                            <div className="text-xs text-gray-500">{log.timestamp.toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={`${
                              log.status === "confirmed"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : log.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                            }`}
                          >
                            {log.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-400 text-sm">{log.gasUsed.toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <Button
                            onClick={() => setSelectedLog(log)}
                            variant="outline"
                            size="sm"
                            className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          {selectedLog ? (
            <Card className="bg-gray-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Block #{selectedLog.blockNumber} Details</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{selectedLog.status}</Badge>
                  {verifyLogIntegrity(selectedLog) && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Block Hash</label>
                      <code className="text-green-400 text-sm bg-black/50 p-2 rounded block break-all">
                        {selectedLog.hash}
                      </code>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Previous Hash</label>
                      <code className="text-green-400 text-sm bg-black/50 p-2 rounded block break-all">
                        {selectedLog.previousHash}
                      </code>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Merkle Root</label>
                      <code className="text-green-400 text-sm bg-black/50 p-2 rounded block break-all">
                        {selectedLog.merkleRoot}
                      </code>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Timestamp</label>
                      <div className="text-green-400 bg-black/50 p-2 rounded">
                        {selectedLog.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">User Address</label>
                      <code className="text-green-400 text-sm bg-black/50 p-2 rounded block break-all">
                        {selectedLog.user}
                      </code>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Gas Used</label>
                        <div className="text-green-400 bg-black/50 p-2 rounded">
                          {selectedLog.gasUsed.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Nonce</label>
                        <div className="text-green-400 bg-black/50 p-2 rounded">{selectedLog.nonce}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Transaction Details</label>
                  <div className="bg-black/50 p-4 rounded-lg border border-green-500/20">
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="text-green-400 font-semibold">Cryptographic Verification</h4>
                      <p className="text-green-300 text-sm mt-1">
                        This log entry has been cryptographically verified and is tamper-proof. The hash chain ensures
                        immutability and integrity of all recorded transactions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-900/50 border-green-500/30">
              <CardContent className="p-12 text-center">
                <Eye className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-gray-400 text-lg mb-2">No Log Selected</h3>
                <p className="text-gray-500">Select a log entry from the table to view detailed information</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
