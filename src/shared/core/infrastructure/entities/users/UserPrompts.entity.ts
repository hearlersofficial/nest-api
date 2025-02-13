<<<<<<< HEAD:src/shared/core/infrastructure/entities/UserPrompts.entity.ts
import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { PromptTemplatesEntity } from "~shared/core/infrastructure/entities/PromptTemplates.entity";
import { UsersEntity } from "~shared/core/infrastructure/entities/Users.entity";
import { Analysis, Context } from "~shared/types/prompts.types";
import { EntityConversation } from "~shared/types/prompts.types";

import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
=======
import { Column, Entity, ManyToOne, JoinColumn, RelationId } from "typeorm";
import { CoreEntity } from "../Core.entity";
import { UsersEntity } from "./Users.entity";
import { PromptTemplatesEntity } from "../PromptTemplates.entity";
import { Context, Analysis } from "~/src/shared/types/prompts.types";
import { EntityConversation } from "~/src/shared/types/prompts.types";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/shared/core/infrastructure/entities/users/UserPrompts.entity.ts

@Entity({ name: "user_prompts" })
export class UserPromptsEntity extends CoreEntity {
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;

  @RelationId((userPrompts: UserPromptsEntity) => userPrompts.user)
  @Column({
    type: "bigint",
    name: "user_id",
    comment: "사용자 ID",
  })
  userId: string;

  @ManyToOne(() => PromptTemplatesEntity)
  @JoinColumn({ name: "template_id" })
  template: PromptTemplatesEntity;

  @RelationId((userPrompts: UserPromptsEntity) => userPrompts.template)
  @Column({
    type: "bigint",
    name: "template_id",
    comment: "템플릿 ID",
  })
  templateId: string;

  @Column({
    type: "jsonb",
    name: "context",
    comment: "상담 컨텍스트 데이터",
  })
  context: Context;

  @Column({
    type: "text",
    name: "generated_prompt",
    comment: "실제 생성된 프롬프트",
  })
  generatedPrompt: string;

  @Column({
    type: "jsonb",
    name: "conversation_history",
    comment: "대화 히스토리",
    default: [],
  })
  conversationHistory: EntityConversation[];

  @Column({
    type: "jsonb",
    name: "analysis",
    nullable: true,
    comment: "상담 분석 데이터",
  })
  analysis: Analysis;
}
