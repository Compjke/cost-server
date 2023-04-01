import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from 'src/schemas/users.shema';
import { UsersService } from 'src/users/user.service';
import { jwtConstants } from './constans';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userName: string): Promise<User | null> {
    const user = await this.userService.findExistUser(userName);

    if (!user) return null;

    return user;
  }

  async generateAccessToket(user: User) {
    return {
      access_token: this.jwtService.sign({ user }),
    };
  }
  async generateRefreshToket(userId: string) {
    return {
      refresh_token: this.jwtService.sign(
        { userId },
        {
          secret: jwtConstants.secret,
          expiresIn: '7d',
        },
      ),
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return { error: error.message };
    }
  }

  // parseJwt(token: string) {
  //   const base64Url = token.split('.')[1];
  //   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   const jsonPayload = decodeURIComponent(
  //     atob(base64)
  //       .split('')
  //       .map(function (c) {
  //         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //       })
  //       .join(''),
  //   );
  //   return JSON.parse(jsonPayload);
  // }

  async getUserByToken(token: string): Promise<User> {
    // const parsedTokenData = this.parseJwt(token);
    // console.log(parsedTokenData);
    const parsedToken = jwt_decode(token) as any;
    console.log(parsedToken.user.userName);
    return await this.userService.findExistUser(parsedToken.user.userName);
  }
}
