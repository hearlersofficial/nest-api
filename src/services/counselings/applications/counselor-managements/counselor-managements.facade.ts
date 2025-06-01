import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { BubblesInfo, CounselorsInfo } from "~counselings/domains/counselors/models/counselors.info";
import { EpisodesService } from "~counselings/domains/episodes/episodes.service";
import { EpisodesNewProps } from "~counselings/domains/episodes/models/episodes";
import { EpisodesInfo } from "~counselings/domains/episodes/models/episodes.info";
import { TonesInfo } from "~counselings/domains/tones/models/tones.info";
import { TonesService } from "~counselings/domains/tones/tones.service";
import { CounselorGender, Speaker } from "~proto/com/hearlers/v1/model/counselor_pb";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselorManagementsFacade {
  constructor(
    private readonly counselorsService: CounselorsService,
    private readonly episodesService: EpisodesService,
    private readonly tonesService: TonesService,
  ) {}

  @Transactional()
  async createTone(params: { name: string; description: string }): Promise<TonesInfo> {
    const { name, description } = params;
    return this.tonesService.create({ name, description });
  }

  async findTones(params: { name?: string }): Promise<TonesInfo[]> {
    const { name } = params;
    return this.tonesService.findMany({ name });
  }

  async findToneById(params: { toneId: UniqueEntityId }): Promise<TonesInfo> {
    const { toneId } = params;
    return this.tonesService.getOne({ toneId });
  }

  @Transactional()
  async updateTone(params: { toneId: UniqueEntityId; name?: string; description?: string }): Promise<TonesInfo> {
    const { toneId, name, description } = params;
    return this.tonesService.updateTone({ toneId, name, description });
  }

  @Transactional()
  async createCounselor(params: {
    toneId: UniqueEntityId;
    name: string;
    description: string;
    profileImage: string;
    counselorGender: CounselorGender;
  }): Promise<CounselorsInfo> {
    const { toneId, name, description, profileImage, counselorGender } = params;
    await this.tonesService.getOne({ toneId });
    return this.counselorsService.create({
      toneId,
      name,
      description,
      profileImage,
      gender: counselorGender,
    });
  }

  async findCounselors(params: { toneId?: UniqueEntityId }): Promise<CounselorsInfo[]> {
    const { toneId } = params;
    return this.counselorsService.findMany({ toneId });
  }

  async findCounselorById(params: { counselorId: UniqueEntityId }): Promise<CounselorsInfo> {
    const { counselorId } = params;
    return this.counselorsService.getOne({ counselorId });
  }

  @Transactional()
  async updateCounselor(params: {
    counselorId: UniqueEntityId;
    toneId?: UniqueEntityId;
    name?: string;
    description?: string;
    profileImage?: string;
    counselorGender?: CounselorGender;
  }): Promise<CounselorsInfo> {
    const { counselorId, toneId, name, description, profileImage, counselorGender } = params;
    return this.counselorsService.updateCounselor({
      counselorId,
      toneId,
      name,
      description,
      profileImage,
      gender: counselorGender,
    });
  }

  @Transactional()
  async createBubble(params: {
    counselorId: UniqueEntityId;
    question: string;
    responseOption1: string;
    responseOption2: string;
  }): Promise<BubblesInfo> {
    const { counselorId, question, responseOption1, responseOption2 } = params;
    return this.counselorsService.createBubble({
      counselorId,
      question,
      responseOption1,
      responseOption2,
    });
  }

  async findBubbles(params: { counselorId: UniqueEntityId }): Promise<BubblesInfo[]> {
    const { counselorId } = params;
    return this.counselorsService.findBubbles({ counselorId });
  }

  async findRandomBubble(params: { counselorId: UniqueEntityId }): Promise<BubblesInfo> {
    const { counselorId } = params;
    return this.counselorsService.findRandomBubble(counselorId);
  }

  async findBubbleById(params: { bubbleId: UniqueEntityId }): Promise<BubblesInfo | null> {
    const { bubbleId } = params;
    return this.counselorsService.findBubbleById(bubbleId);
  }

  async updateBubble(params: {
    bubbleId: UniqueEntityId;
    counselorId: UniqueEntityId;
    question?: string;
    responseOption1?: string;
    responseOption2?: string;
  }): Promise<BubblesInfo> {
    const { bubbleId, counselorId, question, responseOption1, responseOption2 } = params;
    return this.counselorsService.updateBubble({
      bubbleId,
      counselorId,
      question,
      responseOption1,
      responseOption2,
    });
  }

  async deleteBubble(params: { counselorId: UniqueEntityId; bubbleId: UniqueEntityId }): Promise<void> {
    const { counselorId, bubbleId } = params;
    await this.counselorsService.deleteBubble({ counselorId, bubbleId });
    return;
  }

  @Transactional()
  async createEpisode(params: {
    counselorId: UniqueEntityId;
    title: string;
    requiredRapportThreshold: number;
    isTemporary: boolean;
    cutScenes: {
      speaker: Speaker;
      content: string;
      orderIndex: number;
      image: string;
    }[];
  }): Promise<EpisodesInfo> {
    const { counselorId, title, requiredRapportThreshold, isTemporary, cutScenes } = params;
    await this.counselorsService.getOne({ counselorId });
    const newProps: EpisodesNewProps = {
      counselorId,
      title,
      requiredRapportThreshold,
      isTemporary,
      cutScenes: cutScenes.map((cutScene) => ({
        ...cutScene,
      })),
    };
    return this.episodesService.create(newProps);
  }

  async findEpisodes(params: { counselorId: UniqueEntityId; withTemporary?: boolean }): Promise<EpisodesInfo[]> {
    const { counselorId, withTemporary = false } = params;
    await this.counselorsService.getOne({ counselorId });
    return this.episodesService.findEpisodesByCounselorId(counselorId, withTemporary);
  }

  async findEpisodeById(params: { episodeId: UniqueEntityId; withTemporary?: boolean }): Promise<EpisodesInfo | null> {
    const { episodeId, withTemporary = false } = params;
    return this.episodesService.findEpisodeById(episodeId, withTemporary);
  }

  @Transactional()
  async updateEpisode(params: {
    episodeId: UniqueEntityId;
    title?: string;
    requiredRapportThreshold?: number;
    isTemporary?: boolean;
    cutScenes?: {
      id?: string;
      speaker: Speaker;
      content: string;
      orderIndex: number;
      image: string;
    }[];
  }): Promise<EpisodesInfo> {
    return this.episodesService.updateEpisode(params);
  }
}
