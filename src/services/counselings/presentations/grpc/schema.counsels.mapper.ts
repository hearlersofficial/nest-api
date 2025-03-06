import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";
import { Personas } from "~counselings/aggregates/personas/domain/personas";
import { Tones } from "~counselings/aggregates/tones/domain/tones";
import {
  Context,
  ContextSchema,
  Counsel,
  CounselMessage,
  CounselMessageSchema,
  Counselor,
  CounselorSchema,
  CounselSchema,
  CounselTechnique,
  CounselTechniqueSchema,
  Instruction,
  InstructionItem,
  InstructionItemSchema,
  InstructionSchema,
  Persona,
  PersonaSchema,
  Tone,
  ToneSchema,
} from "~proto/com/hearlers/v1/model/counsel_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaCounselsMapper {
  static toCounselProto(counsel: Counsels): Counsel {
    return create(CounselSchema, {
      id: counsel.id.getString(),
      userId: counsel.userId.getString(),
      counselorId: counsel.counselorId.getString(),
      lastMessage: counsel.lastMessage,
      lastChatedAt: counsel.lastChatedAt ? counsel.lastChatedAt.toISOString() : null,
      counselTechniqueId: counsel.counselTechniqueId.getString(),
      counselorUserRelationshipId: counsel.counselorUserRelationshipId.getString(),
      createdAt: counsel.createdAt.toISOString(),
      updatedAt: counsel.updatedAt.toISOString(),
      deletedAt: counsel.deletedAt ? counsel.deletedAt.toISOString() : null,
    });
  }

  static toCounselMessageProto(counselMessage: CounselMessages): CounselMessage {
    return create(CounselMessageSchema, {
      id: counselMessage.id.getString(),
      counselId: counselMessage.counselId.getString(),
      message: counselMessage.message,
      isUserMessage: counselMessage.isUserMessage,
      reactedAt: counselMessage.reactedAt ? counselMessage.reactedAt.toISOString() : null,
      reaction: counselMessage.reaction,
      createdAt: counselMessage.createdAt.toISOString(),
      updatedAt: counselMessage.updatedAt.toISOString(),
      deletedAt: counselMessage.deletedAt ? counselMessage.deletedAt.toISOString() : null,
    });
  }

  static toCounselorProto(counselor: Counselors): Counselor {
    const bubble = counselor.bubble;
    return create(CounselorSchema, {
      id: counselor.id.getString(),
      toneId: counselor.toneId.getString(),
      name: counselor.name,
      description: counselor.description,
      gender: counselor.gender,
      introMessage: bubble.introMessage,
      responseOption1: bubble.responseOption1,
      responseOption2: bubble.responseOption2,
      createdAt: counselor.createdAt.toISOString(),
      updatedAt: counselor.updatedAt.toISOString(),
      deletedAt: counselor.deletedAt ? counselor.deletedAt.toISOString() : null,
    });
  }

  static toCounselTechniqueProto(counselTechnique: CounselTechniques): CounselTechnique {
    return create(CounselTechniqueSchema, {
      id: counselTechnique.id.getString(),
      name: counselTechnique.name,
      toneId: counselTechnique.toneId ? counselTechnique.toneId.getString() : null,
      contextId: counselTechnique.contextId.getString(),
      instructionId: counselTechnique.instructionId.getString(),
      counselTechniqueStage: counselTechnique.counselTechniqueStage,
      nextCounselTechniqueId: counselTechnique.nextTechniqueId ? counselTechnique.nextTechniqueId.getString() : null,
      createdAt: counselTechnique.createdAt.toISOString(),
      updatedAt: counselTechnique.updatedAt.toISOString(),
      deletedAt: counselTechnique.deletedAt ? counselTechnique.deletedAt.toISOString() : null,
    });
  }

  // TODO: counselor user relationship mapper 추가

  static toPersonaProto(persona: Personas): Persona {
    return create(PersonaSchema, {
      id: persona.id.getString(),
      body: persona.body,
      counselorId: persona.counselorId.getString(),
      createdAt: persona.createdAt.toISOString(),
      updatedAt: persona.updatedAt.toISOString(),
      deletedAt: persona.deletedAt ? persona.deletedAt.toISOString() : null,
    });
  }

  static toContextProto(context: Contexts): Context {
    return create(ContextSchema, {
      id: context.id.getString(),
      name: context.name,
      placeholders: context.placeholders,
      body: context.body,
      createdAt: context.createdAt.toISOString(),
      updatedAt: context.updatedAt.toISOString(),
      deletedAt: context.deletedAt ? context.deletedAt.toISOString() : null,
    });
  }

  static toInstructionProto(instruction: Instructions, instructionItems: InstructionItems[]): Instruction {
    return create(InstructionSchema, {
      id: instruction.id.getString(),
      name: instruction.name,
      initialSentence: instruction.initialSentence,
      instructionItems: instructionItems.map((item) => SchemaCounselsMapper.toInstructionItemProto(item)),
      createdAt: instruction.createdAt.toISOString(),
      updatedAt: instruction.updatedAt.toISOString(),
      deletedAt: instruction.deletedAt ? instruction.deletedAt.toISOString() : null,
    });
  }

  static toInstructionItemProto(instructionItem: InstructionItems): InstructionItem {
    return create(InstructionItemSchema, {
      id: instructionItem.id.getString(),
      body: instructionItem.body,
      createdAt: instructionItem.createdAt.toISOString(),
      updatedAt: instructionItem.updatedAt.toISOString(),
      deletedAt: instructionItem.deletedAt ? instructionItem.deletedAt.toISOString() : null,
    });
  }

  static toToneProto(tone: Tones): Tone {
    return create(ToneSchema, {
      id: tone.id.getString(),
      name: tone.name,
      body: tone.body,
      createdAt: tone.createdAt.toISOString(),
      updatedAt: tone.updatedAt.toISOString(),
      deletedAt: tone.deletedAt ? tone.deletedAt.toISOString() : null,
    });
  }
}
