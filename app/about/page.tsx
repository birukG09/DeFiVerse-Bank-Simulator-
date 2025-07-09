"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Globe, Users, Target, Rocket, Code, Wallet } from "lucide-react"
import Link from "next/link"

const milestones = [
  { year: "2021", title: "Foundation", description: "DeFiVerse founded with vision to democratize finance" },
  { year: "2022", title: "Beta Launch", description: "First beta version with basic wallet functionality" },
  { year: "2023", title: "Rust Integration", description: "Migrated core systems to Rust for performance" },
  { year: "2024", title: "Enterprise Ready", description: "Java microservices and institutional features" },
]

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "CEO & Co-Founder",
    background: "Former Goldman Sachs VP, PhD in Computer Science from MIT",
    expertise: "Blockchain Architecture, Financial Systems",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO & Co-Founder",
    background: "Ex-Google Senior Engineer, Rust Core Contributor",
    expertise: "Systems Programming, Distributed Computing",
  },
  {
    name: "Elena Volkov",
    role: "Head of Security",
    background: "Former NSA Cybersecurity Specialist, 15+ years experience",
    expertise: "Cryptography, Security Auditing",
  },
  {
    name: "James Park",
    role: "Lead Backend Engineer",
    background: "Ex-Netflix Senior Engineer, Java Champion",
    expertise: "Microservices, Scalable Systems",
  },
]

const values = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Security First",
    description:
      "Every line of code is written with security as the top priority. We employ military-grade encryption and multi-layer security protocols.",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global Accessibility",
    description:
      "Building financial infrastructure that serves everyone, everywhere, regardless of location or background.",
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Open Innovation",
    description: "Embracing open-source principles and contributing back to the community that makes DeFi possible.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community Driven",
    description: "Our users are our partners. Every feature is built based on community feedback and real-world needs.",
  },
]

const techStack = [
  {
    category: "Backend",
    technologies: [
      { name: "Rust", description: "Core blockchain operations", color: "text-orange-400" },
      { name: "Java Spring", description: "Microservices architecture", color: "text-blue-400" },
      { name: "PostgreSQL", description: "Primary database", color: "text-blue-300" },
      { name: "Redis", description: "Caching layer", color: "text-red-400" },
    ],
  },
  {
    category: "Frontend",
    technologies: [
      { name: "Next.js", description: "React framework", color: "text-gray-300" },
      { name: "TypeScript", description: "Type safety", color: "text-blue-400" },
      { name: "Tailwind CSS", description: "Styling", color: "text-cyan-400" },
      { name: "WebSocket", description: "Real-time updates", color: "text-green-400" },
    ],
  },
  {
    category: "Infrastructure",
    technologies: [
      { name: "Kubernetes", description: "Container orchestration", color: "text-blue-400" },
      { name: "Docker", description: "Containerization", color: "text-blue-300" },
      { name: "AWS", description: "Cloud infrastructure", color: "text-orange-400" },
      { name: "Prometheus", description: "Monitoring", color: "text-red-400" },
    ],
  },
]

export default function AboutPage() {
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
              <Link href="/" className="text-gray-400 hover:text-green-400 transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-green-400 hover:text-green-300 transition-colors">
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
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-black to-emerald-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 mb-6">
              🏢 About DeFiVerse
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Revolutionizing
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                {" "}
                Decentralized Finance
              </span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              We're building the future of finance with cutting-edge technology, uncompromising security, and a vision
              to make DeFi accessible to everyone, everywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8">
                Join Our Mission
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 px-8 bg-transparent"
              >
                View Careers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-black/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center text-2xl">
                  <Target className="w-8 h-8 mr-3" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-lg leading-relaxed">
                  To democratize access to financial services through innovative blockchain technology, making DeFi
                  simple, secure, and accessible to users worldwide.
                </p>
                <p className="text-gray-400">
                  We believe that everyone deserves access to fair, transparent, and efficient financial services,
                  regardless of their location or economic status.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center text-2xl">
                  <Rocket className="w-8 h-8 mr-3" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-lg leading-relaxed">
                  To become the leading DeFi platform that bridges traditional finance with decentralized technologies,
                  powered by enterprise-grade infrastructure.
                </p>
                <p className="text-gray-400">
                  We envision a world where financial sovereignty is not a privilege but a fundamental right, enabled by
                  secure and scalable blockchain solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-400 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-400">From startup to industry leader - the DeFiVerse story</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-500/30" />
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                    <Card className="bg-gray-900/50 border-green-500/30">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-green-400 mb-2">{milestone.year}</div>
                        <div className="text-xl font-semibold text-white mb-2">{milestone.title}</div>
                        <p className="text-gray-400">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-black" />
                  </div>
                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-400 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-400">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="bg-black/50 border-green-500/30 hover:border-green-500/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="text-green-400 mb-4">{value.icon}</div>
                  <CardTitle className="text-green-400 text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-400 mb-4">Technology Stack</h2>
            <p className="text-xl text-gray-400">Built with the most advanced technologies for maximum performance</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {techStack.map((stack, index) => (
              <Card key={index} className="bg-gray-900/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400 text-xl">{stack.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stack.technologies.map((tech, techIndex) => (
                    <div
                      key={techIndex}
                      className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-green-500/20"
                    >
                      <div>
                        <div className={`font-semibold ${tech.color}`}>{tech.name}</div>
                        <div className="text-sm text-gray-400">{tech.description}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-400 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-400">Meet the experts building the future of DeFi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-black/50 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-xl">{member.name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-400 mb-1">{member.name}</h3>
                      <p className="text-emerald-300 font-semibold mb-2">{member.role}</p>
                      <p className="text-gray-400 text-sm mb-2">{member.background}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.split(", ").map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-900/50 rounded-lg border border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-2">$2.4B+</div>
              <div className="text-gray-400">Total Volume Processed</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 rounded-lg border border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-2">150K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 rounded-lg border border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-400">Platform Uptime</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 rounded-lg border border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-2">120+</div>
              <div className="text-gray-400">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-green-400 mb-4">Join the DeFi Revolution</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Be part of the team that's building the future of finance. We're always looking for talented individuals who
            share our vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8">
              View Open Positions
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10 px-8 bg-transparent"
            >
              Contact Us
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
