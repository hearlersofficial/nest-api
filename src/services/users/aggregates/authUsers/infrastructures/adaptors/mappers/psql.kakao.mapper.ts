import { KakaoEntity } from "~/src/shared/core/infrastructure/entities/Kakao.entity";
import { convertDayjs, formatDayjs } from "~/src/shared/utils/Date.utils";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
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
      createdAt: convertDayjs(entity.createdAt),
      updatedAt: convertDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertDayjs(entity.deletedAt) : null,
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
      entity.id = kakao.id.getNumber();
    }

    entity.authUserId = kakao.authUserId.getNumber();
    entity.uniqueId = kakao.uniqueId;
    entity.createdAt = formatDayjs(kakao.createdAt);
    entity.updatedAt = formatDayjs(kakao.updatedAt);
    entity.deletedAt = kakao.deletedAt ? formatDayjs(kakao.deletedAt) : null;

    return entity;
  }
}
