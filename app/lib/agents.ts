import fs from 'fs';
import path from 'path';

export type Review = {
  author: string;
  stars: number;
  comment: string;
};

export type Agent = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  industry: string[];
  function: string;
  productLine: string;
  status: 'live' | 'coming-soon';
  flowId: string;
  tags: string[];
  emoji: string;
  iconBg: string;
  rating: number;
  reviews: Review[];
  usageCount: number;
  videoUrl: string;
  docsUrl: string;
  reviewLinks: string[];
  featured: boolean;
};

export function computeRating(agent: Agent): number {
  if (!agent.reviews || agent.reviews.length === 0) return agent.rating;
  const sum = agent.reviews.reduce((acc, r) => acc + r.stars, 0);
  return sum / agent.reviews.length;
}

export function getAllAgents(): Agent[] {
  const agentsDir = path.join(process.cwd(), 'agents');
  const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.json'));
  return files
    .map(file => JSON.parse(fs.readFileSync(path.join(agentsDir, file), 'utf-8')) as Agent)
    .sort((a, b) => b.usageCount - a.usageCount);
}

export function getAgentById(id: string): Agent | null {
  const agentsDir = path.join(process.cwd(), 'agents');
  const filePath = path.join(agentsDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Agent;
}
