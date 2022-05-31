import { Agent, Tier } from "../contexts/AgentTierContext";
import Image from "next/image";
import { useAgentTier } from "../hooks/useAgentTier";

interface Props {
  agent: Agent;
  tier?: Tier;
}

export const AgentCard = ({ agent, tier }: Props) => {
  const { handleDragStart, handleOnDragEnd } = useAgentTier();

  return (
    <div
      draggable
      onDragEnd={handleOnDragEnd}
      onDragStart={() => {
        handleDragStart(agent, tier);
      }}
      key={agent.key}
      className="flex w-20 items-center justify-center relative bg-slate-400"
    >
      <Image
        src={"/" + agent.url}
        layout="fill"
        objectFit="cover"
        alt={agent.key}
      />
      {agent.key}
    </div>
  );
};
