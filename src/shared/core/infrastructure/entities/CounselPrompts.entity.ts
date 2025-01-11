import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { isValidVersion } from "~shared/types/version.type";
import { CounselPromptType } from "~proto/com/hearlers/v1/model/counsel_pb";

import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";

@Entity({
  name: "counsel_prompts",
})
export class CounselPromptsEntity extends CoreEntity {
  @Column({
    type: "text",
    name: "persona",
    comment: "Persona",
    nullable: true,
  })
  persona: string;

  @Column({
    type: "text",
    name: "context",
    comment: "Context",
    nullable: true,
  })
  context: string;

  @Column({
    type: "text",
    name: "instruction",
    comment: "Instruction",
    nullable: true,
  })
  instruction: string;

  @Column({
    type: "text",
    name: "tone",
    comment: "Tone",
    nullable: true,
  })
  tone: string;

  @Column({
    type: "text",
    name: "additional_prompt",
    comment: "추가 프롬프트",
    nullable: true,
  })
  additionalPrompt: string;

  @Column({
    type: "enum",
    name: "prompt_type",
    enum: CounselPromptType,
    comment: "프롬프트 타입",
  })
  promptType: CounselPromptType;

  @Column({
    type: "varchar",
    name: "description",
    comment: "프롬프트 설명",
    nullable: true,
  })
  description: string;

  @Column({
    type: "varchar",
    name: "version",
    comment: "프롬프트 버전",
    default: "1.0",
  })
  version: string;

  @BeforeInsert()
  @BeforeUpdate()
  protected validateVersion() {
    if (!isValidVersion(this.version)) {
      throw new Error("Invalid version format");
    }
  }
}
