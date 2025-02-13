import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SaveRefreshTokenHandler } from "~/src/aggregates/authUsers/applications/commands/SaveRefreshToken/SaveRefreshToken.handler";
import { VerifyRefreshTokenHandler } from "~/src/aggregates/authUsers/applications/commands/VerifyRefreshToken/VerifyRefreshToken.handler";
import { CreateAuthUserUseCase } from "~/src/aggregates/authUsers/applications/useCases/CreateAuthUserUseCase/CreateAuthUserUseCase";
import { FindOneAuthUserUseCase } from "~/src/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/FindOneAuthUserUseCase";
import { UpdateAuthUserUseCase } from "~/src/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/UpdateAuthUserUseCase";
import { PsqlAuthUsersRepositoryAdaptor } from "~/src/aggregates/authUsers/infrastructures/adaptors/psql.authUsers.repository.adaptor";
import { AUTH_USERS_REPOSITORY } from "~/src/aggregates/authUsers/infrastructures/authUsers.repository.port";
import { AuthUsersEntity } from "~/src/shared/core/infrastructure/entities/users/AuthUsers.entity";

const useCases = [CreateAuthUserUseCase, FindOneAuthUserUseCase, UpdateAuthUserUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([AuthUsersEntity])],
  providers: [
    ...useCases,
    SaveRefreshTokenHandler,
    VerifyRefreshTokenHandler,
    {
      provide: AUTH_USERS_REPOSITORY,
      useClass: PsqlAuthUsersRepositoryAdaptor,
    },
  ],
  exports: [...useCases],
})
export class AuthModule {}
