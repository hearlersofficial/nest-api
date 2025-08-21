import { BaseEntity } from "typeorm";

export function createAlias(tableName: string, prefix: string = ""): string {
  return prefix ? `${prefix}_${tableName}` : tableName;
}

/**
 * TypeORM 엔티티에서 BaseEntity의 기본 메서드들과
 * 추가로 지정된 키(K)를 제외하여 순수한 데이터 컬럼 타입만 추출합니다.
 * @template T - 대상 엔티티 타입 (BaseEntity를 상속해야 함)
 * @template K - 관계(relation) 등 추가로 제외할 키의 유니온 타입
 */
export type EntityData<T extends BaseEntity, K extends keyof T = never> = Omit<T, keyof BaseEntity | K>;
