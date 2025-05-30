import { Speaker } from "~proto/com/hearlers/v1/model/counselor_pb";

import { getNowDayjs } from "~common/shared/utils/Date.utils";
import { isDefined } from "~common/shared/utils/Validate.utils";
import { DomainEntity } from "~common/shared-kernel/domains/DomainEntity";
import { Result } from "~common/shared-kernel/domains/Result";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
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
    const result = episodeCutScenes.validateDomain();
    if (result.isFailureResult()) {
      return Result.fail(result.error);
    }
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

  public validateDomain(): Result<void> {
    if (!isDefined(this.props.episodeId)) {
      return Result.fail<void>("[EpisodeCutScenes] 에피소드 ID는 필수입니다");
    }
    if (!isDefined(this.props.speaker) || this.props.speaker === Speaker.UNSPECIFIED) {
      return Result.fail<void>("[EpisodeCutScenes] 발화자는 필수로 명시해야 합니다");
    }
    if (!isDefined(this.props.content)) {
      return Result.fail<void>("[EpisodeCutScenes] 내용은 필수입니다");
    }
    if (!isDefined(this.props.orderIndex)) {
      return Result.fail<void>("[EpisodeCutScenes] 순서는 필수입니다");
    }
    if (!isDefined(this.props.image)) {
      return Result.fail<void>("[EpisodeCutScenes] 이미지는 필수입니다");
    }
    if (
      (this.props.orderIndex < 0 || !Number.isInteger(this.props.orderIndex)) &&
      typeof this.props.orderIndex === "number"
    ) {
      return Result.fail<void>("[EpisodeCutScenes] 순서는 0 이상 정수여야 합니다");
    }
    return Result.ok<void>(undefined);
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

    const result = this.validateDomain();
    if (result.isFailureResult()) {
      return Result.fail(result.error);
    }
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
