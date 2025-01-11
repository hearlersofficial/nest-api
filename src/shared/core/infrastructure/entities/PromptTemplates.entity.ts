import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { UserPromptsEntity } from "~shared/core/infrastructure/entities/UserPrompts.entity";
import { PromptCategory } from "~shared/enums/PromptCategory.enum";

import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: "prompt_templates" })
export class PromptTemplatesEntity extends CoreEntity {
  @Column({
    type: "varchar",
    name: "title",
    comment: "프롬프트 제목",
  })
  title: string;

  @Column({
    type: "text",
    name: "content",
    comment: "프롬프트 내용",
  })
  content: string;

  @Column({
    type: "enum",
    name: "category",
    enum: PromptCategory,
    comment: "프롬프트 카테고리",
  })
  category: PromptCategory;

  @Column({
    type: "jsonb",
    name: "variables",
    nullable: true,
    comment: "프롬프트 변수 정의",
  })
  variables: Record<string, string>;

  @Column({
    type: "int",
    name: "version",
    default: 1,
    comment: "프롬프트 버전",
  })
  version: number;

  @OneToMany(() => UserPromptsEntity, (userPrompt) => userPrompt.template)
  userPrompts: UserPromptsEntity[];
}
