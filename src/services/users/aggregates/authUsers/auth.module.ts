import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SaveRefreshTokenHandler } from "~users/aggregates/authUsers/applications/commands/SaveRefreshToken/SaveRefreshToken.handler";
import { VerifyRefreshTokenHandler } from "~users/aggregates/authUsers/applications/commands/VerifyRefreshToken/VerifyRefreshToken.handler";
import { CreateAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/CreateAuthUserUseCase/CreateAuthUserUseCase";
import { FindOneAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/FindOneAuthUserUseCase";
import { UpdateAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/UpdateAuthUserUseCase";
import { PsqlAuthUsersRepositoryAdaptor } from "~users/aggregates/authUsers/infrastructures/adaptors/psql.authUsers.repository.adaptor";
import { AUTH_USERS_REPOSITORY } from "~users/aggregates/authUsers/infrastructures/authUsers.repository.port";
import { AuthUsersEntity } from "~shared/core/infrastructure/entities/AuthUsers.entity";

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
