import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthUserFk1758536242938 implements MigrationInterface {
    name = 'AuthUserFk1758536242938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_08c34287e68e3edfee682173bbb"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "authUserId"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_83ec86a8e9e7d9dc50dd97f0f56" FOREIGN KEY ("auth_user_id") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_83ec86a8e9e7d9dc50dd97f0f56"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "authUserId" bigint`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_08c34287e68e3edfee682173bbb" FOREIGN KEY ("authUserId") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
