import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { UpdateUserCommand } from "~users/aggregates/users/applications/commands/UpdateUser/UpdateUser.command";
import { FindOneUserUseCase } from "~users/aggregates/users/applications/useCases/FindOneUserUseCase/FindOneUserUseCase";
import { UpdateUserUseCase } from "~users/aggregates/users/applications/useCases/UpdateUserUseCase/UpdateUserUseCase";
import { UserProfilesProps } from "~users/aggregates/users/domain/UserProfiles";
import { Users } from "~users/aggregates/users/domain/Users";
import { ProgressStatus, ProgressType } from "~proto/com/hearlers/v1/model/user_pb";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import dayjs from "dayjs";

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  async execute(command: UpdateUserCommand): Promise<Users> {
    const { userId, profileImage, phoneNumber, gender, birthday, introduction, mbti } = command.props;

    // 기존 사용자 조회
    const findOneUserUseCaseResponse = await this.findOneUserUseCase.execute({ userId });
    if (!findOneUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, findOneUserUseCaseResponse.error as string);
    }
    const user: Users | undefined = findOneUserUseCaseResponse.user;
    if (!user) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "user not found");
    }

    // 닉네임 업데이트
    if (command.props.nickname) {
      user.updateNickname(command.props.nickname);
    }

    // 프로필 업데이트
    if (profileImage || phoneNumber || gender || birthday || introduction || mbti) {
      const updateProps: Partial<UserProfilesProps> = {};
      if (profileImage) updateProps.profileImage = profileImage;
      if (phoneNumber) updateProps.phoneNumber = phoneNumber;
      if (gender) updateProps.gender = gender;
      if (birthday) updateProps.birthday = dayjs(birthday);
      if (introduction) updateProps.introduction = introduction;
      if (mbti) updateProps.mbti = mbti;
      if (user.userProfile) {
        const updateResult = user.userProfile.updateProfile(updateProps);
        if (updateResult.isFailure) {
          throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, updateResult.error as string);
        }
      }
    }

    // 온보딩 체크 및 완료 처리
    const onboardingProgress = user.findProgress(ProgressType.ONBOARDING);
    if (onboardingProgress?.status !== ProgressStatus.COMPLETED && user.userProfile?.isProfileCompleted()) {
      if (onboardingProgress) {
        onboardingProgress.updateStatus(ProgressStatus.COMPLETED);
      }
    }
    // 사용자 업데이트
    console.log(user);
    const updateUserUseCaseResponse = await this.updateUserUseCase.execute({ toUpdateUser: user });
    if (!updateUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        updateUserUseCaseResponse.error as string,
      );
    }
    const savedUser: Users | undefined = updateUserUseCaseResponse.user;
    if (!savedUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "user not found");
    }
    return savedUser;
  }
}
