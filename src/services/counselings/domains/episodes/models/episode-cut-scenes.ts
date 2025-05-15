import { DomainEntity } from "~shared/core/domain/DomainEntity";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { Speaker } from "~proto/com/hearlers/v1/model/counselor_pb";

import { Dayjs } from "dayjs";

export interface EpisodeCutScenesNewProps {
  episodeId: UniqueEntityId;
  speaker: Speaker;
  title: string;
  orderIndex: number;
  image: string;
}

export interface EpisodeCutScenesProps extends EpisodeCutScenesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class EpisodeCutScenes extends DomainEntity<EpisodeCutScenesProps> {
  private constructor(props: EpisodeCutScenesProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: EpisodeCutScenesProps, id: UniqueEntityId): Result<EpisodeCutScenes> {
    const episodeCutScenes = new EpisodeCutScenes(props, id);
    return Result.ok<EpisodeCutScenes>(episodeCutScenes);
  }

  public static createNew(newProps: EpisodeCutScenesNewProps): Result<EpisodeCutScenes> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    return this.create(
      {
        ...newProps,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );
  }

  // Getters
  get episodeId(): UniqueEntityId {
    return this.props.episodeId;
  }

  get speaker(): Speaker {
    return this.props.speaker;
  }

  get title(): string {
    return this.props.title;
  }

  get orderIndex(): number {
    return this.props.orderIndex;
  }

  get image(): string {
    return this.props.image;
  }

  get createdAt(): Dayjs {
    return this.props.createdAt;
  }

  get updatedAt(): Dayjs {
    return this.props.updatedAt;
  }

  get deletedAt(): Dayjs | null {
    return this.props.deletedAt;
  }
}
