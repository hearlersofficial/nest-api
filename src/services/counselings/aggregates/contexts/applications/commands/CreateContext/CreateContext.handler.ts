import { CreateContextCommand } from "~counselings/aggregates/contexts/applications/commands/CreateContext/CreateContext.command";
import { ContextService } from "~counselings/aggregates/contexts/applications/context.service";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateContextCommand)
export class CreateContextHandler implements ICommandHandler<CreateContextCommand> {
  constructor(private readonly contextService: ContextService) {}

  async execute(command: CreateContextCommand): Promise<Contexts> {
    const { name, body, placeholders } = command.props;
    const context: Contexts = await this.contextService.create({ name, body, placeholders });
    return context;
  }
}
