import { UserTrackings } from "~users/domains/users/models/user-trackings";

import { HttpStatus } from "@nestjs/common";
import { Result } from "~common/shared-kernel/domains/results";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserTrackingId } from "~common/shared-kernel/identifiers/user-tracking.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { UserTrackingsEntity } from "~common/system/persistences/entities/users/user-trackings.entity";
import dayjs from "dayjs";

export class PsqlUserTrackingsMapper {
  static toDomain(entity: UserTrackingsEntity): UserTrackings | null {
    if (!entity) {
      return null;
    }

    const userTrackingsProps = {
      userId: new UserId(entity.userId),
      hasSeenIntroCutscene: entity.hasSeenIntroCutscene,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const userTrackingsOrError: Result<UserTrackings> = UserTrackings.create(
      userTrackingsProps,
      new UserTrackingId(entity.id),
    );

    if (userTrackingsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, userTrackingsOrError.errorValue);
    }

    return userTrackingsOrError.value;
  }

  static toEntity(userTrackings: UserTrackings): UserTrackingsEntity {
    const entity = new UserTrackingsEntity();

    entity.id = userTrackings.id.getString();

    entity.userId = userTrackings.userId.getString();

    entity.hasSeenIntroCutscene = userTrackings.hasSeenIntroCutscene;
    entity.createdAt = userTrackings.createdAt.toISOString();
    entity.updatedAt = userTrackings.updatedAt.toISOString();
    entity.deletedAt = userTrackings.deletedAt ? userTrackings.deletedAt.toISOString() : null;

    return entity;
  }
}
