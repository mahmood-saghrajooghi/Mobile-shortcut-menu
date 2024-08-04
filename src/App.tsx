import { useEffect, useRef, useState } from 'react'
import './App.css'
import { useSpring, animated } from 'react-spring';
import * as Command from 'cmdk';

import Item from './item';

const STATE = {
  CLOSED: 'closed',
  OPENING: 'opening',
  OPEN: 'open',
  CLOSING: 'closing',
}

type State = typeof STATE[keyof typeof STATE];

function App() {
  const [top, setTop] = useState(0);
  const [overlayTop, setOverlayTop] = useState(0);
  const [state, setState] = useState<State>(STATE.CLOSED);
  const [value, setValue] = useState('');
  const [vh, setVh] = useState<number>(window.innerHeight / 100);
  const [inputValue, setInputValue] = useState('');
  const firstTime = useRef<boolean>(false);
  const touchstartY = useRef(0);

  const [toggled, setToggled] = useState(false);
  const [a, setA] = useState(0);

  const inputVisibilityStyles = useSpring({
    config: {
      mass: .6,
      tension: 500,
      friction: 80,
      precision: 1,
    },
    from: {
      visibility: 'hidden',
      opacity: 0,
    },
    to: {
      visibility: state !== STATE.CLOSED || top > 0 ? 'visible' : 'hidden',
      opacity: state === STATE.OPEN ? 1 : state === STATE.CLOSING ? 0 : Math.pow(top / (window.innerHeight / 5), 2),
    },
  })
  const inputStyles = useSpring({
    config: {
      mass: .6,
      tension: 400,
      friction: 50,
      precision: 1,
    },
    from: {
      height: 20,
      width: 65,
      fontSize: 12,
    },
    to: {
      height: state === STATE.OPEN ? 40 : 20,
      fontSize: state === STATE.OPEN ? 16 : 12,
      width: state === STATE.OPEN ? window.innerWidth - 32 : 65,
    },
    onRest: () => {
      if (toggled) {
        // buttonRef.current?.click();
      }
    }
  });

  const overlayStyles = useSpring({
    config: {
      tension: 400,
      friction: 70,
      precision: .1,
    },
    from: {
      opacity: 0,
      top: 0,
      height: 100 * vh,
    },
    to: state === STATE.CLOSING ? {
      opacity: 0,
      top: -5,
      height: 100 * vh,
    } : state === STATE.OPENING ? {
      opacity: top / (window.innerHeight / 5),
      top: top / (window.innerHeight / 200),
      height: 100 * vh,
    } : state === STATE.OPEN ? {
      opacity: 1,
      top: overlayTop,
      height: 100 * vh,
    } : {
      opacity: 0,
      top: -5,
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
    const callback = () => {
      // For the rare legacy browsers that don't support it
      if (!window.visualViewport) {
        return
      }

      // if (!firstTime.current) {
      setVh(window.visualViewport.height / 100)
      //   firstTime.current = true;
      // }
    }
    visualViewport?.addEventListener('resize', callback)

    return () => {
      visualViewport?.removeEventListener('resize', callback)
    }

  }, [])


  return (
    <>
      <animated.div className="pull-to-refresh" style={{ height: top / (window.innerHeight / 300) }} />
      <div className='container'
        onTouchStart={(e) => {
          touchstartY.current = e.touches[0].clientY;
        }}
        onTouchMove={(e) => {
          const touchY = e.touches[0].clientY;
          const touchDiff = touchY - touchstartY.current;

          if (touchDiff > 0 && document.getElementById('root').scrollTop <= 0) {
            e.preventDefault();
            e.stopPropagation();
            setTop(touchDiff);
            if (touchDiff > window.innerHeight / 5) {
              setState(STATE.OPEN)
            } else {
              setState(STATE.OPENING);
            }
          }
        }}
        onTouchEnd={(e) => {
          setTop(0);
          setState(s => s === STATE.OPENING ? STATE.CLOSING : s);
          setA(_a => _a + 1)
        }}
      >
        {
          // TODO: do this with a radix dialog
          state !== STATE.CLOSED && (
            <animated.div className="overlay" key="overlay" style={{ ...overlayStyles, ...overlayHeightStyles }}>
              <Command.CommandRoot>
                <div className="overlayContent"
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
                  onClick={(e) => {
                    setTop(0)
                    setState(STATE.CLOSING)
                  }}
                >
                  <Command.CommandList>
                    <div className='group'>
                      <Command.CommandGroup >
                        <Item title='Admin' subTitle='Account overview' />
                        <Item title='Admin' subTitle='Account access' />
                        <Item title='Admin' subTitle='Users' />
                        <Item title='Admin' subTitle='Workspaces' />
                        <Item title='Admin' subTitle='Groups' />
                        <Item title='Admin' subTitle='Tags' />
                      </Command.CommandGroup>
                    </div>
                    <animated.input
                      key={a}
                      autoFocus
                      placeholder="search"
                      className="input"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ ...inputStyles, ...inputVisibilityStyles }}
                    />
                    <Command.CommandInput value={inputValue} style={{ display: 'none' }} />
                  </Command.CommandList>
                </div>
              </Command.CommandRoot>
            </animated.div>

          )
        }

        <div className="content">
          <h3>
            Mahmood Sagharjooghi
          </h3>
          <p>Web craftsman. Creating delightful and smooth web experiences. Frontend dev at Oneflow.</p>
          <h4>Now</h4>
          <p>Doing side projects and diving deep into web fundamentals. I'm most passionate about building performant small animations. Things you may not notice when they're there, but you'll miss when they're not.</p>
          <p>Listening to music is one of the things I enjoy a lot. My most played song is Float by Zane Alexander.</p>
        </div>
      </div >
    </>
  )
}

export default App
