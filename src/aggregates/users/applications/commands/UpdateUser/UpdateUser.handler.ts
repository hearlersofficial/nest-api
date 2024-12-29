import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserCommand } from "./UpdateUser.command";
import { FindOneUserUseCase } from "../../useCases/FindOneUserUseCase/FindOneUserUseCase";
import { UpdateUserUseCase } from "../../useCases/UpdateUserUseCase/UpdateUserUseCase";
import { Users, UsersProps } from "~/src/aggregates/users/domain/Users";
import { UserProfile } from "~/src/gen/com/hearlers/v1/model/user_pb";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
import { UserProfiles, UserProfilesProps } from "~/src/aggregates/users/domain/UserProfiles";
import { convertDayjs } from "~/src/shared/utils/Date.utils";

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  async execute(command: UpdateUserCommand): Promise<Users> {
    const { userId, userProfile } = command.props;

    // 기존 사용자 조회
    const findOneUserUseCaseResponse = await this.findOneUserUseCase.execute({ userId });
    if (!findOneUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, findOneUserUseCaseResponse.error);
    }
    const originalUser = findOneUserUseCaseResponse.user;

    // 업데이트할 사용자 생성
    const updateProps = this.getUpdateProps(command, originalUser);
    const toUpdateUserOrError = Users.create(updateProps, originalUser.id);
    if (toUpdateUserOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, toUpdateUserOrError.error);
    }
    const toUpdateUser = toUpdateUserOrError.value;

    // 프로필 업데이트
    if (userProfile) {
      const updatedUserProfileProps = this.getUpdatedUserProfileProps(userProfile, originalUser);
      const updatedUserProfileOrError = UserProfiles.create(updatedUserProfileProps, originalUser.id);
      if (updatedUserProfileOrError.isFailure) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, updatedUserProfileOrError.error);
      }
      const updateResult = toUpdateUser.setProfile(updatedUserProfileOrError.value);
      if (updateResult.isFailure) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, updateResult.error);
      }
    }

    // 사용자 업데이트
    const updateUserUseCaseResponse = await this.updateUserUseCase.execute({ toUpdateUser });
    if (!updateUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, updateUserUseCaseResponse.error);
    }

    return updateUserUseCaseResponse.user;
  }

  private getUpdateProps(command: UpdateUserCommand, originalUser: Users): UsersProps {
    const { nickname } = command.props;
    const props = originalUser.propsValue;
    if (nickname) props.nickname = nickname;

    return props;
  }

  private getUpdatedUserProfileProps(userProfile: UserProfile, originalUser: Users): UserProfilesProps {
    const { profileImage, phoneNumber, gender, birthday, introduction, mbti } = userProfile;
    const props = originalUser.userProfile.propsValue;
    if (profileImage) props.profileImage = profileImage;
    if (phoneNumber) props.phoneNumber = phoneNumber;
    if (gender) props.gender = gender;
    if (birthday) props.birthday = convertDayjs(birthday);
    if (introduction) props.introduction = introduction;
    if (mbti) props.mbti = mbti;
    return props;
  }
}
