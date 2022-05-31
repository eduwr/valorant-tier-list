import { useContext } from "react";

import {
  AgentTierContext,
  AgentTierContextValues,
} from "../contexts/AgentTierContext";

export const useAgentTier = (): AgentTierContextValues => {
  const context = useContext(AgentTierContext);
  if (context === undefined) {
    throw new Error("useAgentTier must be used within a AgentTierProvider");
  }
  return context;
};
