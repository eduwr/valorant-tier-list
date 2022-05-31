import { createContext, ReactNode, Reducer, useReducer } from "react";

export type Agent = string;
export type Tier = "S" | "A" | "B" | "C" | "D" | "available";

type State = Record<Tier, Agent[]>;

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

const initialState: State = {
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

export interface AgentTierContextValues {
  state: State;
  onChangeTier: (props: OnChangeTierProps) => void;
}

const reducer: Reducer<State, Action> = (state, action) => {
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

export const AgentTierContext = createContext<AgentTierContextValues>(
  {} as AgentTierContextValues
);

export const AgentTierProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChangeTier = ({
    tier,
    transferAgent,
    prevTier,
  }: OnChangeTierProps) => {
    if (!transferAgent || state[tier].includes(transferAgent)) return;

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

  return (
    <AgentTierContext.Provider value={{ state, onChangeTier }}>
      {children}
    </AgentTierContext.Provider>
  );
};
