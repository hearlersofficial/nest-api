import { CounselManagementsModule } from "~counselings/applications/counsel-managements/counsel-managements.module";
import { CounselPromptManagementsModule } from "~counselings/applications/counsel-prompt-managements/counsel-prompt-managements.module";
import { CounselorManagementsModule } from "~counselings/applications/counselor-managements/counselor-managements.module";
import { CounselingKafkaClientModule } from "~counselings/infrastructures/kafka/counseling-kafka-client.module";
import { GrpcCounselPromptCommandController } from "~counselings/presentations/grpc/command/counsel-prompts-command.controller";
import { GrpcCounselorCommandController } from "~counselings/presentations/grpc/command/counselors-command.controller";
import { GrpcCounselCommandController } from "~counselings/presentations/grpc/command/counsels-command.controller";
import { GrpcEpisodeCommandController } from "~counselings/presentations/grpc/command/episodes-command.controller";
import { GrpcCounselPromptQueryController } from "~counselings/presentations/grpc/query/counsel-prompts-query.controller";
import { GrpcCounselorQueryController } from "~counselings/presentations/grpc/query/counselors-query.controller";
import { GrpcCounselQueryController } from "~counselings/presentations/grpc/query/counsels-query.controller";
import { GrpcEpisodeQueryController } from "~counselings/presentations/grpc/query/episodes-query.controller";

import { Module } from "@nestjs/common";
import { ImageStorageConfig } from "~common/support/image-storage/image-storage.config";

@Module({
  imports: [
    CounselorManagementsModule,
    CounselPromptManagementsModule,
    CounselManagementsModule,
    CounselingKafkaClientModule,
  ],
  controllers: [
    GrpcCounselCommandController,
    GrpcCounselorCommandController,
    GrpcCounselPromptCommandController,
    GrpcCounselQueryController,
    GrpcCounselorQueryController,
    GrpcCounselPromptQueryController,
    GrpcEpisodeCommandController,
    GrpcEpisodeQueryController,
  ],
  providers: [
    ImageStorageConfig.register({
      prefix: "counselings",
    }),
  ],
})
export class CounselsServiceModule {}
