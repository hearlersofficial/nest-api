import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { DomainEventCollector } from "~shared/core/infrastructure/events/domain-event-collector";

/**
 * 메소드나 클래스의 반환값이 AggregateRoot 또는 AggregateRoot[]인 경우 이벤트를 수집하는 데코레이터
 * - 메서드에 적용: 해당 메서드의 반환값에서 이벤트를 수집
 * - 클래스에 적용: 클래스의 모든 메서드에 데코레이터 적용
 */
export function CollectDomainEvents() {
  return function (...args: any[]) {
    // 클래스 데코레이터로 사용된 경우
    if (args.length === 1 && typeof args[0] === "function") {
      return classDecorator(args[0]);
    }

    // 메서드 데코레이터로 사용된 경우
    else if (args.length === 3 && typeof args[1] === "string" && typeof args[2] === "object") {
      return methodDecorator(args[0], args[1], args[2]);
    }

    // 지원하지 않는 형태로 사용된 경우
    else {
      throw new Error("CollectDomainEvents 데코레이터는 클래스나 메서드에만 적용할 수 있습니다.");
    }
  };
}

/**
 * 클래스 데코레이터 - 클래스의 모든 메서드에 이벤트 수집 로직 적용
 */
function classDecorator(constructor: any): any {
  // 클래스의 prototype에 있는 모든 메서드를 가져옴
  const prototype = constructor.prototype;
  const methodNames = Object.getOwnPropertyNames(prototype).filter(
    (name) => typeof prototype[name] === "function" && name !== "constructor",
  );

  // 각 메서드에 이벤트 수집 로직 적용
  for (const methodName of methodNames) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName)!;
    const newDescriptor = methodDecorator(prototype, methodName, descriptor);
    Object.defineProperty(prototype, methodName, newDescriptor);
  }

  return constructor;
}

/**
 * 메서드 데코레이터 - 메서드의 반환값에서 이벤트 수집
 */
function methodDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  // 원본 메소드 저장
  const originalMethod = descriptor.value;

  // 새 메소드로 교체
  descriptor.value = async function (...args: any[]) {
    // 원본 메소드 실행
    const result = await originalMethod.apply(this, args);

    // DomainEventCollector 가져오기
    try {
      const domainEventCollector = this.domainEventCollector as DomainEventCollector;

      if (domainEventCollector && typeof domainEventCollector.collectAggregate === "function") {
        // 반환값이 AggregateRoot 타입이면 이벤트 수집
        if (isAggregateRoot(result) || (Array.isArray(result) && result.length > 0 && isAggregateRoot(result[0]))) {
          domainEventCollector.collectAggregate(result);
        }
      }
    } catch (error) {
      console.warn("DomainEventCollector not available in this context or collectAggregate failed:", error);
    }

    return result;
  };

  return descriptor;
}

// AggregateRoot 타입 체크 헬퍼 함수
function isAggregateRoot(obj: any): obj is AggregateRoot<any> {
  return (
    obj && obj.domainEvents !== undefined && Array.isArray(obj.domainEvents) && typeof obj.clearEvents === "function"
  );
}
