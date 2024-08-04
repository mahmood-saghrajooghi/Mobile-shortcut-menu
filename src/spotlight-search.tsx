import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react';
import { useSpring, animated } from 'react-spring';
import * as RadixDialog from '@radix-ui/react-dialog';

import { STATE } from './spotlight-search-constants';
import useSpotLightSearch from './spotlight-search-context';


type Props = {
  scrollAreaRef: React.MutableRefObject<HTMLDivElement | null>;
  children: ReactNode;
}

export default function SpotlightSearch({ scrollAreaRef, children }: Props) {
  const [overlayTop, setOverlayTop] = useState(0);
  const [vh, setVh] = useState<number>(window.innerHeight / 100);
  const touchstartY = useRef(0);
  const internalTouchDiffRef = useRef(0);
  const {
    state,
    setState,
    touchDiff,
    setTouchDiff,
    setInputKey
  } = useSpotLightSearch();

  const overlayStyles = useSpring({
    config: (key) => {
      if (key === 'top') {
        return {
          tension: 400,
          friction: 70,
          precision: 1,
        }
      }
      return {
        tension: 400,
        friction: 70,
        precision: .3,
      }
    },
    from: {
      opacity: 0,
      top: 0,
      height: 100 * vh,
    },
    to: state === STATE.CLOSING ? {
      opacity: -.5,
      top: -20,
      height: 100 * vh,
    } : state === STATE.OPENING ? {
      opacity: touchDiff / (window.innerHeight / 5),
      top: touchDiff / (window.innerHeight / 200),
      height: 100 * vh,
    } : state === STATE.OPEN ? {
      opacity: 1,
      top: overlayTop,
      height: 100 * vh,
    } : {
      opacity: 0,
      top: 0,
      height: 100 * vh,
    },
    onRest: () => {
      setState(s => s === STATE.CLOSING ? STATE.CLOSED : s)
    }
  });


  const overlayHeightStyles = useSpring({
    config: {
      tension: 400,
      friction: 50,
      precision: .1,
    },
    from: {
      height: window.innerHeight,
    },
    to: {
      height: 100 * vh,
    },
  });

  useEffect(() => {
    const ref = scrollAreaRef.current;
    if (!ref) {
      throw new Error('scrollAreaRef is not defined');
    }

    let startedDraggingWhileAtTop = false;

    ref.ontouchstart = (e) => {
      touchstartY.current = e.touches[0].clientY;
      startedDraggingWhileAtTop = ref.scrollTop <= 0;
    }

    ref.ontouchmove = (e) => {
      if (!ref) {
        throw new Error('scrollAreaRef is not defined');
      }

      if(!startedDraggingWhileAtTop) {
        return;
      }

      const touchY = e.touches[0].clientY;
      internalTouchDiffRef.current = touchY - touchstartY.current;

      if (internalTouchDiffRef.current > 0) {
        e.stopPropagation();
        setTouchDiff(internalTouchDiffRef.current);
        setState(STATE.OPENING);
      }
    }

    ref.ontouchend = () => {
      if(!startedDraggingWhileAtTop) {
        return;
      }

      setTouchDiff(0);
      setState(s => s === STATE.OPENING ? STATE.CLOSING : s);
      setInputKey(_a => _a + 1)

      if (internalTouchDiffRef.current > window.innerHeight / 5) {
        setState(STATE.OPEN)
        internalTouchDiffRef.current = 0;
      }
    }

    return () => {
      if (!ref) {
        return;
      }
      ref.ontouchstart = null;
      ref.ontouchmove = null;
      ref.ontouchend = null;
    }
  }, [])


  useEffect(() => {
    const callback = () => {
      // For the rare legacy browsers that don't support it
      if (!window.visualViewport) {
        return
      }

      setVh(window.visualViewport.height / 100)
    }
    visualViewport?.addEventListener('resize', callback)

    return () => {
      visualViewport?.removeEventListener('resize', callback)
    }
  }, [])

  useEffect(() => {
    if (state === STATE.CLOSED) {
      return;
    }
    const onScroll = () => window.scrollTo(0, 0);

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, [state])

  if (!scrollAreaRef.current) {
    return null;
  }

  return (
    <RadixDialog.Root
      open={state !== STATE.CLOSED}
      onOpenChange={(open) => {
        if (!open) {
          setState(STATE.CLOSING);
        }
      }}
    >
      <RadixDialog.Portal>
        <RadixDialog.Overlay asChild />
        <animated.div style={{ ...overlayStyles }} spotlight-search-overlay="true">
        </animated.div>
        {
          // TODO: do this with a radix dialog
          state !== STATE.CLOSED && (
            <RadixDialog.Content asChild spotlight-search-content="true">
              <animated.div
                style={{ ...overlayStyles, ...overlayHeightStyles }}
                onTouchStart={(e) => {
                  touchstartY.current = e.touches[0].clientY;
                  console.log('here');
                }}
                onTouchMove={(e) => {
                  const touchY = e.touches[0].clientY;
                  const touchDiff = touchY - touchstartY.current;
                  setOverlayTop(touchDiff / 2);

                  e.stopPropagation()
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                  setOverlayTop(0);
                }}
                onClick={() => {
                  setTouchDiff(0)
                  setState(STATE.CLOSING)
                }}
              >
                {children}
              </animated.div>
            </RadixDialog.Content>
          )
        }
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
