import * as Command from 'cmdk';
import { animated, useSpring } from 'react-spring';
import useSpotLightSearch from './spotlight-search-context';
import { STATE } from './spotlight-search-constants';
import { useEffect, useRef } from 'react';

const INPUT_MARGIN_X = 8;

export default function Input() {
  const ref= useRef<HTMLInputElement>(null);
  const { inputKey, state, touchDiff } = useSpotLightSearch();


  const inputVisibilityStyles = useSpring({
    config: {
      mass: .6,
      tension: 400,
      friction: 50,
      precision: .1,
    },
    from: {
      opacity: 0,
    },
    to: {
      opacity: state === STATE.OPEN ? 1 : state === STATE.CLOSING ? 0 : Math.pow(touchDiff / (window.innerHeight / 5), 2),
    },
  })
  const inputStyles = useSpring({
    config: {
      mass: .6,
      tension: 400,
      friction: 50,
      precision: .1,
    },
    from: {
      height: 20,
      width: 65,
      fontSize: 12,
    },
    to: {
      height: state === STATE.OPEN ? 40 : 20,
      fontSize: state === STATE.OPEN ? 16 : 12,
      width: state === STATE.OPEN ? window.innerWidth - (INPUT_MARGIN_X * 2) : 65,
    },
  });

  useEffect(() => {
    if (state === STATE.CLOSING) {
      ref.current?.blur();
    }
  }, [state])

  return (
    <animated.div
      spotlight-search-input="true"
      style={{ ...inputStyles, ...inputVisibilityStyles, ["--margin-x"]: `${INPUT_MARGIN_X}px` }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <Command.CommandInput asChild>
        <input
          key={inputKey}
          autoFocus
          placeholder="Type a command or search..."
          onClick={(e) => e.stopPropagation()}
          ref={ref}
        />
      </Command.CommandInput>
    </animated.div>
  )
}
