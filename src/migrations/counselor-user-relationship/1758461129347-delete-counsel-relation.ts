import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteCounselRelation1758461129347 implements MigrationInterface {
    name = 'DeleteCounselRelation1758461129347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "counsels" DROP COLUMN "counselor_user_relationship_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 주의: up에서 삭제된 counselor_user_relationship_id 데이터는 복구할 수 없습니다.
        // 컬럼만 다시 생성하며, 기존 counsels 레코드들은 NULL 값을 가지게 됩니다.
        await queryRunner.query(`ALTER TABLE "counsels" ADD "counselor_user_relationship_id" bigint`);
        
        // 기존 데이터에 대해서는 user_id와 counselor_id를 기반으로 
        // counselor_user_relationships 테이블에서 매칭되는 레코드를 찾아 업데이트할 수 있지만,
        // 이는 데이터 정합성을 보장할 수 없으므로 수동으로 처리하는 것을 권장합니다.
    }

}
