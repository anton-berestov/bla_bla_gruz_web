import { Account } from './Account';

export interface Route {
  start: StartPoint;
  checkpoints?: Checkpoint[];
  end: EndPoint;
  cargoes?: any[];
  account: Account;
}

export interface StartPoint {
  route?: string;
  point: string;
  weight?: string | number;
  date: string;
  price?: string | number;
  size?: string;
  comment?: string;
  account: string;
  coordinates?: string;
}

export interface Checkpoint {
  point: string;
  date: string;
}

export interface EndPoint {
  point: string;
  date: string;
  coordinates?: string;
}
