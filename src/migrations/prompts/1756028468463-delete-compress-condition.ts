import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteCompressCondition1756028468463 implements MigrationInterface {
  name = "DeleteCompressCondition1756028468463";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE \"counsel_technique_transition_rules\" DROP COLUMN \"min_not_compressed_message_count\"",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsel_technique_transition_rules\" DROP COLUMN \"max_not_compressed_message_count\"",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE \"counsel_technique_transition_rules\" ADD \"max_not_compressed_message_count\" integer",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsel_technique_transition_rules\" ADD \"min_not_compressed_message_count\" integer",
    );
  }
}
