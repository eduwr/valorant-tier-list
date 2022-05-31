import { createContext, ReactNode, Reducer, useReducer } from "react";

export type Agent = string;
export type Tier = "S" | "A" | "B" | "C" | "D";

export interface TierState extends Record<Tier, Agent[]> {
  available: Agent[];
}

enum ActionKind {
  ADD_AGENT = "ADD_AGENT",
  REMOVE_AGENT = "REMOVE_AGENT",
}

type Action = {
  type: ActionKind;
  payload: {
    agent: Agent;
    tier: Tier;
  };
};

const agentsData: Agent[] = ["Phoenix", "Jett"];

const initialState: TierState = {
  S: [],
  A: [],
  B: [],
  C: [],
  D: [],
  available: agentsData,
};

interface OnChangeTierProps {
  transferAgent: Agent;
  tier: Tier;
  prevTier?: Tier;
}

const reducer: Reducer<TierState, Action> = (state, action) => {
  switch (action.type) {
    case ActionKind.ADD_AGENT:
      console.log("ADD AGENT");
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
      console.log("REMOVE AGENT", { payload: action.payload });
      return {
        ...state,
        [action.payload.tier]: state[action.payload.tier].filter(
          (agent) => agent !== action.payload.agent
        ),
      };
    default:
      throw new Error("Unkown action: " + action.type);
  }
};

export interface AgentTierContextValues {
  tierState: TierState;
  onChangeTier: (props: OnChangeTierProps) => void;
  getTierColor: (tier: Tier) => string;
}

export const AgentTierContext = createContext<AgentTierContextValues>(
  {} as AgentTierContextValues
);

const tierColors: Record<Tier, string> = {
  S: "red-500",
  A: "orange-400",
  B: "yellow-400",
  C: "green-400",
  D: "sky-400",
};

export const AgentTierProvider = ({ children }: { children: ReactNode }) => {
  const [tierState, dispatch] = useReducer(reducer, initialState);

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

  return (
    <AgentTierContext.Provider
      value={{ tierState, onChangeTier, getTierColor }}
    >
      {children}
    </AgentTierContext.Provider>
  );
};
