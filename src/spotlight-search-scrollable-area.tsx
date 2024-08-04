import type { HTMLAttributes } from 'react'

import './spotlight-search-scrollable-area.css'

type Props = HTMLAttributes<HTMLDivElement>

export default function ScrollableArea({ children, onTouchMove, ...props }: Props) {
  return (
    <div
      spotlight-search-scrollable-area="true"
      onTouchMove={e => {
        e.stopPropagation()
        onTouchMove?.(e);
      }}
      {...props}
    >
      {children}
    </div>
  )
}
