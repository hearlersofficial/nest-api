import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { isDefined } from "~shared/utils/Validate.utils";
import { EpisodeCutScenes, EpisodeCutScenesNewProps } from "~counselings/domains/episodes/models/episode-cut-scenes";

import { Dayjs } from "dayjs";
export interface EpisodesNewProps {
  counselorId: UniqueEntityId;
  title: string;
  requiredRapportThreshold: number;
  isTemporary: boolean;
  cutScenes: EpisodeCutScenesNewProps[];
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

  public static create(props: EpisodesProps, id: UniqueEntityId): Result<Episodes> {
    const episodes = new Episodes(props, id);
    return Result.ok<Episodes>(episodes);
  }

  public static createNew(newProps: EpisodesNewProps): Result<Episodes> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    const cutSceneResults = newProps.cutScenes?.map((cutScene) => EpisodeCutScenes.createNew(cutScene));
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
      newId,
    );
  }

  public update(
    props: Partial<Pick<EpisodesProps, "title" | "requiredRapportThreshold" | "isTemporary">>,
  ): Result<Episodes> {
    const { title, requiredRapportThreshold, isTemporary } = props;
    this.props.title = isDefined(title) ? title : this.props.title;
    this.props.requiredRapportThreshold = isDefined(requiredRapportThreshold)
      ? requiredRapportThreshold
      : this.props.requiredRapportThreshold;
    this.props.isTemporary = isDefined(isTemporary) ? isTemporary : this.props.isTemporary;
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
