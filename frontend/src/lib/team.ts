// ============================================================
// TEAM CONFIGURATION
// Edit this file to update team member information.
// Changes here automatically reflect on the About page.
// ============================================================

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string; // URL or path to avatar image
  initials: string; // Fallback when no avatar image
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  skills: string[];
}

export const teamMembers: TeamMember[] = [
  {
    name: "Member One",
    role: "Lead Developer",
    bio: "Full-stack blockchain developer passionate about decentralized finance and smart contract architecture.",
    avatar: "",
    initials: "M1",
    socials: {
      github: "https://github.com",
      email: "member1@example.com",
    },
    skills: ["Solidity", "React", "TypeScript", "Web3"],
  },
  {
    name: "Member Two",
    role: "Smart Contract Engineer",
    bio: "Security-focused engineer specializing in ERC standards, gas optimization, and contract auditing.",
    avatar: "",
    initials: "M2",
    socials: {
      github: "https://github.com",
      email: "member2@example.com",
    },
    skills: ["Solidity", "Hardhat", "OpenZeppelin", "Security"],
  },
  {
    name: "Member Three",
    role: "UI/UX Designer & Frontend",
    bio: "Creative designer who bridges the gap between complex blockchain tech and beautiful user experiences.",
    avatar: "",
    initials: "M3",
    socials: {
      github: "https://github.com",
      email: "member3@example.com",
    },
    skills: ["Next.js", "Tailwind CSS", "Figma", "UI Design"],
  },
];

export const projectInfo = {
  name: "BBC Wallet",
  fullName: "BigBlackCoin Wallet",
  version: "1.0.0",
  description:
    "An educational blockchain web application featuring a custom ERC-20 token, multi-currency wallet, and real-time market monitoring.",
  purpose: "Built as an educational project to learn blockchain development, smart contract design, and Web3 frontend integration.",
  techStack: [
    { name: "Solidity", category: "Smart Contracts" },
    { name: "OpenZeppelin", category: "Smart Contracts" },
    { name: "Hardhat", category: "Blockchain" },
    { name: "Next.js 14", category: "Frontend" },
    { name: "React 18", category: "Frontend" },
    { name: "TypeScript", category: "Frontend" },
    { name: "ethers.js v6", category: "Web3" },
    { name: "Zustand", category: "State" },
    { name: "Tailwind CSS", category: "Styling" },
  ],
  features: [
    {
      title: "Custom ERC-20 Token",
      description: "Mintable, burnable BBC token with max supply cap and airdrop support.",
    },
    {
      title: "Multi-Currency Wallet",
      description: "View balances in USD, EUR, GBP, BTC, ETH, or BBC with live conversion.",
    },
    {
      title: "Real-Time Market Data",
      description: "Live cryptocurrency prices from CoinGecko with interactive charts.",
    },
    {
      title: "Send & Receive",
      description: "Transfer BBC tokens with gas estimation and QR code address sharing.",
    },
    {
      title: "Transaction History",
      description: "Full transaction log with filtering by type and status.",
    },
    {
      title: "MetaMask Integration",
      description: "Seamless wallet connection with automatic network detection.",
    },
  ],
};
