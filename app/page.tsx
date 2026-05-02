import { getAllAgents } from "@/lib/agents";
import MarketplaceClient from "./components/MarketplaceClient";

export default function Home() {
  const agents = getAllAgents();
  return <MarketplaceClient agents={agents} />;
}
