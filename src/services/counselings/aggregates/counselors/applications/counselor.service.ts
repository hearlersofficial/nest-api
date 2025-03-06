import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselorPersister } from "~counselings/aggregates/counselors/applications/tools/counselor.persister";
import { CounselorReader } from "~counselings/aggregates/counselors/applications/tools/counselor.reader";
import { Counselors, CounselorsNewProps } from "~counselings/aggregates/counselors/domain/counselors";

import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class CounselorService {
  constructor(
    private readonly counselorReader: CounselorReader,
    private readonly counselorPersister: CounselorPersister,
  ) {}

  async create(counselorNewProps: CounselorsNewProps): Promise<Counselors> {
    const counselorOrError = Counselors.createNew(counselorNewProps);
    if (counselorOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselorOrError.error as string);
    }
    const counselor = counselorOrError.value;
    const createdCounselor = await this.counselorPersister.create(counselor);
    return createdCounselor;
  }

  async update(counselor: Counselors): Promise<Counselors> {
    const updatedCounselor = await this.counselorPersister.update(counselor);
    return updatedCounselor;
  }

  async findOne(counselorId: UniqueEntityId): Promise<Counselors | null> {
    const counselor = await this.counselorReader.findOne(counselorId);
    return counselor;
  }

  async findAll(): Promise<Counselors[]> {
    const counselors = await this.counselorReader.findAll();
    return counselors;
  }

  async findMany(props: { name?: string; toneId?: UniqueEntityId }): Promise<Counselors[]> {
    const counselors = await this.counselorReader.findMany(props);
    return counselors;
  }

  async getById(counselorId: UniqueEntityId): Promise<Counselors> {
    const counselor = await this.counselorReader.findOne(counselorId);
    if (!counselor) {
      throw new NotFoundException("Counselor not found");
    }
    return counselor;
  }

  async getAll(): Promise<Counselors[]> {
    const counselors = await this.counselorReader.findAll();
    if (!counselors) {
      throw new NotFoundException("Counselors not found");
    }
    return counselors;
  }

  async getMany(props: { name?: string; toneId?: UniqueEntityId }): Promise<Counselors[]> {
    const counselors = await this.counselorReader.findMany(props);
    if (!counselors) {
      throw new NotFoundException("Counselors not found");
    }
    return counselors;
  }
}
