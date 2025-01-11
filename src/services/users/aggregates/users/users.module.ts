import { UserProfilesEntity } from "~shared/core/infrastructure/entities/UserProfiles.entity";
import { UserProgressesEntity } from "~shared/core/infrastructure/entities/UserProgresses.entity";
import { UserPromptsEntity } from "~shared/core/infrastructure/entities/UserPrompts.entity";
import { UsersEntity } from "~shared/core/infrastructure/entities/Users.entity";
import { ConsumeTokensHandler } from "~users/aggregates/users/applications/commands/ConsumeTokens/ConsumeTokens.handler";
import { ReserveTokensHandler } from "~users/aggregates/users/applications/commands/ReserveTokens/ReserveTokens.handler";
import { UpdateUserHandler } from "~users/aggregates/users/applications/commands/UpdateUser/UpdateUser.handler";
import { CheckRemainingTokensHandler } from "~users/aggregates/users/applications/queries/CheckRemainingTokens/CheckRemainingTokens.handler";
import { FindOneUserHandler } from "~users/aggregates/users/applications/queries/FindOneUser/FindOneUser.handler";
import { CreateUserUseCase } from "~users/aggregates/users/applications/useCases/CreateUserUseCase/CreateUserUseCase";
import { FindOneUserUseCase } from "~users/aggregates/users/applications/useCases/FindOneUserUseCase/FindOneUserUseCase";
import { UpdateUserUseCase } from "~users/aggregates/users/applications/useCases/UpdateUserUseCase/UpdateUserUseCase";
import { PsqlUsersRepositoryAdaptor } from "~users/aggregates/users/infrastructures/adaptors/psql.users.repository.adaptor";
import { USER_REPOSITORY } from "~users/aggregates/users/infrastructures/users.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

const useCases = [CreateUserUseCase, FindOneUserUseCase, UpdateUserUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, UserProgressesEntity, UserProfilesEntity, UserPromptsEntity])],
  providers: [
    ...useCases,
    FindOneUserHandler,
    UpdateUserHandler,
    CheckRemainingTokensHandler,
    ReserveTokensHandler,
    ConsumeTokensHandler,
    {
      provide: USER_REPOSITORY,
      useClass: PsqlUsersRepositoryAdaptor,
    },
  ],
  exports: [...useCases],
})
export class UsersModule {}
