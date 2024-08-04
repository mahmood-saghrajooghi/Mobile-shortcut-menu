import { animated, useSpring } from 'react-spring';
import useSpotLightSearch from './spotlight-search-context';

export default function SpotlightSearchPullToRefresh() {
  const { touchDiff } = useSpotLightSearch();

  const style = useSpring({
    config: {
      tension: 400,
      friction: 50,
      precision: .1,
    },
    from: {
      height: 0,
    },
    to: {
      height: touchDiff / (window.innerHeight / 300),
    },
  });

  return <animated.div style={style} spotlight-search-pull-to-refresh="true" />
}
