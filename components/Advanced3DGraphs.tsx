"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, PieChart, TrendingUp, Activity, RotateCcw, Settings, Download, Play, Pause } from "lucide-react"

// 3D Graph Component using Canvas and WebGL-like rendering
const Canvas3D = ({ width = 400, height = 300, data, type = "bar" }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = width / 2
    const centerY = height / 2
    const scale = 100

    const draw3DBar = (x: number, y: number, height: number, color: string) => {
      const rotX = (rotation.x * Math.PI) / 180
      const rotY = (rotation.y * Math.PI) / 180

      // 3D transformation
      const x3d = x * Math.cos(rotY) - y * Math.sin(rotY)
      const y3d = x * Math.sin(rotY) * Math.sin(rotX) + y * Math.cos(rotY) * Math.sin(rotX) + height * Math.cos(rotX)
      const z3d = x * Math.sin(rotY) * Math.cos(rotX) + y * Math.cos(rotY) * Math.cos(rotX) - height * Math.sin(rotX)

      const screenX = centerX + (x3d * scale) / (z3d + 5)
      const screenY = centerY - (y3d * scale) / (z3d + 5)

      // Draw bar
      ctx.fillStyle = color
      ctx.fillRect(screenX - 10, screenY - height * 2, 20, height * 2)

      // Add glow effect
      ctx.shadowColor = color
      ctx.shadowBlur = 10
      ctx.fillRect(screenX - 10, screenY - height * 2, 20, height * 2)
      ctx.shadowBlur = 0
    }

    const draw3DLine = (points: any[], color: string) => {
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.shadowColor = color
      ctx.shadowBlur = 5

      ctx.beginPath()
      points.forEach((point, index) => {
        const rotX = (rotation.x * Math.PI) / 180
        const rotY = (rotation.y * Math.PI) / 180

        const x3d = point.x * Math.cos(rotY) - point.y * Math.sin(rotY)
        const y3d =
          point.x * Math.sin(rotY) * Math.sin(rotX) +
          point.y * Math.cos(rotY) * Math.sin(rotX) +
          point.z * Math.cos(rotX)
        const z3d =
          point.x * Math.sin(rotY) * Math.cos(rotX) +
          point.y * Math.cos(rotY) * Math.cos(rotX) -
          point.z * Math.sin(rotX)

        const screenX = centerX + (x3d * scale) / (z3d + 5)
        const screenY = centerY - (y3d * scale) / (z3d + 5)

        if (index === 0) {
          ctx.moveTo(screenX, screenY)
        } else {
          ctx.lineTo(screenX, screenY)
        }
      })
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // Clear canvas
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "#00ff0020"
    ctx.lineWidth = 1
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath()
      ctx.moveTo(centerX + i * 30, 0)
      ctx.lineTo(centerX + i * 30, height)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, centerY + i * 30)
      ctx.lineTo(width, centerY + i * 30)
      ctx.stroke()
    }

    if (type === "bar" && data) {
      data.forEach((item: any, index: number) => {
        const x = (index - data.length / 2) * 0.5
        const y = 0
        const barHeight = item.value / 1000
        const hue = (index * 60) % 360
        const color = `hsl(${hue}, 70%, 50%)`
        draw3DBar(x, y, barHeight, color)
      })
    }

    if (type === "line" && data) {
      const points = data.map((item: any, index: number) => ({
        x: (index - data.length / 2) * 0.3,
        y: 0,
        z: item.value / 5000,
      }))
      draw3DLine(points, "#00ff00")
    }

    if (type === "surface" && data) {
      // Draw 3D surface
      for (let i = 0; i < data.length - 1; i++) {
        for (let j = 0; j < data[i].length - 1; j++) {
          const x1 = (i - data.length / 2) * 0.2
          const y1 = (j - data[i].length / 2) * 0.2
          const z1 = data[i][j] / 10000

          const x2 = (i + 1 - data.length / 2) * 0.2
          const y2 = (j - data[i].length / 2) * 0.2
          const z2 = data[i + 1][j] / 10000

          const points = [
            { x: x1, y: y1, z: z1 },
            { x: x2, y: y2, z: z2 },
          ]

          const intensity = (z1 + z2) / 2
          const color = `hsl(${120 + intensity * 60}, 70%, 50%)`
          draw3DLine(points, color)
        }
      }
    }
  }, [rotation, data, type, width, height])

  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setRotation((prev) => ({
        x: prev.x + 0.5,
        y: prev.y + 1,
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [isAnimating])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isAnimating) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 360
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 360
        setRotation({ x: y, y: x })
      }
    }
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-green-500/30 rounded-lg cursor-pointer"
        onMouseMove={handleMouseMove}
        style={{ background: "linear-gradient(45deg, #000000, #001100)" }}
      />
      <div className="absolute top-2 right-2 flex space-x-1">
        <Button
          onClick={() => setIsAnimating(!isAnimating)}
          size="sm"
          variant="outline"
          className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-black/50"
        >
          {isAnimating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </Button>
        <Button
          onClick={() => setRotation({ x: 0, y: 0 })}
          size="sm"
          variant="outline"
          className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-black/50"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}

export function Advanced3DGraphs() {
  const [portfolioData, setPortfolioData] = useState([
    { name: "BTC", value: 45000, volume: 25000000000 },
    { name: "ETH", value: 3200, volume: 15000000000 },
    { name: "BANK", value: 25, volume: 125000000 },
    { name: "GOV", value: 15, volume: 50000000 },
    { name: "USDT", value: 1, volume: 45000000000 },
  ])

  const [stakingData, setStakingData] = useState([
    { pool: "ETH Pool", apy: 12.5, tvl: 1250000000 },
    { pool: "BANK Pool", apy: 25.8, tvl: 500000000 },
    { pool: "BTC-ETH LP", apy: 18.2, tvl: 750000000 },
    { pool: "GOV Pool", apy: 15.3, tvl: 300000000 },
  ])

  const [surfaceData, setSurfaceData] = useState(() => {
    const data = []
    for (let i = 0; i < 10; i++) {
      const row = []
      for (let j = 0; j < 10; j++) {
        row.push(Math.sin(i * 0.5) * Math.cos(j * 0.5) * 50000 + 25000)
      }
      data.push(row)
    }
    return data
  })

  const [timeSeriesData, setTimeSeriesData] = useState(() => {
    const data = []
    for (let i = 0; i < 50; i++) {
      data.push({
        time: i,
        value: 25000 + Math.sin(i * 0.2) * 5000 + Math.random() * 2000,
      })
    }
    return data
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioData((prev) =>
        prev.map((item) => ({
          ...item,
          value: item.value * (1 + (Math.random() - 0.5) * 0.02),
          volume: item.volume * (1 + (Math.random() - 0.5) * 0.1),
        })),
      )

      setTimeSeriesData((prev) => {
        const newData = [...prev.slice(1)]
        newData.push({
          time: prev[prev.length - 1].time + 1,
          value: prev[prev.length - 1].value * (1 + (Math.random() - 0.5) * 0.05),
        })
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900/50 border-green-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-green-400" />
              <div>
                <CardTitle className="text-green-400">Advanced 3D Analytics</CardTitle>
                <p className="text-gray-400 text-sm">Interactive 3D visualizations and real-time data analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Real-time</Badge>
              <Button
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

      {/* 3D Visualizations */}
      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-green-500/30">
          <TabsTrigger value="portfolio" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
            <PieChart className="w-4 h-4 mr-2" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="staking" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
            <TrendingUp className="w-4 h-4 mr-2" />
            Staking
          </TabsTrigger>
          <TabsTrigger value="market" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
            <Activity className="w-4 h-4 mr-2" />
            Market
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">3D Portfolio Distribution</CardTitle>
                <p className="text-gray-400 text-sm">Interactive 3D bar chart of token holdings</p>
              </CardHeader>
              <CardContent>
                <Canvas3D width={400} height={300} data={portfolioData} type="bar" />
                <div className="mt-4 space-y-2">
                  {portfolioData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }} />
                        <span className="text-gray-400">{item.name}</span>
                      </div>
                      <span className="text-green-400">${item.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Price Trends 3D</CardTitle>
                <p className="text-gray-400 text-sm">Real-time price movement visualization</p>
              </CardHeader>
              <CardContent>
                <Canvas3D width={400} height={300} data={timeSeriesData} type="line" />
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Current Price:</span>
                    <div className="text-green-400 font-semibold">
                      ${timeSeriesData[timeSeriesData.length - 1]?.value.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">24h Change:</span>
                    <div className="text-green-400 font-semibold">+2.34%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Staking Pool Performance</CardTitle>
                <p className="text-gray-400 text-sm">3D visualization of APY vs TVL</p>
              </CardHeader>
              <CardContent>
                <Canvas3D
                  width={400}
                  height={300}
                  data={stakingData.map((pool) => ({ name: pool.pool, value: pool.apy * 1000 }))}
                  type="bar"
                />
                <div className="mt-4 space-y-2">
                  {stakingData.map((pool, index) => (
                    <div key={pool.pool} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{pool.pool}</span>
                      <div className="text-right">
                        <div className="text-green-400">{pool.apy}% APY</div>
                        <div className="text-gray-500">${(pool.tvl / 1e6).toFixed(1)}M TVL</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Yield Farming Heatmap</CardTitle>
                <p className="text-gray-400 text-sm">3D surface showing yield opportunities</p>
              </CardHeader>
              <CardContent>
                <Canvas3D width={400} height={300} data={surfaceData} type="surface" />
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-400">Avg Yield:</span>
                    <span className="text-green-400 ml-2">18.7%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Best Pool:</span>
                    <span className="text-green-400 ml-2">BANK Pool</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Market Depth 3D</CardTitle>
                <p className="text-gray-400 text-sm">Order book visualization</p>
              </CardHeader>
              <CardContent>
                <Canvas3D
                  width={400}
                  height={300}
                  data={portfolioData.map((item) => ({ name: item.name, value: item.volume / 1e6 }))}
                  type="bar"
                />
                <div className="mt-4 text-center">
                  <div className="text-green-400 text-lg font-semibold">$2.4B</div>
                  <div className="text-gray-400 text-sm">Total Market Volume</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Volatility Surface</CardTitle>
                <p className="text-gray-400 text-sm">Risk analysis across time and strike</p>
              </CardHeader>
              <CardContent>
                <Canvas3D
                  width={400}
                  height={300}
                  data={surfaceData.map((row) => row.map((val) => val * 0.5))}
                  type="surface"
                />
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Implied Vol:</span>
                    <div className="text-green-400">24.5%</div>
                  </div>
                  <div>
                    <span className="text-gray-400">VIX:</span>
                    <div className="text-green-400">18.2</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Risk Metrics 3D</CardTitle>
                <p className="text-gray-400 text-sm">Multi-dimensional risk analysis</p>
              </CardHeader>
              <CardContent>
                <Canvas3D
                  width={400}
                  height={300}
                  data={portfolioData.map((item) => ({
                    name: item.name,
                    value: Math.random() * 10000 + 5000,
                  }))}
                  type="line"
                />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Portfolio Beta:</span>
                    <span className="text-green-400">1.23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sharpe Ratio:</span>
                    <span className="text-green-400">2.45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Drawdown:</span>
                    <span className="text-red-400">-12.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Correlation Matrix</CardTitle>
                <p className="text-gray-400 text-sm">Asset correlation heatmap</p>
              </CardHeader>
              <CardContent>
                <Canvas3D
                  width={400}
                  height={300}
                  data={surfaceData.map((row) => row.map((val) => val * 0.3))}
                  type="surface"
                />
                <div className="mt-4 text-center">
                  <div className="text-green-400 text-lg font-semibold">0.67</div>
                  <div className="text-gray-400 text-sm">Average Correlation</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Controls */}
      <Card className="bg-gray-900/50 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Visualization Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-black/50 rounded-lg border border-green-500/20">
              <h4 className="text-green-400 font-semibold mb-2">Interaction</h4>
              <ul className="space-y-1 text-gray-400">
                <li>• Mouse: Rotate view</li>
                <li>• Click pause: Manual control</li>
                <li>• Reset: Return to origin</li>
              </ul>
            </div>
            <div className="p-3 bg-black/50 rounded-lg border border-green-500/20">
              <h4 className="text-green-400 font-semibold mb-2">Features</h4>
              <ul className="space-y-1 text-gray-400">
                <li>• Real-time data updates</li>
                <li>• WebGL acceleration</li>
                <li>• Responsive design</li>
              </ul>
            </div>
            <div className="p-3 bg-black/50 rounded-lg border border-green-500/20">
              <h4 className="text-green-400 font-semibold mb-2">Export</h4>
              <ul className="space-y-1 text-gray-400">
                <li>• PNG/SVG formats</li>
                <li>• High resolution</li>
                <li>• Custom dimensions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
