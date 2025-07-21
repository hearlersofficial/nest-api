import { PsqlUsersRepository } from "~users/domains/users/infrastructures/psql-users.repository";
import { RepositoryUsersPersistor } from "~users/domains/users/infrastructures/repository-users.persistor";
import { RepositoryUsersReader } from "~users/domains/users/infrastructures/repository-users.reader";
import { UsersRepository } from "~users/domains/users/infrastructures/users.repository";
import { UsersPersistor } from "~users/domains/users/users.persistor";
import { UsersReader } from "~users/domains/users/users.reader";
import { UsersService } from "~users/domains/users/users.service";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "~common/system/persistences/entities/users/user.entity";
import { UserMessageTokensEntity } from "~common/system/persistences/entities/users/user-message-tokens.entity";
import { UserProfilesEntity } from "~common/system/persistences/entities/users/user-profiles.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, UserProfilesEntity, UserMessageTokensEntity])],
  providers: [
    {
      provide: UsersRepository,
      useClass: PsqlUsersRepository,
    },
    {
      provide: UsersReader,
      useClass: RepositoryUsersReader,
    },
    {
      provide: UsersPersistor,
      useClass: RepositoryUsersPersistor,
    },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
