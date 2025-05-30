import { AuthUsersPersistor } from "~users/domains/auth-users/auth-users.persistor";
import { AuthUsersReader } from "~users/domains/auth-users/auth-users.reader";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";
import { AuthUsersRepository } from "~users/infrastructures/auth-users/auth-users.repository";
import { PsqlAuthUsersRepository } from "~users/infrastructures/auth-users/psql-auth-users.repository";
import { RepositoryAuthUsersPersistor } from "~users/infrastructures/auth-users/repository-auth-users.persistor";
import { RepositoryAuthUsersReader } from "~users/infrastructures/auth-users/repository-auth-users.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthUsersEntity } from "~common/system/persistences/entities/users/AuthUsers.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AuthUsersEntity])],
  providers: [
    AuthUsersService,
    {
      provide: AuthUsersRepository,
      useClass: PsqlAuthUsersRepository,
    },
    {
      provide: AuthUsersReader,
      useClass: RepositoryAuthUsersReader,
    },
    {
      provide: AuthUsersPersistor,
      useClass: RepositoryAuthUsersPersistor,
    },
  ],
  exports: [AuthUsersService],
})
export class AuthUsersModule {}
