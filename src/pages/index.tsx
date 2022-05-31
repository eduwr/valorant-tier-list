import type { NextPage } from "next";
import Head from "next/head";
import { useState, DragEvent } from "react";
import { AgentCard } from "../components/AgentCard";
import { TierList } from "../components/TierList";
import { Agent, Tier, TierState } from "../contexts/AgentTierContext";
import { useAgentTier } from "../hooks/useAgentTier";

const Home: NextPage = () => {
  const [transferAgent, setTransferAgent] = useState<Agent>();
  const [prevTier, setPrevTier] = useState<Tier>();

  const { onChangeTier, tierState, getTierColor } = useAgentTier();

  const handleOnDrop = (tier: Tier) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!transferAgent || tierState[tier].includes(transferAgent)) return;

    onChangeTier({
      tier,
      transferAgent,
      prevTier,
    });
  };

  const handleOnDragEnd = () => {
    setTransferAgent(undefined);
    setPrevTier(undefined);
  };

  const handleDragStart = (agent: Agent, tier?: Tier) => {
    setTransferAgent(agent);
    setPrevTier(tier);
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <Head>
        <title>Valorant | Tier List</title>
        <meta
          name="Valorant | Tier List"
          content="Generated by create next app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="hero-content bg-primary flex-col w-4/5 h-5/6 align-top prose">
        <h1>Valorant Tier List</h1>
        <TierList
          handleDragStart={handleDragStart}
          handleOnDragEnd={handleOnDragEnd}
          prevTier={prevTier}
          transferAgent={transferAgent}
        />
        <div className="flex flex-row h-20 bg-accent-focus">
          {tierState.available.map((agent) => (
            <AgentCard
              agent={agent}
              handleDragStart={handleDragStart}
              handleOnDragEnd={handleOnDragEnd}
              key={agent.key}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
