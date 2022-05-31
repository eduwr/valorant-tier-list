import { Agent, Tier, TierState } from "../contexts/AgentTierContext";
import { useAgentTier } from "../hooks/useAgentTier";
import { DragEvent } from "react";
import { AgentCard } from "./AgentCard";

export const TierList = () => {
  const { onChangeTier, tierState, getTierColor, transferAgent, prevTier } =
    useAgentTier();

  const handleOnDrop = (tier: Tier) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!transferAgent || tierState[tier].includes(transferAgent)) return;

    onChangeTier({
      tier,
      transferAgent,
      prevTier,
    });
  };

  return (
    <>
      {(Object.entries(tierState) as Array<[keyof TierState, Agent[]]>).map(
        ([tier, agents]) => {
          if (tier && tier !== "available") {
            return (
              <div
                key={tier}
                className="w-full h-20 flex flex-row"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleOnDrop(tier)}
                style={{
                  backgroundColor: getTierColor(tier),
                }}
              >
                <div className="flex text-black w-20 items-center justify-center">
                  TIER {tier}
                </div>

                {agents.map((agent) => (
                  <AgentCard tier={tier} agent={agent} key={agent.key} />
                ))}
              </div>
            );
          }
        }
      )}
    </>
  );
};
