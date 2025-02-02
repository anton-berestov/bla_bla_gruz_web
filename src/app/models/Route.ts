import { Account } from './Account';

export interface Route {
  start: StartPoint;
  checkpoints?: Checkpoint[];
  end: EndPoint;
  cargoes?: any[];
  account: Account;
}

export interface StartPoint {
  route: string;
  point: string;
  weight?: string;
  date: string;
  price?: string;
  size?: string;
  comment?: string;
  account: string;
}

export interface Checkpoint {
  point: string;
  date: string;
}

export interface EndPoint {
  point: string;
  date: string;
}

