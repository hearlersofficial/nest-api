import { MigrationInterface, QueryRunner } from "typeorm";

export class DomainSeperation1757897569891 implements MigrationInterface {
    name = 'DomainSeperation1757897569891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. 새로운 counsel_compress_conditions 테이블 생성
        await queryRunner.query(`CREATE TABLE "counsel_compress_conditions" ("id" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, "message_count_at_last_compression" integer NOT NULL DEFAULT '0', "last_message_compressed_at" TIMESTAMP, "counsel_id" bigint NOT NULL, CONSTRAINT "REL_d4f1447fd87b2315949fc308db" UNIQUE ("counsel_id"), CONSTRAINT "PK_21d3c336c057af4b6ed4ea6adcc" PRIMARY KEY ("id")); COMMENT ON COLUMN "counsel_compress_conditions"."id" IS 'ID'; COMMENT ON COLUMN "counsel_compress_conditions"."created_at" IS '생성일시 (한국시간)'; COMMENT ON COLUMN "counsel_compress_conditions"."updated_at" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN "counsel_compress_conditions"."deleted_at" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN "counsel_compress_conditions"."message_count_at_last_compression" IS '마지막 압축 시점의 메시지 수'; COMMENT ON COLUMN "counsel_compress_conditions"."last_message_compressed_at" IS '마지막 메시지 압축일시'; COMMENT ON COLUMN "counsel_compress_conditions"."counsel_id" IS '상담 ID'`);
        await queryRunner.query(`COMMENT ON TABLE "counsel_compress_conditions" IS '상담 압축 조건'`);

        // 2. counsel_contexts 테이블에 새 컬럼 추가 (NULL 허용으로 임시 생성)
        await queryRunner.query(`ALTER TABLE "counsel_contexts" ADD "message_count_at_last_transition" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "counsel_contexts"."message_count_at_last_transition" IS '마지막 기법 전이 시점의 메시지 수'`);
        await queryRunner.query(`ALTER TABLE "counsel_contexts" ADD "counsel_technique_id" bigint`);
        await queryRunner.query(`COMMENT ON COLUMN "counsel_contexts"."counsel_technique_id" IS '상담 기법 ID'`);

        // 3. 기존 데이터 마이그레이션
        // 3-1. counsel_contexts에 counsel_technique_id 값 설정 (counsels 테이블에서 복사)
        await queryRunner.query(`
            UPDATE "counsel_contexts" 
            SET "counsel_technique_id" = "counsels"."counsel_technique_id"
            FROM "counsels" 
            WHERE "counsel_contexts"."counsel_id" = "counsels"."id"
        `);
        
        // 3-2. counsel_compress_conditions 테이블에 기존 데이터 이전
        await queryRunner.query(`
            INSERT INTO "counsel_compress_conditions" (
                "id", 
                "created_at", 
                "updated_at", 
                "deleted_at",
                "message_count_at_last_compression",
                "last_message_compressed_at",
                "counsel_id"
            )
            SELECT 
                "counsel_contexts"."id" + 1000000000 as "id", -- ID 충돌 방지를 위한 오프셋
                "counsel_contexts"."created_at",
                "counsel_contexts"."updated_at",
                "counsel_contexts"."deleted_at",
                COALESCE("counsel_contexts"."not_compressed_message_count", 0),
                "counsel_contexts"."last_message_compressed_at",
                "counsel_contexts"."counsel_id"
            FROM "counsel_contexts"
            WHERE "counsel_contexts"."counsel_id" IS NOT NULL
        `);

        // 4. counsel_technique_id를 NOT NULL로 변경
        await queryRunner.query(`ALTER TABLE "counsel_contexts" ALTER COLUMN "counsel_technique_id" SET NOT NULL`);
        
        // 5. 기존 컬럼들 제거
        await queryRunner.query(`ALTER TABLE "counsel_contexts" DROP COLUMN "not_compressed_message_count"`);
        await queryRunner.query(`ALTER TABLE "counsel_contexts" DROP COLUMN "last_message_compressed_at"`);
        await queryRunner.query(`ALTER TABLE "counsel_contexts" DROP COLUMN "current_technique_message_count"`);
        
        // 6. counsels 테이블에서 counsel_technique_id 컬럼 제거 (도메인 분리로 인해 더 이상 필요하지 않음)
        await queryRunner.query(`ALTER TABLE "counsels" DROP COLUMN "counsel_technique_id"`);

        // 7. FK 제약조건 추가
        await queryRunner.query(`ALTER TABLE "counsel_compress_conditions" ADD CONSTRAINT "FK_d4f1447fd87b2315949fc308db4" FOREIGN KEY ("counsel_id") REFERENCES "counsels"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "counsel_contexts" ADD CONSTRAINT "FK_counsel_contexts_counsel_technique_id" FOREIGN KEY ("counsel_technique_id") REFERENCES "counsel_techniques"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. FK 제약조건 제거
        await queryRunner.query(`ALTER TABLE "counsel_contexts" DROP CONSTRAINT "FK_counsel_contexts_counsel_technique_id"`);
        await queryRunner.query(`ALTER TABLE "counsel_compress_conditions" DROP CONSTRAINT "FK_d4f1447fd87b2315949fc308db4"`);

        // 2. counsels 테이블에 counsel_technique_id 컬럼 복원
        await queryRunner.query(`ALTER TABLE "counsels" ADD "counsel_technique_id" bigint`);
        await queryRunner.query(`COMMENT ON COLUMN "counsels"."counsel_technique_id" IS '상담 기법 ID'`);

        // 3. counsel_contexts에서 counsels로 counsel_technique_id 데이터 복원
        await queryRunner.query(`
            UPDATE "counsels" 
            SET "counsel_technique_id" = "counsel_contexts"."counsel_technique_id"
            FROM "counsel_contexts" 
            WHERE "counsels"."id" = "counsel_contexts"."counsel_id"
        `);

        // 4. counsel_contexts 테이블에 기존 컬럼들 복원
        await queryRunner.query(`ALTER TABLE "counsel_contexts" ADD "not_compressed_message_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "counsel_contexts" ADD "last_message_compressed_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "counsel_contexts" ADD "current_technique_message_count" integer NOT NULL DEFAULT '0'`);

        // 5. 데이터 복원
        // 5-1. counsel_compress_conditions에서 counsel_contexts로 데이터 복원
        await queryRunner.query(`
            UPDATE "counsel_contexts" 
            SET 
                "not_compressed_message_count" = "counsel_compress_conditions"."message_count_at_last_compression",
                "last_message_compressed_at" = "counsel_compress_conditions"."last_message_compressed_at"
            FROM "counsel_compress_conditions"
            WHERE "counsel_contexts"."counsel_id" = "counsel_compress_conditions"."counsel_id"
        `);

        // 6. 새로 추가된 컬럼들 제거
        await queryRunner.query(`ALTER TABLE "counsel_contexts" DROP COLUMN "counsel_technique_id"`);
        await queryRunner.query(`ALTER TABLE "counsel_contexts" DROP COLUMN "message_count_at_last_transition"`);

        // 7. counsel_compress_conditions 테이블 제거
        await queryRunner.query(`DROP TABLE "counsel_compress_conditions"`);
    }

}
