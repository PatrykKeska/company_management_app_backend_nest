import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'Express';
import { UserService } from './user.service';
import { CreateUserResponse } from './interfaces/createUserResponse';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthLoginDto } from '../auth/dto/auth-login.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserObjectDecorator } from '../decorators/user-object.decorator';
import { User } from '../entities/user.entity';

@Controller('api/user')
export class UserController {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  @Post('/register')
  async createNewUser(
    @Body() user: CreateUserDto,
  ): Promise<CreateUserResponse> {
    const { pwd, email } = user;
    return await this.userService.createNewUser(email, pwd);
  }

  @Get('/get')
  async getMe() {
    return { message: 'you did it bro!' };
  }

  @Post('/login')
  async login(
    @Body() req: AuthLoginDto,
    @Res() res: Response,
    @UserObjectDecorator() user: User,
  ): Promise<any> {
    return this.authService.login(req, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async securityCheck() {
    return {
      message: 'OK',
      statusCode: 200,
    };
  }
  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@UserObjectDecorator() user: User, @Res() res: Response) {
    console.log(user);
    return this.authService.logout(user, res);
  }
}
