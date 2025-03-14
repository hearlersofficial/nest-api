import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Authority } from "~proto/com/hearlers/v1/model/auth_user_pb";

export class UpdateAuthorityCommand {
  constructor(public readonly props: UpdateAuthorityCommandProps) {}
}

interface UpdateAuthorityCommandProps {
  authUserId: UniqueEntityId;
  authority: Authority;
}
