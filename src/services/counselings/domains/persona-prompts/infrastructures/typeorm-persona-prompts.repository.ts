import { TypeormPersonaPromptsMapper } from "~counselings/domains/persona-prompts/infrastructures/mappers/typeorm-persona-prompts.mapper";
import { PersonaPromptsRepository } from "~counselings/domains/persona-prompts/infrastructures/persona-prompts.repository";
import { PersonaPrompts } from "~counselings/domains/persona-prompts/models/persona-prompts";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { PersonaPromptEntity } from "~common/system/persistences/entities/prompts/persona-prompts.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class TypeormPersonaPromptsRepository extends PersonaPromptsRepository {
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
    return personaPrompt ? TypeormPersonaPromptsMapper.toDomain(personaPrompt) : null;
  }

  override async findByVersionAndCounselor(
    promptVersionId: PromptVersionId,
    counselorId: CounselorId,
    options?: FindOneOptions<PersonaPromptEntity>,
  ): Promise<PersonaPrompts | null> {
    const findOneOptions: FindOneOptions<PersonaPromptEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      promptVersionId: promptVersionId.getString(),
      counselorId: counselorId.getString(),
    };
    const personaPrompt = await this.personaPromptsRepository.findOne(findOneOptions);
    return personaPrompt ? TypeormPersonaPromptsMapper.toDomain(personaPrompt) : null;
  }

  override async findMany(options?: FindManyOptions<PersonaPromptEntity>): Promise<PersonaPrompts[]> {
    const findManyOptions: FindManyOptions<PersonaPromptEntity> = options ?? {};
    const personaPrompts = await this.personaPromptsRepository.find(findManyOptions);
    return TypeormPersonaPromptsMapper.toDomains(personaPrompts);
  }

  override async save(personaPrompt: PersonaPrompts): Promise<PersonaPrompts>;
  override async save(personaPrompts: PersonaPrompts[]): Promise<PersonaPrompts[]>;
  async save(personaPrompt: PersonaPrompts | PersonaPrompts[]): Promise<PersonaPrompts | PersonaPrompts[]> {
    if (Array.isArray(personaPrompt)) {
      await this.personaPromptsRepository.save(TypeormPersonaPromptsMapper.toEntities(personaPrompt));
      return personaPrompt;
    } else {
      const personaPromptEntity = TypeormPersonaPromptsMapper.toEntity(personaPrompt);
      await this.personaPromptsRepository.save(personaPromptEntity);
      return personaPrompt;
    }
  }
}
