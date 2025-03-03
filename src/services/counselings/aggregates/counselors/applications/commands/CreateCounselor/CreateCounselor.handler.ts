import { CreateCounselorCommand } from "~counselings/aggregates/counselors/applications/commands/CreateCounselor/CreateCounselor.command";
import { CounselorService } from "~counselings/aggregates/counselors/applications/counselor.service";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateCounselorCommand)
export class CreateCounselorHandler implements ICommandHandler<CreateCounselorCommand> {
  constructor(private readonly counselorService: CounselorService) {}

  async execute(command: CreateCounselorCommand): Promise<Counselors> {
    const { toneId, name, description, gender } = command.props;

    const createCounselor = await this.counselorService.create({ toneId, name, description, gender });

    return createCounselor;
  }
}
