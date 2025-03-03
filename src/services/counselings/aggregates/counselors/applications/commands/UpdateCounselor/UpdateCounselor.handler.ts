import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { UpdateCounselorCommand } from "~counselings/aggregates/counselors/applications/commands/UpdateCounselor/UpdateCounselor.command";
import { CounselorService } from "~counselings/aggregates/counselors/applications/counselor.service";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateCounselorCommand)
export class UpdateCounselorHandler implements ICommandHandler<UpdateCounselorCommand> {
  constructor(private readonly counselorService: CounselorService) {}

  async execute(command: UpdateCounselorCommand): Promise<Counselors> {
    const { counselorId, toneId, name, description, gender } = command.props;

    const counselor = await this.counselorService.findOne(counselorId);
    if (!counselor) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counselor not found");
    }

    counselor.update({ toneId, name, description, gender });
    await this.counselorService.update(counselor);

    return counselor;
  }
}
