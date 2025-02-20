import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/CounselTechniques.entity";

import { Column, Entity, OneToMany } from "typeorm";

@Entity({
  name: "contexts",
  comment: "컨텍스트",
})
export class ContextEntity extends CoreEntity {
  @Column({
    name: "name",
    comment: "이름",
  })
  name: string;

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
    name: "body",
    comment: "본문",
  })
  body: string;

  @OneToMany(() => CounselTechniquesEntity, (counselTechniques) => counselTechniques.context)
  counselTechniques: CounselTechniquesEntity[];
}
