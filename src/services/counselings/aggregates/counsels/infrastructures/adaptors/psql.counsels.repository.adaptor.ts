<<<<<<< HEAD:src/services/counselings/aggregates/counsels/infrastructures/adaptors/psql.counsels.repository.adaptor.ts
import { KAFKA_CLIENT } from "~shared/core/infrastructure/Config";
import { CounselsEntity } from "~shared/core/infrastructure/entities/Counsels.entity";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import { PsqlCounselsMapper } from "~counselings/aggregates/counsels/infrastructures/adaptors/mapper/psql.counsels.mapper";
=======
import { InjectRepository } from "@nestjs/typeorm";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counsels/infrastructures/adaptors/psql.counsels.repository.adaptor.ts
import {
  CounselsRepositoryPort,
  FindManyPropsInCounselsRepository,
  FindOnePropsInCounselsRepository,
<<<<<<< HEAD:src/services/counselings/aggregates/counsels/infrastructures/adaptors/psql.counsels.repository.adaptor.ts
} from "~counselings/aggregates/counsels/infrastructures/counsels.repository.port";

=======
} from "../counsels.repository.port";
import { CounselsEntity } from "~/src/shared/core/infrastructure/entities/Counsels.entity";
import { Counsels } from "~/src/aggregates/counsels/domain/Counsels";
import { PsqlCounselsMapper } from "~/src/aggregates/counsels/infrastructures/adaptors/mapper/psql.counsels.mapper";
import { FindManyOptions, FindOneOptions, FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counsels/infrastructures/adaptors/psql.counsels.repository.adaptor.ts
import { Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";

export class PsqlCounselsRepositoryAdaptor implements CounselsRepositoryPort {
  constructor(
    @InjectRepository(CounselsEntity) private readonly counselsRepository: Repository<CounselsEntity>,
    @Inject(KAFKA_CLIENT) private readonly kafkaProducer: ClientKafka,
  ) {}

  async publishDomainEvents(counsel: Counsels): Promise<void> {
    const domainEvents = counsel.domainEvents;
    for (const domainEvent of domainEvents) {
      this.kafkaProducer.emit(domainEvent.topic, domainEvent.binary);
    }
    counsel.clearEvents();
  }

  async create(counsel: Counsels): Promise<Counsels> {
    const counselsEntity = PsqlCounselsMapper.toEntity(counsel);
    const createdCounselsEntity = await this.counselsRepository.save(counselsEntity);
    const createdCounsel = PsqlCounselsMapper.toDomain(createdCounselsEntity);
    createdCounsel.addCreatedEvent();

    await this.publishDomainEvents(counsel);
    await this.publishDomainEvents(createdCounsel);

    return createdCounsel;
  }

  async findMany(props: FindManyPropsInCounselsRepository): Promise<Counsels[] | null> {
    const { userId } = props;
    const findOptionsWhere: FindOptionsWhere<CounselsEntity> = {};
    if (userId !== null && userId !== undefined) {
      findOptionsWhere.userId = userId.getString();
    }

    const findOptionsOrder: FindOptionsOrder<CounselsEntity> = { lastChatedAt: "DESC" };

    const findManyOptions: FindManyOptions<CounselsEntity> = {
      where: findOptionsWhere,
      order: findOptionsOrder,
    };

    const counselsEntities: CounselsEntity[] = await this.counselsRepository.find(findManyOptions);
    const counselList = counselsEntities.map((entity) => PsqlCounselsMapper.toDomain(entity));
    if (counselList.length > 0) {
      for (const counsel of counselList) {
        await this.publishDomainEvents(counsel);
      }
    }
    return counselList;
  }

  async findOne(props: FindOnePropsInCounselsRepository): Promise<Counsels | null> {
    const { counselId } = props;
    const findOptionsWhere: FindOptionsWhere<CounselsEntity> = {};
    if (counselId !== null && counselId !== undefined) {
      findOptionsWhere.id = counselId.getString();
    }

    const findOneOptions: FindOneOptions<CounselsEntity> = {
      where: findOptionsWhere,
    };

    const counselsEntity: CounselsEntity = await this.counselsRepository.findOne(findOneOptions);
    const counsel = PsqlCounselsMapper.toDomain(counselsEntity);
    if (counsel) {
      await this.publishDomainEvents(counsel);
    }
    return counsel;
  }

  async update(counsel: Counsels): Promise<Counsels> {
    const counselsEntity = PsqlCounselsMapper.toEntity(counsel);
    const updatedCounselsEntity = await this.counselsRepository.save(counselsEntity, { reload: true });

    await this.publishDomainEvents(counsel);

    return PsqlCounselsMapper.toDomain(updatedCounselsEntity);
  }
}
