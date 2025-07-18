import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from '@entity/db';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

  async create(email: string, plainPassword: string) {
    const password = await bcrypt.hash(plainPassword, 10);
    const [user] = await this.db
      .insertInto('user')
      .values({ email, password })
      .returningAll()
      .execute();
    return user;
  }

  async findByEmail(email: string) {
    return this.db
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }

  async findAll() {
    return this.db.selectFrom('user').select(['id', 'email']).execute();
  }
}
