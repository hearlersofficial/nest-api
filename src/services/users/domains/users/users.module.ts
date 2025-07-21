import { PsqlUsersRepository } from "~users/domains/users/infrastructures/psql-users.repository";
import { RepositoryUsersReader } from "~users/domains/users/infrastructures/repository-users.reader";
import { RepositoryUsersStore } from "~users/domains/users/infrastructures/repository-users.store";
import { UsersRepository } from "~users/domains/users/infrastructures/users.repository";
import { UsersReader } from "~users/domains/users/users.reader";
import { UsersService } from "~users/domains/users/users.service";
import { UsersStore } from "~users/domains/users/users.store";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserMessageTokensEntity } from "~common/system/persistences/entities/users/user-message-tokens.entity";
import { UserProfilesEntity } from "~common/system/persistences/entities/users/user-profiles.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/users.entity";

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
      provide: UsersStore,
      useClass: RepositoryUsersStore,
    },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
