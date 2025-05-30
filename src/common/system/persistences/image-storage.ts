import { Extension } from "~proto/com/hearlers/v1/common/presigned_url_pb";

import { Storage } from "@google-cloud/storage";
import { Injectable } from "@nestjs/common";
import { PresignedUrl } from "~common/support/presigned-url";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * 이미지 스토리지 서비스 설정 옵션
 */
export interface ImageStorageOptions {
  /** 모듈별 접두사 (예: 'users', 'counselings') */
  prefix?: string;
  /** GCS 버킷 이름 */
  bucketName?: string;
  /** GCP 프로젝트 ID */
  projectId?: string;
}

/**
 * 파일 경로 생성 옵션
 */
export interface FilePathOptions {
  /** 유스케이스 디렉토리 (예: 'profile', 'verification') */
  useCase?: string;
  /** 엔티티 ID (예: userId, counselorId) */
  entityId?: string;
  /** 고유 파일명 자동 생성 여부 */
  generateUniqueFileName?: boolean;
  /** 파일 확장자 */
  extension?: Extension;
}

/**
 * 클라우드 스토리지 기반 이미지 관리 서비스
 */
@Injectable()
export class ImageStorageService {
  private storage: Storage;
  private bucketName: string;
  private prefix: string;

  constructor(options: ImageStorageOptions = {}) {
    this.storage = new Storage({
      projectId: options.projectId || process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    });

    this.bucketName = options.bucketName || process.env.GOOGLE_CLOUD_STORAGE_BUCKET || "";
    this.prefix = options.prefix ? `${options.prefix}/` : "";
  }

  /**
   * 업로드용 서명된 URL 생성
   *
   * @param fileName 기본 파일명 (확장자는 options.extension으로 대체 가능)
   * @param options 경로 옵션 (useCase, entityId, extension 등)
   * @param expiresInMinutes 만료 시간(분) (기본값: 15분)
   * @returns 서명된 URL과 메타데이터를 포함한 객체
   */
  async getSignedUrlForUpload(
    fileName: string,
    options: FilePathOptions = {},
    expiresInMinutes = 15,
  ): Promise<PresignedUrl> {
    const filePath = this.buildFilePath(fileName, options);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    const contentType = this.determineContentType(fileName, options.extension);

    const [uploadUrl] = await this.storage.bucket(this.bucketName).file(filePath).getSignedUrl({
      version: "v4",
      action: "write",
      expires: expiresAt.getTime(),
      contentType,
    });

    const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filePath}`;

    return PresignedUrl.create({
      uploadUrl,
      filePath,
      publicUrl,
      expiresAt,
    });
  }

  /**
   * 다운로드용 서명된 URL 생성
   *
   * @param filePath 파일 경로
   * @param expiresInMinutes 만료 시간(분) (기본값: 60분)
   * @returns 서명된 URL과 메타데이터를 포함한 객체
   */
  async getSignedUrlForDownload(filePath: string, expiresInMinutes = 60): Promise<PresignedUrl> {
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    const [uploadUrl] = await this.storage.bucket(this.bucketName).file(filePath).getSignedUrl({
      version: "v4",
      action: "read",
      expires: expiresAt.getTime(),
    });

    const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filePath}`;

    return PresignedUrl.create({
      uploadUrl,
      filePath,
      publicUrl,
      expiresAt,
    });
  }

  /**
   * 파일 존재 여부 확인
   */
  async fileExists(filePath: string): Promise<boolean> {
    const [exists] = await this.storage.bucket(this.bucketName).file(filePath).exists();

    return exists;
  }

  /**
   * 파일 삭제
   */
  async deleteFile(filePath: string): Promise<void> {
    await this.storage.bucket(this.bucketName).file(filePath).delete();
  }

  // 내부 헬퍼 메서드

  /**
   * 파일 경로 생성
   */
  private buildFilePath(fileName: string, options: FilePathOptions): string {
    const processedFileName = this.processFileName(fileName, options);
    const pathSegments = this.buildPathSegments(options);

    return pathSegments.length > 0 ? `${pathSegments.join("/")}/${processedFileName}` : processedFileName;
  }

  /**
   * 파일명 처리 (확장자 변경 및 UUID 생성)
   */
  private processFileName(fileName: string, options: FilePathOptions): string {
    // 확장자 처리
    let result = fileName;

    if (options.extension !== undefined) {
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
      const extensionStr = this.getExtensionString(options.extension);
      result = `${nameWithoutExt}${extensionStr}`;
    }

    // UUID 생성 적용
    if (options.generateUniqueFileName) {
      const ext = path.extname(result);
      result = `${uuidv4()}${ext}`;
    }

    return result;
  }

  /**
   * 경로 세그먼트 구성 (prefix/useCase/entityId)
   */
  private buildPathSegments(options: FilePathOptions): string[] {
    const segments: string[] = [];

    // 모듈 prefix 추가
    if (this.prefix) {
      segments.push(this.prefix.endsWith("/") ? this.prefix.slice(0, -1) : this.prefix);
    }

    // 유스케이스 추가
    if (options.useCase) {
      segments.push(options.useCase);
    }

    // 엔티티 ID 추가
    if (options.entityId) {
      segments.push(options.entityId);
    }

    return segments;
  }

  /**
   * 콘텐츠 타입 결정
   */
  private determineContentType(fileName: string, extension?: Extension): string {
    return extension !== undefined
      ? this.getContentTypeByExtension(extension)
      : this.getContentTypeFromFileName(fileName);
  }

  /**
   * 확장자별 콘텐츠 타입 반환
   */
  private getContentTypeByExtension(extension: Extension): string {
    return ImageStorageService.CONTENT_TYPE_MAP[extension] || "image/jpeg";
  }

  /**
   * 파일명에서 콘텐츠 타입 추론
   */
  private getContentTypeFromFileName(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    return ImageStorageService.FILE_EXT_CONTENT_TYPE_MAP[ext] || "application/octet-stream";
  }

  /**
   * 확장자 문자열 반환
   */
  private getExtensionString(extension: Extension): string {
    return ImageStorageService.EXTENSION_MAP[extension] || ".jpg";
  }

  // 상수

  /** 확장자 열거형 -> 확장자 문자열 매핑 */
  private static readonly EXTENSION_MAP: Record<number, string> = {
    [Extension.UNSPECIFIED]: ".jpg",
    [Extension.JPG]: ".jpg",
    [Extension.PNG]: ".png",
    [Extension.GIF]: ".gif",
    [Extension.WEBP]: ".webp",
  };

  /** 확장자 열거형 -> 콘텐츠 타입 매핑 */
  private static readonly CONTENT_TYPE_MAP: Record<number, string> = {
    [Extension.UNSPECIFIED]: "image/jpeg",
    [Extension.JPG]: "image/jpeg",
    [Extension.PNG]: "image/png",
    [Extension.GIF]: "image/gif",
    [Extension.WEBP]: "image/webp",
  };

  /** 파일 확장자 -> 콘텐츠 타입 매핑 */
  private static readonly FILE_EXT_CONTENT_TYPE_MAP: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
}

/**
 * 모듈별 이미지 스토리지 서비스 등록을 위한 설정 클래스
 */
@Injectable()
export class ImageStorageConfig {
  /**
   * 모듈별 이미지 스토리지 서비스 등록
   */
  static register(options: ImageStorageOptions = {}) {
    return {
      provide: ImageStorageService,
      useFactory: () => new ImageStorageService(options),
    };
  }
}
