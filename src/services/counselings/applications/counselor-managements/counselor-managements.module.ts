import { CounselorManagementsFacade } from "~counselings/applications/counselor-managements/counselor-managements.facade";
import { CounselorsModule } from "~counselings/domains/counselors/counselors.module";
import { EpisodesModule } from "~counselings/domains/episodes/episodes.module";

import { Module } from "@nestjs/common";

@Module({
  imports: [EpisodesModule, CounselorsModule],
  providers: [CounselorManagementsFacade],
  exports: [CounselorManagementsFacade],
})
export class CounselorManagementsModule {}
