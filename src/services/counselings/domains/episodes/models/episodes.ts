import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { EpisodeCutScenes } from "~counselings/domains/episodes/models/episode-cut-scenes";

import { Dayjs } from "dayjs";

export interface EpisodesNewProps {
  counselorId: UniqueEntityId;
  title: string;
  requiredRapportThreshold: number;
  isTemporary: boolean;
  cutScenes: EpisodeCutScenes[];
}

export interface EpisodesProps extends EpisodesNewProps {
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
