import { PresignedUrl, PresignedUrlSchema } from "~proto/com/hearlers/v1/common/presigned_url_pb";

import { create } from "@bufbuild/protobuf";
import { PresignedUrl as DomainPresignedUrl } from "~common/support/presigned-url";

export class SchemaPresignedUrlMapper {
  /**
   * 내부 도메인 객체에서 Proto 메시지로 변환
   */
  static toPresignedUrlProto(domainPresignedUrl: DomainPresignedUrl): PresignedUrl {
    return create(PresignedUrlSchema, {
      uploadUrl: domainPresignedUrl.uploadUrl,
      publicUrl: domainPresignedUrl.publicUrl || "",
      filePath: domainPresignedUrl.filePath,
      expiresAt: domainPresignedUrl.expiresAt
        ? domainPresignedUrl.expiresAt.toISOString()
        : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
  }

  /**
   * Proto 메시지에서 내부 도메인 객체로 변환
   */
  static toDomain(proto: PresignedUrl): DomainPresignedUrl {
    return DomainPresignedUrl.create({
      uploadUrl: proto.uploadUrl,
      filePath: proto.filePath,
      publicUrl: proto.publicUrl || undefined,
      expiresAt: proto.expiresAt ? new Date(proto.expiresAt) : undefined,
    });
  }
}
