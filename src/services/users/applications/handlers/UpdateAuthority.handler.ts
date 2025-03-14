import { UpdateAuthorityCommand } from "~users/applications/commands/UpdateAuthority.command";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateAuthorityCommand)
export class UpdateAuthorityHandler implements ICommandHandler<UpdateAuthorityCommand, AuthUsers> {
  constructor(private readonly authUsersService: AuthUsersService) {}

  async execute(command: UpdateAuthorityCommand): Promise<AuthUsers> {
    const { authUserId, authority } = command.props;
    const authUser = await this.authUsersService.getOne({ uniqueCriteria: { type: "authUser", id: authUserId } });
    authUser.update({ authority });
    return await this.authUsersService.update(authUser);
  }
}
