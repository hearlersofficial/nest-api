export interface CreateCounselMessageUseCaseRequest {
  counselId: number;
  userId: number;
  message: string;
  isUserMessage: boolean;
}
