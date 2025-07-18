import { Generated } from 'kysely';

export interface UserTable {
  id: Generated<number>;
  email: string;
  password: string;
}

export interface DB {
  user: UserTable;
}
