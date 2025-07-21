# hearlers-api

## 1. 서비스 개요

**event-driven-architecture**를 기반으로 하여 확장성 있는 애플리케이션을 추구합니다.
nest.js로 생성된 로직 공유를 위해, **modular-monolith** 아키텍처로 **유저 도메인**과 **상담 도메인**을 통합한 레포지토리 입니다. 환경변수 `SERVICE_TYPE` 설정을 통해서 모듈러 모놀리스 모드와 개별 마이크로 서비스 모드 중 선택해 부팅할 수 있습니다.

gRPC 호스트 서버로 gateway에게만 포트를 노출하며 다른 마이크로서비스와 연계가 필요한 경우 이벤트 기반으로 kafka를 통해 소통합니다.


| Category               | description                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| Concepts               | Domain Driven Design (Subdomains, Bounded Contexts, Ubiquitous Language, Aggregates, Value Objects) |
| Architecture style     | Event Driven Modular Monolith                                                                          |
| Architectural patterns | CQRS                                                                                                |
| Technology             | nest.js, Kafka, gRPC, PostgreSQL                                                                    |

## 1. 요구사항

- docker
- docker-compose

## 2. 실행 방법

### 2.1. RUN(LOCAL)

#### proto 파일 동기화 및 빌드

```bash
make build
```

#### 실행

```bash
yarn start
```

### 2.1. Deploying(DEV)


```bash
docker-compose up -d --build
```

## 3. 서비스 구조도

### 3.1 통신 구조

```mermaid
%%{init: {'theme':'neutral'}}%%
flowchart TD
    %% 외부 클라이언트에서 게이트웨이로의 접근
    Client1["Web Client"]
    Client2["Mobile Client"]
    Client1 <-->|HTTP API| GatewayServer
    Client2 <-->|HTTP API| GatewayServer

    %% 게이트웨이가 각 서비스로 라우팅
    subgraph Server["Server"]
        GatewayServer
        GatewayServer <-->|gRPC| UserService["User Service"]
        GatewayServer <-->|gRPC| CounselingService["Counseling Service"]
        GatewayServer <-->|gRPC| PaymentService["Payment Service"]


    end

    subgraph EventBroker["EventBroker"]
        KafkaProducer["Event Producer"]
        KafkaConsumer["Event Consumer"]
        KafkaProducer --> Kafka["Kafka Broker"]
        KafkaConsumer --> Kafka
    end

    %% 각 서비스는 Kafka와 통신
    UserService <-->|Publishes Events| EventBroker
    UserService <-->|Consumes Events| EventBroker
    CounselingService <-->|Publishes Events| EventBroker
    CounselingService <-->|Consumes Events| EventBroker
    PaymentService <-->|Publishes Events| EventBroker
    PaymentService <-->|Consumes Events| EventBroker

```

### 3.2 DDD

```mermaid
%%{init: {'theme':'neutral'}}%%
%% ([]) for Entity
%% () for event
%% {} for layer class
flowchart TD
subgraph BoundedContext
  subgraph Presentation
      RestOuter
      gRPCOuter
  end
  subgraph ApplicationOuter["Application"]
      UseCaseOuter{"Use Case"}
      HandlerOuter{"Handler"}
      ReadModel(["Read Model"])
      subgraph BusOuter["Bus"]
          CommandBusOuter["Command Bus"]
          QueryBusOuter["Query Bus"]
      end
  end

  subgraph Aggregate1["User Aggregate"]
      subgraph Application1["Application"]
          UseCase1{"Use Case"}
          Handler1{"Handler"}
          subgraph Bus1["Bus"]
              CommandBus1["CommandBus"]
              QueryBus1["QueryBus"]
          end
      end
      subgraph Domain1["Domain"]
          AggregateRoot1["Users"]
          VO1["Value Object"]
          DomainEntity1["Domain Entity"]
          DomainEvent1("Domain Event")
      end
      subgraph Infrastructure1["Infrastructure"]
          Repository1[("Repository")]
          OrmEntity1(["ORM Entity"])
      end
  end

  subgraph Aggregate2["Auth Aggregate"]
      subgraph Application2["Application"]
          UseCase2{"Use Case"}
          Handler2{"Handler"}
          subgraph Bus2["Bus"]
              CommandBus2["Command Bus"]
              QueryBus2["Query Bus"]
          end
      end
      subgraph Domain2["Domain"]
          AggregateRoot2["Auth"]
          VO2["Value Object"]
          DomainEntity2["Domain Entity"]
          DomainEvent2("Domain Event")
      end
      subgraph Infrastructure2["Infrastructure"]
          Repository2[("Repository")]
          OrmEntity2(["ORM Entity"])
      end
  end
end
OrmEntity1 <--mapped--> Domain1
OrmEntity2 <--mapped--> Domain2
DomainEntity1 --has--> DomainEvent1
DomainEntity2 --has--> DomainEvent2

OrmEntity1 --used--> Repository1
OrmEntity2 --used--> Repository2


Repository1 --returns--> AggregateRoot1
Repository2 --returns--> AggregateRoot2




AggregateRoot1 --has--> DomainEntity1
AggregateRoot2 --has--> DomainEntity2

AggregateRoot1 --has--> DomainEvent1
AggregateRoot2 --has--> DomainEvent2


Repository1 --returns---> ReadModel
Repository2 --returns---> ReadModel
Application1 --uses--> AggregateRoot1
Application2 --uses--> AggregateRoot2

AggregateRoot1 --has--> VO1
AggregateRoot2 --has--> VO2

BusOuter --register --> HandlerOuter
UseCaseOuter --execute--> UseCase1
UseCaseOuter --execute--> UseCase2
UseCaseOuter --read--> ReadModel

Bus1 --register--> Handler1
Bus2 --register--> Handler2
Presentation --execute--> Bus1
Presentation --execute--> Bus2
HandlerOuter --execute--> UseCaseOuter
Presentation -- execute --> BusOuter

```

## 4. 서비스 설계

모든 서비스는 도메인 주도 설계의 원칙 아래, 바운디드 컨텍스트 단위로 설계한다. 초기 서비스는 팀의 규모 및 생산성을 고려해여 분리를 하며, 서비스 분리를 하는 우선순위는 다음과 같다.

1. **비즈니스 도메인별 독립성**
   비즈니스 상 독립적인 팀이 나눠 작업할 필요가 있는 지
2. **바운디드 컨텍스트의 크기**
   큰 도메인은 한 서비스로 유지하면 복잡성이 높아지고 관리가 어려워지므로 바운디드 컨텍스트를 기준으로 분리
3. **프레임워크 및 언어의 분리 필요성**
   기술적 요구사항이 분리된 경우 각 서비스가 적합한 언어와 프레임워크를 사용하여 최적화된 성능과 확장성을 제공
4. **서비스의 배포 및 확장 필요성**
   서비스의 변경 주기가 빠른 기능이 여러 팀에 영향을 미치지 않도록 독립된 서비스로 관리
5. **데이터 저장소 및 처리 방식의 차이**
   서로 다른 데이터 스토리지를 사용하는 경우. (분석 데이터와 비즈니스 데이터의 분리 등)
