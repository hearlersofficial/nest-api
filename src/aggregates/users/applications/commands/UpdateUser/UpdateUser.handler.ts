import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserCommand } from "./UpdateUser.command";
import { FindOneUserUseCase } from "../../useCases/FindOneUserUseCase/FindOneUserUseCase";
import { UpdateUserUseCase } from "../../useCases/UpdateUserUseCase/UpdateUserUseCase";
import { Users } from "~/src/aggregates/users/domain/Users";
import { ProgressStatus, ProgressType } from "~/src/gen/com/hearlers/v1/model/user_pb";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
import { UserProfilesProps } from "~/src/aggregates/users/domain/UserProfiles";
import { convertDayjs } from "~/src/shared/utils/Date.utils";

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
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, findOneUserUseCaseResponse.error);
    }
    const user: Users = findOneUserUseCaseResponse.user;

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
      if (birthday) updateProps.birthday = convertDayjs(birthday);
      if (introduction) updateProps.introduction = introduction;
      if (mbti) updateProps.mbti = mbti;
      const updateResult = user.userProfile.updateProfile(updateProps);
      if (updateResult.isFailure) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, updateResult.error);
      }
    }

    // 온보딩 체크 및 완료 처리
    const onboardingProgress = user.findProgress(ProgressType.ONBOARDING);
    if (onboardingProgress.status !== ProgressStatus.COMPLETED && user.userProfile.isProfileCompleted()) {
      if (onboardingProgress) {
        onboardingProgress.updateStatus(ProgressStatus.COMPLETED);
      }
    }
    // 사용자 업데이트
    console.log(user);
    const updateUserUseCaseResponse = await this.updateUserUseCase.execute({ toUpdateUser: user });
    if (!updateUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, updateUserUseCaseResponse.error);
    }

    return updateUserUseCaseResponse.user;
  }
}
