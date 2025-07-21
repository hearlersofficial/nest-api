import { PsqlUsersRepository } from "~users/domains/users/infrastructures/psql-users.repository";
import { Users } from "~users/domains/users/models/users";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { fakerKO as faker } from "@faker-js/faker";
import { ClientKafka } from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { UserProfilesEntity } from "~common/system/persistences/entities/users/user-profiles.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/users.entity";
import { KAFKA_CLIENT } from "~common/system/persistences/typeorm-config";
import dayjs from "dayjs";
import { Repository } from "typeorm";

describe("PsqlUsersRepositoryAdaptor", () => {
  let module: TestingModule;
  let repository: Repository<UsersEntity>;
  let adaptor: PsqlUsersRepository;
  let kafkaProducer: ClientKafka;

  const createMockUserEntity = () => {
    const user = new UsersEntity();
    user.id = faker.string.uuid();
    user.nickname = faker.internet.userName().slice(0, 10);
    user.createdAt = getNowDayjs().toISOString();
    user.updatedAt = getNowDayjs().toISOString();
    user.deletedAt = null;
    return user;
  };

  const createMockUserWithRelations = () => {
    const user = createMockUserEntity();

    // UserProfiles 관계 설정
    const profile = new UserProfilesEntity();
    profile.id = faker.string.uuid();
    profile.userId = user.id;
    profile.profileImage = faker.image.avatar();
    profile.phoneNumber = "01012345678";
    profile.gender = Gender.MALE;
    profile.mbti = Mbti.ENFP;
    profile.birthday = dayjs("1990-01-01").toISOString();
    profile.introduction = faker.lorem.paragraph();
    profile.createdAt = getNowDayjs().toISOString();
    profile.updatedAt = getNowDayjs().toISOString();
    profile.deletedAt = null;
    user.userProfiles = profile;

    return user;
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
          provide: KAFKA_CLIENT,
          useValue: mockKafkaProducer,
        },
      ],
    }).compile();

    repository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity));
    kafkaProducer = module.get<ClientKafka>(KAFKA_CLIENT);
    adaptor = module.get<PsqlUsersRepository>(PsqlUsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findOne", () => {
    it("ID로 사용자의 기본 관계들을 조회할 수 있다", async () => {
      const mockUserWithRelations = createMockUserWithRelations();
      jest.spyOn(repository, "findOne").mockResolvedValue(mockUserWithRelations);

      const result = await adaptor.findByUserId(new UniqueEntityId(mockUserWithRelations.id));

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockUserWithRelations.id },
        relations: {
          userProfiles: true,
          userProgresses: true,
          userMessageTokens: true,
        },
      });

      expect(result).toBeDefined();
      expect(result?.id.getNumber()).toBe(mockUserWithRelations.id);
      expect(result?.nickname).toBe(mockUserWithRelations.nickname);
    });

    it("존재하지 않는 사용자를 조회하면 null을 반환한다", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null);
      const result = await adaptor.findByUserId(new UniqueEntityId("999"));
      expect(result).toBeNull();
    });
  });

  describe("publishDomainEvents", () => {
    it("도메인 이벤트를 발행할 수 있다", async () => {
      const mockUser = createMockUserEntity();
      const users = Users.createNew({
        nickname: mockUser.nickname,
      }).value as Users;

      // 도메인 이벤트 추가
      const mockEvent = {
        topic: "user.created",
        payload: {
          $typeName: "UserCreatedEvent",
          userId: users.id.getNumber(),
        },
        binary: Uint8Array.from([]),
      };
      users.domainEvents.push(mockEvent);

      await adaptor.save(users);

      expect(kafkaProducer.emit).toHaveBeenCalledWith(mockEvent.topic, mockEvent.binary);
    });

    it("도메인 이벤트가 없으면 발행하지 않는다", async () => {
      const mockUser = createMockUserEntity();
      const users = Users.createNew({
        nickname: mockUser.nickname,
      }).value as Users;

      await adaptor.save(users);

      expect(kafkaProducer.emit).not.toHaveBeenCalled();
    });
  });

  describe("create with events", () => {
    it("사용자 생성 시 도메인 이벤트를 발행한다", async () => {
      const mockUser = createMockUserEntity();
      jest.spyOn(repository, "create").mockReturnValue(mockUser);
      jest.spyOn(repository, "save").mockResolvedValue(mockUser);

      const users = Users.createNew({
        nickname: mockUser.nickname,
      }).value as Users;

      // 도메인 이벤트 추가
      const mockEvent = {
        topic: "user.created",
        payload: {
          $typeName: "UserCreatedEvent",
          userId: users.id.getNumber(),
        },
        binary: Uint8Array.from([]),
      };
      users.domainEvents.push(mockEvent);

      await adaptor.save(users);

      expect(kafkaProducer.emit).toHaveBeenCalledWith(mockEvent.topic, mockEvent.binary);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe("update with events", () => {
    it("사용자 업데이트 시 도메인 이벤트를 발행한다", async () => {
      const mockUser = createMockUserEntity();
      jest.spyOn(repository, "save").mockResolvedValue(mockUser);

      const users = Users.createNew({
        nickname: mockUser.nickname,
      }).value as Users;

      // 도메인 이벤트 추가
      const mockEvent = {
        topic: "user.updated",
        payload: {
          $typeName: "UserUpdatedEvent",
          userId: users.id.getNumber(),
        },
        binary: Uint8Array.from([]),
      };
      users.domainEvents.push(mockEvent);

      await adaptor.save(users);

      expect(kafkaProducer.emit).toHaveBeenCalledWith(mockEvent.topic, mockEvent.binary);
      expect(repository.save).toHaveBeenCalled();
    });
  });
});
