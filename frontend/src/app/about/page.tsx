"use client";

import { teamMembers, projectInfo } from "@/lib/team";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  Sparkles,
  Users,
  Code2,
  Layers,
  Cpu,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

function TeamCard({ member, index }: { member: typeof teamMembers[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const colors = ["amber", "blue", "emerald"];
  const color = colors[index % colors.length];

  const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", glow: "rgba(245,166,35,0.15)" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", glow: "rgba(59,130,246,0.15)" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", glow: "rgba(16,185,129,0.15)" },
  };

  const c = colorMap[color];

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-500",
        c.border,
        hovered && "scale-[1.02]"
      )}
      style={hovered ? { boxShadow: `0 8px 40px ${c.glow}` } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top gradient bar */}
      <div className={cn("h-1 w-full", `bg-gradient-to-r from-${color}-400 to-${color}-600`)} />

      <div className="p-8">
        {/* Avatar */}
        <div className="flex items-start justify-between mb-6">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-500",
            c.bg, c.text,
            hovered && "scale-110 rotate-3"
          )}>
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              member.initials
            )}
          </div>
          <div className="flex gap-2">
            {member.socials?.github && (
              <a href={member.socials.github} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
                <Github className="h-4 w-4" />
              </a>
            )}
            {member.socials?.linkedin && (
              <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {member.socials?.email && (
              <a href={`mailto:${member.socials.email}`}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
                <Mail className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Info */}
        <h3 className="text-xl font-bold mb-1">{member.name}</h3>
        <p className={cn("text-sm font-medium mb-3", c.text)}>{member.role}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{member.bio}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {member.skills.map((skill) => (
            <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-muted-foreground border border-white/[0.06]">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    <div className="max-w-5xl mx-auto space-y-20 pb-20 animate-fade-in-up">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      {/* ====== Hero ====== */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          About BBC Wallet
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Built for <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">learning</span>,
          <br />designed for <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">discovery</span>.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {projectInfo.description}
        </p>
      </section>

      {/* ====== What is BBC? ====== */}
      <section>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">What is BBC Wallet?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {projectInfo.purpose}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              BigBlackCoin (BBC) is a custom ERC-20 token with {projectInfo.features.length} key features,
              running on a local Hardhat blockchain. No real money involved — just pure learning.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {projectInfo.features.slice(0, 4).map((f, i) => (
              <div key={i} className="glass-card p-5 hover:bg-white/[0.08] transition-all duration-300">
                <h4 className="font-semibold text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Tech Stack ====== */}
      <section>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
            <Code2 className="h-3.5 w-3.5" />
            Tech Stack
          </div>
          <h2 className="text-3xl font-bold">Built with modern tools</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {projectInfo.techStack.map((tech, i) => (
            <div key={i} className="glass-card p-4 text-center hover:bg-white/[0.08] transition-all duration-300 group">
              <div className="text-sm font-medium group-hover:text-amber-400 transition-colors">{tech.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{tech.category}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== Team ====== */}
      <section>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
            <Users className="h-3.5 w-3.5" />
            Our Team
          </div>
          <h2 className="text-3xl font-bold mb-3">Meet the builders</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {teamMembers.length} developers passionate about blockchain education.
          </p>
        </div>

        <div className={cn(
          "grid gap-6",
          teamMembers.length === 1 && "max-w-md mx-auto",
          teamMembers.length === 2 && "md:grid-cols-2 max-w-3xl mx-auto",
          teamMembers.length >= 3 && "md:grid-cols-3",
        )}>
          {teamMembers.map((member, i) => (
            <TeamCard key={i} member={member} index={i} />
          ))}
        </div>
      </section>

      {/* ====== Project Info ====== */}
      <section>
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Project Details</h3>
              <div className="space-y-3">
                {[
                  { label: "Version", value: projectInfo.version },
                  { label: "Token", value: `${projectInfo.fullName} (BBC)` },
                  { label: "Standard", value: "ERC-20" },
                  { label: "Network", value: "Hardhat Local (Chain ID: 31337)" },
                  { label: "Purpose", value: "Educational / Learning" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">What You&apos;ll Learn</h3>
              <div className="space-y-3">
                {[
                  { icon: Cpu, text: "Smart contract development with Solidity" },
                  { icon: Layers, text: "Web3 frontend integration with ethers.js" },
                  { icon: Zap, text: "How wallet transactions are signed & broadcast" },
                  { icon: Code2, text: "State management for blockchain apps" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== Disclaimer ====== */}
      <section className="text-center">
        <div className="inline-block bg-amber-500/5 border border-amber-500/10 rounded-2xl px-8 py-6 max-w-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-amber-400">Educational Project</strong> — This wallet runs on a local
            Hardhat network. The BBC token has no real monetary value. Do not use with real funds on mainnet.
          </p>
        </div>
      </section>
    </div>
  );
}
