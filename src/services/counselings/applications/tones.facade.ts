import { TonesService } from "~counselings/domains/tones/tones.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class TonesFacade {
  constructor(private readonly tonesService: TonesService) {}
}
