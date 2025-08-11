import { PsqlPromptVersionsMapper } from "~counselings/domains/promptVersions/infrastructures/mappers/psql.promptVersions.mapper";
import { PromptVersionsRepository } from "~counselings/domains/promptVersions/infrastructures/promptVersions.repository";
import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/PromptVersions.entity";
import { FindManyOptions, FindOneOptions, FindOptionsRelations, Repository, SelectQueryBuilder } from "typeorm";

@Injectable()
export class PsqlPromptVersionsRepository extends PromptVersionsRepository {
  constructor(
    @InjectRepository(PromptVersionEntity)
    private readonly promptVersionsRepository: Repository<PromptVersionEntity>,
  ) {
    super();
  }

  /**
   * 항상 Distinct + 부모 Deleted 포함여부 반영
   */
  private createBaseQb(withDeleted?: boolean): SelectQueryBuilder<PromptVersionEntity> {
    const qb = this.promptVersionsRepository.createQueryBuilder().distinct(true);
    if (withDeleted) {
      qb.withDeleted();
    }

    return qb;
  }

  /**
   * 삭제되지 않은 자식 관계만 JOIN
   */
  private applyLiveRelations(qb: SelectQueryBuilder<PromptVersionEntity>) {
    const base = qb.alias;
    const counselScopedPromptAlias = `${base}_csp`;
    const toneScopedPromptAlias = `${base}_tsp`;

    return qb
      .leftJoinAndSelect(
        `${base}.counselorScopedPrompts`,
        counselScopedPromptAlias,
        `${counselScopedPromptAlias}.deletedAt IS NULL`,
      )
      .leftJoinAndSelect(
        `${base}.toneScopedPrompts`,
        toneScopedPromptAlias,
        `${toneScopedPromptAlias}.deletedAt IS NULL`,
      );
  }

  /**
   * 쿼리 빌더에 검색 옵션 적용
   * relations 는 무시합니다.( 직접 join 적용 )
   * withDeleted 는 무시합니다. ( 쿼리빌더 생성 시 적용 )
   * 현재 자식 객체의 필터링은 지원하지 않습니다.
   */
  private applyFindOptions(
    qb: SelectQueryBuilder<PromptVersionEntity>,
    options?: FindOneOptions<PromptVersionEntity> | FindManyOptions<PromptVersionEntity>,
  ) {
    if (!options) return qb;

    const { relations, withDeleted, ...rest } = options;
    qb.setFindOptions(rest);
    return qb;
  }

  override async findByPromptVersionId(
    promptVersionId: UniqueEntityId,
    options?: FindOneOptions<PromptVersionEntity>,
  ): Promise<PromptVersions | null> {
    const qb = this.createBaseQb(options?.withDeleted);
    const base = qb.alias;

    qb.where(`${base}.id = :id`, { id: promptVersionId.getString() });
    this.applyFindOptions(qb, options);
    this.applyLiveRelations(qb);

    const promptVersion = await qb.getOne();
    return promptVersion ? PsqlPromptVersionsMapper.toDomain(promptVersion) : null;
  }

  override async findMany(options?: FindManyOptions<PromptVersionEntity>): Promise<PromptVersions[]> {
    const qb = this.createBaseQb(options?.withDeleted);
    this.applyFindOptions(qb, options);
    this.applyLiveRelations(qb);

    const promptVersions = await qb.getMany();
    return PsqlPromptVersionsMapper.toDomains(promptVersions);
  }

  override async save(promptVersion: PromptVersions): Promise<PromptVersions>;
  override async save(promptVersions: PromptVersions[]): Promise<PromptVersions[]>;
  async save(promptVersion: PromptVersions | PromptVersions[]): Promise<PromptVersions | PromptVersions[]> {
    if (Array.isArray(promptVersion)) {
      await this.promptVersionsRepository.save(PsqlPromptVersionsMapper.toEntities(promptVersion));

      return promptVersion;
    } else {
      const promptVersionEntity = PsqlPromptVersionsMapper.toEntity(promptVersion);
      await this.promptVersionsRepository.save(promptVersionEntity);

      return promptVersion;
    }
  }
}
