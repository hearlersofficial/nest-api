import { UsersPersistor } from "~users/domains/users/users.persistor";
import { UsersReader } from "~users/domains/users/users.reader";
import { UsersService } from "~users/domains/users/users.service";
import { PsqlUsersRepository } from "~users/infrastructures/users/psql-users.repository";
import { RepositoryUsersPersistor } from "~users/infrastructures/users/repository-users.persistor";
import { RepositoryUsersReader } from "~users/infrastructures/users/repository-users.reader";
import { UsersRepository } from "~users/infrastructures/users/users.repository";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserMessageTokensEntity } from "~common/system/persistences/entities/users/UserMessageTokens.entity";
import { UserProfilesEntity } from "~common/system/persistences/entities/users/UserProfiles.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/Users.entity";

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
