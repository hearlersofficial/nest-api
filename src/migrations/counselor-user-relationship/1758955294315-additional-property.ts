import { MigrationInterface, QueryRunner } from "typeorm";

export class AdditionalProperty1758955294315 implements MigrationInterface {
    name = 'AdditionalProperty1758955294315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "counselor_user_relationships" ADD "total_user_message_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "counselor_user_relationships"."total_user_message_count" IS '총 사용자 메시지 수'`);
        await queryRunner.query(`ALTER TABLE "counselor_user_relationships" ADD "last_interaction_at" TIMESTAMP NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "counselor_user_relationships"."last_interaction_at" IS '마지막 상호작용 시간'`);
        await queryRunner.query(`ALTER TABLE "counselor_user_relationships" ADD "daily_increased_rapport" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "counselor_user_relationships"."daily_increased_rapport" IS '일일 증가한 친밀도'`);
        await queryRunner.query(`ALTER TABLE "counselor_user_relationships" ADD "daily_rapport_reset_at" TIMESTAMP NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "counselor_user_relationships"."daily_rapport_reset_at" IS '일일 친밀도 초기화 시간'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "counselor_user_relationships" DROP COLUMN "daily_rapport_reset_at"`);
        await queryRunner.query(`ALTER TABLE "counselor_user_relationships" DROP COLUMN "daily_increased_rapport"`);
        await queryRunner.query(`ALTER TABLE "counselor_user_relationships" DROP COLUMN "last_interaction_at"`);
        await queryRunner.query(`ALTER TABLE "counselor_user_relationships" DROP COLUMN "total_user_message_count"`);
    }

}
