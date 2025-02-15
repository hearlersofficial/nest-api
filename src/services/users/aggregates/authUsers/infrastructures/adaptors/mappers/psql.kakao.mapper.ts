import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { KakaoEntity } from "~shared/core/infrastructure/entities/users/Kakao.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { Kakao } from "~users/aggregates/authUsers/domain/Kakao";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlKakaoMapper {
  static toDomain(entity: KakaoEntity): Kakao | null {
    if (!entity) {
      return null;
    }

    const kakaoProps = {
      authUserId: new UniqueEntityId(entity.authUserId),
      uniqueId: entity.uniqueId,
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
    };

    const kakaoOrError: Result<Kakao> = Kakao.create(kakaoProps, new UniqueEntityId(entity.id));

    if (kakaoOrError.isFailure) {
      throw new InternalServerErrorException(kakaoOrError.errorValue);
    }

    return kakaoOrError.value;
  }

  static toEntity(kakao: Kakao): KakaoEntity {
    const entity = new KakaoEntity();

    if (!kakao.id.isNewIdentifier()) {
      entity.id = kakao.id.getString();
    }

    entity.authUserId = kakao.authUserId.getString();
    entity.uniqueId = kakao.uniqueId;
    entity.createdAt = formatDayjsToUtcString(kakao.createdAt);
    entity.updatedAt = formatDayjsToUtcString(kakao.updatedAt);
    entity.deletedAt = kakao.deletedAt ? formatDayjsToUtcString(kakao.deletedAt) : null;

    return entity;
  }
}
