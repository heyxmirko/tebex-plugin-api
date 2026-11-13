export interface Currency {
  iso_4217: string;
  symbol: string;
}

export interface Player {
  id: number;
  name: string;
  uuid: string;
}

export interface PackageRef {
  id: number;
  name: string;
}

export interface Page<T> {
  items: T[];
  page: number;
  lastPage: number;
  total: number;
  hasNext: boolean;
}
