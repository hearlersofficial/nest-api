import { Kakao } from "~users/domains/auth-users/models/kakao";

import { HttpStatus } from "@nestjs/common";
import { Result } from "~common/shared-kernel/domains/Result";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { KakaoEntity } from "~common/system/persistences/entities/users/Kakao.entity";
import dayjs from "dayjs";

export class PsqlKakaoMapper {
  static toDomain(entity: KakaoEntity): Kakao | null {
    if (!entity) {
      return null;
    }

    const kakaoProps = {
      authUserId: new UniqueEntityId(entity.authUserId),
      uniqueId: entity.uniqueId,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const kakaoOrError: Result<Kakao> = Kakao.create(kakaoProps, new UniqueEntityId(entity.id));

    if (kakaoOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, kakaoOrError.errorValue);
    }

    return kakaoOrError.value;
  }

  static toEntity(kakao: Kakao): KakaoEntity {
    const entity = new KakaoEntity();

    entity.id = kakao.id.getString();
    entity.authUserId = kakao.authUserId.getString();
    entity.uniqueId = kakao.uniqueId;
    entity.createdAt = kakao.createdAt.toISOString();
    entity.updatedAt = kakao.updatedAt.toISOString();
    entity.deletedAt = kakao.deletedAt ? kakao.deletedAt.toISOString() : null;

    return entity;
  }
}
