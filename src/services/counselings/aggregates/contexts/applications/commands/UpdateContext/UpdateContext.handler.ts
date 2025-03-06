import { UpdateContextCommand } from "~counselings/aggregates/contexts/applications/commands/UpdateContext/UpdateContext.command";
import { ContextService } from "~counselings/aggregates/contexts/applications/context.service";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateContextCommand)
export class UpdateContextHandler implements ICommandHandler<UpdateContextCommand> {
  constructor(private readonly contextService: ContextService) {}

  async execute(command: UpdateContextCommand): Promise<Contexts> {
    const { contextId, name, body, placeholders } = command.props;
    const context: Contexts = await this.contextService.getById(contextId);
    context.update({ name, body, placeholders });
    await this.contextService.update(context);
    return context;
  }
}
