import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { UpdateUserCommand } from "~users/applications/commands/UpdateUser.command";
import { UserProfilesProps } from "~users/domains/users/models/UserProfiles";
import { Users } from "~users/domains/users/models/Users";
import { UsersService } from "~users/domains/users/users.service";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import dayjs from "dayjs";

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly usersService: UsersService) {}

  async execute(command: UpdateUserCommand): Promise<Users> {
    const { userId, profileImage, phoneNumber, gender, birthday, introduction, mbti } = command.props;

    // 기존 사용자 조회
    const user = await this.usersService.getOne({ uniqueCriteria: { type: "user", id: userId } });

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

    // TODO: 온보딩 체크 및 완료 처리

    // 사용자 업데이트
    return await this.usersService.update(user);
  }
}
