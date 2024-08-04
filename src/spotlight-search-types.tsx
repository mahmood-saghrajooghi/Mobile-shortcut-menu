import { STATE } from './spotlight-search-constants';

export type State = typeof STATE[keyof typeof STATE];
