import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1756027835061 implements MigrationInterface {
  name = "Init1756027835061";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE \"bubbles\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"question\" character varying NOT NULL, \"response_option1\" character varying NOT NULL, \"response_option2\" character varying NOT NULL, \"counselor_id\" bigint NOT NULL, CONSTRAINT \"PK_1ccd82a4359e6c99adc0297a571\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"bubbles\".\"id\" IS 'ID'; COMMENT ON COLUMN \"bubbles\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"bubbles\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"bubbles\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"bubbles\".\"question\" IS '질문'; COMMENT ON COLUMN \"bubbles\".\"response_option1\" IS '응답 옵션 1'; COMMENT ON COLUMN \"bubbles\".\"response_option2\" IS '응답 옵션 2'; COMMENT ON COLUMN \"bubbles\".\"counselor_id\" IS '상담사 ID'",
    );
    await queryRunner.query("COMMENT ON TABLE \"bubbles\" IS '상담사 인트로 버블'");
    await queryRunner.query("CREATE TYPE \"public\".\"episode_cut_scenes_speaker_enum\" AS ENUM('0', '1', '2')");
    await queryRunner.query(
      "CREATE TABLE \"episode_cut_scenes\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"speaker\" \"public\".\"episode_cut_scenes_speaker_enum\" NOT NULL, \"content\" character varying NOT NULL, \"order_index\" integer NOT NULL, \"image\" character varying NOT NULL, \"episode_id\" bigint NOT NULL, CONSTRAINT \"PK_e7cc8c7febd25b43630286d64a8\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"episode_cut_scenes\".\"id\" IS 'ID'; COMMENT ON COLUMN \"episode_cut_scenes\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"episode_cut_scenes\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"episode_cut_scenes\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"episode_cut_scenes\".\"speaker\" IS '화자'; COMMENT ON COLUMN \"episode_cut_scenes\".\"content\" IS '내용'; COMMENT ON COLUMN \"episode_cut_scenes\".\"order_index\" IS '순서 인덱스'; COMMENT ON COLUMN \"episode_cut_scenes\".\"image\" IS '이미지 URL'; COMMENT ON COLUMN \"episode_cut_scenes\".\"episode_id\" IS '에피소드 ID'",
    );
    await queryRunner.query("COMMENT ON TABLE \"episode_cut_scenes\" IS '에피소드 컷씬'");
    await queryRunner.query(
      "CREATE TABLE \"episodes\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"title\" character varying NOT NULL, \"required_rapport_threshold\" integer NOT NULL, \"is_temporary\" boolean NOT NULL, \"counselor_id\" bigint NOT NULL, CONSTRAINT \"PK_6a003fda8b0473fffc39cb831c7\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"episodes\".\"id\" IS 'ID'; COMMENT ON COLUMN \"episodes\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"episodes\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"episodes\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"episodes\".\"title\" IS '제목'; COMMENT ON COLUMN \"episodes\".\"required_rapport_threshold\" IS '필요한 래포트 임계값'; COMMENT ON COLUMN \"episodes\".\"is_temporary\" IS '임시 여부'; COMMENT ON COLUMN \"episodes\".\"counselor_id\" IS '상담사 ID'",
    );
    await queryRunner.query("COMMENT ON TABLE \"episodes\" IS '에피소드'");
    await queryRunner.query(
      "CREATE TABLE \"persona_prompts\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"body\" text NOT NULL, \"counselor_id\" bigint NOT NULL, \"prompt_version_id\" bigint NOT NULL, CONSTRAINT \"PK_3e76160f0f7e4bf10b4e7791118\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"persona_prompts\".\"id\" IS 'ID'; COMMENT ON COLUMN \"persona_prompts\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"persona_prompts\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"persona_prompts\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"persona_prompts\".\"body\" IS '본문'",
    );
    await queryRunner.query("COMMENT ON TABLE \"persona_prompts\" IS '페르소나 프롬프트'");
    await queryRunner.query(
      "CREATE TABLE \"prompt_activate_history\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"prompt_version_id\" bigint NOT NULL, \"activated_at\" TIMESTAMP NOT NULL, CONSTRAINT \"PK_1c9e755fe459e80f644ff1ae93e\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"prompt_activate_history\".\"id\" IS 'ID'; COMMENT ON COLUMN \"prompt_activate_history\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"prompt_activate_history\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"prompt_activate_history\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"prompt_activate_history\".\"prompt_version_id\" IS '프롬프트 버전 ID'; COMMENT ON COLUMN \"prompt_activate_history\".\"activated_at\" IS '활성화 시간(한국시간)'",
    );
    await queryRunner.query("COMMENT ON TABLE \"prompt_activate_history\" IS '프롬프트 활성화 이력'");
    await queryRunner.query(
      "CREATE TABLE \"tone_prompts\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"body\" text NOT NULL, \"tone_id\" bigint NOT NULL, \"prompt_version_id\" bigint NOT NULL, CONSTRAINT \"PK_061d06abb0e2ddfb7acf91dd856\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"tone_prompts\".\"id\" IS 'ID'; COMMENT ON COLUMN \"tone_prompts\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"tone_prompts\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"tone_prompts\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"tone_prompts\".\"body\" IS '본문'",
    );
    await queryRunner.query("COMMENT ON TABLE \"tone_prompts\" IS '톤 프롬프트'");
    await queryRunner.query(
      "CREATE TYPE \"public\".\"prompt_versions_ai_model_enum\" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9')",
    );
    await queryRunner.query(
      "CREATE TABLE \"prompt_versions\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"name\" character varying NOT NULL, \"description\" text NOT NULL, \"is_active\" boolean NOT NULL DEFAULT false, \"is_temporary\" boolean NOT NULL DEFAULT true, \"is_bookmarked\" boolean NOT NULL DEFAULT false, \"ai_model\" \"public\".\"prompt_versions_ai_model_enum\" NOT NULL DEFAULT '4', CONSTRAINT \"PK_5411972c2e9c63bd40530b80545\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"prompt_versions\".\"id\" IS 'ID'; COMMENT ON COLUMN \"prompt_versions\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"prompt_versions\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"prompt_versions\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"prompt_versions\".\"name\" IS '프롬프트 버전 이름'; COMMENT ON COLUMN \"prompt_versions\".\"description\" IS '프롬프트 버전 설명'; COMMENT ON COLUMN \"prompt_versions\".\"is_active\" IS '활성 상태'; COMMENT ON COLUMN \"prompt_versions\".\"is_temporary\" IS '임시 상태'; COMMENT ON COLUMN \"prompt_versions\".\"is_bookmarked\" IS '북마크 상태'; COMMENT ON COLUMN \"prompt_versions\".\"ai_model\" IS 'AI 모델'",
    );
    await queryRunner.query("COMMENT ON TABLE \"prompt_versions\" IS '프롬프트 버전'");
    await queryRunner.query(
      "CREATE TABLE \"counsel_technique_transition_rules\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"prompt_version_id\" bigint NOT NULL, \"from_counsel_technique_id\" bigint NOT NULL, \"to_counsel_technique_id\" bigint NOT NULL, \"priority\" integer NOT NULL DEFAULT '0', \"min_not_compressed_message_count\" integer, \"max_not_compressed_message_count\" integer, \"min_current_technique_message_count\" integer, \"max_current_technique_message_count\" integer, \"required_impact_domains\" text, \"required_timeframes\" text, \"required_emotion_primaries\" text, \"required_valences\" text, \"required_arousal_levels\" text, \"min_emotion_intensity\" integer, \"max_emotion_intensity\" integer, \"required_perceived_controls\" text, \"required_motivation_stages\" text, \"min_self_efficacy\" integer, \"max_self_efficacy\" integer, \"required_social_support_levels\" text, \"required_risk_kinds\" text, \"min_risk_severity\" integer, \"max_risk_severity\" integer, \"required_sleep_qualities\" text, \"required_physical_symptoms_present\" boolean, \"required_cognitive_loads\" text, \"required_alliance_strengths\" text, \"required_consent_to_depth\" boolean, CONSTRAINT \"PK_189f8c730c8873f6f0babc93a86\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"id\" IS 'ID'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"priority\" IS '전이 우선순위 (숫자가 높을수록 우선)'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"min_not_compressed_message_count\" IS '최소 압축되지 않은 메시지 수'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"max_not_compressed_message_count\" IS '최대 압축되지 않은 메시지 수'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"min_current_technique_message_count\" IS '최소 현 기법 메시지 수'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"max_current_technique_message_count\" IS '최대 현 기법 메시지 수'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_impact_domains\" IS '필수 삶의 영역'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_timeframes\" IS '필수 문제 체감 최근성'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_emotion_primaries\" IS '필수 주요 감정'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_valences\" IS '필수 정서 쾌·불쾌'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_arousal_levels\" IS '필수 각성 수준'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"min_emotion_intensity\" IS '최소 감정 강도'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"max_emotion_intensity\" IS '최대 감정 강도'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_perceived_controls\" IS '필수 상황 통제감'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_motivation_stages\" IS '필수 변화 단계'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"min_self_efficacy\" IS '최소 자기효능감'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"max_self_efficacy\" IS '최대 자기효능감'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_social_support_levels\" IS '필수 사회적 지지'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_risk_kinds\" IS '필수 위험 분류'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"min_risk_severity\" IS '최소 위험 심각도'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"max_risk_severity\" IS '최대 위험 심각도'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_sleep_qualities\" IS '필수 수면 질'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_physical_symptoms_present\" IS '필수 신체 증상 유무'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_cognitive_loads\" IS '필수 인지 부하'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_alliance_strengths\" IS '필수 라포·동맹'; COMMENT ON COLUMN \"counsel_technique_transition_rules\".\"required_consent_to_depth\" IS '필수 심층 동의'",
    );
    await queryRunner.query(
      "COMMENT ON TABLE \"counsel_technique_transition_rules\" IS '상담 기법 전이 규칙 (기법의 전이 함수)'",
    );
    await queryRunner.query(
      "CREATE TABLE \"counsel_techniques\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"name\" character varying NOT NULL, \"temperature\" double precision NOT NULL DEFAULT '0.5', \"tone_id\" bigint NOT NULL, \"context\" text NOT NULL, \"instruction\" text NOT NULL, \"message_threshold\" integer NOT NULL, \"is_start_technique\" boolean NOT NULL, \"prompt_version_id\" bigint NOT NULL, CONSTRAINT \"PK_d9cbf453eade79777d6e591306d\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"counsel_techniques\".\"id\" IS 'ID'; COMMENT ON COLUMN \"counsel_techniques\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"counsel_techniques\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"counsel_techniques\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"counsel_techniques\".\"name\" IS '이름'; COMMENT ON COLUMN \"counsel_techniques\".\"temperature\" IS '온도'; COMMENT ON COLUMN \"counsel_techniques\".\"tone_id\" IS '톤 ID'; COMMENT ON COLUMN \"counsel_techniques\".\"context\" IS '컨텍스트'; COMMENT ON COLUMN \"counsel_techniques\".\"instruction\" IS '지시사항'; COMMENT ON COLUMN \"counsel_techniques\".\"message_threshold\" IS '전환에 필요한 메시지 수'; COMMENT ON COLUMN \"counsel_techniques\".\"is_start_technique\" IS '시작 기법 여부 (톤 별 1개만 시작 기법으로 설정 가능)'",
    );
    await queryRunner.query("COMMENT ON TABLE \"counsel_techniques\" IS '상담 기법 (톤 + 컨텍스트 + 지시사항)'");
    await queryRunner.query(
      "CREATE TABLE \"tones\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"name\" character varying NOT NULL, \"description\" character varying NOT NULL, CONSTRAINT \"PK_b142b2749cc5010dc9e6fd4a270\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"tones\".\"id\" IS 'ID'; COMMENT ON COLUMN \"tones\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"tones\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"tones\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"tones\".\"name\" IS '이름'; COMMENT ON COLUMN \"tones\".\"description\" IS '설명'",
    );
    await queryRunner.query("COMMENT ON TABLE \"tones\" IS '톤'");
    await queryRunner.query(
      "CREATE TABLE \"counselor_user_relationships\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"counselor_id\" bigint NOT NULL, \"user_id\" bigint NOT NULL, \"rapport\" integer NOT NULL, CONSTRAINT \"PK_4b681e4545e08e6e158fac0d3a6\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"counselor_user_relationships\".\"id\" IS 'ID'; COMMENT ON COLUMN \"counselor_user_relationships\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"counselor_user_relationships\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"counselor_user_relationships\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"counselor_user_relationships\".\"rapport\" IS '상담사와의 관계 정도'",
    );
    await queryRunner.query(
      "COMMENT ON TABLE \"counselor_user_relationships\" IS '유저별로 개인화된 개별 상담사와의 관계'",
    );
    await queryRunner.query("CREATE TYPE \"public\".\"counselors_gender_enum\" AS ENUM('0', '1', '2', '3')");
    await queryRunner.query(
      "CREATE TABLE \"counselors\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"name\" character varying NOT NULL, \"gender\" \"public\".\"counselors_gender_enum\" NOT NULL, \"description\" character varying NOT NULL, \"profile_image\" character varying NOT NULL DEFAULT '', \"tone_id\" bigint NOT NULL, CONSTRAINT \"PK_da5b8b6f1925afaf58186f3c8ae\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"counselors\".\"id\" IS 'ID'; COMMENT ON COLUMN \"counselors\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"counselors\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"counselors\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"counselors\".\"name\" IS '상담사 이름'; COMMENT ON COLUMN \"counselors\".\"gender\" IS '성별'; COMMENT ON COLUMN \"counselors\".\"description\" IS '상담사 소개'; COMMENT ON COLUMN \"counselors\".\"profile_image\" IS '상담사 프로필 이미지'; COMMENT ON COLUMN \"counselors\".\"tone_id\" IS '톤 ID'",
    );
    await queryRunner.query(
      "CREATE TABLE \"counsel_contexts\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"not_compressed_message_count\" integer NOT NULL DEFAULT '0', \"last_message_compressed_at\" TIMESTAMP, \"current_technique_message_count\" integer NOT NULL DEFAULT '0', \"impact_domain\" integer, \"timeframe\" integer, \"emotion_primary\" integer, \"valence\" integer, \"arousal\" integer, \"emotion_intensity\" integer, \"perceived_control\" integer, \"motivation_stage\" integer, \"self_efficacy\" integer, \"social_support\" integer, \"risk_kind\" integer, \"risk_severity\" integer, \"sleep_quality\" integer, \"physical_symptoms_present\" boolean, \"cognitive_load\" integer, \"alliance_strength\" integer, \"consent_to_depth\" boolean, \"counsel_id\" bigint NOT NULL, CONSTRAINT \"REL_9738f80e8ad5354b781633b7db\" UNIQUE (\"counsel_id\"), CONSTRAINT \"PK_70a61fd5bfa2036b4db91e2fdd5\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"counsel_contexts\".\"id\" IS 'ID'; COMMENT ON COLUMN \"counsel_contexts\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"counsel_contexts\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"counsel_contexts\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"counsel_contexts\".\"not_compressed_message_count\" IS '압축되지 않은 메시지 수'; COMMENT ON COLUMN \"counsel_contexts\".\"last_message_compressed_at\" IS '마지막 메시지 압축일시'; COMMENT ON COLUMN \"counsel_contexts\".\"current_technique_message_count\" IS '현 기법에서 누적 메시지 수(>=0)'; COMMENT ON COLUMN \"counsel_contexts\".\"impact_domain\" IS '삶의 영역'; COMMENT ON COLUMN \"counsel_contexts\".\"timeframe\" IS '문제 체감 최근성'; COMMENT ON COLUMN \"counsel_contexts\".\"emotion_primary\" IS '주요 감정'; COMMENT ON COLUMN \"counsel_contexts\".\"valence\" IS '정서 쾌·불쾌'; COMMENT ON COLUMN \"counsel_contexts\".\"arousal\" IS '각성 수준'; COMMENT ON COLUMN \"counsel_contexts\".\"emotion_intensity\" IS '감정 강도(0~10)'; COMMENT ON COLUMN \"counsel_contexts\".\"perceived_control\" IS '상황 통제감'; COMMENT ON COLUMN \"counsel_contexts\".\"motivation_stage\" IS '변화 단계'; COMMENT ON COLUMN \"counsel_contexts\".\"self_efficacy\" IS '자기효능감(0~10)'; COMMENT ON COLUMN \"counsel_contexts\".\"social_support\" IS '사회적 지지'; COMMENT ON COLUMN \"counsel_contexts\".\"risk_kind\" IS '위험 분류'; COMMENT ON COLUMN \"counsel_contexts\".\"risk_severity\" IS '위험 심각도(0~3)'; COMMENT ON COLUMN \"counsel_contexts\".\"sleep_quality\" IS '수면 질'; COMMENT ON COLUMN \"counsel_contexts\".\"physical_symptoms_present\" IS '신체 증상 유무'; COMMENT ON COLUMN \"counsel_contexts\".\"cognitive_load\" IS '인지 부하'; COMMENT ON COLUMN \"counsel_contexts\".\"alliance_strength\" IS '라포·동맹'; COMMENT ON COLUMN \"counsel_contexts\".\"consent_to_depth\" IS '심층 동의'",
    );
    await queryRunner.query("COMMENT ON TABLE \"counsel_contexts\" IS '상담 컨텍스트'");
    await queryRunner.query("CREATE TYPE \"public\".\"counsel_messages_reaction_enum\" AS ENUM('0', '1', '2')");
    await queryRunner.query(
      "CREATE TABLE \"counsel_messages\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"counsel_id\" bigint NOT NULL, \"user_id\" bigint NOT NULL, \"counsel_technique_id\" bigint NOT NULL, \"message\" character varying NOT NULL, \"is_user_message\" boolean NOT NULL DEFAULT true, \"reacted_at\" TIMESTAMP, \"reaction\" \"public\".\"counsel_messages_reaction_enum\", CONSTRAINT \"PK_6b3cabfb081f9af5a80f217c759\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"counsel_messages\".\"id\" IS 'ID'; COMMENT ON COLUMN \"counsel_messages\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"counsel_messages\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"counsel_messages\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"counsel_messages\".\"counsel_id\" IS '상담 ID'; COMMENT ON COLUMN \"counsel_messages\".\"user_id\" IS '사용자 ID'; COMMENT ON COLUMN \"counsel_messages\".\"counsel_technique_id\" IS '상담기법 ID'; COMMENT ON COLUMN \"counsel_messages\".\"message\" IS '메시지 내용'; COMMENT ON COLUMN \"counsel_messages\".\"is_user_message\" IS '사용자의 메시지인지 여부'; COMMENT ON COLUMN \"counsel_messages\".\"reacted_at\" IS '좋아요/싫어요 누른 일시 (한국시간)'; COMMENT ON COLUMN \"counsel_messages\".\"reaction\" IS '좋아요/싫어요 여부'",
    );
    await queryRunner.query(
      "CREATE TABLE \"counsels\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"last_chated_at\" TIMESTAMP, \"last_message\" character varying, \"message_count\" integer NOT NULL DEFAULT '0', \"user_id\" bigint NOT NULL, \"counselor_id\" bigint NOT NULL, \"prompt_version_id\" bigint NOT NULL, \"counsel_technique_id\" bigint NOT NULL, \"counselor_user_relationship_id\" bigint NOT NULL, CONSTRAINT \"PK_8184f48bf253770d9aee0ff0f74\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"counsels\".\"id\" IS 'ID'; COMMENT ON COLUMN \"counsels\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"counsels\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"counsels\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"counsels\".\"last_chated_at\" IS '마지막 채팅일시 (한국시간)'; COMMENT ON COLUMN \"counsels\".\"last_message\" IS '마지막 메시지'; COMMENT ON COLUMN \"counsels\".\"message_count\" IS '메시지 수'; COMMENT ON COLUMN \"counsels\".\"user_id\" IS '사용자 ID'; COMMENT ON COLUMN \"counsels\".\"counselor_id\" IS '상담사 ID'; COMMENT ON COLUMN \"counsels\".\"prompt_version_id\" IS '프롬프트 버전 ID'; COMMENT ON COLUMN \"counsels\".\"counsel_technique_id\" IS '상담 기법 ID'",
    );
    await queryRunner.query("COMMENT ON TABLE \"counsels\" IS '상담'");
    await queryRunner.query(
      "CREATE TABLE \"kakao\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"unique_id\" character varying NOT NULL, \"auth_user_id\" bigint NOT NULL, CONSTRAINT \"REL_d0c9985402229e8fb78e6956b5\" UNIQUE (\"auth_user_id\"), CONSTRAINT \"PK_59869ad1450c868fec0d635982d\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"kakao\".\"id\" IS 'ID'; COMMENT ON COLUMN \"kakao\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"kakao\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"kakao\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"kakao\".\"unique_id\" IS '고유 아이디'",
    );
    await queryRunner.query("COMMENT ON TABLE \"kakao\" IS 'Kakao 정보 테이블'");
    await queryRunner.query(
      "CREATE TABLE \"refresh_tokens\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"token\" character varying NOT NULL, \"expiresAt\" TIMESTAMP NOT NULL, \"auth_user_id\" bigint NOT NULL, \"authUserId\" bigint, CONSTRAINT \"PK_7d8bee0204106019488c4c50ffa\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"refresh_tokens\".\"id\" IS 'ID'; COMMENT ON COLUMN \"refresh_tokens\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"refresh_tokens\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"refresh_tokens\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"refresh_tokens\".\"token\" IS '리프레시 토큰'; COMMENT ON COLUMN \"refresh_tokens\".\"expiresAt\" IS '토큰 만료 시간'; COMMENT ON COLUMN \"refresh_tokens\".\"auth_user_id\" IS '사용자 ID'; COMMENT ON COLUMN \"refresh_tokens\".\"authUserId\" IS 'ID'",
    );
    await queryRunner.query("COMMENT ON TABLE \"refresh_tokens\" IS '리프레시 토큰 테이블'");
    await queryRunner.query("CREATE TYPE \"public\".\"auth_users_auth_channel_enum\" AS ENUM('0', '1', '2', '3')");
    await queryRunner.query("CREATE TYPE \"public\".\"auth_users_authority_enum\" AS ENUM('0', '1', '2')");
    await queryRunner.query("CREATE TYPE \"public\".\"auth_users_status_enum\" AS ENUM('ACTIVE', 'INACTIVE')");
    await queryRunner.query(
      "CREATE TABLE \"auth_users\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"user_id\" bigint, \"last_login_at\" TIMESTAMP NOT NULL, \"auth_channel\" \"public\".\"auth_users_auth_channel_enum\" NOT NULL DEFAULT '1', \"authority\" \"public\".\"auth_users_authority_enum\" NOT NULL DEFAULT '1', \"status\" \"public\".\"auth_users_status_enum\" NOT NULL DEFAULT 'ACTIVE', CONSTRAINT \"REL_a83a2c4135cbbed32dd980fad9\" UNIQUE (\"user_id\"), CONSTRAINT \"PK_c88cc8077366b470dafc2917366\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"auth_users\".\"id\" IS 'ID'; COMMENT ON COLUMN \"auth_users\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"auth_users\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"auth_users\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"auth_users\".\"user_id\" IS '사용자 ID (외래 키)'; COMMENT ON COLUMN \"auth_users\".\"last_login_at\" IS '마지막 로그인 시간'; COMMENT ON COLUMN \"auth_users\".\"auth_channel\" IS '인증 채널'; COMMENT ON COLUMN \"auth_users\".\"authority\" IS '권한'; COMMENT ON COLUMN \"auth_users\".\"status\" IS '상태'",
    );
    await queryRunner.query("COMMENT ON TABLE \"auth_users\" IS '사용자 인증 정보 테이블'");
    await queryRunner.query(
      "CREATE TYPE \"public\".\"user_activities_activity_type_enum\" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"user_activities_platform_enum\" AS ENUM('0', '1', '2', '3', '4')",
    );
    await queryRunner.query(
      "CREATE TABLE \"user_activities\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"user_id\" bigint NOT NULL, \"activity_type\" \"public\".\"user_activities_activity_type_enum\" NOT NULL, \"activity_data\" jsonb, \"platform\" \"public\".\"user_activities_platform_enum\" NOT NULL, \"ip_address\" character varying, \"user_agent\" character varying, \"duration_seconds\" integer, CONSTRAINT \"PK_1245d4d2cf04ba7743f2924d951\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"user_activities\".\"id\" IS 'ID'; COMMENT ON COLUMN \"user_activities\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"user_activities\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"user_activities\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"user_activities\".\"activity_type\" IS '활동 유형'; COMMENT ON COLUMN \"user_activities\".\"activity_data\" IS '활동 관련 상세 데이터'; COMMENT ON COLUMN \"user_activities\".\"platform\" IS '접속 플랫폼'; COMMENT ON COLUMN \"user_activities\".\"ip_address\" IS 'IP 주소'; COMMENT ON COLUMN \"user_activities\".\"user_agent\" IS 'User Agent'; COMMENT ON COLUMN \"user_activities\".\"duration_seconds\" IS '활동 지속 시간(초)'",
    );
    await queryRunner.query(
      "CREATE INDEX \"IDX_bd789c573f3fd7da3b22f724fd\" ON \"user_activities\" (\"user_id\", \"created_at\") ",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"user_message_tokens_reset_interval_enum\" AS ENUM('DAILY', 'HOURLY', 'SIX_HOURS')",
    );
    await queryRunner.query(
      "CREATE TABLE \"user_message_tokens\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"max_tokens\" integer NOT NULL, \"remaining_tokens\" integer NOT NULL, \"reserved\" boolean NOT NULL, \"reserved_timeout\" TIMESTAMP, \"reset_interval\" \"public\".\"user_message_tokens_reset_interval_enum\" NOT NULL, \"last_reset\" TIMESTAMP NOT NULL, \"user_id\" bigint NOT NULL, CONSTRAINT \"REL_f48ddb1d1026088899ef12f738\" UNIQUE (\"user_id\"), CONSTRAINT \"PK_5d4970249e444434e7c4776081d\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"user_message_tokens\".\"id\" IS 'ID'; COMMENT ON COLUMN \"user_message_tokens\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"user_message_tokens\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"user_message_tokens\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"user_message_tokens\".\"max_tokens\" IS '최대 토큰 수 (예: 하루 할당량)'; COMMENT ON COLUMN \"user_message_tokens\".\"remaining_tokens\" IS '현재 잔여 토큰 수'; COMMENT ON COLUMN \"user_message_tokens\".\"reserved\" IS '논리적 락 칼럼'; COMMENT ON COLUMN \"user_message_tokens\".\"reserved_timeout\" IS '논리적 락 타임아웃'; COMMENT ON COLUMN \"user_message_tokens\".\"reset_interval\" IS '토큰 리셋 주기'; COMMENT ON COLUMN \"user_message_tokens\".\"last_reset\" IS '마지막 리셋 시각'; COMMENT ON COLUMN \"user_message_tokens\".\"user_id\" IS '사용자 ID'",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"user_profiles_mbti_enum\" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16')",
    );
    await queryRunner.query("CREATE TYPE \"public\".\"user_profiles_gender_enum\" AS ENUM('0', '1', '2')");
    await queryRunner.query(
      "CREATE TABLE \"user_profiles\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"profile_image\" character varying NOT NULL, \"phone_number\" character varying NOT NULL, \"mbti\" \"public\".\"user_profiles_mbti_enum\", \"gender\" \"public\".\"user_profiles_gender_enum\" NOT NULL, \"birthday\" TIMESTAMP, \"introduction\" character varying(500), \"user_id\" bigint NOT NULL, CONSTRAINT \"REL_6ca9503d77ae39b4b5a6cc3ba8\" UNIQUE (\"user_id\"), CONSTRAINT \"PK_1ec6662219f4605723f1e41b6cb\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"user_profiles\".\"id\" IS 'ID'; COMMENT ON COLUMN \"user_profiles\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"user_profiles\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"user_profiles\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"user_profiles\".\"profile_image\" IS '프로필 이미지'; COMMENT ON COLUMN \"user_profiles\".\"phone_number\" IS '전화번호'; COMMENT ON COLUMN \"user_profiles\".\"mbti\" IS 'MBTI'; COMMENT ON COLUMN \"user_profiles\".\"gender\" IS '성별'; COMMENT ON COLUMN \"user_profiles\".\"birthday\" IS '생년월일'; COMMENT ON COLUMN \"user_profiles\".\"introduction\" IS '자기소개'; COMMENT ON COLUMN \"user_profiles\".\"user_id\" IS '사용자 ID'",
    );
    await queryRunner.query("CREATE TYPE \"public\".\"users_status_enum\" AS ENUM('ACTIVE', 'INACTIVE')");
    await queryRunner.query(
      "CREATE TABLE \"users\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"nickname\" character varying NOT NULL, \"status\" \"public\".\"users_status_enum\" NOT NULL DEFAULT 'ACTIVE', CONSTRAINT \"PK_a3ffb1c0c8416b9fc6f907b7433\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"users\".\"id\" IS 'ID'; COMMENT ON COLUMN \"users\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"users\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"users\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"users\".\"nickname\" IS '닉네임'; COMMENT ON COLUMN \"users\".\"status\" IS '상태'",
    );
    await queryRunner.query(
      "CREATE TABLE \"compressed_messages\" (\"id\" bigint NOT NULL, \"created_at\" TIMESTAMP NOT NULL, \"updated_at\" TIMESTAMP NOT NULL, \"deleted_at\" TIMESTAMP, \"counsel_id\" bigint NOT NULL, \"content\" text NOT NULL, \"message_count_at_compression\" integer NOT NULL, CONSTRAINT \"PK_ad441762a6488fcad5b9f96ef9d\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"compressed_messages\".\"id\" IS 'ID'; COMMENT ON COLUMN \"compressed_messages\".\"created_at\" IS '생성일시 (한국시간)'; COMMENT ON COLUMN \"compressed_messages\".\"updated_at\" IS '마지막 수정일시 (한국시간)'; COMMENT ON COLUMN \"compressed_messages\".\"deleted_at\" IS '삭제일시 (한국시간)'; COMMENT ON COLUMN \"compressed_messages\".\"counsel_id\" IS '상담 ID'; COMMENT ON COLUMN \"compressed_messages\".\"content\" IS '압축된 컨텐츠'; COMMENT ON COLUMN \"compressed_messages\".\"message_count_at_compression\" IS '압축 시 메시지 수'",
    );
    await queryRunner.query("COMMENT ON TABLE \"compressed_messages\" IS '압축된 메시지'");
    await queryRunner.query(
      "ALTER TABLE \"bubbles\" ADD CONSTRAINT \"FK_141932ed474b3f4baea7f534bb6\" FOREIGN KEY (\"counselor_id\") REFERENCES \"counselors\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE \"episode_cut_scenes\" ADD CONSTRAINT \"FK_c097458a6d071c980a18674298d\" FOREIGN KEY (\"episode_id\") REFERENCES \"episodes\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE \"episodes\" ADD CONSTRAINT \"FK_c9d4b94651ec2c9781db9424192\" FOREIGN KEY (\"counselor_id\") REFERENCES \"counselors\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE \"persona_prompts\" ADD CONSTRAINT \"FK_b48d69219e2ca6d10ef1c5dd0e7\" FOREIGN KEY (\"counselor_id\") REFERENCES \"counselors\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"persona_prompts\" ADD CONSTRAINT \"FK_40cb8a2190ab60ce76976434890\" FOREIGN KEY (\"prompt_version_id\") REFERENCES \"prompt_versions\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"prompt_activate_history\" ADD CONSTRAINT \"FK_cde01419438bb5e79542b80dd1b\" FOREIGN KEY (\"prompt_version_id\") REFERENCES \"prompt_versions\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"tone_prompts\" ADD CONSTRAINT \"FK_9c0822929a6a8f50fb51192813d\" FOREIGN KEY (\"tone_id\") REFERENCES \"tones\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"tone_prompts\" ADD CONSTRAINT \"FK_0bee6ac41932a4bdf3340802ba9\" FOREIGN KEY (\"prompt_version_id\") REFERENCES \"prompt_versions\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsel_technique_transition_rules\" ADD CONSTRAINT \"FK_3d6a086a038a69f75342533dc6f\" FOREIGN KEY (\"prompt_version_id\") REFERENCES \"prompt_versions\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsel_technique_transition_rules\" ADD CONSTRAINT \"FK_c56ef1c15eff2f3a6b55f10145b\" FOREIGN KEY (\"from_counsel_technique_id\") REFERENCES \"counsel_techniques\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsel_technique_transition_rules\" ADD CONSTRAINT \"FK_355b7bd386d61caf8f07a2e7e3e\" FOREIGN KEY (\"to_counsel_technique_id\") REFERENCES \"counsel_techniques\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsel_techniques\" ADD CONSTRAINT \"FK_730e152decf269a78de7ef09933\" FOREIGN KEY (\"tone_id\") REFERENCES \"tones\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsel_techniques\" ADD CONSTRAINT \"FK_46a3274e030020aba91b9e121a4\" FOREIGN KEY (\"prompt_version_id\") REFERENCES \"prompt_versions\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"counselor_user_relationships\" ADD CONSTRAINT \"FK_93d944e605e3f9bc0225908277c\" FOREIGN KEY (\"counselor_id\") REFERENCES \"counselors\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE \"counselor_user_relationships\" ADD CONSTRAINT \"FK_50d04619d10c5c987be6c186c6c\" FOREIGN KEY (\"user_id\") REFERENCES \"users\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE \"counselors\" ADD CONSTRAINT \"FK_44941e8112ffec642b746efdaae\" FOREIGN KEY (\"tone_id\") REFERENCES \"tones\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsel_contexts\" ADD CONSTRAINT \"FK_9738f80e8ad5354b781633b7db8\" FOREIGN KEY (\"counsel_id\") REFERENCES \"counsels\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsel_messages\" ADD CONSTRAINT \"FK_b25f998c2047d6f03669ffcaeef\" FOREIGN KEY (\"counsel_id\") REFERENCES \"counsels\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsels\" ADD CONSTRAINT \"FK_c1036be35816efce30404e614bf\" FOREIGN KEY (\"user_id\") REFERENCES \"users\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsels\" ADD CONSTRAINT \"FK_500f964b03039a4300b3121b624\" FOREIGN KEY (\"counselor_id\") REFERENCES \"counselors\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsels\" ADD CONSTRAINT \"FK_afe498a9fe79ff870e81747fb14\" FOREIGN KEY (\"prompt_version_id\") REFERENCES \"prompt_versions\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsels\" ADD CONSTRAINT \"FK_9306474178b0a490dc065445732\" FOREIGN KEY (\"counsel_technique_id\") REFERENCES \"counsel_techniques\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"kakao\" ADD CONSTRAINT \"FK_d0c9985402229e8fb78e6956b5a\" FOREIGN KEY (\"auth_user_id\") REFERENCES \"auth_users\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE \"refresh_tokens\" ADD CONSTRAINT \"FK_08c34287e68e3edfee682173bbb\" FOREIGN KEY (\"authUserId\") REFERENCES \"auth_users\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"auth_users\" ADD CONSTRAINT \"FK_a83a2c4135cbbed32dd980fad90\" FOREIGN KEY (\"user_id\") REFERENCES \"users\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"user_activities\" ADD CONSTRAINT \"FK_a283f37e08edf5e37d38b375eec\" FOREIGN KEY (\"user_id\") REFERENCES \"users\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE \"user_message_tokens\" ADD CONSTRAINT \"FK_f48ddb1d1026088899ef12f738d\" FOREIGN KEY (\"user_id\") REFERENCES \"users\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE \"user_profiles\" ADD CONSTRAINT \"FK_6ca9503d77ae39b4b5a6cc3ba88\" FOREIGN KEY (\"user_id\") REFERENCES \"users\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"');
    await queryRunner.query('ALTER TABLE "user_message_tokens" DROP CONSTRAINT "FK_f48ddb1d1026088899ef12f738d"');
    await queryRunner.query('ALTER TABLE "user_activities" DROP CONSTRAINT "FK_a283f37e08edf5e37d38b375eec"');
    await queryRunner.query('ALTER TABLE "auth_users" DROP CONSTRAINT "FK_a83a2c4135cbbed32dd980fad90"');
    await queryRunner.query('ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_08c34287e68e3edfee682173bbb"');
    await queryRunner.query('ALTER TABLE "kakao" DROP CONSTRAINT "FK_d0c9985402229e8fb78e6956b5a"');
    await queryRunner.query('ALTER TABLE "counsels" DROP CONSTRAINT "FK_9306474178b0a490dc065445732"');
    await queryRunner.query('ALTER TABLE "counsels" DROP CONSTRAINT "FK_afe498a9fe79ff870e81747fb14"');
    await queryRunner.query('ALTER TABLE "counsels" DROP CONSTRAINT "FK_500f964b03039a4300b3121b624"');
    await queryRunner.query('ALTER TABLE "counsels" DROP CONSTRAINT "FK_c1036be35816efce30404e614bf"');
    await queryRunner.query('ALTER TABLE "counsel_messages" DROP CONSTRAINT "FK_b25f998c2047d6f03669ffcaeef"');
    await queryRunner.query('ALTER TABLE "counsel_contexts" DROP CONSTRAINT "FK_9738f80e8ad5354b781633b7db8"');
    await queryRunner.query('ALTER TABLE "counselors" DROP CONSTRAINT "FK_44941e8112ffec642b746efdaae"');
    await queryRunner.query(
      "ALTER TABLE \"counselor_user_relationships\" DROP CONSTRAINT \"FK_50d04619d10c5c987be6c186c6c\"",
    );
    await queryRunner.query(
      "ALTER TABLE \"counselor_user_relationships\" DROP CONSTRAINT \"FK_93d944e605e3f9bc0225908277c\"",
    );
    await queryRunner.query('ALTER TABLE "counsel_techniques" DROP CONSTRAINT "FK_46a3274e030020aba91b9e121a4"');
    await queryRunner.query('ALTER TABLE "counsel_techniques" DROP CONSTRAINT "FK_730e152decf269a78de7ef09933"');
    await queryRunner.query(
      "ALTER TABLE \"counsel_technique_transition_rules\" DROP CONSTRAINT \"FK_355b7bd386d61caf8f07a2e7e3e\"",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsel_technique_transition_rules\" DROP CONSTRAINT \"FK_c56ef1c15eff2f3a6b55f10145b\"",
    );
    await queryRunner.query(
      "ALTER TABLE \"counsel_technique_transition_rules\" DROP CONSTRAINT \"FK_3d6a086a038a69f75342533dc6f\"",
    );
    await queryRunner.query('ALTER TABLE "tone_prompts" DROP CONSTRAINT "FK_0bee6ac41932a4bdf3340802ba9"');
    await queryRunner.query('ALTER TABLE "tone_prompts" DROP CONSTRAINT "FK_9c0822929a6a8f50fb51192813d"');
    await queryRunner.query('ALTER TABLE "prompt_activate_history" DROP CONSTRAINT "FK_cde01419438bb5e79542b80dd1b"');
    await queryRunner.query('ALTER TABLE "persona_prompts" DROP CONSTRAINT "FK_40cb8a2190ab60ce76976434890"');
    await queryRunner.query('ALTER TABLE "persona_prompts" DROP CONSTRAINT "FK_b48d69219e2ca6d10ef1c5dd0e7"');
    await queryRunner.query('ALTER TABLE "episodes" DROP CONSTRAINT "FK_c9d4b94651ec2c9781db9424192"');
    await queryRunner.query('ALTER TABLE "episode_cut_scenes" DROP CONSTRAINT "FK_c097458a6d071c980a18674298d"');
    await queryRunner.query('ALTER TABLE "bubbles" DROP CONSTRAINT "FK_141932ed474b3f4baea7f534bb6"');
    await queryRunner.query('COMMENT ON TABLE "compressed_messages" IS NULL');
    await queryRunner.query('DROP TABLE "compressed_messages"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "public"."users_status_enum"');
    await queryRunner.query('DROP TABLE "user_profiles"');
    await queryRunner.query('DROP TYPE "public"."user_profiles_gender_enum"');
    await queryRunner.query('DROP TYPE "public"."user_profiles_mbti_enum"');
    await queryRunner.query('DROP TABLE "user_message_tokens"');
    await queryRunner.query('DROP TYPE "public"."user_message_tokens_reset_interval_enum"');
    await queryRunner.query('DROP INDEX "public"."IDX_bd789c573f3fd7da3b22f724fd"');
    await queryRunner.query('DROP TABLE "user_activities"');
    await queryRunner.query('DROP TYPE "public"."user_activities_platform_enum"');
    await queryRunner.query('DROP TYPE "public"."user_activities_activity_type_enum"');
    await queryRunner.query('COMMENT ON TABLE "auth_users" IS NULL');
    await queryRunner.query('DROP TABLE "auth_users"');
    await queryRunner.query('DROP TYPE "public"."auth_users_status_enum"');
    await queryRunner.query('DROP TYPE "public"."auth_users_authority_enum"');
    await queryRunner.query('DROP TYPE "public"."auth_users_auth_channel_enum"');
    await queryRunner.query('COMMENT ON TABLE "refresh_tokens" IS NULL');
    await queryRunner.query('DROP TABLE "refresh_tokens"');
    await queryRunner.query('COMMENT ON TABLE "kakao" IS NULL');
    await queryRunner.query('DROP TABLE "kakao"');
    await queryRunner.query('COMMENT ON TABLE "counsels" IS NULL');
    await queryRunner.query('DROP TABLE "counsels"');
    await queryRunner.query('DROP TABLE "counsel_messages"');
    await queryRunner.query('DROP TYPE "public"."counsel_messages_reaction_enum"');
    await queryRunner.query('COMMENT ON TABLE "counsel_contexts" IS NULL');
    await queryRunner.query('DROP TABLE "counsel_contexts"');
    await queryRunner.query('DROP TABLE "counselors"');
    await queryRunner.query('DROP TYPE "public"."counselors_gender_enum"');
    await queryRunner.query('COMMENT ON TABLE "counselor_user_relationships" IS NULL');
    await queryRunner.query('DROP TABLE "counselor_user_relationships"');
    await queryRunner.query('COMMENT ON TABLE "tones" IS NULL');
    await queryRunner.query('DROP TABLE "tones"');
    await queryRunner.query('COMMENT ON TABLE "counsel_techniques" IS NULL');
    await queryRunner.query('DROP TABLE "counsel_techniques"');
    await queryRunner.query('COMMENT ON TABLE "counsel_technique_transition_rules" IS NULL');
    await queryRunner.query('DROP TABLE "counsel_technique_transition_rules"');
    await queryRunner.query('COMMENT ON TABLE "prompt_versions" IS NULL');
    await queryRunner.query('DROP TABLE "prompt_versions"');
    await queryRunner.query('DROP TYPE "public"."prompt_versions_ai_model_enum"');
    await queryRunner.query('COMMENT ON TABLE "tone_prompts" IS NULL');
    await queryRunner.query('DROP TABLE "tone_prompts"');
    await queryRunner.query('COMMENT ON TABLE "prompt_activate_history" IS NULL');
    await queryRunner.query('DROP TABLE "prompt_activate_history"');
    await queryRunner.query('COMMENT ON TABLE "persona_prompts" IS NULL');
    await queryRunner.query('DROP TABLE "persona_prompts"');
    await queryRunner.query('COMMENT ON TABLE "episodes" IS NULL');
    await queryRunner.query('DROP TABLE "episodes"');
    await queryRunner.query('COMMENT ON TABLE "episode_cut_scenes" IS NULL');
    await queryRunner.query('DROP TABLE "episode_cut_scenes"');
    await queryRunner.query('DROP TYPE "public"."episode_cut_scenes_speaker_enum"');
    await queryRunner.query('COMMENT ON TABLE "bubbles" IS NULL');
    await queryRunner.query('DROP TABLE "bubbles"');
  }
}
