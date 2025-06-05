import { CounselsCriteriaFindMany } from "~counselings/domains/counsels/counsels.criteria";
import { CounselsPersister } from "~counselings/domains/counsels/counsels.persister";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";
import { CounselsNewProps } from "~counselings/domains/counsels/models/counsels";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselsService {
  constructor(
    private readonly counselsReader: CounselsReader,
    private readonly counselsPersister: CounselsPersister,
  ) {}

  @Transactional()
  async create(newProps: CounselsNewProps): Promise<CounselInfo> {
    const counsel = await this.counselsPersister.create(newProps);
    return CounselInfo.fromDomain(counsel);
  }

  async getOne(props: { counselId: UniqueEntityId }): Promise<CounselInfo> {
    const counsel = await this.counselsReader.findOne(props);
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    return CounselInfo.fromDomain(counsel);
  }

  async getMany(props: CounselsCriteriaFindMany): Promise<CounselInfo[]> {
    const counsels = await this.counselsReader.findMany(props);
    return counsels.map(CounselInfo.fromDomain);
  }

  @Transactional()
  async updateCounselTechniqueId(props: {
    counselId: UniqueEntityId;
    counselTechniqueId: UniqueEntityId;
  }): Promise<CounselInfo> {
    const { counselId, counselTechniqueId } = props;
    const counsel = await this.counselsReader.findOne({ counselId });
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }

    counsel.updateCounselTechniqueId(counselTechniqueId);

    const updatedCounsel = await this.counselsPersister.update(counsel);
    return CounselInfo.fromDomain(updatedCounsel);
  }

  @Transactional()
  async saveLastMessage(props: { counselId: UniqueEntityId; lastMessage: string }): Promise<CounselInfo> {
    const { counselId, lastMessage } = props;
    const counsel = await this.counselsReader.findOne({ counselId });
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    counsel.saveLastMessage(lastMessage);
    const updatedCounsel = await this.counselsPersister.update(counsel);
    return CounselInfo.fromDomain(updatedCounsel);
  }
}
