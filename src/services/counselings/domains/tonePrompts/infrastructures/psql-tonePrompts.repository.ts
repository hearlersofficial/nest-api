import { PsqlTonePromptsMapper } from "~counselings/domains/tonePrompts/infrastructures/mappers/psql.tonePrompts.mapper";
import { TonePromptsRepository } from "~counselings/domains/tonePrompts/infrastructures/tonePrompts.repository";
import { TonePrompts } from "~counselings/domains/tonePrompts/models/tonePrompts";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { TonePromptEntity } from "~common/system/persistences/entities/prompts/TonePrompts.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class PsqlTonePromptsRepository extends TonePromptsRepository {
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
    return tonePrompt ? PsqlTonePromptsMapper.toDomain(tonePrompt) : null;
  }

  override async findMany(options?: FindManyOptions<TonePromptEntity>): Promise<TonePrompts[]> {
    const findManyOptions: FindManyOptions<TonePromptEntity> = options ?? {};
    const tonePrompts = await this.tonePromptsRepository.find(findManyOptions);
    return PsqlTonePromptsMapper.toDomains(tonePrompts);
  }

  override async save(tonePrompt: TonePrompts): Promise<TonePrompts>;
  override async save(tonePrompts: TonePrompts[]): Promise<TonePrompts[]>;
  async save(tonePrompt: TonePrompts | TonePrompts[]): Promise<TonePrompts | TonePrompts[]> {
    if (Array.isArray(tonePrompt)) {
      await this.tonePromptsRepository.save(PsqlTonePromptsMapper.toEntities(tonePrompt));
      return tonePrompt;
    } else {
      const tonePromptEntity = PsqlTonePromptsMapper.toEntity(tonePrompt);
      await this.tonePromptsRepository.save(tonePromptEntity);
      return tonePrompt;
    }
  }
}
