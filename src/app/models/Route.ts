import { Account } from './Account';

export interface Route {
  route: string;
  weight: string;
  price: string;
  account: Account;
  start: PointDetails;
  end: PointDetails;
}

interface PointDetails {
  point: string;
  date: string;
}
