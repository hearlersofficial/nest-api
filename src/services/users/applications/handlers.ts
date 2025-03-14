import { CheckRemainingTokensHandler } from "~users/applications/handlers/CheckRemainingTokens.handler";
import { ConnectAuthChannelHandler } from "~users/applications/handlers/ConnectAuthChannel.handler";
import { ConsumeTokensHandler } from "~users/applications/handlers/ConsumeTokens.handler";
import { FindOneAuthUserHandler } from "~users/applications/handlers/FindOneAuthUser.handler";
import { FindOneUserHandler } from "~users/applications/handlers/FindOneUser.handler";
import { InitializeUserHandler } from "~users/applications/handlers/InitializeUser.handler";
import { ReserveTokensHandler } from "~users/applications/handlers/ReserveTokens.handler";
import { SaveRefreshTokenHandler } from "~users/applications/handlers/SaveRefreshToken.handler";
import { UpdateAuthorityHandler } from "~users/applications/handlers/UpdateAuthority.handler";
import { UpdateUserHandler } from "~users/applications/handlers/UpdateUser.handler";
import { VerifyRefreshTokenHandler } from "~users/applications/handlers/VerifyRefreshToken.handler";

export const USER_SERVICE_HANDLERS = [
  FindOneUserHandler,
  UpdateUserHandler,
  CheckRemainingTokensHandler,
  ReserveTokensHandler,
  ConsumeTokensHandler,
  InitializeUserHandler,
  ConnectAuthChannelHandler,
  SaveRefreshTokenHandler,
  VerifyRefreshTokenHandler,
  UpdateAuthorityHandler,
  FindOneAuthUserHandler,
];
