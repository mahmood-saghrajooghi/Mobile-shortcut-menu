import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

const STATE = {
  CLOSED: 'closed',
  OPENING: 'opening',
  OPEN: 'open',
  CLOSING: 'closing',
}

type State = typeof STATE[keyof typeof STATE];

type ContextType = {
  state: State;
  setState: Dispatch<SetStateAction<State>>;
  inputKey: number;
  setInputKey: Dispatch<SetStateAction<number>>;
  touchDiff: number;
  setTouchDiff: Dispatch<SetStateAction<number>>;
}

export const SpotlightSearchContext = createContext<ContextType | null>(null);

export function SpotlightSearchContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(STATE.CLOSED);
  const [touchDiff, setTouchDiff] = useState<number>(0);
  const [inputKey, setInputKey] = useState(0);
  return (
    <SpotlightSearchContext.Provider value={{
      state,
      setState,
      inputKey,
      setInputKey,
      touchDiff,
      setTouchDiff,
    }}>
      {children}
    </SpotlightSearchContext.Provider>
  )
}

export default function useSpotLightSearch() {
  const context = useContext(SpotlightSearchContext);
  if (context === null) {
    throw new Error('useSpotLightSearch must be used within a SpotlightSearchProvider');
  }
  return context;
}
