import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { isDefined } from "~shared/utils/Validate.utils";
import {
  EpisodeCutScenes,
  EpisodeCutScenesNewProps,
} from "~counselings/domains/episodes/models/episode-cut-scenes";

import { Dayjs } from "dayjs";
export interface EpisodesNewProps {
  counselorId: UniqueEntityId;
  title: string;
  requiredRapportThreshold: number;
  isTemporary: boolean;
  cutScenes: Omit<EpisodeCutScenesNewProps, "episodeId">[];
}

export interface EpisodesProps extends EpisodesNewProps {
  cutScenes: EpisodeCutScenes[];
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Episodes extends AggregateRoot<EpisodesProps> {
  private constructor(props: EpisodesProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(
    props: EpisodesProps,
    id: UniqueEntityId
  ): Result<Episodes> {
    const episodes = new Episodes(props, id);
    const result = episodes.validateDomain();
    if (result.isFailureResult()) {
      return Result.fail(result.error);
    }
    return Result.ok<Episodes>(episodes);
  }

  public static createNew(newProps: EpisodesNewProps): Result<Episodes> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    const cutSceneResults = newProps.cutScenes?.map((cutScene) =>
      EpisodeCutScenes.createNew({ ...cutScene, episodeId: newId })
    );
    if (Result.getFailResultIfExist(cutSceneResults)) {
      return Result.fail<Episodes>("Cut scenes are invalid");
    }
    const cutScenes = cutSceneResults.map((result) => result.value);
    return this.create(
      {
        ...newProps,
        cutScenes,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId
    );
  }

  public validateDomain(): Result<void> {
    if (!isDefined(this.props.counselorId)) {
      return Result.fail<void>("[Episodes] 상담사 ID는 필수입니다");
    }
    if (!isDefined(this.props.title)) {
      return Result.fail<void>("[Episodes] 제목은 필수입니다");
    }
    if (!isDefined(this.props.requiredRapportThreshold)) {
      return Result.fail<void>("[Episodes] 필요한 신뢰도 임계값은 필수입니다");
    }
    if (!isDefined(this.props.isTemporary)) {
      return Result.fail<void>("[Episodes] 임시 여부는 필수입니다");
    }
    if (!isDefined(this.props.cutScenes)) {
      return Result.fail<void>("[Episodes] 컷 장면은 필수입니다");
    }
    if (this.props.cutScenes.length === 0) {
      return Result.fail<void>(
        "[Episodes] 컷 장면은 최소 1개 이상이어야 합니다"
      );
    }

    // 컷신의 orderIndex가 1부터 시작하고 순차적으로 증가하는지 검증
    const sortedCutScenes = [...this.props.cutScenes].sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
    for (let i = 0; i < sortedCutScenes.length; i++) {
      if (sortedCutScenes[i].orderIndex !== i + 1) {
        return Result.fail<void>(
          `[Episodes] 컷신의 순서는 1부터 시작하여 순차적으로 증가해야 합니다. 실패한 값의 순서: ${
            sortedCutScenes[i].orderIndex
          }, 현재 순서: ${i + 1}, 총 개수: ${sortedCutScenes.length}`
        );
      }
    }

    const cutSceneResults = this.props.cutScenes.map((cutScene) =>
      cutScene.validateDomain()
    );

    const cutSceneResult = Result.getFailResultIfExist(cutSceneResults);
    if (cutSceneResult) {
      return Result.fail(cutSceneResult.error);
    }
    return Result.ok();
  }

  public update(
    props: Partial<
      Pick<EpisodesProps, "title" | "requiredRapportThreshold" | "isTemporary">
    >
  ): Result<Episodes> {
    const { title, requiredRapportThreshold, isTemporary } = props;
    this.props.title = isDefined(title) ? title : this.props.title;
    this.props.requiredRapportThreshold = isDefined(requiredRapportThreshold)
      ? requiredRapportThreshold
      : this.props.requiredRapportThreshold;
    this.props.isTemporary = isDefined(isTemporary)
      ? isTemporary
      : this.props.isTemporary;
    this.props.updatedAt = getNowDayjs();

    return Result.ok<Episodes>(this);
  }

  public updateCutScenes(cutScenes: EpisodeCutScenes[]): Result<Episodes> {
    this.props.cutScenes = cutScenes;
    this.props.updatedAt = getNowDayjs();
    return Result.ok<Episodes>(this);
  }

  public delete(): Result<Episodes> {
    this.props.deletedAt = getNowDayjs();
    return Result.ok<Episodes>(this);
  }

  // Getters
  get counselorId(): UniqueEntityId {
    return this.props.counselorId;
  }

  get title(): string {
    return this.props.title;
  }

  get cutScenes(): EpisodeCutScenes[] {
    return this.props.cutScenes;
  }

  get requiredRapportThreshold(): number {
    return this.props.requiredRapportThreshold;
  }

  get isTemporary(): boolean {
    return this.props.isTemporary;
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
