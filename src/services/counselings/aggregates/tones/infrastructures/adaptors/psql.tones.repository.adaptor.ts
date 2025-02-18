import { ToneEntity } from "~shared/core/infrastructure/entities/prompts/Tones.entity";
import { TonesRepositoryPort } from "~counselings/aggregates/tones/infrastructures/tones.repository.port";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class PsqlTonesRepositoryAdaptor implements TonesRepositoryPort {
  constructor(
    @InjectRepository(ToneEntity)
    private readonly tonesRepository: Repository<ToneEntity>,
  ) {}
}
