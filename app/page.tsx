"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  BarChart3,
  Code,
} from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Total Volume", value: "$2.4B", change: "+12.5%" },
  { label: "Active Users", value: "150K+", change: "+8.2%" },
  { label: "Transactions", value: "5.2M", change: "+15.7%" },
  { label: "Countries", value: "120+", change: "+3" },
]

const features = [
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Multi-Chain Wallet",
    description: "Support for Bitcoin, Ethereum, and 50+ cryptocurrencies with advanced security features.",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "DeFi Staking",
    description: "Earn up to 25% APY through our optimized staking pools and yield farming strategies.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Bank-Grade Security",
    description: "Military-grade encryption, multi-signature wallets, and cold storage protection.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Lightning Fast",
    description: "Execute trades and transfers in milliseconds with our optimized blockchain infrastructure.",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global Access",
    description: "Trade 24/7 from anywhere in the world with full regulatory compliance.",
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Developer APIs",
    description: "Integrate with our Rust and Java backend APIs for institutional-grade solutions.",
  },
]

const testimonials = [
  {
    name: "Alex Chen",
    role: "Crypto Trader",
    content:
      "DeFiVerse has revolutionized my trading experience. The interface is intuitive and the security is unmatched.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "DeFi Investor",
    content: "The staking rewards are incredible. I've earned more in 6 months than traditional banking in 5 years.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Blockchain Developer",
    content: "Their API documentation is excellent. Integration was seamless with both Rust and Java backends.",
    rating: 5,
  },
]

export default function HomePage() {
  const [currentStat, setCurrentStat] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Navigation */}
      <nav className="border-b border-green-900/30 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-green-400">DeFiVerse</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">v2.0</Badge>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-green-400 hover:text-green-300 transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-green-400 transition-colors">
                About
              </Link>
              <Link href="/dashboard" className="text-gray-400 hover:text-green-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/api" className="text-gray-400 hover:text-green-400 transition-colors">
                API
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
              >
                Sign In
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-black to-emerald-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                  🚀 Now with Rust & Java Backend
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  The Future of
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                    {" "}
                    DeFi Banking
                  </span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Experience next-generation decentralized finance with military-grade security, lightning-fast
                  transactions, and institutional-level APIs powered by Rust and Java.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8">
                  Launch App
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10 px-8 bg-transparent"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">$2.4B+</div>
                  <div className="text-sm text-gray-500">Total Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">150K+</div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">99.9%</div>
                  <div className="text-sm text-gray-500">Uptime</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Card className="bg-gray-900/50 border-green-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-400">Live Trading Dashboard</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-green-400">LIVE</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-black/50 rounded-lg border border-green-500/20">
                        <div className="text-sm text-gray-400">BTC/USD</div>
                        <div className="text-lg font-bold text-green-400">$45,234.56</div>
                        <div className="text-xs text-green-400">+2.34%</div>
                      </div>
                      <div className="p-3 bg-black/50 rounded-lg border border-green-500/20">
                        <div className="text-sm text-gray-400">ETH/USD</div>
                        <div className="text-lg font-bold text-green-400">$3,187.92</div>
                        <div className="text-xs text-green-400">+1.87%</div>
                      </div>
                    </div>
                    <div className="h-32 bg-black/30 rounded-lg flex items-center justify-center border border-green-500/20">
                      <BarChart3 className="w-16 h-16 text-green-500/50" />
                    </div>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-black">Start Trading</Button>
                  </CardContent>
                </Card>
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-green-900/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-lg transition-all duration-500 ${
                  currentStat === index ? "bg-green-500/10 border border-green-500/30" : "bg-gray-900/30"
                }`}
              >
                <div className="text-3xl font-bold text-green-400 mb-2">{stat.value}</div>
                <div className="text-gray-400 mb-1">{stat.label}</div>
                <div className="text-sm text-green-400">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-400 mb-4">Powered by Advanced Technology</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built with cutting-edge Rust and Java backends for unmatched performance, security, and scalability in the
              DeFi ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-green-500/30 hover:border-green-500/50 transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="text-green-400 group-hover:text-green-300 transition-colors mb-4">{feature.icon}</div>
                  <CardTitle className="text-green-400">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-400 mb-4">Enterprise-Grade Architecture</h2>
            <p className="text-xl text-gray-400">
              Built with the most advanced technologies for maximum performance and security
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-black/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Code className="w-6 h-6 mr-2" />
                  Rust Backend
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Ultra-fast, memory-safe blockchain operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-green-500/20">
                  <code className="text-green-400 text-sm">
                    {`// High-performance transaction processing
async fn process_transaction(tx: Transaction) -> Result<Hash> {
    let validated = validate_transaction(&tx).await?;
    blockchain.add_transaction(validated).await
}`}
                  </code>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Zero-cost abstractions
                  </li>
                  <li className="flex items-center text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Memory safety without garbage collection
                  </li>
                  <li className="flex items-center text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Concurrent transaction processing
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  Java Enterprise
                </CardTitle>
                <CardDescription className="text-gray-400">Scalable microservices architecture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-green-500/20">
                  <code className="text-green-400 text-sm">
                    {`@RestController
@RequestMapping("/api/v1/wallet")
public class WalletController {
    @PostMapping("/transfer")
    public ResponseEntity<TransactionResult> transfer(
        @RequestBody TransferRequest request) {
        return walletService.processTransfer(request);
    }
}`}
                  </code>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Spring Boot microservices
                  </li>
                  <li className="flex items-center text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Enterprise security features
                  </li>
                  <li className="flex items-center text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Horizontal scaling support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-400 mb-4">Trusted by Crypto Leaders</h2>
            <p className="text-xl text-gray-400">See what our community says about DeFiVerse</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-900/50 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-green-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-400 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-green-400">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-green-400 mb-4">Ready to Start Your DeFi Journey?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust DeFiVerse for their cryptocurrency needs. Start trading, staking, and
            earning today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8">
              Create Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10 px-8 bg-transparent"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-900/30 bg-black/95">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-green-400">DeFiVerse</span>
              </div>
              <p className="text-gray-400">The future of decentralized finance, powered by advanced technology.</p>
            </div>
            <div>
              <h3 className="text-green-400 font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-green-400">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/staking" className="hover:text-green-400">
                    Staking
                  </Link>
                </li>
                <li>
                  <Link href="/lending" className="hover:text-green-400">
                    Lending
                  </Link>
                </li>
                <li>
                  <Link href="/nfts" className="hover:text-green-400">
                    NFTs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-green-400 font-semibold mb-4">Developers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/api" className="hover:text-green-400">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link href="/rust-sdk" className="hover:text-green-400">
                    Rust SDK
                  </Link>
                </li>
                <li>
                  <Link href="/java-sdk" className="hover:text-green-400">
                    Java SDK
                  </Link>
                </li>
                <li>
                  <Link href="/github" className="hover:text-green-400">
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-green-400 font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-green-400">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-green-400">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-green-400">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-green-400">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-900/30 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DeFiVerse. All rights reserved. Built with Rust & Java.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
