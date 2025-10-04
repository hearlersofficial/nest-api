import { PsqlUsersRepository } from "~users/domains/users/infrastructures/psql-users.repository";
import { USERS_KAFKA_CLIENT } from "~users/infrastructures/kafka/users-kafka-client-config";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { fakerKO as faker } from "@faker-js/faker";
import { ClientKafka } from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CoreStatus } from "~common/shared/enums/status";
import { TokenResetInterval } from "~common/shared/enums/token-reset-interval.enum";
import { getNowDayjs } from "~common/shared/utils/date";
import { EntityData } from "~common/shared/utils/orm";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserMessageTokensEntity } from "~common/system/persistences/entities/users/user-message-tokens.entity";
import { UserProfilesEntity } from "~common/system/persistences/entities/users/user-profiles.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/users.entity";
import { Repository } from "typeorm";

describe("PsqlUsersRepositoryAdaptor", () => {
  let module: TestingModule;
  let repository: Repository<UsersEntity>;
  let adaptor: PsqlUsersRepository;
  let kafkaProducer: ClientKafka;

  const createMockUserEntity = (): UsersEntity => {
    const entity = new UsersEntity();
    const userId = faker.string.uuid();
    const props: EntityData<UsersEntity, "authUser" | "counsels" | "counselorUserRelationships" | "userTrackings"> = {
      id: userId,
      nickname: faker.internet.userName().slice(0, 10),
      userProfiles: createMockUserProfilesEntity(userId),
      userMessageTokens: createMockUserMessageTokensEntity(userId),
      userActivities: [],
      status: CoreStatus.ACTIVE,
      createdAt: getNowDayjs().toISOString(),
      updatedAt: getNowDayjs().toISOString(),
      deletedAt: null,
    };
    Object.assign(entity, props);
    return entity;
  };

  const createMockUserMessageTokensEntity = (userId: string): UserMessageTokensEntity => {
    const maxTokens = faker.number.int({ min: 1000, max: 10000 });
    const props: EntityData<UserMessageTokensEntity, "user"> = {
      id: faker.string.uuid(),
      userId: userId,
      maxTokens: maxTokens,
      remainingTokens: faker.number.int({ min: 0, max: maxTokens }),
      reserved: faker.datatype.boolean(),
      reservedTimeout: getNowDayjs().add(1, "hour").toISOString(),
      resetInterval: faker.helpers.arrayElement(Object.values(TokenResetInterval)),
      lastReset: getNowDayjs().toISOString(),
      createdAt: getNowDayjs().toISOString(),
      updatedAt: getNowDayjs().toISOString(),
      deletedAt: null,
    };
    const entity = new UserMessageTokensEntity();
    Object.assign(entity, props);

    return entity;
  };

  const createMockUserProfilesEntity = (userId: string): UserProfilesEntity => {
    const entity = new UserProfilesEntity();
    const props: EntityData<UserProfilesEntity, "user"> = {
      id: faker.string.uuid(),
      userId: userId,
      profileImage: faker.image.avatar(),
      phoneNumber: "01012345678",
      gender: Gender.MALE,
      mbti: Mbti.ENFP,
      birthday: getNowDayjs().toISOString(),
      introduction: faker.lorem.paragraph(),
      createdAt: getNowDayjs().toISOString(),
      updatedAt: getNowDayjs().toISOString(),
      deletedAt: null,
    };
    Object.assign(entity, props);
    return entity;
  };

  beforeEach(async () => {
    const mockKafkaProducer = {
      emit: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        PsqlUsersRepository,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: USERS_KAFKA_CLIENT,
          useValue: mockKafkaProducer,
        },
      ],
    }).compile();

    repository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity));
    kafkaProducer = module.get<ClientKafka>(USERS_KAFKA_CLIENT);
    adaptor = module.get<PsqlUsersRepository>(PsqlUsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findOne", () => {
    it("ID로 사용자의 기본 관계들을 조회할 수 있다", async () => {
      const mockUserWithRelations = createMockUserEntity();
      jest.spyOn(repository, "findOne").mockResolvedValue(mockUserWithRelations);

      const result = await adaptor.findByUserId(new UserId(mockUserWithRelations.id));

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockUserWithRelations.id },
        relations: {
          userProfiles: true,
          userMessageTokens: true,
        },
      });

      expect(result).toBeDefined();
      expect(result?.id.getString()).toEqual(mockUserWithRelations.id);
      expect(result?.nickname).toBe(mockUserWithRelations.nickname);
    });

    it("존재하지 않는 사용자를 조회하면 null을 반환한다", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null);
      const result = await adaptor.findByUserId(new UserId("999"));
      expect(result).toBeNull();
    });
  });

  // describe("create with events", () => {
  //   it("사용자 생성 시 도메인 이벤트를 발행한다", async () => {
  //     const mockUser = createMockUserEntity();
  //     jest.spyOn(repository, "create").mockReturnValue(mockUser);
  //     jest.spyOn(repository, "save").mockResolvedValue(mockUser);

  //     const users = Users.createNew({
  //       nickname: mockUser.nickname,
  //     }).value as Users;

  //     // 도메인 이벤트 추가
  //     const mockEvent = {
  //       topic: "user.created",
  //       payload: {
  //         $typeName: "UserCreatedEvent",
  //         userId: users.id.getNumber(),
  //       },
  //       binary: Uint8Array.from([]),
  //     };
  //     users.domainEvents.push(mockEvent);

  //     await adaptor.save(users);

  //     expect(kafkaProducer.emit).toHaveBeenCalledWith(mockEvent.topic, mockEvent.binary);
  //     expect(repository.save).toHaveBeenCalled();
  //   });
  // });

  // describe("update with events", () => {
  //   it("사용자 업데이트 시 도메인 이벤트를 발행한다", async () => {
  //     const mockUser = createMockUserEntity();
  //     jest.spyOn(repository, "save").mockResolvedValue(mockUser);

  //     const users = Users.createNew({
  //       nickname: mockUser.nickname,
  //     }).value as Users;

  //     // 도메인 이벤트 추가
  //     const mockEvent = {
  //       topic: "user.updated",
  //       payload: {
  //         $typeName: "UserUpdatedEvent",
  //         userId: users.id.getNumber(),
  //       },
  //       binary: Uint8Array.from([]),
  //     };
  //     users.domainEvents.push(mockEvent);

  //     await adaptor.save(users);

  //     expect(kafkaProducer.emit).toHaveBeenCalledWith(mockEvent.topic, mockEvent.binary);
  //     expect(repository.save).toHaveBeenCalled();
  //   });
  // });
});
