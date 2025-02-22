import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PersonaEntity } from "~shared/core/infrastructure/entities/prompts/Personas.entity";
import { Personas } from "~counselings/aggregates/personas/domain/personas";
import { PsqlPersonasMapper } from "~counselings/aggregates/personas/infrastructures/adaptors/mappers/psql.persona.mapper";
import { FindManyPropsInPersonasRepository, PersonasRepositoryPort } from "~counselings/aggregates/personas/infrastructures/persona.repository.port";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class PsqlPersonaRepositoryAdaptor implements PersonasRepositoryPort {
  constructor(
    @InjectRepository(PersonaEntity)
    private readonly personasRepository: Repository<PersonaEntity>,
  ) {}

  async create(persona: Personas): Promise<Personas> {
    const personaEntity = PsqlPersonasMapper.toEntity(persona);
    await this.personasRepository.save(personaEntity);
    return persona;
  }

  async update(persona: Personas): Promise<Personas> {
    const personaEntity = PsqlPersonasMapper.toEntity(persona);
    await this.personasRepository.update(personaEntity.id, personaEntity);
    return persona;
  }

  async findOne(personaId: UniqueEntityId): Promise<Personas> {
    const personaEntity = await this.personasRepository.findOne({
      where: { id: personaId.getString() },
    });
    return PsqlPersonasMapper.toDomain(personaEntity);
  }

  async findAll(): Promise<Personas[]> {
    const personaEntities = await this.personasRepository.find();
    return personaEntities.map((personaEntity) => PsqlPersonasMapper.toDomain(personaEntity));
  }

  async findMany(props: FindManyPropsInPersonasRepository): Promise<Personas[]> {
    const findOptionsWhere: FindOptionsWhere<PersonaEntity> = {};
    if (props.counselorId) {
      findOptionsWhere.counselorId = props.counselorId.getString();
    }
    const personaEntities = await this.personasRepository.find({
      where: findOptionsWhere,
    });
    return personaEntities.map((personaEntity) => PsqlPersonasMapper.toDomain(personaEntity));
  }
}
