import { PsqlPersonaPromptsMapper } from "~counselings/domains/personaPrompts/infrastructures/mappers/psql.personaPrompts.mapper";
import { PersonaPromptsRepository } from "~counselings/domains/personaPrompts/infrastructures/personaPrompts.repository";
import { PersonaPrompts } from "~counselings/domains/personaPrompts/models/personaPrompts";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PersonaPromptEntity } from "~common/system/persistences/entities/prompts/PersonaPrompts.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class PsqlPersonaPromptsRepository extends PersonaPromptsRepository {
  constructor(
    @InjectRepository(PersonaPromptEntity)
    private readonly personaPromptsRepository: Repository<PersonaPromptEntity>,
  ) {
    super();
  }

  override async findByPersonaPromptId(
    personaPromptId: PersonaPromptId,
    options?: FindOneOptions<PersonaPromptEntity>,
  ): Promise<PersonaPrompts | null> {
    const findOneOptions: FindOneOptions<PersonaPromptEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: personaPromptId.getString(),
    };
    const personaPrompt = await this.personaPromptsRepository.findOne(findOneOptions);
    return personaPrompt ? PsqlPersonaPromptsMapper.toDomain(personaPrompt) : null;
  }

  override async findMany(options?: FindManyOptions<PersonaPromptEntity>): Promise<PersonaPrompts[]> {
    const findManyOptions: FindManyOptions<PersonaPromptEntity> = options ?? {};
    const personaPrompts = await this.personaPromptsRepository.find(findManyOptions);
    return PsqlPersonaPromptsMapper.toDomains(personaPrompts);
  }

  override async save(personaPrompt: PersonaPrompts): Promise<PersonaPrompts>;
  override async save(personaPrompts: PersonaPrompts[]): Promise<PersonaPrompts[]>;
  async save(personaPrompt: PersonaPrompts | PersonaPrompts[]): Promise<PersonaPrompts | PersonaPrompts[]> {
    if (Array.isArray(personaPrompt)) {
      await this.personaPromptsRepository.save(PsqlPersonaPromptsMapper.toEntities(personaPrompt));
      return personaPrompt;
    } else {
      const personaPromptEntity = PsqlPersonaPromptsMapper.toEntity(personaPrompt);
      await this.personaPromptsRepository.save(personaPromptEntity);
      return personaPrompt;
    }
  }
}
