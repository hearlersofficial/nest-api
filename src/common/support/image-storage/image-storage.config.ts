import { Injectable } from "@nestjs/common";
import { ImageStorageOptions, ImageStorageService } from "~common/support/image-storage/image-storage.service";

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
