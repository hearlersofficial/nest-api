import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { InstructionPersistor } from "~counselings/aggregates/instructions/applications/tools/instruction.persistor";
import { InstructionReader } from "~counselings/aggregates/instructions/applications/tools/instruction.reader";
import { Instructions, InstructionsNewProps } from "~counselings/aggregates/instructions/domain/instructions";

import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class InstructionService {
  constructor(private readonly instructionReader: InstructionReader, private readonly instructionPersistor: InstructionPersistor) {}

  async create(instructionNewProps: InstructionsNewProps): Promise<Instructions> {
    const instructionOrError = Instructions.createNew(instructionNewProps);
    if (instructionOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, instructionOrError.error);
    }
    const instruction = instructionOrError.value;
    const createdInstruction = await this.instructionPersistor.create(instruction);
    return createdInstruction;
  }

  async update(instruction: Instructions): Promise<Instructions> {
    const updatedInstruction = await this.instructionPersistor.update(instruction);
    return updatedInstruction;
  }

  async findOne(instructionId: UniqueEntityId): Promise<Instructions> {
    const instruction = await this.instructionReader.findOne(instructionId);
    return instruction;
  }

  async findAll(): Promise<Instructions[]> {
    const instructions = await this.instructionReader.findAll();
    return instructions;
  }

  async findMany(props: { name?: string }): Promise<Instructions[]> {
    const instructions = await this.instructionReader.findMany(props);
    return instructions;
  }

  async getById(instructionId: UniqueEntityId): Promise<Instructions> {
    const instruction: Instructions | null = await this.findOne(instructionId);
    if (!instruction) {
      throw new NotFoundException("Instruction not found");
    }
    return instruction;
  }

  async getAll(): Promise<Instructions[]> {
    const instructions = await this.findAll();
    if (instructions.length === 0) {
      throw new NotFoundException("Instructions not found");
    }
    return instructions;
  }

  async getMany(props: { name?: string }): Promise<Instructions[]> {
    const instructions = await this.findMany(props);
    if (instructions.length === 0) {
      throw new NotFoundException("Instructions not found");
    }
    return instructions;
  }
}
