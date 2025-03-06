import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselPersister } from "~counselings/aggregates/counsels/applications/tools/counsel.persister";
import { CounselReader } from "~counselings/aggregates/counsels/applications/tools/counsel.reader";
import { Counsels, CounselsNewProps } from "~counselings/aggregates/counsels/domain/Counsels";

import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class CounselService {
  constructor(private readonly counselReader: CounselReader, private readonly counselPersistor: CounselPersister) {}

  async create(counselNewProps: CounselsNewProps): Promise<Counsels> {
    const counselOrError = Counsels.createNew(counselNewProps);
    if (counselOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselOrError.error as string);
    }
    const counsel = counselOrError.value;
    const createdCounsel = await this.counselPersistor.create(counsel);
    return createdCounsel;
  }

  async update(counsel: Counsels): Promise<Counsels> {
    const updatedCounsel = await this.counselPersistor.update(counsel);
    return updatedCounsel;
  }

  async findOne(counselId: UniqueEntityId): Promise<Counsels | null> {
    const counsel = await this.counselReader.findOne(counselId);
    return counsel;
  }

  async findAll(): Promise<Counsels[]> {
    const counsels = await this.counselReader.findAll();
    return counsels;
  }

  async findMany(props: { userId?: UniqueEntityId; counselorId?: UniqueEntityId }): Promise<Counsels[]> {
    const counsels = await this.counselReader.findMany(props);
    return counsels;
  }

  async getOne(counselId: UniqueEntityId): Promise<Counsels> {
    const counsel: Counsels | null = await this.findOne(counselId);
    if (!counsel) {
      throw new NotFoundException("Counsel not found");
    }
    return counsel;
  }

  async getAll(): Promise<Counsels[]> {
    const counsels = await this.findAll();
    if (counsels.length === 0) {
      throw new NotFoundException("Counsels not found");
    }
    return counsels;
  }

  async getMany(props: { userId?: UniqueEntityId }): Promise<Counsels[]> {
    const counsels = await this.findMany(props);
    if (counsels.length === 0) {
      throw new NotFoundException("Counsels not found");
    }
    return counsels;
  }
}
