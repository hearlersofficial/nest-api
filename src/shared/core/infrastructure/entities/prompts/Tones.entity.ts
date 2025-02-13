import { Column, Entity, OneToMany } from "typeorm";
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";
import { CounselTechniquesEntity } from "~/src/shared/core/infrastructure/entities/CounselTechniques.entity";

@Entity({ name: "tones", comment: "톤" })
export class ToneEntity extends CoreEntity {
  @Column({
    name: "name",
    comment: "이름",
  })
  name: string;

  @Column({
    name: "body",
    comment: "본문",
  })
  body: string;

  @OneToMany(() => CounselTechniquesEntity, (counselTechnique) => counselTechnique.tone)
  counselTechniques: CounselTechniquesEntity[];
}
