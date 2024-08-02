import { useEffect, useRef, useState } from 'react'
import './App.css'
import { useSpring, animated } from 'react-spring';

function convertToRange(x, a, b) {
  // Ensure the input x is within the range [a, b]
  if (x < a) {
    x = a;
  } else if (x > b) {
    x = b;
  }

  // Calculate the transformed value in the range [1, 1.5]
  const y = (x - a) / (b - a) + 1;
  return y;
}
function App() {
  const [top, setTop] = useState(0);
  const ref = useRef<HTMLDivElement | null>();
  const inputRef = useRef<HTMLInputElement | null>();
  const buttonRef = useRef<HTMLButtonElement | null>();
  const isThresholdPassed = useRef(false);

  const [toggled, setToggled] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [a, setA] = useState(0);

  const styles = useSpring({
    config: {
      tension: 1500,
      friction: 50,
      bounce: 0,
      precision: 0.001,
    },
    from: {
      height: 0,
    },
    to: {
      height: top,
    },
  });

  const inputVisibilityStyles = useSpring({
    config: {
      mass: .6,
      tension: 500,
      friction: 50,
      precision: 1,
    },
    from: {
      visibility: 'hidden',
      opacity: 0,
    },
    to: {
      visibility: isInputVisible || top > 0 ? 'visible' : 'hidden',
      opacity: isInputVisible  ? 1 : Math.pow(top / (window.innerHeight / 5), 2),
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
      width: 60,
      fontSize: 12,
    },
    to: {
      height: toggled ? 40 : 20,
      fontSize: toggled ? 16 : 12,
      width: toggled ? window.innerWidth - 20 : 60,
    },
    onRest: () => {
      if (toggled) {
        // buttonRef.current?.click();
      }
    }
  });

  useEffect(() => {
    let touchstartY = 0;
    ref.current?.addEventListener('touchstart', e => {
      touchstartY = e.touches[0].clientY;
    });
    ref.current?.addEventListener('touchmove', e => {
      const touchY = e.touches[0].clientY;
      const touchDiff = touchY - touchstartY;
      if (touchDiff > 0 && window.scrollY === 0) {
        setTop(touchDiff);
        e.preventDefault();
        if (touchDiff > window.innerHeight / 5) {
          isThresholdPassed.current = true;
          setToggled(true);
          setIsInputVisible(true);
        } else {
          setToggled(false);
          isThresholdPassed.current = false;
        }
      }
    });
    ref.current?.addEventListener('touchend', () => {
      setTop(0);
      if(!isThresholdPassed.current) {
        setIsInputVisible(false);
      }
      setA(_a => a + 1)
    });
  }, []);


  return (
    <>
      <animated.div className="pull-to-refresh" style={styles} />
      <div ref={ref} className='container'>
        <button ref={buttonRef} onClick={(e) => {
          e.isTrusted = true;
          inputRef.current?.focus()
        }}>reset</button>
        <animated.input key={a} autoFocus ref={inputRef} placeholder="search" style={{ ...inputStyles, ...inputVisibilityStyles }} />
      </div>
    </>
  )
}

export default App
