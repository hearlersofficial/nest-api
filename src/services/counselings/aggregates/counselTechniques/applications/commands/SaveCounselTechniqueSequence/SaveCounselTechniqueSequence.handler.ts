import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import {
  SaveCounselTechniqueSequenceCommand,
  SaveCounselTechniqueSequenceCommandResponse,
} from "~counselings/aggregates/counselTechniques/applications/commands/SaveCounselTechniqueSequence/SaveCounselTechniqueSequence.command";
import { CounselTechniqueService } from "~counselings/aggregates/counselTechniques/applications/counselTechnique.service";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(SaveCounselTechniqueSequenceCommand)
export class SaveCounselTechniqueSequenceHandler implements ICommandHandler<SaveCounselTechniqueSequenceCommand> {
  constructor(private readonly counselTechniqueService: CounselTechniqueService) {}

  async execute(command: SaveCounselTechniqueSequenceCommand): Promise<SaveCounselTechniqueSequenceCommandResponse> {
    const { counselTechniqueIds } = command.props;
    // 상답 기법 조회
    const counselTechniques = await this.counselTechniqueService.findMany({ ids: counselTechniqueIds });
    if (counselTechniques.length !== counselTechniqueIds.length) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel techniques not found");
    }

    // id 순서대로 정렬
    const orderMap = new Map(counselTechniqueIds.map((id, index) => [id.getValue(), index]));
    counselTechniques.sort((a, b) => {
      return (orderMap.get(a.id.getValue()) ?? Number.MAX_VALUE) - (orderMap.get(b.id.getValue()) ?? Number.MAX_VALUE);
    });

    // 기존 연결 해제
    for (const counselTechnique of counselTechniques) {
      if (counselTechnique.prevTechniqueId !== null) {
        const prevTechnique = await this.counselTechniqueService.findOne(counselTechnique.prevTechniqueId);
        if (prevTechnique !== null) {
          prevTechnique.update({ nextTechniqueId: null });
          await this.counselTechniqueService.update(prevTechnique);
        }
      }
      if (counselTechnique.nextTechniqueId !== null) {
        const nextTechnique = await this.counselTechniqueService.findOne(counselTechnique.nextTechniqueId);
        if (nextTechnique !== null) {
          nextTechnique.update({ prevTechniqueId: null });
          await this.counselTechniqueService.update(nextTechnique);
        }
      }
    }

    // 새로운 리스트 생성
    for (const [index, counselTechnique] of counselTechniques.entries()) {
      counselTechnique.update({ prevTechniqueId: counselTechniques[index - 1]?.id ?? null });
      counselTechnique.update({ nextTechniqueId: counselTechniques[index + 1]?.id ?? null });
    }

    await this.counselTechniqueService.updateMany(counselTechniques);

    return { counselTechniques };
  }
}
