import { createContext, ReactNode, Reducer, useReducer, useState } from "react";
import agents from "../data/agents.json";

export type Agent = ReturnType<() => typeof agents[0]>;
export type Tier = "S" | "A" | "B" | "C" | "D";

export interface TierState extends Record<Tier, Agent[]> {
  available: Agent[];
}

enum ActionKind {
  ADD_AGENT = "ADD_AGENT",
  REMOVE_AGENT = "REMOVE_AGENT",
  RESET_STATE = "RESET_STATE",
}

type Action = {
  type: ActionKind;
  payload: {
    agent: Agent;
    tier: Tier;
  };
};

const initialState: TierState = {
  S: [],
  A: [],
  B: [],
  C: [],
  D: [],
  available: agents,
};

interface OnChangeTierProps {
  transferAgent: Agent;
  tier: Tier;
  prevTier?: Tier;
}

const reducer: Reducer<TierState, Action> = (state, action) => {
  switch (action.type) {
    case ActionKind.ADD_AGENT:
      return {
        ...state,
        [action.payload.tier]: [
          ...state[action.payload.tier],
          action.payload.agent,
        ],
        available: state.available.filter(
          (agent) => agent !== action.payload.agent
        ),
      };
    case ActionKind.REMOVE_AGENT:
      return {
        ...state,
        [action.payload.tier]: state[action.payload.tier].filter(
          (agent) => agent.key !== action.payload.agent.key
        ),
      };
    case ActionKind.RESET_STATE:
      return initialState;
    default:
      throw new Error("Unkown action: " + action.type);
  }
};

export interface AgentTierContextValues {
  tierState: TierState;
  onChangeTier: (props: OnChangeTierProps) => void;
  getTierColor: (tier: Tier) => string;
  handleOnDragEnd: () => void;
  handleDragStart: (agent: Agent, tier?: Tier) => void;
  transferAgent?: Agent;
  prevTier?: Tier;
  resetState: () => void;
}

export const AgentTierContext = createContext<AgentTierContextValues>(
  {} as AgentTierContextValues
);

const tierColors: Record<Tier, string> = {
  S: "#ef4444",
  A: "#fb923c",
  B: "#facc15",
  C: "#4ade80",
  D: "#38bdf8",
};

export const AgentTierProvider = ({ children }: { children: ReactNode }) => {
  const [tierState, dispatch] = useReducer(reducer, initialState);
  const [transferAgent, setTransferAgent] = useState<Agent>();
  const [prevTier, setPrevTier] = useState<Tier>();

  const handleOnDragEnd = () => {
    setTransferAgent(undefined);
    setPrevTier(undefined);
  };

  const handleDragStart = (agent: Agent, tier?: Tier) => {
    setTransferAgent(agent);
    setPrevTier(tier);
  };

  const onChangeTier = ({
    tier,
    transferAgent,
    prevTier,
  }: OnChangeTierProps) => {
    if (!transferAgent || tierState[tier].includes(transferAgent)) return;

    dispatch({
      type: ActionKind.ADD_AGENT,
      payload: {
        tier,
        agent: transferAgent,
      },
    });

    if (prevTier) {
      dispatch({
        type: ActionKind.REMOVE_AGENT,
        payload: {
          tier: prevTier,
          agent: transferAgent,
        },
      });
    }
  };

  const getTierColor = (tier: Tier) => {
    const color = tierColors[tier];
    if (!color) {
      throw new Error("Tier doesnt exists");
    }

    return color;
  };

  const resetState = () => {
    dispatch({
      type: ActionKind.RESET_STATE,
    } as Action);
  };

  return (
    <AgentTierContext.Provider
      value={{
        tierState,
        onChangeTier,
        getTierColor,
        handleOnDragEnd,
        handleDragStart,
        transferAgent,
        prevTier,
        resetState,
      }}
    >
      {children}
    </AgentTierContext.Provider>
  );
};
