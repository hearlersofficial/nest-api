import { Column, Entity, JoinColumn, OneToOne, RelationId } from "typeorm";
import { Gender, Mbti } from "~/src/gen/com/hearlers/v1/model/user_pb";
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";
import { UsersEntity } from "~/src/shared/core/infrastructure/entities/Users.entity";

@Entity({ name: "user_profiles" })
export class UserProfilesEntity extends CoreEntity {
  @Column({
    type: "varchar",
    name: "profile_image",
    comment: "프로필 이미지",
  })
  profileImage: string;

  @Column({
    type: "varchar",
    name: "phone_number",
    comment: "전화번호",
  })
  phoneNumber: string;

  @Column({
    type: "enum",
    name: "mbti",
    enum: Mbti,
    nullable: true,
    comment: "MBTI",
  })
  mbti: Mbti;

  @Column({
    type: "enum",
    name: "gender",
    enum: Gender,
    nullable: false,
    comment: "성별",
  })
  gender: Gender;

  @Column({
    type: "timestamp",
    name: "birthday",
    nullable: true,
    comment: "생년월일",
  })
  birthday: string;

  @Column({
    type: "varchar",
    name: "introduction",
    nullable: true,
    length: 500,
    comment: "자기소개",
  })
  introduction: string;

  @OneToOne(() => UsersEntity, (user) => user.userProfiles, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;

  @RelationId((userProfiles: UserProfilesEntity) => userProfiles.user)
  @Column({
    type: "int",
    name: "user_id",
    comment: "사용자 ID",
  })
  userId: number;
}
