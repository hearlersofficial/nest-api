import { TonesService } from "~counselings/domains/tones/tones.service";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class TonesFacade {
  constructor(private readonly tonesService: TonesService) {}

  @Transactional()
  async createTone(params: { name: string; description: string }) {
    const { name, description } = params;
    return this.tonesService.create({ name, description });
  }

  async findTones(params: { name?: string }) {
    const { name } = params;
    return this.tonesService.findMany({ name });
  }

  async findToneById(params: { toneId: UniqueEntityId }) {
    const { toneId } = params;
    return this.tonesService.getOne({ toneId });
  }

  @Transactional()
  async updateTone(params: { toneId: UniqueEntityId; name?: string; description?: string }) {
    const { toneId, name, description } = params;
    const tone = await this.tonesService.getOne({ toneId });

    tone.update({ name, description });
    return this.tonesService.update(tone);
  }
}
