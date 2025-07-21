import { AuthUsersPersistor } from "~users/domains/auth-users/auth-users.persistor";
import { AuthUsersReader } from "~users/domains/auth-users/auth-users.reader";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";
import { AuthUsersRepository } from "~users/domains/auth-users/infrastructures/mappers/auth-users.repository";
import { PsqlAuthUsersRepository } from "~users/domains/auth-users/infrastructures/mappers/psql-auth-users.repository";
import { RepositoryAuthUsersPersistor } from "~users/domains/auth-users/infrastructures/mappers/repository-auth-users.persistor";
import { RepositoryAuthUsersReader } from "~users/domains/auth-users/infrastructures/mappers/repository-auth-users.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthUsersEntity } from "~common/system/persistences/entities/users/auth-users.entity";

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
