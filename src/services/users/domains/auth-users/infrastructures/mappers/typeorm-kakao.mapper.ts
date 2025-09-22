import { Kakao } from "~users/domains/auth-users/models/kakao";

import { HttpStatus } from "@nestjs/common";
import { Result } from "~common/shared-kernel/domains/results";
import { AuthUserId } from "~common/shared-kernel/identifiers/auth-user.id";
import { KakaoId } from "~common/shared-kernel/identifiers/kakao.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { KakaoEntity } from "~common/system/persistences/entities/users/kakao.entity";
import dayjs from "dayjs";

export class PsqlKakaoMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: KakaoEntity): Kakao;
  static toDomain(entity: KakaoEntity | null): Kakao | null;
  static toDomain(entity: KakaoEntity | null): Kakao | null {
    if (!entity) {
      return null;
    }

    const kakaoProps = {
      authUserId: new AuthUserId(entity.authUserId),
      uniqueId: entity.uniqueId,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const kakaoOrError: Result<Kakao> = Kakao.create(kakaoProps, new KakaoId(entity.id));

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
