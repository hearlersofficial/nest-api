import { DomainEntity } from "~shared/core/domain/DomainEntity";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { isDefined } from "~shared/utils/Validate.utils";
import { Speaker } from "~proto/com/hearlers/v1/model/counselor_pb";

import { Dayjs } from "dayjs";

export interface EpisodeCutScenesNewProps {
  episodeId: UniqueEntityId;
  speaker: Speaker;
  content: string;
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

  public update(
    props: Partial<Pick<EpisodeCutScenesProps, "speaker" | "content" | "orderIndex" | "image">>,
  ): Result<EpisodeCutScenes> {
    const { speaker, content, orderIndex, image } = props;
    this.props.speaker = isDefined(speaker) ? speaker : this.props.speaker;
    this.props.content = isDefined(content) ? content : this.props.content;
    this.props.orderIndex = isDefined(orderIndex) ? orderIndex : this.props.orderIndex;
    this.props.image = isDefined(image) ? image : this.props.image;
    this.props.updatedAt = getNowDayjs();
    return Result.ok<EpisodeCutScenes>(this);
  }

  public delete(): Result<EpisodeCutScenes> {
    this.props.deletedAt = getNowDayjs();
    return Result.ok<EpisodeCutScenes>(this);
  }

  // Getters
  get episodeId(): UniqueEntityId {
    return this.props.episodeId;
  }

  get speaker(): Speaker {
    return this.props.speaker;
  }

  get content(): string {
    return this.props.content;
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
