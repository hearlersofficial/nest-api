import { TypeormTonePromptsMapper } from "~counselings/domains/tone-prompts/infrastructures/mappers/typeorm-tone-prompts.mapper";
import { TonePromptsRepository } from "~counselings/domains/tone-prompts/infrastructures/tone-prompts.repository";
import { TonePrompts } from "~counselings/domains/tone-prompts/models/tone-prompts";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { TonePromptEntity } from "~common/system/persistences/entities/prompts/tone-prompts.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class TypeormTonePromptsRepository extends TonePromptsRepository {
  constructor(
    @InjectRepository(TonePromptEntity)
    private readonly tonePromptsRepository: Repository<TonePromptEntity>,
  ) {
    super();
  }

  override async findByTonePromptId(
    tonePromptId: TonePromptId,
    options?: FindOneOptions<TonePromptEntity>,
  ): Promise<TonePrompts | null> {
    const findOneOptions: FindOneOptions<TonePromptEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: tonePromptId.getString(),
    };
    const tonePrompt = await this.tonePromptsRepository.findOne(findOneOptions);
    return tonePrompt ? TypeormTonePromptsMapper.toDomain(tonePrompt) : null;
  }

  override async findMany(options?: FindManyOptions<TonePromptEntity>): Promise<TonePrompts[]> {
    const findManyOptions: FindManyOptions<TonePromptEntity> = options ?? {};
    const tonePrompts = await this.tonePromptsRepository.find(findManyOptions);
    return TypeormTonePromptsMapper.toDomains(tonePrompts);
  }

  override async save(tonePrompt: TonePrompts): Promise<TonePrompts>;
  override async save(tonePrompts: TonePrompts[]): Promise<TonePrompts[]>;
  async save(tonePrompt: TonePrompts | TonePrompts[]): Promise<TonePrompts | TonePrompts[]> {
    if (Array.isArray(tonePrompt)) {
      await this.tonePromptsRepository.save(TypeormTonePromptsMapper.toEntities(tonePrompt));
      return tonePrompt;
    } else {
      const tonePromptEntity = TypeormTonePromptsMapper.toEntity(tonePrompt);
      await this.tonePromptsRepository.save(tonePromptEntity);
      return tonePrompt;
    }
  }
}
