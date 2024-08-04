import * as Command from 'cmdk';
import { ComponentProps } from 'react';
import useSpotLightSearch from './spotlight-search-context';
import { STATE } from './spotlight-search-constants';

type Props = {
  title: string;
  subTitle: string;
  onSelect?: ComponentProps<typeof Command.CommandItem>['onSelect'];
}

export default function Item({ title, subTitle, onSelect }: Props) {
  const { setState } = useSpotLightSearch();
  return (
    <Command.CommandItem
      value={`${title} ${subTitle}`}
      onSelect={(v) => {
        setState(STATE.CLOSING);
        onSelect?.(v);
      }}
    >
      <div className="left">
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
      <div className="right">
        {title}
        <div className='extra'>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          {subTitle}
        </div>
      </div>
    </Command.CommandItem>
  )
}
