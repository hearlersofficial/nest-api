export class PresignedUrl {
  constructor(
    public readonly uploadUrl: string,
    public readonly filePath: string,
    public readonly publicUrl?: string,
    public readonly expiresAt?: Date,
  ) {}

  static create(props: { uploadUrl: string; filePath: string; publicUrl?: string; expiresAt?: Date }): PresignedUrl {
    return new PresignedUrl(
      props.uploadUrl,
      props.filePath,
      props.publicUrl,
      props.expiresAt || new Date(Date.now() + 60 * 60 * 1000), // 기본 1시간
    );
  }

  public getExpiryTimestamp(): number {
    return this.expiresAt ? this.expiresAt.getTime() : Date.now() + 60 * 60 * 1000;
  }

  public isExpired(): boolean {
    return this.getExpiryTimestamp() < Date.now();
  }

  public getUploadUrl(): string {
    return this.uploadUrl;
  }

  public getFilePath(): string {
    return this.filePath;
  }

  public getPublicUrl(): string | undefined {
    return this.publicUrl;
  }
}
