import { Column, Entity, OneToMany } from "typeorm";
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";
import { CounselTechniquesEntity } from "~/src/shared/core/infrastructure/entities/CounselTechniques.entity";

@Entity("contexts")
export class ContextEntity extends CoreEntity {
  // 플레이스홀더는 ,기준으로 구분된 문자열
  // 꺼낼 때 split(",")
  // 나중에 엄청 고도화를 하면 placeholders로 쓸 수 있는 값을 사전 정의해두고 어드민에서 그 중에서 골라서 쓰는 것도 가능.
  @Column({
    name: "placeholders",
    comment: "플레이스홀더",
  })
  placeholders: string;

  @Column({
    type: "text",
    name: "context_body",
    comment: "컨텍스트 본문",
  })
  contextBody: string;

  @OneToMany(() => CounselTechniquesEntity, (counselTechniques) => counselTechniques.context)
  counselTechniques: CounselTechniquesEntity[];
}
