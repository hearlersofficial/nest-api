import { MigrationInterface, QueryRunner } from "typeorm";

export class Tracking1759582571555 implements MigrationInterface {
    name = 'Tracking1759582571555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "counsel_contexts" DROP CONSTRAINT "FK_counsel_contexts_counsel_technique_id"`);
        await queryRunner.query(`CREATE TABLE "user_trackings" ("id" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, "intro_cutscene_watched" boolean NOT NULL, "user_id" bigint NOT NULL, CONSTRAINT "PK_7c58ae117a9665b93a0740729a8" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_trackings"."id" IS 'ID'; COMMENT ON COLUMN "user_trackings"."created_at" IS '생성일시 (한국시간)'; COMMENT ON COLUMN "user_trackings"."updated_at" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN "user_trackings"."deleted_at" IS '삭제일시 (한국시간)'`);
        await queryRunner.query(`ALTER TABLE "counsel_contexts" ADD CONSTRAINT "FK_98169a3680f66492b75217e4ce0" FOREIGN KEY ("counsel_technique_id") REFERENCES "counsel_techniques"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_trackings" ADD CONSTRAINT "FK_ce5e5847c8a9d403c6967741ca1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_trackings" DROP CONSTRAINT "FK_ce5e5847c8a9d403c6967741ca1"`);
        await queryRunner.query(`ALTER TABLE "counsel_contexts" DROP CONSTRAINT "FK_98169a3680f66492b75217e4ce0"`);
        await queryRunner.query(`DROP TABLE "user_trackings"`);
        await queryRunner.query(`ALTER TABLE "counsel_contexts" ADD CONSTRAINT "FK_counsel_contexts_counsel_technique_id" FOREIGN KEY ("counsel_technique_id") REFERENCES "counsel_techniques"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
