import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteThreshold1756866124755 implements MigrationInterface {
  name = "DeleteThreshold1756866124755";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "counsel_techniques" DROP COLUMN "message_threshold"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "counsel_techniques" ADD "message_threshold" integer NOT NULL DEFAULT 5');
  }
}
