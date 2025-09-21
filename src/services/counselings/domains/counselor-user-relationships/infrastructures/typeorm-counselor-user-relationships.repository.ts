import { CounselorUserRelationshipsRepository } from "~counselings/domains/counselor-user-relationships/infrastructures/counselor-user-relationships.repository";
import { TypeormCounselorUserRelationshipsMapper } from "~counselings/domains/counselor-user-relationships/infrastructures/mappers/typeorm-counselor-user-relationships.mapper";
import { CounselorUserRelationships } from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationships";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { CounselorUserRelationshipsEntity } from "~common/system/persistences/entities/counsels/counselor-user-relationships.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class TypeormCounselorUserRelationshipsRepository extends CounselorUserRelationshipsRepository {
  constructor(
    @InjectRepository(CounselorUserRelationshipsEntity)
    private readonly counselorUserRelationshipsRepository: Repository<CounselorUserRelationshipsEntity>,
  ) {
    super();
  }

  override async findByRelationshipId(
    relationshipId: CounselorUserRelationshipId,
    options?: FindOneOptions<CounselorUserRelationshipsEntity>,
  ): Promise<CounselorUserRelationships | null> {
    const findOneOptions: FindOneOptions<CounselorUserRelationshipsEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: relationshipId.getString(),
    };

    const relationship = await this.counselorUserRelationshipsRepository.findOne(findOneOptions);
    return relationship ? TypeormCounselorUserRelationshipsMapper.toDomain(relationship) : null;
  }

  override async findByUserAndCounselorId(
    userId: UserId,
    counselorId: CounselorId,
    options?: FindOneOptions<CounselorUserRelationshipsEntity>,
  ): Promise<CounselorUserRelationships | null> {
    const findOneOptions: FindOneOptions<CounselorUserRelationshipsEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      userId: userId.getString(),
      counselorId: counselorId.getString(),
    };
    const relationship = await this.counselorUserRelationshipsRepository.findOne(findOneOptions);
    return relationship ? TypeormCounselorUserRelationshipsMapper.toDomain(relationship) : null;
  }

  override async findMany(
    options?: FindManyOptions<CounselorUserRelationshipsEntity>,
  ): Promise<CounselorUserRelationships[]> {
    const relationships = await this.counselorUserRelationshipsRepository.find(options);
    return TypeormCounselorUserRelationshipsMapper.toDomains(relationships);
  }

  override async save(relationship: CounselorUserRelationships): Promise<CounselorUserRelationships>;
  override async save(relationships: CounselorUserRelationships[]): Promise<CounselorUserRelationships[]>;
  async save(
    relationship: CounselorUserRelationships | CounselorUserRelationships[],
  ): Promise<CounselorUserRelationships | CounselorUserRelationships[]> {
    if (Array.isArray(relationship)) {
      await this.counselorUserRelationshipsRepository.save(
        TypeormCounselorUserRelationshipsMapper.toEntities(relationship),
      );
      return relationship;
    } else {
      const relationshipEntity = TypeormCounselorUserRelationshipsMapper.toEntity(relationship);
      await this.counselorUserRelationshipsRepository.save(relationshipEntity);
      return relationship;
    }
  }
}
