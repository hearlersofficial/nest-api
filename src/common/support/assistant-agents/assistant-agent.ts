import { Observable } from "rxjs";

export interface ChatRequest {
  conversationId: string;
  message: string;
  systemPrompt?: string;
  useTools?: boolean;
}

export interface ChatResponse {
  conversationId: string;
  content: string;
  isComplete: boolean;
  toolCalls?: any[];
  metadata?: any;
}

export interface AssistantAgent {
  /**
   * 단일 요청-응답 처리
   * @param request 채팅 요청
   * @returns 채팅 응답
   */
  call(request: ChatRequest): Promise<ChatResponse>;

  /**
   * 스트리밍 응답 처리 (gRPC 스트리밍용)
   * @param request 채팅 요청
   * @returns Observable 스트리밍 응답
   */
  callStream(request: ChatRequest): Observable<ChatResponse>;

  getModel(): string;
  setModel(model: string): void;

  /**
   * Agent 헬스 체크
   * @returns 헬스 상태
   */
  healthCheck(): Promise<boolean>;
}

/**
 * Agent 구성 옵션
 */
export interface AgentConfig {
  modelName: string;
  temperature: number;
  maxToolCalls: number;
  maxMemoryMessages: number;
  streaming: boolean;
}

/**
 * Tool 실행 결과
 */
export interface ToolExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
  executionTime?: number;
}
