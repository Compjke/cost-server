import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from 'src/users/user.service';
import { createUserDto } from './dto/user.dto';
import { Response } from 'express';
import { RegistrationGuard } from './guards/registration.guard';
import { loginUserDto } from './dto/loginUser.dto';
import { LoginGuard } from './guards/login.guard';
import { AuthService } from './auth.service';
import { RefreshJWTGuard } from './guards/refresh-jwt.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private UsersService: UsersService,
    private authService: AuthService,
  ) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(LoginGuard)
  @Post('login')
  async loginUser(@Body() loginUserDto: loginUserDto, @Res() res: Response) {
    const logUser = await this.UsersService.login(loginUserDto);

    const accessT = await this.authService.generateAccessToket(logUser);
    const refreshT = await this.authService.generateRefreshToket(
      logUser._id as string,
    );
    res.statusCode = HttpStatus.OK;

    return res.send({ userName: logUser.userName, ...accessT, ...refreshT });
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(RegistrationGuard)
  @Post('registration')
  async registrationUser(
    @Body() createUserDto: createUserDto,
    @Res() res: Response,
  ) {
    const newUser = await this.UsersService.registration(createUserDto);

    res.statusCode = HttpStatus.CREATED;

    return res.send(`user ${newUser.userName} created`);
  }

  @UseGuards(RefreshJWTGuard)
  @Post('refresh')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() res: Response,
  ) {
    const validToken = this.authService.verifyToken(
      refreshTokenDto.refresh_token,
    );

    const user = await this.UsersService.findExistUser(
      refreshTokenDto.userName,
    );
    const acsess = await this.authService.generateAccessToket(user);

    if (validToken?.error) {
      if (validToken?.error === 'jwt expired') {
        const refresh = await this.authService.generateRefreshToket(
          user._id as string,
        );
        res.statusCode = HttpStatus.OK;

        return res.send({ ...acsess, ...refresh });
      } else {
        res.statusCode = HttpStatus.BAD_REQUEST;

        return res.send({ error: validToken?.error });
      }
    } else {
      res.statusCode = HttpStatus.OK;

      return res.send({
        ...acsess,
        refresh_token: refreshTokenDto.refresh_token,
      });
    }
  }
}
