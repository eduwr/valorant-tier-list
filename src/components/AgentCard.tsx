import { Agent, Tier } from "../contexts/AgentTierContext";
import Image from "next/image";

interface Props {
  agent: Agent;
  handleOnDragEnd: () => void;
  handleDragStart: (agent: Agent, tier?: Tier) => void;
}

export const AgentCard = ({
  handleDragStart,
  handleOnDragEnd,
  agent,
}: Props) => {
  return (
    <div
      draggable
      onDragEnd={handleOnDragEnd}
      onDragStart={() => {
        handleDragStart(agent);
      }}
      key={agent.key}
      className="flex w-20 items-center justify-center relative"
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
