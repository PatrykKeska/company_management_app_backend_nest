import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { hashPwd } from '../utils/hash-pwd';
import { CreateUserResponse } from './interfaces/createUserResponse';

@Injectable()
export class UserService {
  async createNewUser(email: string, pwd: string): Promise<CreateUserResponse> {
    const isExist = await User.findOne({ where: { userEmail: email } });
    if (!isExist) {
      if (email.includes('@')) {
        const user = new User();
        user.userEmail = email;
        user.pwdHash = hashPwd(pwd);
        await user.save();
        return {
          isSuccess: true,
          message: `New user ${email} created`,
        };
      } else {
        return {
          isSuccess: false,
          message: `this type of email ${email} is invalid because doesn't have a @`,
        };
      }
    } else {
      return {
        isSuccess: false,
        message: 'this emails is already exist in database!',
      };
    }
  }
}
