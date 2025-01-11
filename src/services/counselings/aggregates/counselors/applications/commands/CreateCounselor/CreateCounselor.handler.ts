import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
import { CreateCounselorCommand } from "~counselings/aggregates/counselors/applications/commands/CreateCounselor/CreateCounselor.command";
import { CreateCounselorUseCase } from "~counselings/aggregates/counselors/applications/useCases/CreateCounselorUseCase/CreateCounselorUseCase";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateCounselorCommand)
export class CreateCounselorHandler implements ICommandHandler<CreateCounselorCommand> {
  constructor(private readonly createCounselUseCase: CreateCounselorUseCase) {}

  async execute(command: CreateCounselorCommand): Promise<Counselors> {
    const { props } = command;

    const createCounselorResult = await this.createCounselUseCase.execute(props);
    if (!createCounselorResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, createCounselorResult.error);
    }

    return createCounselorResult.counselor;
  }
}
