import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { BubbleEntity } from "~shared/core/infrastructure/entities/counselors/bubble.entity";
import { CounselorEntity } from "~shared/core/infrastructure/entities/counselors/counselor.entity";
import { Bubbles } from "~counselings/domains/counselors/models/bubbles";
import { Counselors } from "~counselings/domains/counselors/models/counselors";
import { CounselorsRepository } from "~counselings/infrastructures/counselors/counselors.repository";
import { PsqlCounselorsMapper } from "~counselings/infrastructures/counselors/mappers/psql.counselors.mapper";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class PsqlCounselorsRepository extends CounselorsRepository {
  constructor(
    @InjectRepository(CounselorEntity) private readonly counselorsRepository: Repository<CounselorEntity>,
    @InjectRepository(BubbleEntity) private readonly bubblesRepository: Repository<BubbleEntity>,
  ) {
    super();
  }

  override async findByCounselorId(
    counselorId: UniqueEntityId,
    options?: FindOneOptions<CounselorEntity>,
  ): Promise<Counselors | null> {
    const findOneOptions: FindOneOptions<CounselorEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: counselorId.getString(),
    };
    const counselor = await this.counselorsRepository.findOne(findOneOptions);
    return counselor ? PsqlCounselorsMapper.toDomain(counselor) : null;
  }

  override async findMany(options?: FindManyOptions<CounselorEntity>): Promise<Counselors[]> {
    const findManyOptions: FindManyOptions<CounselorEntity> = options ?? {};
    const counselors = await this.counselorsRepository.find(findManyOptions);
    return PsqlCounselorsMapper.toDomains(counselors);
  }

  override async save(counselor: Counselors): Promise<Counselors>;
  override async save(counselors: Counselors[]): Promise<Counselors[]>;
  async save(counselor: Counselors | Counselors[]): Promise<Counselors | Counselors[]> {
    if (Array.isArray(counselor)) {
      await this.counselorsRepository.save(PsqlCounselorsMapper.toEntities(counselor));
      return counselor;
    }
    const counselorEntity = PsqlCounselorsMapper.toEntity(counselor);
    await this.counselorsRepository.save(counselorEntity);
    return counselor;
  }

  override async saveBubble(counselor: Counselors, bubble: Bubbles): Promise<Bubbles> {
    const bubbleEntity = PsqlCounselorsMapper.toBubbleEntity(counselor, bubble);
    await this.counselorsRepository.save(bubbleEntity);
    return bubble;
  }

  override async findBubbles(options?: FindManyOptions<BubbleEntity>): Promise<Bubbles[]> {
    const findManyOptions: FindManyOptions<BubbleEntity> = options ?? {};
    const bubbles = await this.bubblesRepository.find(findManyOptions);
    return PsqlCounselorsMapper.toBubbleDomains(bubbles);
  }

  override async findRandomBubble(counselorId: UniqueEntityId): Promise<Bubbles> {
    const bubbles = await this.bubblesRepository.find({
      where: { counselorId: counselorId.getString() },
    });

    if (!bubbles || bubbles.length === 0) {
      throw new Error("No bubbles found for this counselor");
    }

    const randomIndex = Math.floor(Math.random() * bubbles.length);
    const randomBubble = bubbles[randomIndex];

    const bubble = PsqlCounselorsMapper.toBubbleDomain(randomBubble);
    return bubble;
  }

  override async findBubbleById(bubbleId: UniqueEntityId): Promise<Bubbles | null> {
    const bubble = await this.bubblesRepository.findOne({
      where: { id: bubbleId.getString() },
    });
    return bubble ? PsqlCounselorsMapper.toBubbleDomain(bubble) : null;
  }
}
