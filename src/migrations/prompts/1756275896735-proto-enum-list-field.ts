import { MigrationInterface, QueryRunner } from "typeorm";

export class ProtoEnumListField1756275896735 implements MigrationInterface {
  name = "ProtoEnumListField1756275896735";

  // helper 함수를 만들어 반복을 줄입니다.
  private async changeColumnType(
    queryRunner: QueryRunner,
    columnName: string,
    newType: string,
    usingClause: string,
  ): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "counsel_technique_transition_rules" ALTER COLUMN "${columnName}" TYPE ${newType} USING ${usingClause}`,
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns = [
      "required_impact_domains",
      "required_timeframes",
      "required_emotion_primaries",
      "required_perceived_controls",
      "required_motivation_stages",
      "required_social_support_levels",
      "required_risk_kinds",
      "required_sleep_qualities",
      "required_cognitive_loads",
      "required_alliance_strengths",
      "required_valences",
      "required_arousal_levels",
    ];

    // 각 컬럼에 대해 타입을 integer[]로 변경합니다.
    for (const column of columns) {
      // 비어있거나 NULL인 경우를 처리하는 더 안전한 USING 구문
      const using = `(CASE WHEN "${column}" IS NULL OR "${column}" = '' THEN NULL ELSE string_to_array("${column}", ',')::integer[] END)`;
      await this.changeColumnType(queryRunner, column, "integer[]", using);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columns = [
      "required_impact_domains",
      "required_timeframes",
      "required_emotion_primaries",
      "required_perceived_controls",
      "required_motivation_stages",
      "required_social_support_levels",
      "required_risk_kinds",
      "required_sleep_qualities",
      "required_cognitive_loads",
      "required_alliance_strengths",
      "required_valences",
      "required_arousal_levels",
    ];

    // 각 컬럼에 대해 타입을 다시 text로 되돌립니다.
    for (const column of columns) {
      const using = `array_to_string("${column}", ',')`;
      await this.changeColumnType(queryRunner, column, "text", using);
    }
  }
}
