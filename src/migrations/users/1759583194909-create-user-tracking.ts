import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTracking1759583194909 implements MigrationInterface {
    name = 'CreateUserTracking1759583194909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_trackings" ("id" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, "has_seen_intro_cutscene" boolean NOT NULL, "user_id" bigint NOT NULL, CONSTRAINT "REL_ce5e5847c8a9d403c6967741ca" UNIQUE ("user_id"), CONSTRAINT "PK_7c58ae117a9665b93a0740729a8" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_trackings"."id" IS 'ID'; COMMENT ON COLUMN "user_trackings"."created_at" IS '생성일시 (한국시간)'; COMMENT ON COLUMN "user_trackings"."updated_at" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN "user_trackings"."deleted_at" IS '삭제일시 (한국시간)'`);
        await queryRunner.query(`ALTER TABLE "user_trackings" ADD CONSTRAINT "FK_ce5e5847c8a9d403c6967741ca1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_trackings" DROP CONSTRAINT "FK_ce5e5847c8a9d403c6967741ca1"`);
        await queryRunner.query(`DROP TABLE "user_trackings"`);
    }

}
