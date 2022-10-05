import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { hashPwd } from '../utils/hash-pwd';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt.strategy';
import { User } from '../entities/user.entity';
import { AuthLoginDto } from './dto/auth-login.dto';
import { jwtConstants } from '../secretFIle';

@Injectable()
export class AuthService {
  private static createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = Number(60 * 60 * 24);
    const accessToken = sign(payload, jwtConstants.secret, { expiresIn });
    return {
      accessToken,
      expiresIn,
    };
  }

  private static async generateToken(user: User): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await User.findOne({
        where: { currentTokenId: token },
      });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();
    return token;
  }

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    const { email, pwd } = req;
    try {
      const user = await User.findOne({
        where: { userEmail: email, pwdHash: hashPwd(pwd) },
      });

      if (!user) {
        return res.json({ error: 'Invalid login data!', status: 401 });
      }
      const token = AuthService.createToken(
        await AuthService.generateToken(user),
      );
      return res
        .cookie('jwt', token.accessToken, {
          secure: true,
          domain: 'kendziior4.usermd.net',
          httpOnly: true,
        })
        .json({ logged: true, status: 200 });
    } catch (e) {
      return res.json({ error: e.message, message: 'this is error' });
    }
  }

  async logout(user: User, res: Response) {
    try {
      user.currentTokenId = null;
      await user.save();
      res.clearCookie('jwt', {
        secure: true,
        domain: 'kendziior4.usermd.net',
        httpOnly: true,
      });
      return res.json({ logged: false, status: 200 });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}
