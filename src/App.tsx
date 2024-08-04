import { useRef } from 'react'
import * as Command from 'cmdk';

import Item from './item';
import ScrollableArea from './spotlight-search-scrollable-area';
import SpotlightSearch from './spotlight-search';

import './App.css'
import Input from './input';
import SpotlightSearchPullToRefresh from './spotlight-search-pull-to-refresh';
import { SpotlightSearchContextProvider } from './spotlight-search-context';

function App() {
  const scrollableAreaRef = useRef<HTMLDivElement>(null);

  return (
    <SpotlightSearchContextProvider>
      <div className='container' ref={scrollableAreaRef}>
        <SpotlightSearchPullToRefresh />
        <SpotlightSearch scrollAreaRef={scrollableAreaRef}>
          <Command.CommandRoot >
            <Command.CommandList>
              <ScrollableArea className='scrollable-area'>
                <Command.CommandGroup >
                  <Item title='Admin' subTitle='Account overview' />
                  <Item title='Admin' subTitle='Account access' />
                  <Item title='Admin' subTitle='Users' />
                  <Item title='Admin' subTitle='Workspaces' />
                  <Item title='Admin' subTitle='Marketplace' />
                  <Item title='Admin' subTitle='Data management' />
                  <Item title='Admin' subTitle='Audit log' />
                  <Item title='Admin' subTitle='Groups' />
                  <Item title='Admin' subTitle='Tags' />
                  <Item title='User' subTitle='Profile' />
                  <Item title='User' subTitle='Help' />
                  <Item title='User' subTitle='Logout' />
                </Command.CommandGroup>
              </ScrollableArea>
              <Input />
            </Command.CommandList>
          </Command.CommandRoot>
        </SpotlightSearch>
        <div className="content">
          <h3>
            Mahmood Sagharjooghi
          </h3>
          <p>Web craftsman. Creating delightful and smooth web experiences. Frontend dev at Oneflow.</p>
          <h4>Now</h4>
          <p>Doing side projects and diving deep into web fundamentals. I'm most passionate about building performant small animations. Things you may not notice when they're there, but you'll miss when they're not.</p>
          <p>Listening to music is one of the things I enjoy a lot. My most played song is Float by Zane Alexander.</p>
          <h3>
            Mahmood Sagharjooghi
          </h3>
          <p>Web craftsman. Creating delightful and smooth web experiences. Frontend dev at Oneflow.</p>
          <h4>Now</h4>
          <p>Doing side projects and diving deep into web fundamentals. I'm most passionate about building performant small animations. Things you may not notice when they're there, but you'll miss when they're not.</p>
          <p>Listening to music is one of the things I enjoy a lot. My most played song is Float by Zane Alexander.</p>
        </div>
      </div >
    </SpotlightSearchContextProvider>
  )
}

export default App
