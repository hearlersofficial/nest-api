import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { TonesService } from "~counselings/domains/tones/tones.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class TonesFacade {
  constructor(private readonly tonesService: TonesService) {}

  async createTone(params: { name: string; body: string }) {
    const { name, body } = params;
    return this.tonesService.create({ name, body });
  }

  async findTones(params: { name?: string }) {
    const { name } = params;
    return this.tonesService.findMany({ name });
  }

  async findToneById(params: { toneId: UniqueEntityId }) {
    const { toneId } = params;
    return this.tonesService.getOne({ toneId });
  }

  async updateTone(params: { toneId: UniqueEntityId; name?: string; body?: string }) {
    const { toneId, name, body } = params;
    const tone = await this.tonesService.getOne({ toneId });

    tone.update({ name, body });
    return this.tonesService.update(tone);
  }
}
