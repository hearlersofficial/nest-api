import { AuthUsersReader } from "~users/domains/auth-users/auth-users.reader";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";
import { AuthUsersStore } from "~users/domains/auth-users/auth-users.store";
import { AuthUsersRepository } from "~users/domains/auth-users/infrastructures/auth-users.repository";
import { PsqlAuthUsersRepository } from "~users/domains/auth-users/infrastructures/psql-auth-users.repository";
import { RepositoryAuthUsersReader } from "~users/domains/auth-users/infrastructures/repository-auth-users.reader";
import { RepositoryAuthUsersStore } from "~users/domains/auth-users/infrastructures/repository-auth-users.store";
import { UsersKafkaClientModule } from "~users/infrastructures/kafka/users-kafka-client.module";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthUsersEntity } from "~common/system/persistences/entities/users/auth-users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AuthUsersEntity]), UsersKafkaClientModule],
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
      provide: AuthUsersStore,
      useClass: RepositoryAuthUsersStore,
    },
  ],
  exports: [AuthUsersService],
})
export class AuthUsersModule {}
